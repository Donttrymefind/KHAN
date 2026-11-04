import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  HelpCircle,
  Wallet,
  CreditCard,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { Product, MysteryBox, PaymentMethodConfig, Order } from '../types';

export interface TopupBuzzProductPageProps {
  boxId: string;
  boxTitle: string;
  boxCategory: string;
  boxImage: string;
  badge?: string;
  packages: Array<{
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    subtitle?: string;
    productRef?: Product | MysteryBox;
  }>;
  onBack: () => void;
  onProceedOrder: (selectedPackage: any, gameUid: string, paymentMethod: 'Wallet' | 'Instant') => void;
  walletBalance: number;
  onOpenAddMoney: () => void;
  isLightMode?: boolean;
}

export const TopupBuzzProductPage: React.FC<TopupBuzzProductPageProps> = ({
  boxId,
  boxTitle,
  boxCategory,
  boxImage,
  badge = '২ সেকেন্ডে টপআপ',
  packages,
  onBack,
  onProceedOrder,
  walletBalance,
  onOpenAddMoney,
  isLightMode = true,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    packages[0]?.id || ''
  );
  const [gameUid, setGameUid] = useState<string>('');
  const [paymentOption, setPaymentOption] = useState<'Wallet' | 'Instant'>('Instant');
  const [howToOrderOpen, setHowToOrderOpen] = useState(false);
  const [inputError, setInputError] = useState<string>('');

  // Interactive Spin Wheel State (For VIP Welcome / 8,000 Bonus Spin Wheel)
  const isSpinWheel = boxId === 'bonus_vip_mega' || boxTitle.toLowerCase().includes('spin');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [spinResult, setSpinResult] = useState<{ label: string; text: string; pkgId?: string } | null>(null);

  const wheelPrizes = [
    { label: '৮০০০💎 JACKPOT', text: 'সর্বোচ্চ ৮,০০০💎 মেগা বোনাস!', pkgId: 'sp_jackpot_1', angle: 22 },
    { label: '৫০০💎 বোনাস', text: '৫০০💎 ইনস্ট্যান্ট বোনাস!', pkgId: 'sp_1', angle: 67 },
    { label: '১৫০০💎 বোনাস', text: '১,৫০০💎 ভিআইপি বোনাস!', pkgId: 'sp_3', angle: 112 },
    { label: '৩০০০💎 বোনাস', text: '৩,০০০💎 মেগা ড্রপ!', pkgId: 'sp_5', angle: 157 },
    { label: '১০০০💎 বোনাস', text: '১,০০০💎 লাকি বোনাস!', pkgId: 'sp_10', angle: 202 },
    { label: '২০০০💎 বোনাস', text: '২,০০০💎 সুপার বোনাস!', pkgId: 'sp_pass', angle: 247 },
    { label: '৫০০০💎 বোনাস', text: '৫,০০০💎 রয়েল বোনাস!', pkgId: 'sp_whale_5k', angle: 292 },
    { label: '2X VIP ডাবল', text: '২X ডাবল মাল্টিপ্লায়ার বোনাস!', pkgId: 'sp_mega', angle: 337 },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    // Guaranteed exciting win (8000💎 Jackpot or 5000💎)
    const targetPrizeIndex = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * wheelPrizes.length);
    const prize = wheelPrizes[targetPrizeIndex];

    const currentRot = wheelAngle;
    const additionalSpins = 360 * 6; // 6 full rotations
    const targetAngle = additionalSpins + (360 - prize.angle);
    const finalRot = currentRot + targetAngle;

    setWheelAngle(finalRot);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prize);
      if (prize.pkgId) {
        const found = packages.find((p) => p.id === prize.pkgId);
        if (found) {
          setSelectedPackageId(found.id);
        }
      }
    }, 4200);
  };

  const currentPackage = packages.find((p) => p.id === selectedPackageId) || packages[0];

  const handleConfirmOrder = () => {
    if (!gameUid.trim()) {
      setInputError('অনুগ্রহ করে গেমের সঠিক প্লেয়ার আইডি (Player UID) দিন');
      const el = document.getElementById('account-info-input');
      el?.focus();
      return;
    }
    if (gameUid.trim().length < 4) {
      setInputError('আইডি কোডটি খুব ছোট, সঠিক কোড লিখুন');
      return;
    }
    setInputError('');

    if (paymentOption === 'Wallet' && walletBalance < (currentPackage?.price || 0)) {
      alert(`আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳ ${walletBalance}। অনুগ্রহ করে Add Money করুন অথবা Instant Pay সিলেক্ট করুন।`);
      return;
    }

    onProceedOrder(currentPackage, gameUid.trim(), paymentOption);
  };

  const isSocial = boxCategory.includes('social') || boxId.includes('social') || boxId.includes('fb');
  const inputPlaceholder = isSocial
    ? 'এখানে ফেসবুক পেজ / প্রোফাইল লিংক দিন'
    : boxCategory.includes('entertainment')
    ? 'এখানে আপনার ইমেইল এড্রেস দিন'
    : 'এখানে গেমের আইডি কোড দিন (Player UID)';

  const inputLabel = isSocial
    ? 'Facebook Profile / Page Link'
    : boxCategory.includes('entertainment')
    ? 'Personal / Delivery Email'
    : 'Player ID / UID কোড';

  return (
    <div className={`min-h-screen py-6 sm:py-10 transition-colors ${
      isLightMode ? 'bg-[#f4f7fb] text-slate-800' : 'bg-[#070b14] text-slate-100'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              isLightMode
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-slate-100'
                : 'bg-[#121929] hover:bg-[#1a243b] text-cyan-300 border border-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-[#0066FF]" />
            <span>হোমে ফিরুন (Back to Home)</span>
          </button>

          <button
            onClick={() => setHowToOrderOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:underline"
          >
            <HelpCircle className="w-4 h-4" />
            <span>কিভাবে অর্ডার করবেন?</span>
          </button>
        </div>

        {/* Product Hero Banner Card (Matching TopupBuzz header) */}
        <div className={`rounded-2xl p-4 sm:p-6 mb-6 shadow-sm border transition-all ${
          isLightMode
            ? 'bg-white border-slate-200/80 shadow-slate-200/50'
            : 'bg-[#101726] border-slate-800 shadow-black/40'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-blue-500/30 shadow-md">
                <img
                  src={boxImage}
                  alt={boxTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-[#0066FF] text-white">
                  LIVE
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black font-['Orbitron'] tracking-wide">
                    {boxTitle}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0066FF] border border-blue-200">
                    {badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> অফিশিয়াল সার্ভার
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Zap className="w-3.5 h-3.5" /> ২ সেকেন্ডে ডেলিভারি
                  </span>
                  <span>•</span>
                  <span>১০০% সেফ ও ট্রাস্টেড</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Auto Topup
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SPIN WHEEL WIDGET (Matching VIP Welcome / 8,000 Bonus Offer) */}
        {isSpinWheel && (
          <div
            className={`rounded-2xl p-5 sm:p-6 mb-6 shadow-md border overflow-hidden relative ${
              isLightMode
                ? 'bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border-purple-200'
                : 'bg-gradient-to-br from-[#1c1236] via-[#101726] to-[#0f172a] border-purple-900/60'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              {/* Left Column: Spin Wheel Graphics */}
              <div className="relative flex flex-col items-center shrink-0">
                {/* Pointer Arrow pointing Down into the top of the wheel */}
                <div className="z-20 -mb-3 drop-shadow-md">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-red-600 animate-bounce" />
                </div>

                {/* The Rotating Wheel */}
                <div
                  className="w-48 h-48 sm:w-56 sm:h-56 relative rounded-full shadow-2xl transition-transform duration-[4200ms] ease-[cubic-bezier(0.15,0.9,0.25,1)]"
                  style={{ transform: `rotate(${wheelAngle}deg)` }}
                >
                  <img
                    src="/assets/branding/vip_spin_wheel_8000.svg"
                    alt="VIP Spin Wheel 8000 Diamonds"
                    className="w-full h-full object-contain pointer-events-none select-none drop-shadow-xl"
                  />
                </div>

                {/* Center Spin Trigger Button */}
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={handleSpinWheel}
                  className={`mt-4 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                    isSpinning
                      ? 'bg-slate-400 text-white cursor-not-allowed animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 hover:brightness-110 hover:scale-105 active:scale-95 shadow-amber-500/30'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-900 animate-spin" />
                  <span>{isSpinning ? 'চাকা ঘুরছে...' : '🎡 চাকা ঘোরান (Spin Now)'}</span>
                </button>
              </div>

              {/* Right Column: Spin Wheel Info & Live Result */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>ইন্টার‍্যাক্টিভ ৮,০০০💎 স্পিন হুইল অফার</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Orbitron']">
                  ঘুরান লাকি হুইল • জিতুন ৮,০০০💎 পর্যন্ত বোনাস!
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  নিচের স্পিন বাটনে ক্লিক করে চাকা ঘোরান। আপনি ৫০💎 থেকে সর্বোচ্চ ৮,০০০💎 পর্যন্ত নিশ্চিত এক্সক্লুসিভ রিওয়ার্ড বোনাস পাবেন যা সরাসরি আপনার অ্যাকাউন্টে অটো-ক্রেডিট হবে!
                </p>

                {/* Result Box if spun */}
                {spinResult && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 border-2 border-emerald-500/50 animate-in fade-in zoom-in duration-300">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      🎉 অভিনন্দন! আপনি আনলক করেছেন:
                    </p>
                    <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {spinResult.label} — <span className="text-amber-500">{spinResult.text}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      নিচের প্যাকেজ তালিকা থেকে স্বয়ংক্রিয়ভাবে আপনার উইনিং বোনাস সিলেক্ট করা হয়েছে!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Select Recharge (রিচার্জ সিলেক্ট করুন) */}
        <div className={`rounded-2xl p-5 sm:p-6 mb-6 shadow-sm border ${
          isLightMode
            ? 'bg-white border-slate-200/80 shadow-slate-200/50'
            : 'bg-[#101726] border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-black flex items-center justify-center">
                ১
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Select Recharge (প্যাকেজ নির্বাচন করুন)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {packages.length} টি প্যাকেজ
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
            {packages.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`relative p-3 sm:p-3.5 rounded-xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[#0066FF] bg-blue-50/70 dark:bg-blue-950/40 shadow-md ring-2 ring-[#0066FF]/20 transform -translate-y-0.5'
                      : isLightMode
                      ? 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50'
                      : 'border-slate-800 hover:border-slate-700 bg-[#141d30]'
                  }`}
                >
                  {/* Selected Radio Indicator & Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#0066FF] bg-[#0066FF] text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    {pkg.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-100 text-[#0066FF] border border-blue-200">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Diamond Count */}
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-[#0066FF] transition-colors">
                      {pkg.title}
                    </h3>
                    {pkg.subtitle && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {pkg.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Price Tag (Bold Red/Amber) */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between">
                    <span className="font-black text-sm sm:text-base text-red-600 dark:text-red-400 font-mono">
                      ৳ {pkg.price}
                    </span>
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                      <span className="text-[11px] line-through text-slate-400 font-mono">
                        ৳ {pkg.originalPrice}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Account Info (একাউন্ট ইনফরমেশন) */}
        <div className={`rounded-2xl p-5 sm:p-6 mb-6 shadow-sm border ${
          isLightMode
            ? 'bg-white border-slate-200/80 shadow-slate-200/50'
            : 'bg-[#101726] border-slate-800'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-black flex items-center justify-center">
              ২
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Account Info (একাউন্ট ইনফরমেশন)
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {inputLabel} <span className="text-red-500">*</span>
              </label>
              <input
                id="account-info-input"
                type="text"
                placeholder={inputPlaceholder}
                value={gameUid}
                onChange={(e) => {
                  setGameUid(e.target.value);
                  if (inputError) setInputError('');
                }}
                className={`w-full px-4 py-3 rounded-xl text-sm font-mono font-medium outline-none transition-all ${
                  inputError
                    ? 'border-2 border-red-500 bg-red-50/50 dark:bg-red-950/20'
                    : isLightMode
                    ? 'border border-slate-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 bg-slate-50/50 focus:bg-white'
                    : 'border border-slate-700 focus:border-cyan-500 bg-[#13192b]'
                }`}
              />
              {inputError && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {inputError}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                সতর্কতা: শুধুমাত্র সঠিক Player UID বা একাউন্ট লিংক দিন। ভুল ইউআইডি দিলে ডায়মন্ড অন্য কারো একাউন্টে চলে যাবে এবং রিফান্ড পাওয়া যাবে না।
              </span>
            </div>
          </div>
        </div>

        {/* STEP 3: Select Payment Method (পেমেন্ট পদ্ধতি) */}
        <div className={`rounded-2xl p-5 sm:p-6 mb-6 shadow-sm border ${
          isLightMode
            ? 'bg-white border-slate-200/80 shadow-slate-200/50'
            : 'bg-[#101726] border-slate-800'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-black flex items-center justify-center">
              ৩
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Select Payment Method (পেমেন্ট পদ্ধতি নির্বাচন করুন)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Wallet Pay */}
            <div
              onClick={() => setPaymentOption('Wallet')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                paymentOption === 'Wallet'
                  ? 'border-[#0066FF] bg-blue-50/70 dark:bg-blue-950/40 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#0066FF] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Wallet Pay (ওয়ালেট ব্যালেন্স)
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ব্যালেন্স: <span className="font-bold text-[#0066FF]">৳ {walletBalance}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAddMoney();
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0066FF] hover:bg-blue-700 text-white transition-all shadow-sm"
              >
                + Add Money
              </button>
            </div>

            {/* Option 2: Instant Pay (bKash, Nagad, Rocket, Upay) */}
            <div
              onClick={() => setPaymentOption('Instant')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                paymentOption === 'Instant'
                  ? 'border-[#0066FF] bg-blue-50/70 dark:bg-blue-950/40 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Instant Pay (বিকাশ / নগদ / রকেট)
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700">bKash</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Nagad</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">Rocket</span>
                  </div>
                </div>
              </div>

              <div className="w-5 h-5 rounded-full border-2 border-[#0066FF] flex items-center justify-center">
                {paymentOption === 'Instant' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4: Rules & Conditions (জরুরী নিয়মাবলী) */}
        <div className={`rounded-2xl p-5 sm:p-6 mb-8 shadow-sm border ${
          isLightMode
            ? 'bg-white border-slate-200/80'
            : 'bg-[#101726] border-slate-800'
        }`}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-center">
              ৪
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Rules &amp; Conditions (জরুরী নিয়মাবলী)
            </h2>
          </div>

          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-[#0066FF] font-bold">১.</span>
              <span>শুধুমাত্র বাংলাদেশ (BD) সার্ভার আইডিতে টপআপ সম্পন্ন হবে।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0066FF] font-bold">২.</span>
              <span>পেমেন্ট সফল হওয়ার সাথে সাথে ২ থেকে ৫ মিনিটের মধ্যে ডায়মন্ড অ্যাকাউন্টে জমা হবে।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0066FF] font-bold">৩.</span>
              <span>ভুল আইডি কোড দিলে অর্ডার কমপ্লিট হবে কিন্তু রিফান্ড দাবি গ্রহণযোগ্য হবে না।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0066FF] font-bold">৪.</span>
              <span>যেকোনো প্রয়োজনে আমাদের টেলিগ্রাম বা হেল্পলাইন বাটনে ক্লিক করে সাথে সাথে সাপোর্ট নিন।</span>
            </li>
          </ul>
        </div>

        {/* Sticky Buy Now Action Footer */}
        <div className={`sticky bottom-0 z-30 p-4 sm:p-5 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
          isLightMode
            ? 'bg-white/95 border-blue-200 shadow-blue-500/10'
            : 'bg-[#0f1524]/95 border-cyan-500/30 shadow-black'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">সিলেক্টেড প্যাকেজ:</span>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {currentPackage?.title || 'প্যাকেজ নির্বাচন করুন'}
                </span>
                <span className="font-black text-lg sm:text-xl text-red-600 dark:text-red-400 font-mono">
                  ৳ {currentPackage?.price || 0}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="px-6 sm:px-8 py-3 rounded-xl font-black text-sm sm:text-base bg-[#0066FF] hover:bg-blue-600 text-white transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <span>অর্ডার কনফার্ম করুন (Buy Now)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* How To Order Modal */}
      {howToOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121929] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0066FF]" />
              কিভাবে অর্ডার করবেন?
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>১. আপনার পছন্দের রিচার্জ প্যাকেজ সিলেক্ট করুন।</p>
              <p>২. আপনার গেমের সঠিক Player UID বা আইডি কোডটি ইনপুট বক্সে লিখুন।</p>
              <p>৩. আপনার ওয়ালেটে ব্যালেন্স থাকলে Wallet Pay বেছে নিন, অথবা Instant Pay (bKash/Nagad/Rocket) সিলেক্ট করুন।</p>
              <p>৪. "অর্ডার কনফার্ম করুন" বাটনে ক্লিক করে টাকা পাঠিয়ে Transaction ID দিয়ে ভেরিফাই করুন।</p>
              <p>৫. ২ থেকে ৫ মিনিটের মধ্যে ডায়মন্ড আপনার গেমের মেইলবক্স বা প্রোফাইলে যুক্ত হয়ে যাবে।</p>
            </div>
            <button
              onClick={() => setHowToOrderOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#0066FF] text-white font-bold text-xs"
            >
              বুঝেছি (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
