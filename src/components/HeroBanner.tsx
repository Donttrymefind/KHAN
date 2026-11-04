import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Users,
  Shield,
  Zap,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BannerSlide, ProductCategory } from '../types';

interface HeroBannerProps {
  banners: BannerSlide[];
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenTrackModal: () => void;
  isLightMode?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners,
  onSelectCategory,
  onOpenTrackModal,
  isLightMode = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default banners if none configured
  const defaultBanners = [
    {
      id: 'b1',
      title: 'গুরুত্বপূর্ণ নোটিশ',
      subtitle:
        'ডায়মন্ড টপ-আপ করতে চান, কিন্তু নিজের বিকাশ নেই অথবা দেশের বাইরে আছেন? তাহলে টাকা পাঠানোর আগে অবশ্যই আমাদের ইনবক্সে যোগাযোগ করুন। আপনার জন্য আলাদা পেমেন্টের ব্যবস্থা রয়েছে।',
      image:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'টপআপ করুন',
      tag: 'অফিশিয়াল নোটিশ',
    },
    {
      id: 'b2',
      title: 'Free Fire Instant UID Top-Up',
      subtitle:
        '২৫ ডায়মন্ড থেকে ১২,০০০ ডায়মন্ড পর্যন্ত মাত্র ২ সেকেন্ডে ডেলিভারি! ১০০% সেফ এবং অনুমোদিত।',
      image:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'ডায়মন্ড কিনুন',
      tag: '🔥 হট ডিল',
    },
  ];

  const activeBanners = banners && banners.length > 0 ? banners : defaultBanners;

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const current = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 space-y-4">
      {/* Banner Carousel Card (Matching Screenshot 3) */}
      <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border shadow-xl transition-all ${
        isLightMode
          ? 'bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 border-blue-200'
          : 'bg-[#0e1424] border-cyan-500/30 shadow-cyan-950/40'
      }`}>
        <div className="relative h-60 sm:h-72 md:h-80 w-full overflow-hidden">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover object-center filter brightness-50 contrast-125 scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          {/* Text Content Overlay matching Screenshot 3 notice banner */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-14 max-w-2xl z-10">
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-amber-400 text-black text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.tag || 'গুরুত্বপূর্ণ নোটিশ'}</span>
            </div>

            <h2 className="font-['Orbitron'] font-black text-xl sm:text-2xl md:text-3xl text-white tracking-wide leading-tight mb-2 drop-shadow-md">
              {current.title}
            </h2>

            <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 max-w-xl font-medium drop-shadow">
              {current.subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator matching Screenshot 3 */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-[#0066FF] shadow-sm'
                      : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two Prominent Quick Action Buttons matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Button 1: SUPPORT Telegram */}
        <a
          href="https://t.me/khantopupbd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white transition-all transform hover:-translate-y-0.5 shadow-md shadow-blue-500/25 font-bold text-sm sm:text-base cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">SUPPORT</span>
            <span className="font-black">Telegram</span>
          </div>
        </a>

        {/* Button 2: GROUP Join Group */}
        <a
          href="https://t.me/khantopupgroup"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white transition-all transform hover:-translate-y-0.5 shadow-md shadow-blue-500/25 font-bold text-sm sm:text-base cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">GROUP</span>
            <span className="font-black">Join Group</span>
          </div>
        </a>
      </div>
    </div>
  );
};
