import React from 'react';
import { Sparkles, Zap, ShieldAlert, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onBuyNow: (product: Product) => void;
  isLightMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow, isLightMode = false }) => {
  const isOutOfStock = product.isOutOfStock || (!product.isUnlimited && product.stock <= 0);
  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md ${
        isOutOfStock
          ? 'border-red-500/40 opacity-80'
          : isLightMode
          ? 'bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1'
          : 'bg-gradient-to-b from-[#131a2e] to-[#0d1222] border-slate-800 hover:border-cyan-500/60 hover:shadow-cyan-500/10 hover:-translate-y-1'
      }`}
    >
      {/* Top badges bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        {product.badge ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm">
            {product.badge}
          </span>
        ) : (
          <span />
        )}

        {discountPercent && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Product Image / Visual header */}
      <div className="relative h-36 w-full overflow-hidden bg-[#090d18]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 filter brightness-90 group-hover:brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131a2e] via-transparent to-black/30" />

        {/* Floating Diamond/Token Icon for Diamond Category */}
        {product.category === 'diamond' && (
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 backdrop-blur-sm text-cyan-300 text-xs font-black">
            <span className="text-sm">💎</span>
            <span>{product.diamondCount || product.name.split(' ')[0]}</span>
          </div>
        )}

        {/* Out of Stock Large Watermark Banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 text-white font-black text-xs uppercase tracking-widest shadow-lg">
              <ShieldAlert className="w-4 h-4" />
              <span>Out of Stock</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className={`font-['Orbitron'] font-bold text-base transition-colors line-clamp-1 mb-1 ${
              isLightMode
                ? 'text-slate-900 group-hover:text-blue-600'
                : 'text-white group-hover:text-cyan-400'
            }`}
          >
            {product.name}
          </h3>

          <p
            className={`text-xs line-clamp-2 mb-3 leading-relaxed ${
              isLightMode ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {product.description}
          </p>
        </div>

        {/* Stock & Price Row */}
        <div
          className={`pt-2 border-t ${
            isLightMode ? 'border-slate-100' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1">
              {product.isUnlimited ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Instant Available
                  </span>
                </>
              ) : isOutOfStock ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[11px] text-red-500 font-bold">Out of Stock</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Stock: {product.stock}
                  </span>
                </>
              )}
            </span>

            {product.bonus && (
              <span className="text-[10px] font-semibold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/50 px-1.5 py-0.5 rounded border border-blue-200 dark:border-cyan-800/50">
                {product.bonus}
              </span>
            )}
          </div>

          {/* Pricing Info */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-['Orbitron'] text-amber-500">
                ৳{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              BDT
            </span>
          </div>

          {/* Buy Action Button */}
          <button
            onClick={() => onBuyNow(product)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                : isLightMode
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-98'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-600/30 active:scale-98'
            }`}
          >
            {isOutOfStock ? (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Out of Stock</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
