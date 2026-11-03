import React from 'react';
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingBag,
  CreditCard,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  KeyRound,
  History,
  Gamepad2,
  Bell,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'mystery_boxes'
  | 'orders'
  | 'payments'
  | 'customers'
  | 'settings'
  | 'logs';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingOrdersCount: number;
  onOpenChangePassword: () => void;
  onOpenLogs: () => void;
  onLogout: () => void;
  onViewStore: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onSelectTab,
  pendingOrdersCount,
  onOpenChangePassword,
  onOpenLogs,
  onLogout,
  onViewStore,
}) => {
  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products & Prices', icon: <Tag className="w-4 h-4" /> },
    { id: 'mystery_boxes', label: 'Mystery Boxes', icon: <Package className="w-4 h-4" /> },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    { id: 'payments', label: 'Payment Control', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'logs', label: 'Security & Logs', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#0c101d] border-b border-cyan-500/20 sticky top-0 z-40 shadow-xl">
      {/* Top Admin Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Console Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#0b0e17] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Orbitron'] font-black text-base sm:text-lg text-white">
                  KHAN TOP UP
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Admin Console
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Master Product, Stock &amp; Order Control Center
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Customer Store */}
            <button
              onClick={onViewStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141b2d] hover:bg-[#1e2740] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
              title="Open Customer-facing website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Live Store</span>
            </button>

            {/* Change Password */}
            <button
              onClick={onOpenChangePassword}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141b2d] hover:bg-[#1e2740] text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              title="Change Administrator Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Change Password</span>
            </button>

            {/* Admin Logs Button */}
            <button
              onClick={onOpenLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141b2d] hover:bg-[#1e2740] text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              title="View Security & Activity Audit Trail"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Logs</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors"
              title="Sign out from Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="bg-[#090d18] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-[#13192b]'
                  }`}
                >
                  <span className={active ? 'text-black' : 'text-slate-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        active ? 'bg-black text-amber-400' : 'bg-red-600 text-white animate-pulse'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
