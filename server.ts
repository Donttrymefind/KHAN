import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import {
  verifyAdminPassword,
  updateAdminPassword,
  createAdminSession,
  validateAdminSession,
  removeAdminSession,
  markSessionPasswordChanged,
} from './src/server/adminAuth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Server data logs path
const LOGS_FILE = path.resolve(process.cwd(), '.server-data', 'admin-logs.json');

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
    const trimmed = logs.slice(0, 200);
    fs.mkdirSync(path.dirname(LOGS_FILE), { recursive: true });
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
    return newLog;
  } catch (err) {
    console.error('Failed to write admin log:', err);
    return null;
  }
}

function getBearerToken(req: express.Request): string {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return '';
}

// Google Gen AI for customer support chatbot
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

// ==========================================
// 1. ADMIN AUTHENTICATION API ROUTES
// ==========================================

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  const check = verifyAdminPassword(password);
  if (!check.success) {
    appendLog('LOGIN_FAILED', 'Failed login attempt with invalid password');
    return res.status(401).json({
      success: false,
      message: 'Invalid administrator password. Please check your credentials.',
    });
  }

  const token = createAdminSession(check.mustChangePassword);
  appendLog(
    'LOGIN_SUCCESS',
    check.mustChangePassword
      ? 'First-time admin login (password change required)'
      : 'Admin logged in successfully'
  );

  return res.status(200).json({
    success: true,
    token,
    mustChangePassword: check.mustChangePassword,
    message: 'Authentication successful',
  });
});

// GET /api/admin/verify
app.get('/api/admin/verify', (req, res) => {
  const token = getBearerToken(req);
  const session = validateAdminSession(token);
  if (!session.valid) {
    return res.status(401).json({ valid: false, message: 'Session expired or invalid' });
  }
  return res.status(200).json({ valid: true, mustChangePassword: session.mustChangePassword });
});

// POST /api/admin/change-password
app.post('/api/admin/change-password', (req, res) => {
  const token = getBearerToken(req);
  const session = validateAdminSession(token);

  if (!session.valid) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please login again.' });
  }

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    });
  }

  const result = updateAdminPassword(newPassword);
  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: result.error || 'Failed to update password',
    });
  }

  markSessionPasswordChanged(token);
  appendLog('PASSWORD_CHANGED', 'Administrator updated master security password');

  return res.status(200).json({
    success: true,
    message: 'Password successfully updated. You may now access the full Admin Dashboard.',
  });
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  const token = getBearerToken(req);
  removeAdminSession(token);
  appendLog('LOGOUT', 'Administrator logged out');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// GET /api/admin/logs
app.get('/api/admin/logs', (req, res) => {
  const token = getBearerToken(req);
  const session = validateAdminSession(token);
  if (!session.valid) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  return res.status(200).json({ success: true, logs: getLogs() });
});

// POST /api/admin/logs
app.post('/api/admin/logs', (req, res) => {
  const token = getBearerToken(req);
  const session = validateAdminSession(token);
  if (!session.valid) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const { action, details, adminUser } = req.body;
  const log = appendLog(action || 'ADMIN_ACTION', details || '', adminUser || 'SuperAdmin');
  return res.status(200).json({ success: true, log });
});

// ==========================================
// 2. MYSTERY BOX & 24H COOLDOWN SYSTEM
// ==========================================

const COOLDOWNS_FILE = path.resolve(process.cwd(), '.server-data', 'mystery-cooldowns.json');
const HISTORY_FILE = path.resolve(process.cwd(), '.server-data', 'mystery-history.json');
const BOX_CONFIG_FILE = path.resolve(process.cwd(), '.server-data', 'mystery-box-config.json');

// Default box cooldown hours (configurable by Admin)
let boxCooldownConfig: Record<string, number> = {
  mb_royal: 24,
  mb_special: 24,
};

function loadBoxConfig() {
  try {
    if (fs.existsSync(BOX_CONFIG_FILE)) {
      boxCooldownConfig = {
        ...boxCooldownConfig,
        ...JSON.parse(fs.readFileSync(BOX_CONFIG_FILE, 'utf-8')),
      };
    }
  } catch {}
}
loadBoxConfig();

