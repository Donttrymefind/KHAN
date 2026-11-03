import React from 'react';
import { X, Shield, FileText, RotateCcw } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface PolicyModalProps {
  type: 'terms' | 'privacy' | 'refund' | null;
  settings: WebsiteSettings;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, settings, onClose }) => {
  if (!type) return null;

  const contentMap = {
    terms: {
      title: 'Terms and Conditions',
      icon: <FileText className="w-5 h-5 text-cyan-400" />,
      text: settings.termsAndConditions,
    },
    privacy: {
      title: 'Privacy Policy',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      text: settings.privacyPolicy,
    },
    refund: {
      title: 'Refund & Delivery Policy',
      icon: <RotateCcw className="w-5 h-5 text-amber-400" />,
      text: settings.refundPolicy,
    },
  };

  const current = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            {current.icon}
          </div>
          <h3 className="font-['Orbitron'] font-bold text-lg text-white">{current.title}</h3>
        </div>

        <div className="p-4 rounded-2xl bg-[#13192b] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto mb-5">
          {current.text}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
