import React from 'react';
import {
  Sparkles,
  Zap,
  Crown,
  Package,
  Crosshair,
  TrendingUp,
  Share2,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { ProductCategory } from '../types';

interface GameShopBoxItem {
  id: ProductCategory;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: string;
  image: string;
  itemCount: string;
  accentColor: string;
}

interface GameShopBoxesProps {
  onSelectShop: (cat: ProductCategory) => void;
  activeShop: ProductCategory | 'all';
}

export const GameShopBoxes: React.FC<GameShopBoxesProps> = ({ onSelectShop, activeShop }) => {
  const shopBoxes: GameShopBoxItem[] = [
    {
      id: 'diamond',
      title: 'Free Fire Diamonds Shop',
      subtitle: '২৫ ডায়মন্ড থেকে ১২,০০০ ডায়মন্ড পর্যন্ত ইনস্ট্যান্ট UID টপআপ',
      badge: '🔥 মোস্ট পপুলার',
      badgeColor: 'from-amber-500 to-orange-500 text-black',
      icon: '💎',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      itemCount: '25 - 12,000 💎',
      accentColor: 'border-cyan-500/50 hover:border-cyan-400 group-hover:shadow-cyan-500/20',
    },
    {
      id: 'friday_offer',
      title: 'Friday & Bonus Offers',
      subtitle: 'ডাবল ডায়মন্ড ফ্রাইডে স্পেশাল ও উইকেন্ড মেগা রাশ অফার',
      badge: '⚡ ডাবল ডায়মন্ড',
      badgeColor: 'from-amber-400 to-yellow-500 text-black',
      icon: '🔥',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      itemCount: 'ডাবল বোনাস প্যাক',
      accentColor: 'border-amber-500/50 hover:border-amber-400 group-hover:shadow-amber-500/20',
    },
    {
      id: 'entertainment',
      title: 'Digital Subscriptions',
      subtitle: 'Netflix 4K, YouTube Premium, Spotify & Crunchyroll',
      badge: '🍿 প্রিমিয়াম ওটিটি',
      badgeColor: 'from-red-500 to-purple-600 text-white',
      icon: '🍿',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80',
      itemCount: 'Netflix / YT / Spotify',
      accentColor: 'border-purple-500/50 hover:border-purple-400 group-hover:shadow-purple-500/20',
    },
    {
      id: 'membership',
      title: 'Memberships & VIP Passes',
      subtitle: 'উইকলি, মান্থলি ও ১০টি স্পেশাল মেগা কম্বো প্যাকেজ',
      badge: '👑 ভিআইপি পাস',
      badgeColor: 'from-purple-500 to-indigo-500 text-white',
      icon: '👑',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      itemCount: '১০টি কম্বো আইটেম',
      accentColor: 'border-purple-500/50 hover:border-purple-400 group-hover:shadow-purple-500/20',
    },
    {
      id: 'mystery_box',
      title: 'Mystery Box Crates',
      subtitle: '১০০% গ্যারান্টিড ডায়মন্ড, ইভো টোকেন ও ওয়েপন ভাউচার',
      badge: '🎁 ১০০% গ্যারান্টি',
      badgeColor: 'from-emerald-500 to-teal-500 text-black',
      icon: '🎁',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      itemCount: '৫টি মিষ্টি বক্স',
      accentColor: 'border-emerald-500/50 hover:border-emerald-400 group-hover:shadow-emerald-500/20',
    },
    {
      id: 'voucher',
      title: 'Indo Server & UniPin',
      subtitle: 'ইন্দোনেশিয়া সার্ভার টপআপ এবং ইউনিপিন ডিজিটাল ভাউচার',
      badge: '🇮🇩 ইন্দো & ভাউচার',
      badgeColor: 'from-blue-500 to-cyan-500 text-white',
      icon: '🎟️',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
      itemCount: 'Indo & Vouchers',
      accentColor: 'border-blue-500/50 hover:border-blue-400 group-hover:shadow-blue-500/20',
    },
    {
      id: 'level_up',
      title: 'Level Up Pass',
      subtitle: 'লেভেল ২ থেকে ৩০ পর্যন্ত ৮০২ ডায়মন্ড সরাসরি আনলক',
      badge: '🎯 ৮০২💎 আনলক',
      badgeColor: 'from-blue-500 to-cyan-500 text-white',
      icon: '🎯',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
      itemCount: '৫টি লেভেল পাস',
      accentColor: 'border-blue-500/50 hover:border-blue-400 group-hover:shadow-blue-500/20',
    },
    {
      id: 'evo_access',
      title: 'Evo Gun Access',
      subtitle: 'সকল ম্যাক্স ইভো গানের ৩, ৭ ও ৩০ দিনের ট্রায়াল পাস',
      badge: '⚡ অল ম্যাক্স গান',
      badgeColor: 'from-amber-400 to-yellow-500 text-black',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      itemCount: '৩d / ৭d / ৩০d',
      accentColor: 'border-yellow-500/50 hover:border-yellow-400 group-hover:shadow-yellow-500/20',
    },
    {
      id: 'social_fb',
      title: 'Facebook Boost Services',
      subtitle: '১০০ থেকে ১০ মিলিয়ন পর্যন্ত ফলোয়ার ও ভিডিও ভিউজ',
      badge: '👍 ১০০ - ১০M',
      badgeColor: 'from-blue-600 to-indigo-600 text-white',
      icon: '👍',
      image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=600&q=80',
      itemCount: '100 to 10M',
      accentColor: 'border-blue-600/50 hover:border-blue-400 group-hover:shadow-blue-600/20',
    },
    {
      id: 'social_insta',
      title: 'Instagram Boost Services',
      subtitle: '১০০ থেকে ১০ মিলিয়ন হাই-রিটেনশন ইনস্টাগ্রাম ফলোয়ার',
      badge: '📸 ১০০ - ১০M',
      badgeColor: 'from-pink-500 to-rose-500 text-white',
      icon: '📸',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
      itemCount: '100 to 10M',
      accentColor: 'border-pink-500/50 hover:border-pink-400 group-hover:shadow-pink-500/20',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <h2 className="font-['Orbitron'] font-black text-xl sm:text-2xl text-white tracking-wider">
            Game &amp; Service Top-Up Shops
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          বক্সে ক্লিক করে ভেতরে প্রবেশ করুন
        </span>
      </div>

      {/* Grid of Sleek Category Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {shopBoxes.map((box) => {
          const isSelected = activeShop === box.id;

          return (
            <div
              key={box.id}
              onClick={() => onSelectShop(box.id)}
              className={`group relative rounded-3xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl border bg-gradient-to-b from-[#141b30] to-[#0c101d] ${
                box.accentColor
              } ${
                isSelected
                  ? 'ring-2 ring-cyan-400 border-cyan-400 -translate-y-1 shadow-2xl shadow-cyan-500/20'
                  : 'hover:-translate-y-1 hover:shadow-2xl'
              }`}
            >
              {/* Glow backdrop */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

              <div>
                {/* Header row: Badge & Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r shadow-sm ${box.badgeColor}`}
                  >
                    {box.badge}
                  </span>

                  <span className="text-2xl">{box.icon}</span>
                </div>

                {/* Box Image Thumbnail */}
                <div className="relative h-28 w-full rounded-2xl overflow-hidden mb-3 border border-slate-700/60 bg-black/40">
                  <img
                    src={box.image}
                    alt={box.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 filter brightness-90 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[11px] font-mono font-bold text-cyan-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-cyan-500/30">
                    {box.itemCount}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-['Orbitron'] font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
                  {box.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {box.subtitle}
                </p>
              </div>

              {/* Enter Button Action */}
              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                  দোকানে ঢুকুন
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#19223c] group-hover:bg-cyan-500 text-cyan-300 group-hover:text-black flex items-center justify-center transition-all transform group-hover:scale-105 shadow-sm">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
