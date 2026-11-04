import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  RotateCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WelcomeBonusSpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimToShop: (discountCode?: string) => void;
  isLightMode?: boolean;
}

interface WheelSegment {
  id: string;
  label: string;
  subLabel: string;
  code?: string;
  diamonds?: number;
  cashback?: number;
  color: string;
  textColor: string;
  icon: string;
}

const SEGMENTS: WheelSegment[] = [
  {
    id: 'jackpot_8000',
    label: '৮,০০০💎 Jackpot',
    subLabel: 'Mega Win',
    code: 'MEGA8000',
    diamonds: 8000,
    color: '#FFB800',
    textColor: '#1A1000',
    icon: '👑',
  },
  {
    id: 'bonus_50',
    label: 'Free 50💎 Bonus',
    subLabel: 'Instant Free',
    code: 'FREE50DIA',
    diamonds: 50,
    color: '#00D2FF',
    textColor: '#002B36',
    icon: '💎',
  },
  {
    id: 'coupon_10',
    label: '10% Discount',
    subLabel: 'কোড: WELCOME10',
    code: 'WELCOME10',
    color: '#10B981',
    textColor: '#FFFFFF',
    icon: '🎟️',
  },
  {
    id: 'bonus_100',
    label: '100💎 Bonus Drop',
    subLabel: 'Bonus Pass',
    code: 'BONUS100',
    diamonds: 100,
    color: '#6366F1',
    textColor: '#FFFFFF',
    icon: '✨',
  },
  {
    id: 'cashback_20',
    label: '৳২০ Cashback',
    subLabel: 'Wallet Return',
    cashback: 20,
    code: 'CASH20',
    color: '#8B5CF6',
    textColor: '#FFFFFF',
    icon: '💰',
  },
  {
    id: 'drop_500',
    label: '500💎 Rare Drop',
    subLabel: 'Lucky Prize',
    code: 'DROP500',
    diamonds: 500,
    color: '#EC4899',
    textColor: '#FFFFFF',
    icon: '🎁',
  },
  {
    id: 'double_diamond',
    label: '2X Double Diamond',
    subLabel: '100% Extra',
    code: '2XDOUBLE',
    color: '#0066FF',
    textColor: '#FFFFFF',
    icon: '⚡',
  },
  {
    id: 'coupon_15',
    label: '15% VIP Off',
    subLabel: 'কোড: VIP15',
    code: 'VIP15',
    color: '#F97316',
    textColor: '#FFFFFF',
    icon: '🔥',
  },
];

