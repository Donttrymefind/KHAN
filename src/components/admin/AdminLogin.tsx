import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Gamepad2,
  ChevronLeft,
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, mustChangePassword: boolean) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // First-time password change forced flow
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [isForcePasswordChange, setIsForcePasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter administrator password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrator password');
      }

      // If initial password was used and must be changed
      if (data.mustChangePassword) {
        setPendingToken(data.token);
        setIsForcePasswordChange(true);
      } else {
        localStorage.setItem('ktu_admin_token', data.token);
        onLoginSuccess(data.token, false);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForcePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pendingToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update master password');
      }

      setPasswordChangeSuccess(true);
      if (pendingToken) {
        localStorage.setItem('ktu_admin_token', pendingToken);
        setTimeout(() => {
          onLoginSuccess(pendingToken, false);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Cyber Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff1_1px,transparent_1px),linear-gradient(to_bottom,#0ff1_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10 pointer-events-none" />

      {/* Back to Customer Website Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13192b]/80 hover:bg-[#1c253f] border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to KHAN TOP UP Store</span>
        </button>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Terminal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-0.5 mx-auto mb-4 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-[#0b0e17] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h2 className="font-['Orbitron'] font-black text-2xl text-white tracking-wider">
            KHAN TOP UP ADMIN
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Secure Management Console &bull; Authorized Personnel Only
          </p>
        </div>

        {/* Login or Force Password Change Card */}
        <div className="bg-[#0e1424]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
          {!isForcePasswordChange ? (
            /* Standard Admin Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Enter Administrator Master Password</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#13192b] border border-slate-700/80 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Initial Password Hint for First Time Login */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">Administrator Notice:</span>
                Initial setup password is configured securely on the server. Upon first entry, you will be required to establish your permanent custom password.
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Access</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Forced First-Time Password Change Form */
            <form onSubmit={handleForcePasswordChangeSubmit} className="space-y-5 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Mandatory First-Time Security Requirement</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  You have logged in with the initial default password. To protect your store, orders, and customer data, you must establish a new private administrator password before accessing the dashboard.
                </p>
              </div>

              {passwordChangeSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-bold text-sm text-white">Password Updated Successfully!</div>
                  <p className="text-xs text-slate-300">Redirecting to Admin Dashboard...</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      New Administrator Password (Min 6 chars) *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Enter strong new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#13192b] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Confirm New Password *
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#13192b] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-['Orbitron'] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    {isLoading ? (
                      <span>Saving Secure Password...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Save Password &amp; Open Dashboard</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Security badge at bottom */}
        <div className="text-center text-[11px] text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>PBKDF2 SHA-512 Hash Salt Protection Enabled</span>
        </div>
      </div>
    </div>
  );
};
