import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Image,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  FileText,
  Plus,
  Trash2,
} from 'lucide-react';
import { WebsiteSettings, BannerSlide } from '../../types';

interface AdminWebsiteSettingsProps {
  settings: WebsiteSettings;
  onSaveSettings: (settings: WebsiteSettings) => Promise<void>;
}

export const AdminWebsiteSettings: React.FC<AdminWebsiteSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New banner temp state
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerTag, setNewBannerTag] = useState('HOT PROMO');

  const handleAddBanner = () => {
    if (!newBannerTitle.trim()) return;
    const banner: BannerSlide = {
      id: 'banner_' + Date.now(),
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim() || 'Instant Free Fire UID top-up delivery',
      image:
        newBannerImage.trim() ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      tag: newBannerTag.trim() || 'PROMO',
      ctaText: 'Explore Now',
    };
    setFormData({
      ...formData,
      banners: [...formData.banners, banner],
    });
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImage('');
  };

  const handleRemoveBanner = (id: string) => {
    setFormData({
      ...formData,
      banners: formData.banners.filter((b) => b.id !== id),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="font-['Orbitron'] font-black text-xl text-white">
              Website Brand &amp; Content Settings
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Control website title, scrolling promotional marquee, banners, social links, and legal policies
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-['Orbitron'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Website settings successfully saved and synchronized with customer view!</span>
        </div>
      )}

      {/* Brand & Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
          <h3 className="font-['Orbitron'] font-bold text-base text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Store Identity &amp; Notice</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Website Name *
            </label>
            <input
              type="text"
              required
              value={formData.websiteName}
              onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
              className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Live Announcement Ticker Notice (Top Marquee)
            </label>
            <textarea
              rows={3}
              value={formData.promoNotice}
              onChange={(e) => setFormData({ ...formData, promoNotice: e.target.value })}
              className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white leading-relaxed"
            />
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
          <h3 className="font-['Orbitron'] font-bold text-base text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Contact &amp; Social Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebookLink}
                onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
                className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Instagram Page URL
              </label>
              <input
                type="url"
                value={formData.instagramLink}
                onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Banners Manager */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
        <h3 className="font-['Orbitron'] font-bold text-base text-white flex items-center gap-2">
          <Image className="w-4 h-4 text-amber-400" />
          <span>Homepage Hero Banners</span>
        </h3>

        {/* Existing Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.banners.map((b) => (
            <div
              key={b.id}
              className="relative rounded-2xl overflow-hidden border border-slate-700 bg-[#13192b] flex flex-col justify-between"
            >
              <div className="h-32 w-full relative">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13192b] to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/60 text-amber-300 border border-amber-500/40">
                  {b.tag}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveBanner(b.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs"
                  title="Remove banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3">
                <h4 className="font-['Orbitron'] font-bold text-white text-xs line-clamp-1">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{b.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Banner Sub-Form */}
        <div className="p-4 rounded-2xl bg-[#13192b] border border-slate-700 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Add New Slide Banner
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Banner Title"
              value={newBannerTitle}
              onChange={(e) => setNewBannerTitle(e.target.value)}
              className="bg-[#0e1424] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={newBannerSubtitle}
              onChange={(e) => setNewBannerSubtitle(e.target.value)}
              className="bg-[#0e1424] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newBannerImage}
              onChange={(e) => setNewBannerImage(e.target.value)}
              className="bg-[#0e1424] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAddBanner}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
          >
            + Add Slide Banner
          </button>
        </div>
      </div>

      {/* Policies */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
        <h3 className="font-['Orbitron'] font-bold text-base text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Legal Policies &amp; Store Terms</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Terms &amp; Conditions
            </label>
            <textarea
              rows={4}
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              className="w-full bg-[#13192b] border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Privacy Policy
            </label>
            <textarea
              rows={4}
              value={formData.privacyPolicy}
              onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.value })}
              className="w-full bg-[#13192b] border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Refund &amp; Delivery Policy
            </label>
            <textarea
              rows={4}
              value={formData.refundPolicy}
              onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
              className="w-full bg-[#13192b] border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
