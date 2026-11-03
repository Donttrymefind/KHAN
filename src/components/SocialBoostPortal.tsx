import React, { useState } from 'react';
import {
  Share2,
  Zap,
  ShieldCheck,
  Check,
  ShoppingBag,
  Sliders,
  ListFilter,
  LayoutGrid,
  Search,
  ArrowRight,
  Sparkles,
  Link2,
  Video,
  Users,
  Eye,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { Product } from '../types';

interface SocialBoostPortalProps {
  products: Product[];
  onBuySocialPackage: (customItem: Product, targetUrl: string) => void;
}

export const SocialBoostPortal: React.FC<SocialBoostPortalProps> = ({
  products,
  onBuySocialPackage,
}) => {
  // Service Type: 'fb_views' | 'fb_followers' | 'insta'
  const [activeTab, setActiveTab] = useState<'fb_views' | 'fb_followers' | 'insta'>('fb_views');
  // View Mode: 'list' (এত ভিউ এত টাকা লিস্ট) | 'slider' (কাস্টমাইজ ক্যালকুলেটর) | 'grid' (কার্ডস)
  const [viewMode, setViewMode] = useState<'list' | 'slider' | 'grid'>('list');

  const [targetUrl, setTargetUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [listSearch, setListSearch] = useState('');

  // Customizer state
  const [customQuantity, setCustomQuantity] = useState<number>(10000);

  // Filter products by active tab
  const getTabProducts = (): Product[] => {
    if (activeTab === 'fb_views') {
      return products.filter((p) => p.category === 'social_fb' && p.id.startsWith('fb_view') && p.isActive);
    }
    if (activeTab === 'fb_followers') {
      return products.filter((p) => p.category === 'social_fb' && p.id.startsWith('fb_fol') && p.isActive);
    }
    return products.filter((p) => p.category === 'social_insta' && p.isActive);
  };

  const currentProducts = getTabProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>(
    currentProducts[2]?.id || currentProducts[0]?.id || ''
  );

  // Calculate rate for custom views (~৳0.033 to ৳0.07 per view depending on volume)
  const calculateViewsPrice = (qty: number): number => {
    if (qty <= 500) return Math.round(qty * 0.08);
    if (qty <= 5000) return Math.round(qty * 0.055);
    if (qty <= 50000) return Math.round(qty * 0.045);
    if (qty <= 500000) return Math.round(qty * 0.040);
    if (qty <= 2000000) return Math.round(qty * 0.036);
    return Math.round(qty * 0.033);
  };

  // Calculate rate for custom followers (~৳0.18 to ৳0.30 per follower)
  const calculateFollowersPrice = (qty: number): number => {
    if (qty <= 500) return Math.round(qty * 0.32);
    if (qty <= 5000) return Math.round(qty * 0.27);
    if (qty <= 50000) return Math.round(qty * 0.25);
    if (qty <= 500000) return Math.round(qty * 0.23);
    if (qty <= 2000000) return Math.round(qty * 0.21);
    return Math.round(qty * 0.185);
  };

  const currentCustomPrice =
    activeTab === 'fb_views'
      ? calculateViewsPrice(customQuantity)
      : calculateFollowersPrice(customQuantity);

  const handleBuy = (overrideProduct?: Product) => {
    if (!targetUrl.trim() || targetUrl.trim().length < 8) {
      setUrlError('অনুগ্রহ করে সঠিক ফেসবুক/ইনস্টাগ্রাম পোস্ট, ভিডিও বা প্রোফাইল লিংক দিন');
      const el = document.getElementById('social-target-url-field');
      el?.focus();
      return;
    }
    setUrlError('');

    if (overrideProduct) {
      onBuySocialPackage(overrideProduct, targetUrl.trim());
      return;
    }

    if (viewMode === 'slider') {
      const isViews = activeTab === 'fb_views';
      const labelType = isViews ? 'Views' : 'Followers';
      const price = currentCustomPrice;
      const customItem: Product = {
        id: `social_custom_${isViews ? 'view' : 'fol'}_${customQuantity}`,
        name: `Facebook ${customQuantity.toLocaleString()} ${labelType} (Custom Vault)`,
        category: 'social_fb',
        price,
        originalPrice: Math.round(price * 1.2),
        stock: -1,
        isUnlimited: true,
        isOutOfStock: false,
        isActive: true,
        badge: 'Custom Boost',
        description: `High-retention ${customQuantity.toLocaleString()} ${labelType} delivery for link: ${targetUrl.trim()}`,
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=400&q=80',
        updatedAt: new Date().toISOString(),
      };
      onBuySocialPackage(customItem, targetUrl.trim());
    } else {
      const selected = currentProducts.find((p) => p.id === selectedProductId) || currentProducts[0];
      if (selected) {
        onBuySocialPackage(selected, targetUrl.trim());
      }
    }
  };

  const filteredForList = currentProducts.filter((p) => {
    if (!listSearch.trim()) return true;
    return (
      p.name.toLowerCase().includes(listSearch.toLowerCase()) ||
      p.price.toString().includes(listSearch)
    );
  });

  // Preset quick milestone buttons
  const viewPresets = [
    { label: '১০০ ভিউ', qty: 100, price: 15 },
    { label: '৫০০ ভিউ', qty: 500, price: 35 },
    { label: '১,০০০ ভিউ', qty: 1000, price: 65 },
    { label: '৫,০০০ ভিউ', qty: 5000, price: 250 },
    { label: '১০,০০০ ভিউ', qty: 10000, price: 480 },
    { label: '৫০,০০০ ভিউ', qty: 50000, price: 2200 },
    { label: '১ লাখ (100K)', qty: 100000, price: 4200 },
    { label: '৫ লাখ (500K)', qty: 500000, price: 19500 },
    { label: '১০ লাখ (১M)', qty: 1000000, price: 37000 },
    { label: '৫০ লাখ (৫M)', qty: 5000000, price: 175000 },
    { label: '১ কোটি (১০M)', qty: 10000000, price: 330000 },
  ];

  const followerPresets = [
    { label: '১০০ ফলোয়ার', qty: 100, price: 35 },
    { label: '৫০০ ফলোয়ার', qty: 500, price: 150 },
    { label: '১,০০০ ফলোয়ার', qty: 1000, price: 280 },
    { label: '৫,০০০ ফলোয়ার', qty: 5000, price: 1350 },
    { label: '১০,০০০ ফলোয়ার', qty: 10000, price: 2600 },
    { label: '৫০,০০০ ফলোয়ার', qty: 50000, price: 12500 },
    { label: '১ লাখ (100K)', qty: 100000, price: 24500 },
    { label: '৫ লাখ (500K)', qty: 500000, price: 115000 },
    { label: '১০ লাখ (১M)', qty: 1000000, price: 220000 },
    { label: '৫০ লাখ (৫M)', qty: 5000000, price: 990000 },
    { label: '১ কোটি (১০M)', qty: 10000000, price: 1850000 },
  ];

  const currentPresets = activeTab === 'fb_views' ? viewPresets : followerPresets;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#090d18] border-2 border-blue-500/40 p-5 sm:p-7 shadow-2xl shadow-blue-950/60 text-white space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              <span>সোশ্যাল মিডিয়া গ্রোথ হাব</span>
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>১০০ থেকে ১০ মিলিয়ন পর্যন্ত নন-ড্রপ সার্ভিস</span>
            </span>
          </div>

          <h3 className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-white">
            Facebook &amp; Social Boost Price List
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            লিস্ট দেখে বা কাস্টমাইজ করে সরাসরি ১০০ থেকে ১০ মিলিয়ন পর্যন্ত ভিউ ও ফলোয়ার অর্ডার করুন।
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090d18] border border-blue-500/30">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>রেট লিস্ট (লিস্ট ভিউ)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'slider'
                ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>কাস্টমাইজ (১০০ - ১০M)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>কার্ড গ্রিড</span>
          </button>
        </div>
      </div>

      {/* Service Tab Buttons: Views vs Followers vs Insta */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveTab('fb_views');
            setSelectedProductId('fb_view_1000');
            setCustomQuantity(10000);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'fb_views'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
              : 'bg-[#151d33] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Video className="w-4 h-4 text-cyan-300" />
          <span>ফেসবুক ভিডিও ও রিল ভিউয়ার্স (Views Rate List)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('fb_followers');
            setSelectedProductId('fb_fol_1000');
            setCustomQuantity(5000);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'fb_followers'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
              : 'bg-[#151d33] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-300" />
          <span>ফেসবুক পেজ ও প্রোফাইল ফলোয়ার (Followers Rate List)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('insta');
            setSelectedProductId('insta_fol_1000');
            setCustomQuantity(1000);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'insta'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 border border-pink-400'
              : 'bg-[#151d33] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Eye className="w-4 h-4 text-pink-300" />
          <span>ইনস্টাগ্রাম বুস্ট (Instagram Services)</span>
        </button>
      </div>

      {/* Target URL Input Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1220] border border-blue-500/30 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Link2 className="w-5 h-5 text-blue-400 shrink-0" />
          <div className="flex-1">
            <input
              id="social-target-url-field"
              type="text"
              value={targetUrl}
              onChange={(e) => {
                setTargetUrl(e.target.value);
                if (urlError) setUrlError('');
              }}
              placeholder={
                activeTab === 'fb_views'
                  ? 'আপনার ফেসবুক ভিডিও বা রিল লিংক এখানে পেস্ট করুন (e.g. https://www.facebook.com/reel/...)'
                  : 'আপনার ফেসবুক পেজ বা প্রোফাইল লিংক দিন (e.g. https://www.facebook.com/...)'
              }
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none font-medium"
            />
            {urlError && <p className="text-[11px] text-red-400 mt-0.5">{urlError}</p>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleBuy()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-['Orbitron'] font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 whitespace-nowrap transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার করুন (Buy Now)</span>
        </button>
      </div>

      {/* Quick Rate Highlight Pill Banner */}
      <div className="bg-[#10182c] border border-blue-500/20 rounded-2xl p-3.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-slate-200">
            {activeTab === 'fb_views'
              ? 'ভিউয়ার্স রেট চার্ট: ১০০ ভিউ = ১৫ ৳ | ১,০০০ ভিউ = ৬৫ ৳ | ১০,০০০ ভিউ = ৪৮০ ৳ | ১ লাখ = ৪,২০০ ৳ | ১০ লাখ (১M) = ৩৭,০০০ ৳'
              : 'ফলোয়ার রেট চার্ট: ১০০ ফলোয়ার = ৩৫ ৳ | ১,০০০ ফলোয়ার = ২৮০ ৳ | ১০,০০০ = ২,৬০০ ৳ | ১ লাখ = ২৪,৫০০ ৳ | ১০ লাখ (১M) = ২,২০,০০০ ৳'}
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700/50">
          ✓ ১০০% নন-ড্রপ রিফিল গ্যারান্টি
        </span>
      </div>

      {/* =========================================================================
          MODE 1: RATE LIST (লিস্ট ভিউ - এত ভিউ এত টাকা)
      ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search bar inside list */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                placeholder="লিস্টে খুঁজুন (যেমন: 1000, 10,000, 1 Lakh)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#090d18] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              মোট {filteredForList.length}টি প্যাকেজ লিস্টে রয়েছে
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-blue-500/30 bg-[#0c1220]/90">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#12192d] text-slate-300 font-semibold text-[11px] uppercase tracking-wider border-b border-blue-500/30">
                <tr>
                  <th className="py-3.5 px-4">সার্ভিস ও পরিমাণ</th>
                  <th className="py-3.5 px-4">নির্ধারিত মূল্য (টাকা)</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">রেগুলার মূল্য</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">ডেলিভারি স্পিড</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">গ্যারান্টি</th>
                  <th className="py-3.5 px-4 text-right">একশনে অর্ডার</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredForList.map((p) => {
                  const isSelected = selectedProductId === p.id;
                  const isOut = p.isOutOfStock || (!p.isUnlimited && p.stock <= 0);

                  return (
                    <tr
                      key={p.id}
                      onClick={() => !isOut && setSelectedProductId(p.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/40 border-l-4 border-blue-400'
                          : 'hover:bg-[#141b30]/60'
                      } ${isOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Name & Package */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {activeTab === 'fb_views' ? '👁️' : activeTab === 'fb_followers' ? '👥' : '📸'}
                          </span>
                          <div>
                            <span className="font-['Orbitron'] font-black text-sm sm:text-base text-blue-200 block">
                              {p.name}
                            </span>
                            {p.badge && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Price (এত ভিউ = এত টাকা) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-baseline gap-1">
                          <span className="font-['Orbitron'] font-black text-base sm:text-lg text-amber-400">
                            ৳{p.price.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">টাকা</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {p.name.replace('Facebook', '').replace('Video Views', 'ভিউ').replace('Video/Reel Views', 'ভিউ').replace('Followers', 'ফলোয়ার')} = {p.price.toLocaleString()} ৳
                        </span>
                      </td>

                      {/* Regular Price */}
                      <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 line-through">
                        ৳{p.originalPrice?.toLocaleString() || Math.round(p.price * 1.25).toLocaleString()}
                      </td>

                      {/* Delivery Speed */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          ইনস্ট্যান্ট ৫-১৫ মিনিট
                        </span>
                      </td>

                      {/* Guarantee */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-slate-300 text-[11px]">
                        ১০০% নন-ড্রপ লাইফটাইম
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        {isOut ? (
                          <span className="text-red-400 font-bold text-xs">Out of Stock</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductId(p.id);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-[#151c32] text-slate-300 hover:text-white border border-slate-700'
                              }`}
                            >
                              {isSelected ? 'সিলেক্টেড' : 'সিলেক্ট'}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductId(p.id);
                                handleBuy(p);
                              }}
                              className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-xs uppercase"
                            >
                              Buy Now
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: CUSTOMIZER (১০০ থেকে ১০ মিলিয়ন কাস্টমাইজ স্লাইডার)
      ========================================================================= */}
      {viewMode === 'slider' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141b30] border border-amber-500/40 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">
                কাস্টমাইজ {activeTab === 'fb_views' ? 'ভিডিও ভিউয়ার্স' : 'ফলোয়ার'} সংখ্যা
              </span>
              <div className="font-['Orbitron'] font-black text-3xl sm:text-4xl text-cyan-400">
                {customQuantity.toLocaleString()}{' '}
                <span className="text-base text-slate-300">
                  {activeTab === 'fb_views' ? 'ভিউয়ার্স' : 'ফলোয়ার'}
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold block mt-0.5">
                {customQuantity.toLocaleString()} {activeTab === 'fb_views' ? 'ভিউ' : 'ফলোয়ার'} = {currentCustomPrice.toLocaleString()} টাকা
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-slate-400 uppercase font-semibold">মোট মূল্য</span>
              <div className="font-['Orbitron'] font-black text-3xl sm:text-4xl text-amber-400">
                ৳{currentCustomPrice.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">
                রেগুলার: <span className="line-through">৳{Math.round(currentCustomPrice * 1.25).toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-2">
            <input
              type="range"
              min={100}
              max={10000000}
              step={customQuantity >= 1000000 ? 500000 : customQuantity >= 100000 ? 50000 : customQuantity >= 10000 ? 5000 : 500}
              value={customQuantity}
              onChange={(e) => setCustomQuantity(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>১০০ (Min)</span>
              <span>১ লাখ (100K)</span>
              <span>১০ লাখ (1M)</span>
              <span>৫০ লাখ (5M)</span>
              <span>১ কোটি (10M Max)</span>
            </div>
          </div>

          {/* Quick preset milestone buttons */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">
              কুইক সিলেক্ট মিলস্টোন:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentPresets.map((preset) => (
                <button
                  key={preset.qty}
                  type="button"
                  onClick={() => setCustomQuantity(preset.qty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    customQuantity === preset.qty
                      ? 'bg-amber-400 text-black font-extrabold shadow-md shadow-amber-400/30'
                      : 'bg-[#0f1628] text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="ml-1.5 opacity-80 font-mono text-[11px] text-amber-300">
                    ৳{preset.price.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Buy Button */}
          <button
            type="button"
            onClick={() => handleBuy()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              {customQuantity.toLocaleString()} {activeTab === 'fb_views' ? 'ভিউয়ার্স' : 'ফলোয়ার'} অর্ডার করুন (৳{currentCustomPrice.toLocaleString()} টাকা)
            </span>
          </button>
        </div>
      )}

      {/* =========================================================================
          MODE 3: CARD GRID
      ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
          {currentProducts.map((product) => {
            const isSelected = selectedProductId === product.id;
            const isOut = product.isOutOfStock || (!product.isUnlimited && product.stock <= 0);

            return (
              <div
                key={product.id}
                onClick={() => !isOut && setSelectedProductId(product.id)}
                className={`relative rounded-2xl p-4 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#151f38] border-blue-400 ring-2 ring-blue-500/40 shadow-xl'
                    : 'bg-[#10172b] border-slate-800 hover:border-slate-700'
                } ${isOut ? 'opacity-50' : ''}`}
              >
                {product.badge && (
                  <span className="absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {product.badge}
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {activeTab === 'fb_views' ? '👁️' : activeTab === 'fb_followers' ? '👥' : '📸'}
                  </span>
                  <h4 className="font-['Orbitron'] font-bold text-sm text-white line-clamp-1">
                    {product.name}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/80 mb-3">
                  <div>
                    <span className="font-['Orbitron'] font-black text-lg text-amber-400">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">টাকা</span>
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-500 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isOut}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProductId(product.id);
                    handleBuy(product);
                  }}
                  className={`w-full py-2 rounded-xl font-['Orbitron'] font-black text-xs uppercase tracking-wider transition-all ${
                    isOut
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md'
                  }`}
                >
                  {isOut ? 'স্টক শেষ' : 'Buy Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
