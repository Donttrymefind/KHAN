import React, { useState } from 'react';
import {
  Send,
  MessageCircle,
  Phone,
  Sparkles,
  X,
  Volume2,
  Bell,
  ArrowRight,
} from 'lucide-react';

interface TelegramNoticeBarProps {
  notice: string;
  telegramChannelUrl?: string;
  telegramGroupUrl?: string;
  whatsappNumber?: string;
  isLightMode?: boolean;
}

export const TelegramNoticeBar: React.FC<TelegramNoticeBarProps> = ({
  notice,
  telegramChannelUrl = 'https://t.me/khantopupbd',
  telegramGroupUrl = 'https://t.me/khantopupgroup',
  whatsappNumber = '01575630127',
  isLightMode = false,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={`relative border-b transition-all ${
        isLightMode
          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-blue-800 shadow-sm'
          : 'bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#0a1020] text-slate-100 border-blue-500/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
          {/* Notice Text Marquee / Announcement */}
          <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto flex-1">
            <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-sm">
              <Bell className="w-3 h-3" />
              <span>নোটিশ</span>
            </span>

            <p className="text-xs sm:text-sm font-medium truncate flex-1 opacity-95">
              {notice ||
                '⚡ স্বাগতম KHAN TOP UP এ! ফ্রি ফায়ার ডায়মন্ড, মেম্বারশিপ ও সাবস্ক্রিপশন ইনস্ট্যান্ট ডেলিভারি!'}
            </p>
          </div>

          {/* Quick Action Buttons: Telegram Channel, Support Group, WhatsApp */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            {/* Telegram Channel Button */}
            <a
              href={telegramChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0088cc] hover:bg-[#0077b3] text-white shadow-sm transition-all hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
              <span>টেলিগ্রাম চ্যানেল</span>
            </a>

            {/* Telegram Support Group */}
            <a
              href={telegramGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#229ed9]/90 hover:bg-[#229ed9] text-white shadow-sm transition-all hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>সাপোর্ট গ্রুপ</span>
            </a>

            {/* WhatsApp Support Button */}
            <a
              href={`https://wa.me/88${whatsappNumber.replace(/\D/g, '')}?text=Hello%20KHAN%20TOP%20UP`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-105"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>হোয়াটসঅ্যাপ: {whatsappNumber}</span>
            </a>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all ml-1"
              title="Close notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
