import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Shield, Clock, Zap, Award } from 'lucide-react';
import { BannerSlide, ProductCategory } from '../types';

interface HeroBannerProps {
  banners: BannerSlide[];
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenTrackModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners,
  onSelectCategory,
  onOpenTrackModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Banner Carousel Card */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 bg-[#0e1424]">
        {/* Background Image with Gaming Gradients */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover object-center filter brightness-60 contrast-110 scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e17] via-[#0b0e17]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-black/30" />

          {/* Grid cyber overlay pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff1_1px,transparent_1px),linear-gradient(to_bottom,#0ff1_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />

          {/* Content Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl z-10">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{current.tag || 'HOT DEAL'}</span>
            </div>

            {/* Title */}
            <h1 className="font-['Orbitron'] font-black text-2xl sm:text-3xl md:text-5xl text-white tracking-wide leading-tight mb-2 sm:mb-3 drop-shadow-md">
              {current.title}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-base mb-5 line-clamp-2 max-w-xl font-medium">
              {current.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (current.categoryFilter) {
                    onSelectCategory(current.categoryFilter);
                  }
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{current.ctaText || 'Order Now'}</span>
              </button>

              <button
                onClick={onOpenTrackModal}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#151c30]/90 hover:bg-[#1f2845] text-slate-200 border border-slate-700/80 hover:border-slate-500 font-semibold text-xs sm:text-sm transition-all"
              >
                Track Live Order
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/80 border border-slate-700 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/80 border border-slate-700 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 right-6 flex items-center gap-1.5 z-20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400'
                      : 'w-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trust & Guarantee Badges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111728]/80 border border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">5-15 Min Delivery</div>
            <div className="text-[11px] text-slate-400">Direct In-Game UID processing</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111728]/80 border border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">bKash & Nagad</div>
            <div className="text-[11px] text-slate-400">Verified manual & automated gateway</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111728]/80 border border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">100% Safe Top-Up</div>
            <div className="text-[11px] text-slate-400">Zero ID ban risk, official servers</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111728]/80 border border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">24/7 Live Support</div>
            <div className="text-[11px] text-slate-400">WhatsApp hotline: 01575630127</div>
          </div>
        </div>
      </div>
    </div>
  );
};
