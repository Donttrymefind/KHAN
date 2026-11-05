import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Crown,
  Flame,
  Zap,
  Clock,
  Eye,
  Gift,
  ShoppingCart,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RotateCw,
} from 'lucide-react';
import { MysteryBox, BoxCooldownInfo } from '../types';

interface MysteryBoxStoreSectionProps {
  mysteryBoxes: MysteryBox[];
  onPreviewBox: (box: MysteryBox, mode?: 'view' | 'open') => void;
  onBuyBox: (box: MysteryBox) => void;
  userId?: string;
  isLightMode?: boolean;
}

export const MysteryBoxStoreSection: React.FC<MysteryBoxStoreSectionProps> = ({
  mysteryBoxes,
  onPreviewBox,
  onBuyBox,
  userId,
  isLightMode = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cooldown' | 'jackpot' | 'budget'>('all');
  const [cooldowns, setCooldowns] = useState<Record<string, BoxCooldownInfo>>({});
  const [nowSec, setNowSec] = useState<number>(Date.now());

  // Fetch server-authoritative cooldowns for this user
  const effectiveUserId = userId || localStorage.getItem('ktu_guest_uid') || 'guest_' + (typeof window !== 'undefined' ? window.navigator.userAgent.replace(/\D/g, '').slice(0, 10) : 'user');

  const fetchCooldowns = async () => {
    try {
      const res = await fetch(`/api/mystery-box/cooldowns/${effectiveUserId}`);
      const data = await res.json();
      if (data.success && data.cooldowns) {
        setCooldowns(data.cooldowns);
      }
    } catch {}
  };

  useEffect(() => {
    fetchCooldowns();
    // Poll every 15 seconds to ensure server time sync
    const pollInterval = setInterval(fetchCooldowns, 15000);
    return () => clearInterval(pollInterval);
  }, [effectiveUserId]);

  // 1-second countdown clock for smooth UI updates
  useEffect(() => {
    const timer = setInterval(() => {
      setNowSec(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingTimeFormatted = (boxId: string) => {
    const info = cooldowns[boxId];
    if (!info || !info.nextAvailableAt) return null;

    const target = new Date(info.nextAvailableAt).getTime();
    const diffSec = Math.max(0, Math.ceil((target - nowSec) / 1000));
    if (diffSec <= 0) return null;

    const hours = Math.floor(diffSec / 3600);
    const mins = Math.floor((diffSec % 3600) / 60);
    const secs = diffSec % 60;

    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter boxes based on user selection
  const filteredBoxes = mysteryBoxes.filter((b) => {
    if (activeFilter === 'cooldown') {
      return b.cooldownHours && b.cooldownHours > 0;
    }
    if (activeFilter === 'jackpot') {
      return b.price >= 700 || b.guaranteedRewards.some((r) => r.isJackpot || r.rarity === 'Mythic');
    }
    if (activeFilter === 'budget') {
      return b.price < 400;
    }
    return true;
  });

  return (
    <section id="mystery-box-store-section" className="relative scroll-mt-24 py-8">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#12072b]/60 via-[#0a0418]/80 to-transparent pointer-events-none rounded-3xl -z-10" />

      {/* Header Container */}
      <div className="text-center max-w-4xl mx-auto px-4 mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-900/30 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>OFFICIAL GAMING CRATES &amp; JACKPOT</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Orbitron'] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
          MYSTERY BOX STORE
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          ১৫টি বিশেষ গেমিং মিষ্টি বক্স – প্রতিটি বক্সে রয়েছে ১০০% নিশ্চিত পুরস্কার, স্বচ্ছ ড্রপ রেট (Probability) এবং লাইভ ৩ডি আনবক্সিং অ্যানিমেশন!
        </p>

        {/* 24-Hours Cooldown Highlight Notice */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-semibold shadow-inner">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Royal Box: ২৪ ঘণ্টায় ১ বার</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-950/80 border border-orange-500/40 text-orange-200 text-xs font-semibold shadow-inner">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Special Box: ২৪ ঘণ্টায় ১ বার</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>১০০% সার্ভার-সিকিউরড Cooldown</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#18112e] text-slate-300 hover:bg-[#251a44] border border-slate-700/60'
            }`}
          >
            সকল ১৫টি বক্স ({mysteryBoxes.length})
          </button>

          <button
            onClick={() => setActiveFilter('cooldown')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'cooldown'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#18112e] text-slate-300 hover:bg-[#251a44] border border-slate-700/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>২৪ ঘণ্টা Cooldown (২টি)</span>
          </button>

          <button
            onClick={() => setActiveFilter('jackpot')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'jackpot'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg'
                : 'bg-[#18112e] text-slate-300 hover:bg-[#251a44] border border-slate-700/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>মেগা জ্যাকপট বক্স</span>
          </button>

          <button
            onClick={() => setActiveFilter('budget')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'budget'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-[#18112e] text-slate-300 hover:bg-[#251a44] border border-slate-700/60'
            }`}
          >
            বাজেট বক্স (&lt; ৳৪০০)
          </button>
        </div>
      </div>

      {/* 15 Box Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 max-w-7xl mx-auto px-4">
        {filteredBoxes.map((box) => {
          const remainingTime = getRemainingTimeFormatted(box.id);
          const isOnCooldown = Boolean(remainingTime);
          const isRoyalOrSpecial = box.id === 'mb_royal' || box.id === 'mb_special' || (box.cooldownHours && box.cooldownHours > 0);

          return (
            <div
              key={box.id}
              className={`group relative rounded-3xl bg-gradient-to-b from-[#170e30] via-[#0f0924] to-[#070312] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                isOnCooldown
                  ? 'border-purple-500/60 shadow-purple-900/20'
                  : 'border-amber-500/30 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1.5'
              }`}
            >
              {/* Top Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-black" />
                  <span>{box.badge}</span>
                </span>

                {isRoyalOrSpecial && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md ${
                    isOnCooldown
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-purple-900/90 text-purple-200 border border-purple-400/50'
                  }`}>
                    <Clock className="w-2.5 h-2.5" />
                    <span>{isOnCooldown ? 'Cooldown' : '২৪ ঘণ্টা'}</span>
                  </span>
                )}
              </div>

              {/* 3D Crate Image Header */}
              <div
                onClick={() => onPreviewBox(box, 'view')}
                className="relative h-44 w-full overflow-hidden bg-gradient-to-b from-purple-950/30 via-slate-900/40 to-transparent flex items-center justify-center p-3 cursor-pointer"
                title="বক্সের ভেতরে কী কী পুরষ্কার রয়েছে দেখতে ক্লিক করুন"
              >
                {/* Radial golden glow aura */}
                <div className="absolute w-28 h-28 bg-amber-500/20 group-hover:bg-amber-400/35 rounded-full blur-2xl transition-all duration-500" />

                <img
                  src={box.image}
                  alt={box.name}
                  className="relative z-10 max-h-32 object-contain filter drop-shadow-[0_8px_20px_rgba(245,158,11,0.35)] group-hover:scale-110 transition-transform duration-500"
                />

                {/* Cooldown Active Overlay Banner */}
                {isOnCooldown && (
                  <div className="absolute inset-x-2 bottom-2 z-20 px-2.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 backdrop-blur-sm text-center shadow-lg">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                      <span>বাকি সময়: {remainingTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Crate Information */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{box.guaranteedRewards?.length || 4} টি নিশ্চিত আইটেম</span>
                  </div>

                  <h3
                    onClick={() => onPreviewBox(box, 'view')}
                    className="font-['Orbitron'] font-extrabold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {box.name}
                  </h3>

                  {box.description && (
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {box.description}
                    </p>
                  )}

                  {/* Top Rewards Preview */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {box.guaranteedRewards?.slice(0, 3).map((r, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 rounded-md bg-[#1d1238] border border-purple-800/50 text-slate-300 font-medium flex items-center gap-1"
                      >
                        <span>{r.icon || '🎁'}</span>
                        <span className="line-clamp-1 max-w-[85px]">{r.quantity}</span>
                        {r.probability && (
                          <span className="text-[8px] text-amber-400 font-bold">({r.probability}%)</span>
                        )}
                      </span>
                    ))}
                    {(box.guaranteedRewards?.length || 0) > 3 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#1d1238] text-slate-400">
                        +{(box.guaranteedRewards?.length || 0) - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-2.5 border-t border-purple-900/50 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold">মূল্য</span>
                      <div className="font-['Orbitron'] font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">
                        ৳{box.price}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onPreviewBox(box, 'view')}
                      className="px-2.5 py-1 rounded-lg bg-[#241544] hover:bg-[#341e62] text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="ভেতরের পুরস্কার ও ড্রপ রেট দেখুন"
                    >
                      <Eye className="w-3 h-3" />
                      <span>পুরস্কার</span>
                    </button>
                  </div>

                  {/* Action Buttons: Open & Buy */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      disabled={isOnCooldown}
                      onClick={() => onPreviewBox(box, 'open')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold font-['Orbitron'] flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 ${
                        isOnCooldown
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                          : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 cursor-pointer'
                      }`}
                      title={isOnCooldown ? `২৪ ঘণ্টার Cooldown চলমান: ${remainingTime}` : '৩ডি অ্যানিমেশনসহ বক্স খুলুন'}
                    >
                      <span className="text-xs">🎁</span>
                      <span>{isOnCooldown ? 'Cooldown' : 'খুলুন'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onBuyBox(box)}
                      className="py-2 px-1 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                      title="সরাসরি বক্স কিনুন ও ডেলিভারি নিন"
                    >
                      <ShoppingCart className="w-3 h-3 text-black" />
                      <span>কিনুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
