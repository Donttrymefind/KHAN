import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, PackageCheck } from 'lucide-react';
import { MysteryBox } from '../types';

interface GuaranteedRewardsModalProps {
  box: MysteryBox | null;
  onClose: () => void;
  onBuy: (box: MysteryBox) => void;
}

export const GuaranteedRewardsModal: React.FC<GuaranteedRewardsModalProps> = ({
  box,
  onClose,
  onBuy,
}) => {
  if (!box) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/80 text-white overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border border-cyan-500/30 shrink-0">
            <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                100% Guaranteed Contents
              </span>
            </div>
            <h3 className="font-['Orbitron'] font-bold text-xl text-white mt-1">
              {box.name}
            </h3>
            <p className="text-xs text-slate-400">
              No RNG gambling. You receive ALL the items below instantly upon purchase!
            </p>
          </div>
        </div>

        {/* Guaranteed Items List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 mb-6">
          {box.guaranteedRewards.map((reward, idx) => {
            const rarityColors: Record<string, string> = {
              Mythic: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
              Legendary: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
              Epic: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-cyan-300',
              Rare: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
            };
            const currentRarity = rarityColors[reward.rarity] || rarityColors.Epic;

            return (
              <div
                key={reward.id || idx}
                className={`p-3 rounded-2xl bg-gradient-to-r ${currentRarity} border flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon || '🎁'}</span>
                  <div>
                    <div className="font-semibold text-sm text-white flex items-center gap-2">
                      <span>{reward.name}</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-black/40 text-slate-300 border border-white/10">
                        {reward.rarity}
                      </span>
                    </div>
                    {reward.description && (
                      <div className="text-[11px] text-slate-400">{reward.description}</div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="font-['Orbitron'] font-extrabold text-sm text-amber-300 bg-black/40 px-2 py-1 rounded-lg border border-amber-500/30">
                    {reward.quantity}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 justify-end mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Included</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparency Guarantee Note */}
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200/90 flex items-start gap-2.5 mb-6">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Transparency Promise:</strong> KHAN TOP UP strictly guarantees 100% of the listed contents for this box. Every diamond and voucher is delivered directly to your Free Fire UID.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div>
            <div className="text-[11px] text-slate-400">Total Price</div>
            <div className="font-['Orbitron'] font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              ৳{box.price}
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onBuy(box);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Order Guaranteed Box</span>
          </button>
        </div>
      </div>
    </div>
  );
};
