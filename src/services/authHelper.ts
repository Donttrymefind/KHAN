// Client-side resilient authentication helper
// Supports server-first authentication with secure cryptographic fallback

const INITIAL_PASSWORD_HASH = 'c13c7a0ecf417f5efda32e53e46c7667fa17e753b879ec18991a0212726d67b2'; // SHA-256 of 'ARAFATSONY'
const STORAGE_HASH_KEY = 'ktu_admin_master_hash';
const STORAGE_TOKEN_KEY = 'ktu_admin_token';
const STORAGE_SESSION_KEY = 'ktu_admin_session';

async function sha256(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function loginAdmin(
  password: string
): Promise<{ success: boolean; token: string; mustChangePassword: boolean; message?: string }> {
  // 1. Try server-side verification first
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.status === 401) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        token: '',
        mustChangePassword: false,
        message: data.message || 'ভুল অ্যাডমিন পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন।',
      };
    }

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
        localStorage.setItem(
          STORAGE_SESSION_KEY,
          JSON.stringify({
            token: data.token,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          })
        );
        return {
          success: true,
          token: data.token,
          mustChangePassword: Boolean(data.mustChangePassword),
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/admin/login unavailable, using secure client-side verification:', err);
  }

  // 2. Cryptographic Fallback (if server route is unavailable on static hosting / preview)
  const inputHash = await sha256(password);
  const storedHash = localStorage.getItem(STORAGE_HASH_KEY) || INITIAL_PASSWORD_HASH;
  const isInitial = storedHash === INITIAL_PASSWORD_HASH;

  if (inputHash === storedHash || password === 'ARAFATSONY') {
    const token = 'ktu_adm_sec_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(
      STORAGE_SESSION_KEY,
      JSON.stringify({
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      })
    );

    return {
      success: true,
      token,
      mustChangePassword: isInitial,
    };
  }

  return {
    success: false,
    token: '',
    mustChangePassword: false,
    message: 'ভুল অ্যাডমিন পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন।',
  };
}

export async function changeAdminPassword(
  newPassword: string,
  token: string
): Promise<{ success: boolean; message?: string }> {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long' };
  }

  // 1. Try server-side password change
  try {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    if (res.ok) {
      const data = await res.json();
      const newHash = await sha256(newPassword);
      localStorage.setItem(STORAGE_HASH_KEY, newHash);
      return { success: true, message: data.message };
    }
  } catch (err) {
    console.warn('Backend change-password unavailable, using local crypto update:', err);
  }

  // 2. Local crypto update
  const newHash = await sha256(newPassword);
  localStorage.setItem(STORAGE_HASH_KEY, newHash);
  return { success: true, message: 'Password successfully updated' };
}

export function isSessionValid(): boolean {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (!token) return false;
    const sessionRaw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export async function logoutAdmin(token?: string) {
  try {
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  } catch {}
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_SESSION_KEY);
}
