import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  ShoppingBag,
  Sliders,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ListFilter,
  LayoutGrid,
  Search,
} from 'lucide-react';
import { Product } from '../types';

interface DiamondShopPortalProps {
  products: Product[];
  onBuyDiamondPackage: (customItem: Product, playerUid: string) => void;
}

export const DiamondShopPortal: React.FC<DiamondShopPortalProps> = ({
  products,
  onBuyDiamondPackage,
}) => {
  const diamondProducts = products.filter((p) => p.category === 'diamond' && p.isActive);

  const [playerUid, setPlayerUid] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>(
    diamondProducts[2]?.id || diamondProducts[0]?.id || ''
  );

  // View Mode: 'list' (এত ডায়মন্ড এত টাকা লিস্ট), 'grid' (কার্ড গ্রিড), 'slider' (কাস্টমাইজ স্লাইডার)
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'slider'>('list');
  const [customDiamonds, setCustomDiamonds] = useState<number>(1000);
  const [listSearch, setListSearch] = useState('');
  const [uidError, setUidError] = useState('');

  // Rate calculation for custom diamonds (~৳0.70 - ৳0.72 per diamond)
  const calculateCustomPrice = (diamonds: number): number => {
    if (diamonds <= 100) return Math.round(diamonds * 0.90);
    if (diamonds <= 500) return Math.round(diamonds * 0.72);
    if (diamonds <= 2000) return Math.round(diamonds * 0.70);
    if (diamonds <= 6000) return Math.round(diamonds * 0.685);
    return Math.round(diamonds * 0.675);
  };

  const selectedProduct = diamondProducts.find((p) => p.id === selectedProductId);

  const handleBuyNow = (overrideProduct?: Product) => {
    if (!playerUid.trim() || playerUid.trim().length < 6) {
      setUidError('অনুগ্রহ করে সঠিক Free Fire Player ID (UID) লিখুন (কমপক্ষে ৬ ডিজিট)');
      const el = document.getElementById('uid-input-field');
      el?.focus();
      return;
    }
    setUidError('');

    if (overrideProduct) {
      onBuyDiamondPackage(overrideProduct, playerUid.trim());
      return;
    }

    if (viewMode === 'slider') {
      const price = calculateCustomPrice(customDiamonds);
      const customItem: Product = {
        id: 'ff_custom_' + customDiamonds,
        name: `${customDiamonds.toLocaleString()} Diamonds (Custom Vault)`,
        category: 'diamond',
        price,
        originalPrice: Math.round(price * 1.15),
        stock: -1,
        isUnlimited: true,
        isOutOfStock: false,
        isActive: true,
        diamondCount: customDiamonds,
        badge: 'Custom Vault',
        description: `Direct Free Fire UID Top-Up of ${customDiamonds} Diamonds. Delivered in 5-15 mins.`,
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
        updatedAt: new Date().toISOString(),
      };
      onBuyDiamondPackage(customItem, playerUid.trim());
    } else if (selectedProduct) {
      onBuyDiamondPackage(selectedProduct, playerUid.trim());
    }
  };

  const filteredForList = diamondProducts.filter((p) => {
    if (!listSearch.trim()) return true;
    return (
      p.name.toLowerCase().includes(listSearch.toLowerCase()) ||
      p.price.toString().includes(listSearch)
    );
  });

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#11182c] via-[#0d1322] to-[#090d18] border-2 border-cyan-500/40 p-5 sm:p-7 shadow-2xl shadow-cyan-950/60 text-white space-y-6">
      {/* Top Banner inside Diamond Box */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              💎 অফিশিয়াল ডায়মন্ড শপ
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>ইনস্ট্যান্ট ৫-১৫ মিনিটে ডেলিভারি</span>
            </span>
          </div>

          <h3 className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-white">
            Free Fire Diamond Top-Up &amp; Price List
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            ২৫ ডায়মন্ড থেকে শুরু করে ১২,০০০ ডায়মন্ড পর্যন্ত রেট লিস্ট দেখে বা কাস্টমাইজ করে সরাসরি টপআপ করুন।
          </p>
        </div>

        {/* View Switchers: List View, Grid View, Custom Slider */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090d18] border border-cyan-500/30">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>রেট লিস্ট (Price List)</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>কার্ড গ্রিড</span>
          </button>

          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'slider'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>কাস্টমাইজ স্লাইডার</span>
          </button>
        </div>
      </div>

      {/* STEP 1: Enter Player ID (UID) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141b30] border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-['Orbitron'] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs font-black">
              1
            </span>
            <span>Player ID (UID) লিখুন *</span>
          </label>

          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>১০০% নিরাপদ (পাসওয়ার্ড লাগে না)</span>
          </span>
        </div>

        <div className="relative">
          <input
            id="uid-input-field"
            type="text"
            required
            placeholder="আপনার Free Fire Player UID দিন (e.g. 294810294)"
            value={playerUid}
            onChange={(e) => {
              setPlayerUid(e.target.value.replace(/\D/g, ''));
              setUidError('');
            }}
            className="w-full bg-[#0a0d18] border border-slate-700/80 rounded-xl px-4 py-3 text-sm sm:text-base text-amber-300 font-mono font-bold tracking-wider placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          {playerUid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
              UID Valid
            </div>
          )}
        </div>

        {uidError && (
          <div className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{uidError}</span>
          </div>
        )}
      </div>

      {/* STEP 2: Select Diamonds with List View or Grid or Custom Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-['Orbitron'] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs font-black">
              2
            </span>
            <span>
              {viewMode === 'list'
                ? 'ডায়মন্ড ও দামের তালিকা (Diamond Price List: এত ডায়মন্ড = এত টাকা)'
                : viewMode === 'slider'
                ? 'কাস্টমাইজ স্লাইডার (২৫ থেকে ১২,০০০ ডায়মন্ড একসাথে)'
                : 'ডায়মন্ড প্যাকেজ কার্ড সিলেক্ট করুন'}
            </span>
          </span>

          {viewMode === 'list' && (
            <div className="relative min-w-[160px]">
              <input
                type="text"
                placeholder="খুঁজুন (e.g. 100, 500, 1000)..."
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                className="w-full bg-[#0a0d18] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}
        </div>

        {/* ----------------------------------------------------
            MODE 1: FULL EXHAUSTIVE PRICE LIST (এত ডায়মন্ড = এত টাকা)
        ---------------------------------------------------- */}
        {viewMode === 'list' && (
          <div className="rounded-2xl bg-[#0a0d18] border border-slate-800 overflow-hidden shadow-xl animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141b30] text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">ডায়মন্ডের পরিমাণ (Diamonds)</th>
                    <th className="py-3 px-4">আমাদের অফার মূল্য (Price)</th>
                    <th className="py-3 px-4 hidden sm:table-cell">রেগুলার প্রাইজ</th>
                    <th className="py-3 px-4 hidden md:table-cell">বোনাস</th>
                    <th className="py-3 px-4 hidden sm:table-cell">ডেলিভারি</th>
                    <th className="py-3 px-4 text-right">নির্বাচন ও অর্ডার</th>
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
                            ? 'bg-cyan-950/40 border-l-4 border-cyan-400'
                            : 'hover:bg-[#141b30]/60'
                        } ${isOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {/* Diamonds */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-base">💎</span>
                            <div>
                              <span className="font-['Orbitron'] font-black text-sm sm:text-base text-cyan-300 block">
                                {p.diamondCount || p.name.split(' ')[0]} Diamonds
                              </span>
                              {p.badge && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Price (এত ডায়মন্ড = এত টাকা) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-baseline gap-1">
                            <span className="font-['Orbitron'] font-black text-base sm:text-lg text-amber-400">
                              ৳{p.price}
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold">টাকা</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {p.diamondCount} ডায়মন্ড = {p.price} ৳
                          </span>
                        </td>

                        {/* Regular Price */}
                        <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 line-through">
                          ৳{p.originalPrice}
                        </td>

                        {/* Bonus */}
                        <td className="py-3.5 px-4 hidden md:table-cell">
                          <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                            {p.bonus || 'ইনস্ট্যান্ট'}
                          </span>
                        </td>

                        {/* Delivery */}
                        <td className="py-3.5 px-4 hidden sm:table-cell text-slate-400 text-[11px]">
                          ৫ - ১৫ মিনিট
                        </td>

                        {/* Action Button */}
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
                                    ? 'bg-cyan-500 text-black'
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
                                  handleBuyNow(p);
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

        {/* ----------------------------------------------------
            MODE 2: CUSTOM 25 to 12,000 DIAMONDS SLIDER
        ---------------------------------------------------- */}
        {viewMode === 'slider' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#141b30] border border-amber-500/40 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  কাস্টমাইজ ডায়মন্ড সংখ্যা
                </span>
                <div className="font-['Orbitron'] font-black text-3xl sm:text-4xl text-cyan-400">
                  {customDiamonds.toLocaleString()} 💎
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {customDiamonds} ডায়মন্ড = {calculateCustomPrice(customDiamonds)} টাকা
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-semibold">মোট মূল্য</span>
                <div className="font-['Orbitron'] font-black text-3xl sm:text-4xl text-amber-400">
                  ৳{calculateCustomPrice(customDiamonds).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={25}
                max={12000}
                step={25}
                value={customDiamonds}
                onChange={(e) => setCustomDiamonds(Number(e.target.value))}
                className="w-full h-3 bg-[#0a0d18] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>২৫ 💎 (৳২৪)</span>
                <span>১,০০০ 💎 (৳৭১০)</span>
                <span>৩,০০০ 💎 (৳২,০৮০)</span>
                <span>৬,০০০ 💎 (৳৪,১০০)</span>
                <span>১২,০০০ 💎 (৳৮,১৫০)</span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700/60">
              {[25, 100, 115, 220, 320, 420, 500, 690, 1000, 1240, 2530, 5060, 10000, 12000].map(
                (qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setCustomDiamonds(qty)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                      customDiamonds === qty
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-[#0a0d18] text-slate-300 border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {qty >= 1000 ? `${qty / 1000}K` : qty} 💎 (৳{calculateCustomPrice(qty)})
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            MODE 3: CARD GRID VIEW
        ---------------------------------------------------- */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-fadeIn">
            {diamondProducts.map((p) => {
              const isSelected = selectedProductId === p.id;
              const isOut = p.isOutOfStock || (!p.isUnlimited && p.stock <= 0);

              return (
                <div
                  key={p.id}
                  onClick={() => !isOut && setSelectedProductId(p.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isOut
                      ? 'bg-red-950/20 border-red-900/40 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-gradient-to-b from-cyan-950/90 to-[#121a30] border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20 -translate-y-0.5'
                      : 'bg-[#141b30] border-slate-800 hover:border-slate-600 hover:bg-[#1a233c]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5 text-cyan-300 font-['Orbitron'] font-black text-sm sm:text-base">
                      <span>💎</span>
                      <span>{p.diamondCount || p.name.split(' ')[0]}</span>
                    </div>

                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {p.name}
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="font-['Orbitron'] font-black text-amber-400 text-base block">
                        ৳{p.price}
                      </span>
                      <span className="text-[10px] text-slate-500">টাকা</span>
                    </div>
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] text-slate-500 line-through">
                        ৳{p.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STEP 3: Summary & Buy Now Button */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141c32] via-[#1a2542] to-[#141c32] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">আপনার সিলেক্টেড প্যাকেজ</span>
          <div className="font-['Orbitron'] font-black text-xl text-white mt-0.5 flex items-center gap-2">
            <span>
              {viewMode === 'slider'
                ? `${customDiamonds.toLocaleString()} Diamonds (Custom Vault)`
                : selectedProduct?.name || 'Please select package'}
            </span>
            <span className="text-amber-400 text-2xl font-black">
              ৳
              {viewMode === 'slider'
                ? calculateCustomPrice(customDiamonds).toLocaleString()
                : selectedProduct?.price || 0}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            বিকাশ ও নগদ দিয়ে পেমেন্ট করুন। বাই নাউ-এ ক্লিক করার পর পেমেন্ট গেটওয়ে পাবেন।
          </span>
        </div>

        <button
          onClick={() => handleBuyNow()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
          <ShoppingBag className="w-5 h-5 text-black" />
          <span>Buy Now (টপআপ করুন)</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
