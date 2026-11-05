import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  Crosshair,
  User,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  PhoneCall,
  Crown,
  Package,
  Sun,
  Moon,
  Wallet,
  Flame,
  Film,
  Activity,
  Headphones,
  ShoppingBag,
} from 'lucide-react';
import { WebsiteSettings, ProductCategory } from '../types';

interface NavbarProps {
  settings: WebsiteSettings;
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onOpenTrackModal: () => void;
  onOpenAdmin: () => void;
  onOpenCustomerProfile: () => void;
  onOpenWelcomeSpin?: () => void;
  customerUser: any;
  customerWalletBalance?: number;
  onGoogleLogin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdminLoggedIn: boolean;
  isLightMode?: boolean;
  onToggleTheme?: () => void;
  onScrollToLiveOrders?: () => void;
  onScrollToContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeCategory,
  onSelectCategory,
  onOpenTrackModal,
  onOpenAdmin,
  onOpenCustomerProfile,
  onOpenWelcomeSpin,
  customerUser,
  customerWalletBalance = 0,
  onGoogleLogin,
  searchQuery,
  onSearchChange,
  isAdminLoggedIn,
  isLightMode = false,
  onToggleTheme,
  onScrollToLiveOrders,
  onScrollToContact,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { id: ProductCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Items', icon: '⚡' },
    { id: 'diamond', label: 'FF Diamonds', icon: '💎' },
    { id: 'friday_offer', label: 'Friday Bonus', icon: '🔥' },
    { id: 'entertainment', label: 'Subscriptions', icon: '🍿' },
    { id: 'membership', label: 'Memberships', icon: '👑' },
    { id: 'level_up', label: 'Level Up Pass', icon: '🎯' },
    { id: 'mystery_box', label: 'Mystery Boxes', icon: '🎁' },
    { id: 'voucher', label: 'Indo & Vouchers', icon: '🎟️' },
    { id: 'social_fb', label: 'FB Boost', icon: '👍' },
    { id: 'social_insta', label: 'Insta Boost', icon: '📸' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isLightMode
          ? 'bg-white/95 border-blue-200/80 shadow-sm'
          : 'bg-[#0c101d]/95 border-cyan-500/20 shadow-lg shadow-black/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div
              className={`relative w-11 h-11 rounded-xl p-0.5 shadow-lg transition-all duration-300 transform group-hover:scale-105 ${
                isLightMode
                  ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-blue-500/20'
                  : 'bg-gradient-to-br from-cyan-500 via-indigo-600 to-amber-500 shadow-cyan-500/25'
              }`}
            >
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  isLightMode ? 'bg-white' : 'bg-[#0b0e17]'
                }`}
              >
                <Gamepad2
                  className={`w-6 h-6 transition-colors ${
                    isLightMode
                      ? 'text-blue-600 group-hover:text-indigo-600'
                      : 'text-cyan-400 group-hover:text-amber-400'
                  }`}
                />
              </div>
              <div
                className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 animate-pulse ${
                  isLightMode
                    ? 'bg-emerald-500 border-white'
                    : 'bg-emerald-500 border-[#0b0e17]'
                }`}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-['Orbitron'] font-black text-xl sm:text-2xl tracking-wider ${
                    isLightMode
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-amber-400'
                  }`}
                >
                  {settings.websiteName || 'KHAN TOP UP'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                    isLightMode
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  BD
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide hidden sm:block">
                Free Fire Official UID Top-Up &amp; Subscriptions
              </span>
            </div>
          </div>

          {/* Navigation links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'all'
                  ? isLightMode
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              Topup
            </button>

            <button
              onClick={() => onSelectCategory('friday_offer')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeCategory === 'friday_offer'
                  ? 'bg-amber-500/20 text-amber-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Friday Offers</span>
            </button>

            <button
              onClick={() => onSelectCategory('entertainment')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeCategory === 'entertainment'
                  ? 'bg-purple-500/20 text-purple-500'
                  : 'text-slate-600 dark:text-slate-300 hover:text-purple-500'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-purple-500" />
              <span>Subscriptions</span>
            </button>

            {/* Dedicated Mystery Box Store Link */}
            <button
              onClick={() => {
                const el = document.getElementById('mystery-box-store-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onSelectCategory('mystery_box');
                }
              }}
              className="px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-gradient-to-r from-purple-900/40 via-amber-900/30 to-purple-900/40 text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold"
            >
              <span className="text-xs">🎁</span>
              <span>Mystery Box</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-purple-600 text-white font-black uppercase">
                ১৫টি বক্স
              </span>
            </button>

            {/* My Order Desktop Nav Link */}
            <button
              onClick={onOpenTrackModal}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                isLightMode
                  ? 'text-blue-600 hover:bg-blue-50 font-bold'
                  : 'text-cyan-400 hover:bg-cyan-950/40 font-bold'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>My Order</span>
            </button>

            {/* Welcome Spin Desktop Nav Link */}
            {onOpenWelcomeSpin && (
              <button
                onClick={onOpenWelcomeSpin}
                className="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 text-amber-600 dark:text-amber-400 hover:from-amber-500/25 hover:to-yellow-500/25 border border-amber-400/40 font-bold shadow-xs"
              >
                <span className="text-sm">🎡</span>
                <span>Welcome Spin</span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500 text-black font-black uppercase">
                  ৮০০০💎
                </span>
              </button>
            )}

            <button
              onClick={onScrollToLiveOrders}
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-all flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Live Orders</span>
            </button>

            <button
              onClick={onScrollToContact}
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all"
            >
              Contact Us
            </button>
          </nav>

          {/* Search bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search diamonds, pass, UID..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm transition-all outline-none ${
                  isLightMode
                    ? 'bg-slate-100/90 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
                    : 'bg-[#13192b] border border-slate-700/60 text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Welcome Spin Button in Actions */}
            {onOpenWelcomeSpin && (
              <button
                onClick={onOpenWelcomeSpin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-black transition-all transform active:scale-95 shadow-sm bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/40 hover:border-amber-400 hover:shadow-amber-500/10 cursor-pointer"
                title="Welcome Bonus Spin Wheel - Win up to 8,000 Diamonds!"
              >
                <span className="text-sm">🎡</span>
                <span className="hidden md:inline">Spin Wheel</span>
              </button>
            )}

            {/* Theme Toggle (Light TopupPapa / Dark Gaming) */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isLightMode
                    ? 'bg-amber-100/80 text-amber-700 border-amber-300 hover:bg-amber-200'
                    : 'bg-[#151c30] text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
                }`}
                title={isLightMode ? 'Switch to Dark Gaming Theme' : 'Switch to Light TopUp Theme'}
              >
                {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            )}

            {/* My Order Button in Actions */}
            <button
              onClick={onOpenTrackModal}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all transform active:scale-95 shadow-sm border ${
                isLightMode
                  ? 'bg-blue-50 hover:bg-blue-100 text-[#0066FF] border-blue-200'
                  : 'bg-[#151c30] hover:bg-[#1c2642] text-cyan-300 hover:text-cyan-200 border-cyan-500/30'
              }`}
              title="My Order & Status Tracking"
            >
              <ShoppingBag className="w-4 h-4 text-[#0066FF] dark:text-cyan-400" />
              <span>My Order</span>
            </button>

            {/* Customer User / Google Login & Wallet Balance */}
            {customerUser ? (
              <div className="flex items-center gap-1.5">
                {/* Wallet Balance Pill */}
                <div
                  onClick={onOpenCustomerProfile}
                  className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border cursor-pointer ${
                    isLightMode
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  }`}
                  title="Your KHAN Wallet Balance"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-mono font-bold text-xs">
                    ৳{customerWalletBalance}
                  </span>
                </div>

                <button
                  onClick={onOpenCustomerProfile}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm transition-all ${
                    isLightMode
                      ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-800'
                      : 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-500/40 text-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {customerUser.photoURL ? (
                    <img
                      src={customerUser.photoURL}
                      alt="User"
                      className="w-6 h-6 rounded-full border border-indigo-400"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {customerUser.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="max-w-[70px] sm:max-w-[100px] truncate font-medium">
                    {customerUser.displayName?.split(' ')[0] || 'Account'}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleLogin}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  isLightMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    : 'bg-[#13192b] hover:bg-[#1a223a] text-slate-200 border border-slate-700/70 hover:border-slate-500'
                }`}
                title="Sign in with Google"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </button>
            )}

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all transform active:scale-95 shadow-md ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/30 hover:border-red-400'
              }`}
              title="Admin Management Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>{isAdminLoggedIn ? 'Dashboard' : 'Admin'}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl md:hidden ${
                isLightMode
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-[#151c30] text-slate-300 hover:text-white'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search diamonds, passes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs outline-none ${
                isLightMode
                  ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
                  : 'bg-[#13192b] border border-slate-700/60 text-slate-100 placeholder-slate-400 focus:border-cyan-500'
              }`}
            />
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden py-3 border-t space-y-2 animate-fadeIn ${
              isLightMode ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            {/* Quick Action Banner on Mobile Menu */}
            <div className="grid grid-cols-2 gap-2 pb-1">
              <button
                onClick={() => {
                  onOpenTrackModal();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl font-bold text-xs shadow-xs border ${
                  isLightMode
                    ? 'bg-blue-50 text-[#0066FF] border-blue-200'
                    : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Order</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById('mystery-box-store-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onSelectCategory('mystery_box');
                  }
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-900/50 to-amber-900/40 text-amber-300 border border-amber-500/40 shadow-xs"
              >
                <span>🎁</span>
                <span>Mystery Box (১৫টি)</span>
              </button>

              {onOpenWelcomeSpin && (
                <button
                  onClick={() => {
                    onOpenWelcomeSpin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/40 shadow-xs"
                >
                  <span className="text-sm">🎡</span>
                  <span>Welcome Spin</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left ${
                    activeCategory === cat.id
                      ? isLightMode
                        ? 'bg-blue-100 text-blue-700 font-bold'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : isLightMode
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-[#13192b] text-slate-300 hover:bg-[#1a233c]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>Helpline: {settings.contactPhone}</span>
              </span>
              <button
                onClick={() => {
                  onOpenTrackModal();
                  setMobileMenuOpen(false);
                }}
                className="text-blue-600 dark:text-cyan-400 font-bold underline"
              >
                My Order স্ট্যাটাস
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Category Bar (Desktop) */}
      <div
        className={`hidden md:block border-t ${
          isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-[#090d18] border-slate-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? isLightMode
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                      : isLightMode
                      ? 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-[#101628] text-slate-300 hover:bg-[#172038] hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