export const WelcomeBonusSpinModal: React.FC<WelcomeBonusSpinModalProps> = ({
  isOpen,
  onClose,
  onClaimToShop,
  isLightMode = true,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winningSegment, setWinningSegment] = useState<WheelSegment | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasSpun, setHasSpun] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio Context
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

  // Play tick sound
  const playTick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  };

  // Play victory melody
  const playFanfare = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.36);
      });
    } catch {}
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0066FF', '#00D2FF', '#FFB800', '#10B981', '#EC4899'],
      });
    } catch {}
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinningSegment(null);

    // Pick a rewarding segment (weighted towards high engagement: 10% coupon, 50 diamond, 100 diamond, or 8000 jackpot)
    const segmentCount = SEGMENTS.length;
    const sliceDeg = 360 / segmentCount; // 45 deg

    // Pick target index:
    // Random choice among all 8 segments with fair probabilities
    const targetIdx = Math.floor(Math.random() * segmentCount);
    const targetSeg = SEGMENTS[targetIdx];

    // Compute rotation:
    // Note: Top arrow is at 0 degrees (pointing down to the top segment).
    // The segment center for index i is at: i * sliceDeg + sliceDeg / 2.
    // To align it with the top (270 or 0 deg), rotate clockwise:
    const baseRotations = 6 * 360; // 6 full spins
    const targetOffset = 360 - (targetIdx * sliceDeg + sliceDeg / 2);
    const totalRotation = currentRotation + baseRotations + (targetOffset - (currentRotation % 360));

    setCurrentRotation(totalRotation);

    // Ticking audio interval simulation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      playTick();
      if (tickCount > 30) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setHasSpun(true);
      setWinningSegment(targetSeg);
      playFanfare();
      triggerConfetti();

      // Save to localStorage
      try {
        localStorage.setItem(
          'ktu_welcome_prize',
          JSON.stringify({ segment: targetSeg, wonAt: new Date().toISOString() })
        );
      } catch {}
    }, 4200);
  };

  const copyPrizeCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl my-6 border transition-all text-center ${
          isLightMode
            ? 'bg-gradient-to-b from-white via-blue-50/50 to-white text-slate-800 border-blue-200 shadow-blue-500/20'
            : 'bg-gradient-to-b from-[#0b0e17] via-[#111827] to-[#0b0e17] text-white border-cyan-500/40 shadow-cyan-950/80'
        }`}
      >
        {/* Top Controls: Sound & Close */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-colors ${
              isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Welcome Bonus Spin Wheel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-['Orbitron']">
            ঘোরান এবং জিতে নিন ৮,০০০💎 পর্যন্ত!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            KHAN TOP UP এ আপনাকে স্বাগতম! ফ্রি স্পিন করে ইনস্ট্যান্ট বোনাস ডায়মন্ড ও স্পেশাল ভাউচার জিতুন।
          </p>
        </div>

        {/* The Animated Spin Wheel Container */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-3 flex items-center justify-center">
          {/* Top Arrow / Indicator Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_10px_rgba(255,184,0,0.8)]">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-white -mt-5 border-2 border-amber-500 shadow-md"></div>
          </div>

          {/* Outer Glowing Ring with Neon Dots */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/60 dark:border-amber-400/40 shadow-[0_0_25px_rgba(255,184,0,0.4)] pointer-events-none z-20">
            {/* 16 perimeter lights */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const r = 48; // percentage
              const x = 50 + r * Math.cos(rad);
              const y = 50 + r * Math.sin(rad);
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#FFB800] transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    animationDelay: `${(i % 4) * 0.25}s`,
                  }}
                />
              );
            })}
          </div>

          {/* Rotating Wheel Body */}
          <div
            className="w-full h-full rounded-full relative overflow-hidden shadow-2xl transition-transform"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transitionDuration: isSpinning ? '4200ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.12, 0.85, 0.2, 1)',
            }}
          >
            {/* SVG Wheel Segments */}
            <svg viewBox="0 0 320 320" className="w-full h-full">
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.4" />
                </filter>
              </defs>
              {SEGMENTS.map((seg, i) => {
                const count = SEGMENTS.length;
                const angle = 360 / count;
                const startAngle = i * angle - 90;
                const endAngle = (i + 1) * angle - 90;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const cx = 160;
                const cy = 160;
                const r = 156;

                const x1 = cx + r * Math.cos(startRad);
                const y1 = cy + r * Math.sin(startRad);
                const x2 = cx + r * Math.cos(endRad);
                const y2 = cy + r * Math.sin(endRad);

                const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

                const textAngle = startAngle + angle / 2;
                const textRad = (textAngle * Math.PI) / 180;
                const tr = 100;
                const tx = cx + tr * Math.cos(textRad);
                const ty = cy + tr * Math.sin(textRad);

                return (
                  <g key={seg.id}>
                    <path
                      d={d}
                      fill={seg.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-colors"
                    />
                    {/* Rotated text label */}
                    <g transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}>
                      <text
                        x={tx}
                        y={ty - 8}
                        fill={seg.textColor}
                        fontSize="13"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {seg.icon}
                      </text>
                      <text
                        x={tx}
                        y={ty + 8}
                        fill={seg.textColor}
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {seg.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Spin Action Button */}
          <div className="absolute z-30">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full font-black text-[11px] sm:text-xs uppercase tracking-tight flex flex-col items-center justify-center transition-all transform shadow-2xl border-4 ${
                isSpinning
                  ? 'bg-slate-500 text-slate-200 border-slate-400 cursor-not-allowed scale-95'
                  : 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 border-white hover:scale-105 active:scale-95 shadow-amber-500/50 cursor-pointer animate-pulse'
              }`}
            >
              <RotateCw className={`w-4 h-4 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'ঘুরছে...' : 'SPIN'}</span>
            </button>
          </div>
        </div>

        {/* Winning Prize Announcement Popup Card */}
        {winningSegment && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-emerald-500/20 border-2 border-amber-400 animate-bounce-subtle space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{winningSegment.icon}</span>
              <span className="font-black text-base sm:text-lg text-amber-500 dark:text-amber-300">
                🎉 অভিনন্দন! আপনি জিতেছেন:
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {winningSegment.label}
            </div>

            {winningSegment.code && (
              <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-xs text-blue-600 dark:text-cyan-400">
                  কুপন কোড: {winningSegment.code}
                </div>
                <button
                  onClick={() => copyPrizeCode(winningSegment.code!)}
                  className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => {
                  onClaimToShop(winningSegment.code);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>টপ-আপে ব্যবহার করুন (Claim &amp; Topup)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Spin Instruction / Footer */}
        {!winningSegment && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>প্রতিদিন একবার করে ফ্রি স্পিন করার সুযোগ রয়েছে!</span>
          </div>
        )}
      </div>
    </div>
  );
};
