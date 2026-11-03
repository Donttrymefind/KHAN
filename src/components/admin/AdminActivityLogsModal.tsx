import React, { useEffect, useState } from 'react';
import { X, History, Shield, RefreshCw, Clock, Terminal } from 'lucide-react';
import { AdminLog } from '../../types';

interface AdminActivityLogsModalProps {
  onClose: () => void;
}

export const AdminActivityLogsModal: React.FC<AdminActivityLogsModalProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('ktu_admin_token') || '';
      const res = await fetch('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl text-white my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Orbitron'] font-bold text-lg text-white">
                Admin Security &amp; Activity Audit Logs
              </h3>
              <p className="text-xs text-slate-400">
                Immutable audit trail of administrator price edits, stock updates, and login sessions
              </p>
            </div>
          </div>

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#13192b] hover:bg-[#1a233c] text-cyan-400"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Logs Terminal List */}
        <div className="bg-[#080b13] border border-slate-800 rounded-2xl p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2.5">
          {logs.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              No audit logs recorded yet in this session.
            </div>
          ) : (
            logs.map((log) => {
              const isLogin = log.action.includes('LOGIN');
              const isPrice = log.action.includes('PRICE');
              const isStatus = log.action.includes('STATUS');

              return (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-[#0d1222] border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          isLogin
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                            : isPrice
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : isStatus
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="text-slate-400 text-[11px]">{log.adminUser}</span>
                    </div>
                    <p className="text-slate-200 text-xs">{log.details}</p>
                  </div>

                  <span className="text-[10px] text-slate-500 shrink-0 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString()} &bull;{' '}
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};
