import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PromoNoticeProps {
  notice?: string;
  isLightMode?: boolean;
}

export const PromoNotice: React.FC<PromoNoticeProps> = ({
  notice = 'এখানে আমাদের সাইটে রাত দিন ২৪ ঘণ্টা অর্ডার করতে পারবেন। ধন্যবাদ।',
  isLightMode = true,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={`border-b transition-colors ${
      isLightMode
        ? 'bg-white border-slate-200 text-slate-700 shadow-xs'
        : 'bg-[#0f1524] border-slate-800 text-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          {/* NOTICE blue badge matching Screenshot 3 */}
          <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#0066FF] text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>NOTICE</span>
          </span>

          <p className="truncate font-medium text-slate-800 dark:text-slate-200 flex-1">
            {notice}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          title="Dismiss Notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
