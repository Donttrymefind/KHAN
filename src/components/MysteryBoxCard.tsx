import React, { useState } from 'react';
import { Package, Sparkles, Eye, ShoppingCart, ShieldCheck, ShieldAlert } from 'lucide-react';
import { MysteryBox } from '../types';

interface MysteryBoxCardProps {
  box: MysteryBox;
  onPreview: (box: MysteryBox, mode?: 'view' | 'open') => void;
  onBuy: (box: MysteryBox) => void;
}

export const MysteryBoxCard: React.FC<MysteryBoxCardProps> = ({ box, onPreview, onBuy }) => {
  const isOutOfStock = !box.isUnlimited && box.stock <= 0;

  return (
    <div
      className={`group relative rounded-3xl bg-gradient-to-b from-[#161c32] via-[#0f1424] to-[#0a0d18] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
        isOutOfStock
          ? 'border-red-900/40 opacity-75'
          : 'border-amber-500/30 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1'
      }`}
    >
      {/* Top Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-black" />
          <span>{box.badge || '১০০% নিশ্চিত ড্রপ'}</span>
        </span>
      </div>

      {/* Crate Visual Header */}
      <div
        onClick={() => onPreview(box, 'view')}
        className="relative h-48 w-full overflow-hidden bg-gradient-to-b from-amber-950/20 to-transparent flex items-center justify-center p-4 cursor-pointer"
        title="পুরষ্কার তালিকা দেখতে ক্লিক করুন"
      >
        {/* Glow circle behind crate */}
        <div className="absolute w-36 h-36 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-400/35 transition-all" />

        <img
          src={box.image}
          alt={box.name}
          className="relative z-10 max-h-36 object-contain filter drop-shadow-[0_10px_25px_rgba(245,158,11,0.35)] group-hover:scale-110 transition-transform duration-500"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 text-white font-black text-xs uppercase tracking-widest shadow-lg">
              <ShieldAlert className="w-4 h-4" />
              <span>স্টক শেষ (Out of Stock)</span>
            </div>
          </div>
        )}
      </div>

      {/* Crate Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{box.guaranteedRewards.length} টি নিশ্চিত আইটেম ও জ্যাকপট</span>
          </div>

          <h3
            onClick={() => onPreview(box, 'view')}
            className="font-['Orbitron'] font-extrabold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors mb-2 cursor-pointer line-clamp-1"
          >
            {box.name}
          </h3>

          {/* Quick reward tags summary with drop chance */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {box.guaranteedRewards.slice(0, 3).map((r, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-[#13192b] border border-slate-700/60 text-slate-300 font-medium flex items-center gap-1"
              >
                <span>{r.icon || '🎁'}</span>
                <span>{r.quantity}</span>
                {r.probability && (
                  <span className="text-[9px] text-amber-400 font-bold">({r.probability}%)</span>
                )}
              </span>
            ))}
            {box.guaranteedRewards.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#13192b] text-slate-400">
                +{box.guaranteedRewards.length - 3} আরো
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Interactive Action Buttons */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">মূল্য (Price)</span>
              <div className="font-['Orbitron'] font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">
                ৳{box.price}
              </div>
            </div>

            <button
              onClick={() => onPreview(box, 'view')}
              className="px-2.5 py-1.5 rounded-lg bg-[#182138] hover:bg-[#222e4d] text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="মিষ্টি বক্সের ভেতরের সকল পুরষ্কার ও ড্রপ চান্স দেখুন"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>পুরষ্কার দেখুন</span>
            </button>
          </div>

          {/* Dual Action Buttons: Open Box (বক্স খুলুন) & Buy Box (কিনুন) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPreview(box, 'open')}
              disabled={isOutOfStock}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Orbitron'] font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="৩ডি অ্যানিমেশনসহ বক্স আনবক্স করুন"
            >
              <span className="text-sm">🎁</span>
              <span>বক্স খুলুন</span>
            </button>

            <button
              onClick={() => onBuy(box)}
              disabled={isOutOfStock}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="সরাসরি বক্স কিনুন ও ডেলিভারি পান"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-black" />
              <span>বক্স কিনুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
