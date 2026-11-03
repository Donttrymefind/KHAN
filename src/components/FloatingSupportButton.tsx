import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Send,
  X,
  Sparkles,
  Bot,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface FloatingSupportButtonProps {
  whatsappNumber?: string;
  telegramChannelUrl?: string;
  telegramGroupUrl?: string;
  contactPhone?: string;
  isLightMode?: boolean;
}

export const FloatingSupportButton: React.FC<FloatingSupportButtonProps> = ({
  whatsappNumber = '01575630127',
  telegramChannelUrl = 'https://t.me/khantopupbd',
  telegramGroupUrl = 'https://t.me/khantopupgroup',
  contactPhone = '01575630127',
  isLightMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-['Orbitron'] font-black text-xs sm:text-sm tracking-wider shadow-2xl shadow-blue-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-400/40"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <MessageCircle className="w-5 h-5" />
          <span>সাহায্য লাগবে? (Need Help?)</span>
        </button>
      </div>

      {/* Support Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all animate-scaleUp ${
              isLightMode
                ? 'bg-white text-slate-800 border-blue-200'
                : 'bg-[#101728] text-white border-blue-500/40'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Orbitron'] font-black text-base text-blue-600 dark:text-cyan-400">
                    KHAN TOP UP কাস্টমার সাপোর্ট
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>২৪/৭ লাইভ সাপোর্ট হটলাইন চালু আছে</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Support Channels */}
            <div className="py-5 space-y-3">
              {/* WhatsApp Option */}
              <a
                href={`https://wa.me/88${whatsappNumber.replace(/\D/g, '')}?text=Hello%20KHAN%20TOP%20UP%2C%20I%20need%20help%20with%20my%20topup`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${
                  isLightMode
                    ? 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200 text-slate-800'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/40 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                      WhatsApp Live Chat
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      ইনস্ট্যান্ট সাপোর্ট নম্বর: {whatsappNumber}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-500 text-white">
                  Chat Now
                </span>
              </a>

              {/* Telegram Channel & Group */}
              <a
                href={telegramGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${
                  isLightMode
                    ? 'bg-blue-50 hover:bg-blue-100/70 border-blue-200 text-slate-800'
                    : 'bg-blue-950/40 hover:bg-blue-900/50 border-blue-500/40 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0088cc] flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-blue-700 dark:text-blue-300">
                      Telegram Support Group
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      সকল নোটিশ ও সাহায্য কমিউনিটি
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-[#0088cc] text-white">
                  Join Group
                </span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${contactPhone}`}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${
                  isLightMode
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-[#151c2f] hover:bg-[#1b253e] border-slate-700 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black shadow-md shadow-amber-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400">
                      হটলাইনে সরাসরি কল
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 font-mono">
                      {contactPhone}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500 text-black">
                  Call
                </span>
              </a>
            </div>

            {/* Safety Guarantee */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>১০০% অফিসিয়াল টপআপ ও ফুল রিফান্ড সিকিউরিটি সিস্টেম</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