function saveBoxConfig() {
  try {
    fs.mkdirSync(path.dirname(BOX_CONFIG_FILE), { recursive: true });
    fs.writeFileSync(BOX_CONFIG_FILE, JSON.stringify(boxCooldownConfig, null, 2), 'utf-8');
  } catch {}
}

interface CooldownEntry {
  userId: string;
  boxId: string;
  lastOpenedAt: string;
  nextAvailableAt: string;
}

function getCooldowns(): Record<string, CooldownEntry> {
  try {
    if (fs.existsSync(COOLDOWNS_FILE)) {
      return JSON.parse(fs.readFileSync(COOLDOWNS_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveCooldown(entry: CooldownEntry) {
  try {
    const list = getCooldowns();
    const key = `${entry.userId}:${entry.boxId}`;
    list[key] = entry;
    fs.mkdirSync(path.dirname(COOLDOWNS_FILE), { recursive: true });
    fs.writeFileSync(COOLDOWNS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save cooldown:', err);
  }
}

function getOpeningHistory(): any[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function appendOpeningHistory(record: any) {
  try {
    const history = getOpeningHistory();
    history.unshift(record);
    const trimmed = history.slice(0, 500);
    fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to append opening history:', err);
  }
}

// GET /api/mystery-box/cooldowns/:userId
app.get('/api/mystery-box/cooldowns/:userId', (req, res) => {
  const { userId } = req.params;
  const allCooldowns = getCooldowns();
  const now = Date.now();

  const boxesWithCooldown = ['mb_royal', 'mb_special', ...Object.keys(boxCooldownConfig)];
  const uniqueBoxes = Array.from(new Set(boxesWithCooldown));

  const result: Record<string, any> = {};

  for (const boxId of uniqueBoxes) {
    const cooldownHours =
      boxCooldownConfig[boxId] !== undefined
        ? boxCooldownConfig[boxId]
        : boxId === 'mb_royal' || boxId === 'mb_special'
        ? 24
        : 0;

    if (cooldownHours <= 0) continue;

    const key = `${userId}:${boxId}`;
    const entry = allCooldowns[key];

    if (!entry) {
      result[boxId] = {
        boxId,
        lastOpenedAt: null,
        nextAvailableAt: null,
        remainingSeconds: 0,
        isAvailable: true,
        cooldownHours,
      };
    } else {
      const nextTime = new Date(entry.nextAvailableAt).getTime();
      const remainingSeconds = Math.max(0, Math.ceil((nextTime - now) / 1000));
      result[boxId] = {
        boxId,
        lastOpenedAt: entry.lastOpenedAt,
        nextAvailableAt: entry.nextAvailableAt,
        remainingSeconds,
        isAvailable: remainingSeconds === 0,
        cooldownHours,
      };
    }
  }

  return res.status(200).json({
    success: true,
    serverTime: new Date().toISOString(),
    cooldowns: result,
  });
});

// POST /api/mystery-box/open
app.post('/api/mystery-box/open', (req, res) => {
  const {
    userId,
    userName,
    userPhone,
    boxId,
    boxName,
    pricePaid,
    rewards,
    gameUid,
    transactionId,
  } = req.body;

  if (!boxId || !Array.isArray(rewards) || rewards.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid box data or rewards' });
  }

  const effectiveUserId =
    userId || 'guest_' + (userPhone ? userPhone.replace(/\D/g, '') : 'visitor');
  const cooldownHours =
    boxCooldownConfig[boxId] !== undefined
      ? boxCooldownConfig[boxId]
      : boxId === 'mb_royal' || boxId === 'mb_special'
      ? 24
      : 0;

  // Enforce server-authoritative cooldown
  if (cooldownHours > 0) {
    const allCooldowns = getCooldowns();
    const key = `${effectiveUserId}:${boxId}`;
    const entry = allCooldowns[key];
    const now = Date.now();

    if (entry) {
      const nextTime = new Date(entry.nextAvailableAt).getTime();
      const remainingSeconds = Math.max(0, Math.ceil((nextTime - now) / 1000));
      if (remainingSeconds > 0) {
        const hours = Math.floor(remainingSeconds / 3600);
        const mins = Math.floor((remainingSeconds % 3600) / 60);
        const secs = remainingSeconds % 60;
        const timeFormatted = `${hours > 0 ? hours + ' ঘণ্টা ' : ''}${mins} মিনিট ${secs} সেকেন্ড`;
        return res.status(403).json({
          success: false,
          isCooldownActive: true,
          message: `এই ${boxName} প্রতি ${cooldownHours} ঘণ্টায় সর্বোচ্চ একবার খোলা যায়। আর ${timeFormatted} পর আবার খুলতে পারবেন।`,
          remainingSeconds,
          nextAvailableAt: entry.nextAvailableAt,
        });
      }
    }
  }

  // Prevent duplicate usage of same transactionId
  if (transactionId) {
    const history = getOpeningHistory();
    const duplicate = history.find(
      (h) => h.transactionId && h.transactionId.toLowerCase() === transactionId.toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'এই Transaction ID দিয়ে ইতিমধ্যে একটি বক্স খোলা হয়েছে। অনুগ্রহ করে নতুন অর্ডার করুন।',
      });
    }
  }

  // Calculate server-side weighted random selection
  let totalWeight = 0;
  const weightedRewards = rewards.map((r: any) => {
    const prob = typeof r.probability === 'number' && r.probability > 0 ? r.probability : 20;
    totalWeight += prob;
    return { ...r, weight: prob };
  });

  const rand = Math.random() * totalWeight;
  let cumulative = 0;
  let selectedReward = weightedRewards[0];

  for (const item of weightedRewards) {
    cumulative += item.weight;
    if (rand <= cumulative) {
      selectedReward = item;
      break;
    }
  }

  const now = new Date();
  const openedAt = now.toISOString();

  // If box has cooldown, update and persist cooldown immediately
  let nextAvailableAt: string | null = null;
  if (cooldownHours > 0) {
    const nextDate = new Date(now.getTime() + cooldownHours * 3600 * 1000);
    nextAvailableAt = nextDate.toISOString();
    saveCooldown({
      userId: effectiveUserId,
      boxId,
      lastOpenedAt: openedAt,
      nextAvailableAt,
    });
  }

  const openingRecord = {
    id: 'mbo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId: effectiveUserId,
    userName: userName || 'Customer',
    userPhone: userPhone || '',
    boxId,
    boxName: boxName || boxId,
    pricePaid: Number(pricePaid) || 0,
    reward: {
      id: selectedReward.id,
      name: selectedReward.name,
      quantity: selectedReward.quantity,
      icon: selectedReward.icon || '🎁',
      rarity: selectedReward.rarity,
      description: selectedReward.description || '',
      isJackpot: selectedReward.isJackpot || false,
      probability: selectedReward.probability,
    },
    openedAt,
    transactionId: transactionId || 'MBOX_' + Date.now(),
    gameUid: gameUid || 'Player UID',
  };

  appendOpeningHistory(openingRecord);

  appendLog(
    'MYSTERY_BOX_UNBOX',
    `User ${userName || effectiveUserId} unboxed ${boxName} -> Won: ${selectedReward.name} (${selectedReward.quantity})`
  );

  return res.status(200).json({
    success: true,
    boxId,
    boxName,
    reward: openingRecord.reward,
    openedAt,
    deliveryTarget: gameUid || 'Player UID',
    transactionId: openingRecord.transactionId,
    cooldownInfo:
      cooldownHours > 0
        ? {
            remainingSeconds: cooldownHours * 3600,
            nextAvailableAt,
            cooldownHours,
          }
        : null,
  });
});

// GET /api/mystery-box/history (Admin & Customer history)
app.get('/api/mystery-box/history', (req, res) => {
  const token = getBearerToken(req);
  const session = validateAdminSession(token);
  const history = getOpeningHistory();
  const cooldowns = getCooldowns();

  return res.status(200).json({
    success: true,
    history,
    cooldowns,
    boxCooldownConfig,
    isAdmin: session.valid,
  });
});

// POST /api/admin/mystery-box/cooldown-config (Admin configures hours)
app.post('/api/admin/mystery-box/cooldown-config', (req, res) => {
  const token = getBearerToken(req);
  const session = validateAdminSession(token);
  if (!session.valid) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { boxId, cooldownHours } = req.body;
  if (!boxId || typeof cooldownHours !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid boxId or cooldownHours' });
  }

  boxCooldownConfig[boxId] = Math.max(0, cooldownHours);
  saveBoxConfig();

  appendLog(
    'UPDATE_COOLDOWN_CONFIG',
    `Updated cooldown for ${boxId} to ${cooldownHours} hours`
  );

  return res.status(200).json({
    success: true,
    boxCooldownConfig,
    message: `Updated cooldown for ${boxId} to ${cooldownHours} hours`,
  });
});

// POST /api/admin/mystery-box/reset-cooldown (Admin can reset a user cooldown)
app.post('/api/admin/mystery-box/reset-cooldown', (req, res) => {
  const token = getBearerToken(req);
  const session = validateAdminSession(token);
  if (!session.valid) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { userId, boxId } = req.body;
  if (!userId || !boxId) {
    return res.status(400).json({ success: false, message: 'Missing userId or boxId' });
  }

  const allCooldowns = getCooldowns();
  const key = `${userId}:${boxId}`;
  if (allCooldowns[key]) {
    delete allCooldowns[key];
    try {
      fs.writeFileSync(COOLDOWNS_FILE, JSON.stringify(allCooldowns, null, 2), 'utf-8');
    } catch {}
  }

  appendLog('RESET_COOLDOWN', `Reset cooldown for user ${userId} on box ${boxId}`);

  return res.status(200).json({
    success: true,
    message: `Cooldown reset successfully for user ${userId}`,
  });
});

// ==========================================
// 3. GEMINI AI ASSISTANT API
// ==========================================

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  if (!aiClient) {
    return res.status(200).json({
      success: true,
      reply: `স্বাগতম KHAN TOP UP এ! আমি আপনার গেমিং সাপোর্ট অ্যাসিস্ট্যান্ট।\n\n- Free Fire ডায়মন্ড ২৫ থেকে ১২,০০০ পর্যন্ত ২-৫ মিনিটে সরাসরি ইন-গেম UID তে ডেলিভারি করা হয়।\n- পেমেন্ট মেথড: bKash ও Nagad (নম্বর: 01575630127)।\n- যে কোনো জরুরি প্রয়োজনে আমাদের হেল্পলাইনে কল করুন বা WhatsApp করুন: 01575630127।`,
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
          'You are the official KHAN TOP UP Bangladesh AI Gaming & Customer Support Assistant. You provide helpful, friendly support in Bengali and English for Free Fire Player ID (UID) top-ups (25 to 12,000 diamonds), weekly/monthly memberships, Level Up Pass, Evo access, Mystery Boxes with guaranteed rewards and unboxing, and bKash & Nagad payments (number: 01575630127). Use Google Search grounding to retrieve current Free Fire events, redeem codes, OB patch notes, and esports updates when users ask.',
        tools: [{ googleSearch: {} }],
      },
    });

    const replyText =
      response.text || 'I am here to assist with your KHAN TOP UP orders and Free Fire questions.';

    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = rawChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => ({
        uri: web.uri,
        title: web.title || web.uri,
      }));

    return res.status(200).json({
      success: true,
      reply: replyText,
      sources,
    });
  } catch (aiErr: any) {
    console.error('Gemini chat error:', aiErr);
    return res.status(200).json({
      success: true,
      reply: `KHAN TOP UP হেল্পলাইন: Free Fire UID ডায়মন্ড টপআপ ও মেম্বারশিপ সংক্রান্ত তথ্যের জন্য আমাদের ২৪/৭ WhatsApp 01575630127 নম্বরে মেসেজ দিন। দ্রুত সহায়তা পাবেন!`,
      sources: [],
    });
  }
});

// ==========================================
// 4. VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
// ==========================================

async function setupServer() {
  if (!isProduction) {
    // Development mode: Mount Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KHAN TOP UP Full-Stack Server running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start KHAN TOP UP Server:', err);
  process.exit(1);
});
