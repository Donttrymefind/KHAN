import React from 'react';
import {
  Gamepad2,
  PhoneCall,
  Mail,
  Shield,
  MessageSquare,
  Facebook,
  Instagram,
  Lock,
  Heart,
} from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenPolicy: (type: 'terms' | 'privacy' | 'refund') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenPolicy, onOpenAdmin }) => {
  return (
    <footer className="bg-[#080b13] border-t border-cyan-500/20 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Orbitron'] font-black text-xl text-white tracking-wider">
                {settings.websiteName || 'KHAN TOP UP'}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Bangladesh&rsquo;s most trusted gaming top-up destination. Fast, reliable Free Fire Diamond and membership UID delivery with instant bKash &amp; Nagad payment verification.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              {settings.facebookLink && (
                <a
                  href={settings.facebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#151c30] hover:bg-blue-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors border border-slate-700/60"
                  title="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.instagramLink && (
                <a
                  href={settings.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#151c30] hover:bg-pink-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors border border-slate-700/60"
                  title="Instagram Page"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/88${settings.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#151c30] hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors border border-slate-700/60"
                  title="WhatsApp Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="font-['Orbitron'] font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Top Services
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>Free Fire UID Diamonds (Instant Delivery)</li>
              <li>Weekly &amp; Monthly VIP Membership</li>
              <li>Free Fire Level Up Pass (802💎 Unlock)</li>
              <li>Evo Gun Access (3d / 7d / 30d Trials)</li>
              <li>100% Guaranteed Reward Mystery Boxes</li>
              <li>Facebook &amp; Instagram Profile Boost</li>
            </ul>
          </div>

          {/* Payment Methods & Verification */}
          <div>
            <h4 className="font-['Orbitron'] font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Payment Gateways
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              We officially support Send Money via bKash and Nagad personal accounts:
            </p>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#13192b] border border-pink-500/30 flex items-center justify-between">
                <span className="font-bold text-pink-400 text-xs">bKash Personal</span>
                <span className="font-mono text-white text-xs font-bold">{settings.contactPhone}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#13192b] border border-orange-500/30 flex items-center justify-between">
                <span className="font-bold text-orange-400 text-xs">Nagad Personal</span>
                <span className="font-mono text-white text-xs font-bold">{settings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* 24/7 Helpline */}
          <div>
            <h4 className="font-['Orbitron'] font-bold text-white text-sm mb-3 uppercase tracking-wider">
              24/7 Helpline &amp; Contact
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#13192b] hover:bg-[#1a233c] border border-slate-700 transition-colors text-white"
              >
                <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Hotline (Call/SMS)</div>
                  <div className="font-mono font-black text-sm text-emerald-400">
                    {settings.contactPhone}
                  </div>
                </div>
              </a>

              <a
                href={`https://wa.me/88${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 transition-colors text-white"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-emerald-300 font-medium">Live WhatsApp Chat</div>
                  <div className="font-semibold text-xs text-white">Instant Agent Reply</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Admin row */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {settings.websiteName || 'KHAN TOP UP'}. All rights reserved. Powered by Official Garena UID Integration.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-cyan-400 transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPolicy('refund')}
              className="hover:text-cyan-400 transition-colors"
            >
              Refund Policy
            </button>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors border-l border-slate-700 pl-3 font-semibold"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
