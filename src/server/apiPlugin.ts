import type { Plugin, ViteDevServer } from 'vite';
import { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import {
  verifyAdminPassword,
  updateAdminPassword,
  createAdminSession,
  validateAdminSession,
  removeAdminSession,
  markSessionPasswordChanged,
} from './adminAuth';

const LOGS_FILE = path.resolve(process.cwd(), '.server-data', 'admin-logs.json');

// Initialize GoogleGenAI client with required User-Agent header
const aiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function getLogs(): any[] {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function appendLog(action: string, details: string, adminUser: string = 'SuperAdmin') {
  try {
    const logs = getLogs();
    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      action,
      details,
      adminUser,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep last 200 logs
    const trimmed = logs.slice(0, 200);
    fs.mkdirSync(path.dirname(LOGS_FILE), { recursive: true });
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
    return newLog;
  } catch (err) {
    console.error('Failed to write admin log:', err);
    return null;
  }
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // 10MB limit for screenshots if sent via json
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function getBearerToken(req: IncomingMessage): string {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return '';
}

export function khanTopUpApiPlugin(): Plugin {
  return {
    name: 'khan-topup-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (!url || !url.startsWith('/api/')) {
          return next();
        }

        try {
          // --- Admin Login ---
          if (url === '/api/admin/login' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const { password } = body;

            if (!password) {
              return sendJson(res, 400, { success: false, message: 'Password is required' });
            }

            const check = verifyAdminPassword(password);
            if (!check.success) {
              appendLog('LOGIN_FAILED', 'Failed login attempt with invalid password');
              return sendJson(res, 401, { success: false, message: 'Invalid administrator password' });
            }

            const token = createAdminSession(check.mustChangePassword);
            appendLog('LOGIN_SUCCESS', check.mustChangePassword ? 'First-time admin login (password change required)' : 'Admin logged in successfully');

            return sendJson(res, 200, {
              success: true,
              token,
              mustChangePassword: check.mustChangePassword,
              message: 'Authentication successful',
            });
          }

          // --- Verify Admin Session ---
          if (url === '/api/admin/verify' && req.method === 'GET') {
            const token = getBearerToken(req);
            const session = validateAdminSession(token);
            if (!session.valid) {
              return sendJson(res, 401, { valid: false, message: 'Session expired or invalid' });
            }
            return sendJson(res, 200, { valid: true, mustChangePassword: session.mustChangePassword });
          }

          // --- Force Change Password / Update Password ---
          if (url === '/api/admin/change-password' && req.method === 'POST') {
            const token = getBearerToken(req);
            const session = validateAdminSession(token);

            if (!session.valid) {
              return sendJson(res, 401, { success: false, message: 'Unauthorized. Please login again.' });
            }

            const body = await parseJsonBody(req);
            const { newPassword } = body;

            if (!newPassword || newPassword.length < 6) {
              return sendJson(res, 400, { success: false, message: 'New password must be at least 6 characters' });
            }

            const result = updateAdminPassword(newPassword);
            if (!result.success) {
              return sendJson(res, 500, { success: false, message: result.error || 'Failed to update password' });
            }

            markSessionPasswordChanged(token);
            appendLog('PASSWORD_CHANGED', 'Administrator updated master security password');

            return sendJson(res, 200, {
              success: true,
              message: 'Password successfully updated. You may now access the full Admin Dashboard.',
            });
          }

          // --- Admin Logout ---
          if (url === '/api/admin/logout' && req.method === 'POST') {
            const token = getBearerToken(req);
            removeAdminSession(token);
            appendLog('LOGOUT', 'Administrator logged out');
            return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
          }

          // --- Get Admin Logs ---
          if (url === '/api/admin/logs' && req.method === 'GET') {
            const token = getBearerToken(req);
            const session = validateAdminSession(token);
            if (!session.valid) {
              return sendJson(res, 401, { success: false, message: 'Unauthorized' });
            }
            return sendJson(res, 200, { success: true, logs: getLogs() });
          }

          // --- Post Admin Log ---
          if (url === '/api/admin/logs' && req.method === 'POST') {
            const token = getBearerToken(req);
            const session = validateAdminSession(token);
            if (!session.valid) {
              return sendJson(res, 401, { success: false, message: 'Unauthorized' });
            }
            const body = await parseJsonBody(req);
            const log = appendLog(body.action || 'ADMIN_ACTION', body.details || '', body.adminUser || 'SuperAdmin');
            return sendJson(res, 200, { success: true, log });
          }

          // --- Gemini AI Chatbot with Google Search Grounding ---
          if (url === '/api/chat' && req.method === 'POST') {
            const body = await parseJsonBody(req);
            const { message, history } = body;

            if (!message || typeof message !== 'string') {
              return sendJson(res, 400, { success: false, message: 'Message is required' });
            }

            if (!aiClient) {
              return sendJson(res, 200, {
                success: true,
                reply: `স্বাগতম KHAN TOP UP এ! আমি আপনার গেমিং সাপোর্ট অ্যাসিস্ট্যান্ট।\n\n- Free Fire ডায়মন্ড ২৫ থেকে ১২,০০০ পর্যন্ত ৫-১৫ মিনিটে সরাসরি ইন-গেম UID তে ডেলিভারি করা হয়।\n- পেমেন্ট মেথড: bKash ও Nagad (নম্বর: 01575630127)।\n- যে কোনো জরুরি প্রয়োজনে আমাদের হেল্পলাইনে কল করুন বা WhatsApp করুন: 01575630127।`,
                sources: [],
              });
            }

            try {
              const formattedContents = [
                ...(Array.isArray(history) ? history : []).map((h: any) => ({
                  role: h.role === 'user' ? 'user' : 'model',
                  parts: [{ text: String(h.text || h.message || '') }],
                })),
                { role: 'user', parts: [{ text: message }] },
              ];

              const response = await aiClient.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: formattedContents,
                config: {
                  systemInstruction:
                    'You are the official KHAN TOP UP Bangladesh AI Gaming & Customer Support Assistant. You provide helpful, friendly support in Bengali and English for Free Fire Player ID (UID) top-ups (25 to 12,000 diamonds), weekly/monthly memberships, Level Up Pass, Evo access, Mystery Boxes with guaranteed rewards, and bKash & Nagad payments (number: 01575630127). Use Google Search grounding to retrieve current Free Fire events, redeem codes, OB patch notes, and esports updates when users ask.',
                  tools: [{ googleSearch: {} }],
                },
              });

              const replyText = response.text || 'I am here to assist with your KHAN TOP UP orders and Free Fire questions.';

              // Extract search grounding sources if present
              const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
              const sources = rawChunks
                .map((chunk: any) => chunk.web)
                .filter((web: any) => web && web.uri)
                .map((web: any) => ({
                  uri: web.uri,
                  title: web.title || web.uri,
                }));

              return sendJson(res, 200, {
                success: true,
                reply: replyText,
                sources,
              });
            } catch (aiErr: any) {
              console.error('Gemini chat error:', aiErr);
              return sendJson(res, 200, {
                success: true,
                reply: `KHAN TOP UP হেল্পলাইন: Free Fire UID ডায়মন্ড টপআপ ও মেম্বারশিপ সংক্রান্ত তথ্যের জন্য আমাদের ২৪/৭ WhatsApp 01575630127 নম্বরে মেসেজ দিন। দ্রুত সহায়তা পাবেন!`,
                sources: [],
              });
            }
          }

          // Fallthrough
          return next();
        } catch (error: any) {
          console.error('API Error:', error);
          return sendJson(res, 500, { success: false, message: error.message || 'Internal server error' });
        }
      });
    },
  };
}
