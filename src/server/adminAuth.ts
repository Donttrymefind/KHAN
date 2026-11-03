import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// File path for persistent server-side admin configuration
const DATA_DIR = path.resolve(process.cwd(), '.server-data');
const CONFIG_FILE = path.join(DATA_DIR, 'admin-credentials.json');

interface AdminConfig {
  salt: string;
  hash: string;
  mustChangePassword: boolean;
  updatedAt: string;
  lastLoginAt: string | null;
}

// Initial default password as specified: ARAFATSONY
const INITIAL_ADMIN_PASSWORD = 'ARAFATSONY';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function getOrCreateAdminConfig(): AdminConfig {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading admin config file:', err);
  }

  // Create initial config with ARAFATSONY hashed
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(INITIAL_ADMIN_PASSWORD, salt);
  const initialConfig: AdminConfig = {
    salt,
    hash,
    mustChangePassword: true, // Forces change on first login
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
  };

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(initialConfig, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing admin config file:', err);
  }

  return initialConfig;
}

export function verifyAdminPassword(password: string): { success: boolean; mustChangePassword: boolean } {
  const config = getOrCreateAdminConfig();
  const testHash = hashPassword(password, config.salt);

  if (crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(config.hash, 'hex'))) {
    // Update last login
    config.lastLoginAt = new Date().toISOString();
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    } catch {}
    return { success: true, mustChangePassword: config.mustChangePassword };
  }

  return { success: false, mustChangePassword: false };
}

export function updateAdminPassword(newPassword: string): { success: boolean; error?: string } {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);

  const updatedConfig: AdminConfig = {
    salt: newSalt,
    hash: newHash,
    mustChangePassword: false, // Initial password changed!
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to write updated password to server storage' };
  }
}

// Simple in-memory session store for admin tokens
const activeSessions = new Map<string, { createdAt: number; mustChangePassword: boolean }>();

export function createAdminSession(mustChangePassword: boolean): string {
  const token = 'ktu_adm_' + crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, { createdAt: Date.now(), mustChangePassword });
  return token;
}

export function validateAdminSession(token: string): { valid: boolean; mustChangePassword: boolean } {
  if (!token) return { valid: false, mustChangePassword: false };
  const session = activeSessions.get(token);
  if (!session) return { valid: false, mustChangePassword: false };

  // 24 hour session expiration
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return { valid: false, mustChangePassword: false };
  }

  return { valid: true, mustChangePassword: session.mustChangePassword };
}

export function removeAdminSession(token: string): void {
  activeSessions.delete(token);
}

export function markSessionPasswordChanged(token: string): void {
  const session = activeSessions.get(token);
  if (session) {
    session.mustChangePassword = false;
  }
}
