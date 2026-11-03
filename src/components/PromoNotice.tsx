import React from 'react';
import { Radio, Zap } from 'lucide-react';

interface PromoNoticeProps {
  notice: string;
}

export const PromoNotice: React.FC<PromoNoticeProps> = ({ notice }) => {
  if (!notice) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600/20 via-orange-500/20 to-amber-600/20 border-b border-amber-500/30 text-amber-200 text-xs sm:text-sm py-2 px-4 shadow-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold text-[11px] uppercase tracking-wider animate-pulse">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Notice</span>
        </div>

        <div className="relative overflow-hidden w-full whitespace-nowrap">
          <p className="inline-block animate-marquee font-medium text-slate-200">
            {notice}
          </p>
        </div>
      </div>
    </div>
  );
};
