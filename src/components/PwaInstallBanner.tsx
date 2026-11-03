import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Zap, ShieldCheck } from 'lucide-react';

interface PwaInstallBannerProps {
  isLightMode?: boolean;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ isLightMode = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Direct instruction fallback for mobile browsers
      alert('আপনার ব্রাউজারের মেনু (৩ ডট) থেকে "Add to Home screen" বা "Install App" চাপুন।');
    }
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 border-t shadow-2xl transition-all transform animate-slideUp ${
        isLightMode
          ? 'bg-white/95 backdrop-blur-md border-blue-200 text-slate-800'
          : 'bg-[#0f1422]/95 backdrop-blur-md border-blue-500/40 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Orbitron'] font-black text-sm text-blue-600 dark:text-cyan-400">
                KHAN TOP UP Official App
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                PWA Fast
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              অ্যাপ ইনস্টল করুন! ১-ক্লিকে ইনস্ট্যান্ট ডায়মন্ড টপআপ ও লাইভ অর্ডার ট্র্যাকিং নোটিফিকেশন পান।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={handleInstallClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-['Orbitron'] font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Install App (ইনস্টল করুন)</span>
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
