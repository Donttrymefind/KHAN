import React, { useState, useRef } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  PackageCheck,
  Gift,
  RotateCw,
  ArrowRight,
  TrendingUp,
  Percent,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MysteryBox, GuaranteedReward } from '../types';

interface GuaranteedRewardsModalProps {
  box: MysteryBox | null;
  onClose: () => void;
  onBuy: (box: MysteryBox) => void;
  initialMode?: 'view' | 'open';
  userId?: string;
  userPhone?: string;
  userName?: string;
}

export const GuaranteedRewardsModal: React.FC<GuaranteedRewardsModalProps> = ({
  box,
  onClose,
  onBuy,
  initialMode = 'view',
  userId,
  userPhone,
  userName,
}) => {
  const [mode, setMode] = useState<'view' | 'opening' | 'result'>(
    initialMode === 'open' ? 'opening' : 'view'
  );
  const [isOpening, setIsOpening] = useState(false);
  const [wonReward, setWonReward] = useState<GuaranteedReward | null>(null);
  const [cooldownError, setCooldownError] = useState<{
    message: string;
    remainingSeconds: number;
    nextAvailableAt: string;
  } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  if (!box) return null;

  // Derive guest or authenticated user ID
  const effectiveUserId =
    userId ||
    localStorage.getItem('ktu_guest_uid') ||
    'guest_' + (typeof window !== 'undefined' ? window.navigator.userAgent.replace(/\D/g, '').slice(0, 10) : 'user');

  // Initialize Web Audio Context for realistic gaming unbox sound
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playUnboxSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Rumble/drumroll frequency sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 2.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.2);
    } catch {}
  };

  const playVictoryFanfare = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      // High triumph chords: G4 -> C5 -> E5 -> G5
      const notes = [392, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 0.52);
      });
    } catch {}
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFB800', '#00D2FF', '#EC4899', '#10B981', '#FFFFFF'],
      });
    } catch {}
  };

  // Perform server-authoritative unboxing with 24-hour cooldown validation
  const handleStartUnbox = async () => {
    if (isOpening) return;
    setCooldownError(null);
    setWonReward(null);

    try {
      const res = await fetch('/api/mystery-box/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          userName: userName || 'Gamer',
          userPhone: userPhone || '',
          boxId: box.id,
          boxName: box.name,
          rewards: box.guaranteedRewards,
          pricePaid: box.price,
        }),
      });

      const data = await res.json();

      if (res.status === 403 || data.isCooldownActive) {
        setCooldownError({
          message: data.message || '২৪ ঘণ্টার Cooldown চলমান রয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।',
          remainingSeconds: data.remainingSeconds || 86400,
          nextAvailableAt: data.nextAvailableAt || '',
        });
        setMode('view');
        return;
      }

      if (!data.success || !data.reward) {
        setCooldownError({
          message: data.message || 'বক্স খুলতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          remainingSeconds: 0,
          nextAvailableAt: '',
        });
        setMode('view');
        return;
      }

      // Successful server-side random pick
      setMode('opening');
      setIsOpening(true);
      playUnboxSound();

      setTimeout(() => {
        setIsOpening(false);
        setWonReward(data.reward);
        setMode('result');
        playVictoryFanfare();
        triggerConfetti();
      }, 2400);
    } catch {
      // Fallback in case of network issue
      setMode('opening');
      setIsOpening(true);
      playUnboxSound();
      const fallbackReward = box.guaranteedRewards[0];
      setTimeout(() => {
        setIsOpening(false);
        setWonReward(fallbackReward);
        setMode('result');
        playVictoryFanfare();
        triggerConfetti();
      }, 2400);
    }
  };

  const rarityStyles: Record<
    string,
    { bg: string; text: string; border: string; glow: string }
  > = {
    Mythic: {
      bg: 'from-amber-500/25 via-yellow-500/20 to-orange-500/25',
      text: 'text-amber-300',
      border: 'border-amber-400/50',
      glow: 'shadow-amber-500/20',
    },
    Legendary: {
      bg: 'from-purple-500/25 via-pink-500/20 to-purple-500/25',
      text: 'text-purple-300',
      border: 'border-purple-400/50',
      glow: 'shadow-purple-500/20',
    },
    Epic: {
      bg: 'from-blue-500/25 via-cyan-500/20 to-blue-500/25',
      text: 'text-cyan-300',
      border: 'border-cyan-400/50',
      glow: 'shadow-cyan-500/20',
    },
    Rare: {
      bg: 'from-emerald-500/25 via-teal-500/20 to-emerald-500/25',
      text: 'text-emerald-300',
      border: 'border-emerald-400/50',
      glow: 'shadow-emerald-500/20',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#111728] via-[#0d121f] to-[#090d16] border border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/40 text-white my-6 overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =========================================================================
            VIEW MODE 1: INSIDE REWARDS LIST (বিস্তারিত পুরষ্কার তালিকা)
        ========================================================================= */}
        {mode === 'view' && (
          <div className="space-y-5">
            {/* Header: 3D Box Banner & Title */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-slate-900 border-2 border-amber-400/50 shrink-0 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-full object-contain filter drop-shadow hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-['Orbitron']">
                    {box.badge || 'Inside Rewards'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>১০০% নিশ্চিত পুরষ্কার ড্রপ</span>
                  </span>
                </div>

                <h3 className="font-['Orbitron'] font-extrabold text-lg sm:text-xl text-white mt-1 truncate">
                  {box.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  নিচে বক্সের ভিতরের সব সম্ভাব্য পুরষ্কার ও জয়ের সম্ভাবনা (Drop Rates) দেখুন
                </p>
              </div>
            </div>

            {/* Cooldown Alert Banner */}
            {cooldownError && (
              <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-start gap-3 shadow-lg shadow-red-950/40 animate-pulse">
                <Flame className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-red-300">
                    🚨 ২৪ ঘণ্টার Cooldown সক্রিয় রয়েছে!
                  </div>
                  <p className="text-[11px] text-red-200/90 leading-relaxed">
                    {cooldownError.message}
                  </p>
                </div>
              </div>
            )}

            {/* Rewards List Cards */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 px-1">
                <span>সম্ভাব্য পুরষ্কারসমূহ ({box.guaranteedRewards.length} Items)</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Percent className="w-3.5 h-3.5" />
                  <span>জয়ের সম্ভাবনা (Drop Rate)</span>
                </span>
              </div>

              <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
                {box.guaranteedRewards.map((reward, idx) => {
                  const style = rarityStyles[reward.rarity] || rarityStyles.Epic;
                  const prob = reward.probability || Math.round(100 / box.guaranteedRewards.length);

                  return (
                    <div
                      key={reward.id || idx}
                      className={`p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r ${style.bg} border ${style.border} flex items-center justify-between gap-3 shadow-sm transition-all hover:scale-[1.01]`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                          {reward.icon || '🎁'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 flex-wrap">
                            <span className="truncate">{reward.name}</span>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/50 ${style.text} border border-white/10`}
                            >
                              {reward.rarity}
                            </span>
                            {reward.isJackpot && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500 text-black">
                                👑 JACKPOT
                              </span>
                            )}
                          </div>
                          {reward.description && (
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                              {reward.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="font-['Orbitron'] font-black text-xs sm:text-sm text-amber-300 bg-black/50 px-2.5 py-1 rounded-xl border border-amber-500/30">
                          {reward.quantity}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center justify-end gap-1">
                          <span>{prob}% চান্স</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transparency Note */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>স্বচ্ছতা গ্যারান্টি:</strong> বক্সটি খুললে আপনি উপরের যে কোনো একটি রেয়ার বা মেগা পুরষ্কার নিশ্চিত পাবেন, যা সরাসরি আপনার গেম ইউআইডি/অ্যাকাউন্টে যোগ হবে।
              </span>
            </div>

            {/* Action Buttons: Buy Box & Open/Simulate */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div>
                <div className="text-[11px] text-slate-400">বক্সের দাম (Box Price)</div>
                <div className="font-['Orbitron'] font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">
                  ৳{box.price}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartUnbox}
                  className="px-4 py-2.5 rounded-xl bg-[#182138] hover:bg-[#222e4d] text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Open Box (বক্স খুলুন)</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onBuy(box);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Buy Box (৳{box.price})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW MODE 2: UNBOXING ANIMATION (বক্স খোলার সুন্দর এনিমেশন)
        ========================================================================= */}
        {mode === 'opening' && (
          <div className="py-10 text-center space-y-6">
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Radial Golden Ray Burst */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-yellow-500/40 to-amber-500/30 rounded-full blur-2xl animate-ping" />
              <div className="absolute w-40 h-40 bg-amber-400/20 rounded-full blur-xl animate-pulse" />

              {/* Shaking Chest Image */}
              <div className="relative z-10 animate-bounce">
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-36 h-36 object-contain filter drop-shadow-[0_0_25px_rgba(255,184,0,0.8)] transform scale-110"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase font-['Orbitron'] animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>Unboxing {box.name}...</span>
              </div>
              <h3 className="font-['Orbitron'] font-black text-2xl text-white">
                বক্স খোলা হচ্ছে... পুরষ্কার আসছে!
              </h3>
              <p className="text-xs text-slate-400">
                লাকি র্যান্ডম অ্যালগরিদম আপনার বিজয়ী পুরষ্কার নির্ধারণ করছে
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW MODE 3: REWARD RESULT REVEAL (বিজয়ী পুরষ্কার প্রদর্শনী)
        ========================================================================= */}
        {mode === 'result' && wonReward && (
          <div className="py-4 text-center space-y-5 animate-fadeIn">
            {/* Victory Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase font-['Orbitron']">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>🎉 Congratulations! Winner</span>
            </div>

            <h3 className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              আপনি জিতেছেন!
            </h3>

            {/* Winning Item Spotlight Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c2438] via-[#131a2b] to-[#0c111e] border-2 border-amber-400/80 shadow-2xl shadow-amber-500/30 max-w-sm mx-auto space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="w-20 h-20 rounded-2xl bg-black/50 border-2 border-amber-400/60 flex items-center justify-center text-5xl mx-auto shadow-inner">
                {wonReward.icon || '💎'}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-['Orbitron']">
                  {wonReward.rarity}
                </span>
                <h4 className="font-['Orbitron'] font-black text-xl text-white mt-1.5">
                  {wonReward.name}
                </h4>
                <div className="font-['Orbitron'] font-black text-2xl text-amber-300 mt-1">
                  {wonReward.quantity}
                </div>
                {wonReward.description && (
                  <p className="text-xs text-slate-300 mt-1">{wonReward.description}</p>
                )}
              </div>
            </div>

            {/* Actions: Claim / Buy Box / Close */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setMode('view')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                পুরষ্কার তালিকা দেখুন
              </button>

              <button
                onClick={handleStartUnbox}
                className="px-4 py-2.5 rounded-xl bg-[#182138] hover:bg-[#222e4d] text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>আবার বক্স খুলুন</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBuy(box);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-['Orbitron'] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/25"
              >
                <Zap className="w-4 h-4" />
                <span>ক্লেইম ও অর্ডার করুন (Buy Box)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
