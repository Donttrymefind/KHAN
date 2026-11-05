import React from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  Crown,
  Share2,
  Film,
  Gift,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { Product, MysteryBox } from '../types';

export interface TopupBoxItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  image: string;
  defaultPrice?: number;
  packages: Array<{
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    badge?: string;
    subtitle?: string;
    productRef?: Product | MysteryBox;
  }>;
}

interface TopupPapaBoxGridProps {
  products: Product[];
  mysteryBoxes: MysteryBox[];
  onOpenBoxPurchase: (box: TopupBoxItem) => void;
  onPreviewMysteryBox?: (box: MysteryBox, mode?: 'view' | 'open') => void;
  onBuyMysteryBox?: (box: MysteryBox) => void;
  isLightMode?: boolean;
}

export const TopupPapaBoxGrid: React.FC<TopupPapaBoxGridProps> = ({
  products,
  mysteryBoxes,
  onOpenBoxPurchase,
  onPreviewMysteryBox,
  onBuyMysteryBox,
  isLightMode = true,
}) => {
  // 1. FREE FIRE DIAMOND PACKAGES (User's Exact Requested Rates: 25💎=18 TK, 50💎=25 TK up to 12,000💎)
  const ffDiamondPackages = [
    { id: 'ff_25', title: '25 Diamond', price: 18, originalPrice: 25, badge: 'Starter' },
    { id: 'ff_50', title: '50 Diamond', price: 25, originalPrice: 35, badge: 'Hot' },
    { id: 'ff_100', title: '100 Diamond', price: 55, originalPrice: 70 },
    { id: 'ff_115', title: '115 Diamond', price: 70, originalPrice: 85, badge: 'Best Seller' },
    { id: 'ff_140', title: '140 Diamond', price: 88, originalPrice: 105 },
    { id: 'ff_200', title: '200 Diamond', price: 125, originalPrice: 150 },
    { id: 'ff_220', title: '220 Diamond', price: 140, originalPrice: 165 },
    { id: 'ff_240', title: '240 Diamond', price: 150, originalPrice: 175, badge: 'Popular' },
    { id: 'ff_320', title: '320 Diamond', price: 200, originalPrice: 235 },
    { id: 'ff_355', title: '355 Diamond', price: 220, originalPrice: 260, badge: 'Elite Pass' },
    { id: 'ff_420', title: '420 Diamond', price: 260, originalPrice: 310 },
    { id: 'ff_505', title: '505 Diamond', price: 310, originalPrice: 360 },
    { id: 'ff_550', title: '550 Diamond', price: 330, originalPrice: 380, badge: 'Special' },
    { id: 'ff_610', title: '610 Diamond', price: 390, originalPrice: 450, badge: 'Bonus' },
    { id: 'ff_720', title: '720 Diamond', price: 450, originalPrice: 520 },
    { id: 'ff_850', title: '850 Diamond', price: 520, originalPrice: 600 },
    { id: 'ff_1000', title: '1000 Diamond', price: 630, originalPrice: 720, badge: 'Pro' },
    { id: 'ff_1090', title: '1090 Diamond', price: 700, originalPrice: 800, badge: 'Mega' },
    { id: 'ff_1240', title: '1240 Diamond', price: 750, originalPrice: 870 },
    { id: 'ff_1500', title: '1500 Diamond', price: 920, originalPrice: 1050 },
    { id: 'ff_1750', title: '1750 Diamond', price: 1100, originalPrice: 1300 },
    { id: 'ff_2030', title: '2030 Diamond', price: 1550, originalPrice: 1750, badge: 'Whale' },
    { id: 'ff_2530', title: '2530 Diamond', price: 1750, originalPrice: 2000 },
    { id: 'ff_3040', title: '3040 Diamond', price: 2100, originalPrice: 2400 },
    { id: 'ff_4060', title: '4060 Diamond', price: 2650, originalPrice: 3000 },
    { id: 'ff_5060', title: '5060 Diamond', price: 3100, originalPrice: 3500, badge: 'Titan' },
    { id: 'ff_6080', title: '6080 Diamond', price: 3700, originalPrice: 4200 },
    { id: 'ff_7900', title: '7900 Diamond', price: 4600, originalPrice: 5200, badge: 'Grand' },
    { id: 'ff_10020', title: '10,020 Diamond', price: 6100, originalPrice: 7000, badge: 'Vault' },
    { id: 'ff_12000', title: '12,000 Diamond', price: 7200, originalPrice: 8500, badge: 'Max VIP Vault' },
  ];

  // 2. FF LIKE PACKAGES (18 options)
  const ffLikePackages = [
    { id: 'like_100', title: '100 Like', price: 12, originalPrice: 18, badge: 'Instant' },
    { id: 'like_200', title: '200 Like', price: 20, originalPrice: 30, badge: 'Fast' },
    { id: 'like_300', title: '300 Like', price: 28, originalPrice: 38 },
    { id: 'like_400', title: '400 Like', price: 30, originalPrice: 45 },
    { id: 'like_500', title: '500 Like', price: 45, originalPrice: 60 },
    { id: 'like_600', title: '600 Like', price: 60, originalPrice: 80, badge: 'Popular' },
    { id: 'like_800', title: '800 Like', price: 80, originalPrice: 105 },
    { id: 'like_1000', title: '1000 Like', price: 100, originalPrice: 130, badge: 'Best Seller' },
    { id: 'like_1400', title: '1400 Like', price: 140, originalPrice: 180, badge: 'Mega' },
    { id: 'like_2000', title: '2000 Like', price: 200, originalPrice: 250 },
    { id: 'like_3000', title: '3000 Like', price: 300, originalPrice: 380, badge: 'Super' },
    { id: 'like_4000', title: '4000 Like', price: 400, originalPrice: 500 },
    { id: 'like_5000', title: '5000 Like', price: 500, originalPrice: 620, badge: 'Heroic' },
    { id: 'like_6000', title: '6000 Like', price: 600, originalPrice: 750, badge: 'VIP' },
    { id: 'like_8000', title: '8000 Like', price: 800, originalPrice: 1000 },
    { id: 'like_10000', title: '10,000 Like', price: 980, originalPrice: 1250, badge: 'Master' },
    { id: 'like_15000', title: '15,000 Like', price: 1450, originalPrice: 1800 },
    { id: 'like_20000', title: '20,000 Like', price: 1900, originalPrice: 2400, badge: 'Grand Master' },
  ];

  // 3. WEEKLY LITE PACKAGES (16 options)
  const weeklyLitePackages = [
    { id: 'wl_1', title: '1x Weekly Lite', price: 35, originalPrice: 45, badge: 'Instant' },
    { id: 'wl_2', title: '2x Weekly Lite', price: 70, originalPrice: 90 },
    { id: 'wl_3', title: '3x Weekly Lite', price: 105, originalPrice: 135 },
    { id: 'wl_4', title: '4x Weekly Lite', price: 140, originalPrice: 180 },
    { id: 'wl_5', title: '5x Weekly Lite', price: 175, originalPrice: 220, badge: 'Best' },
    { id: 'wl_6', title: '6x Weekly Lite', price: 210, originalPrice: 260 },
    { id: 'wl_7', title: '7x Weekly Lite', price: 245, originalPrice: 300 },
    { id: 'wl_8', title: '8x Weekly Lite', price: 280, originalPrice: 350 },
    { id: 'wl_9', title: '9x Weekly Lite', price: 315, originalPrice: 390 },
    { id: 'wl_10', title: '10x Weekly Lite', price: 340, originalPrice: 430, badge: 'Super Saver' },
    { id: 'wl_12', title: '12x Weekly Lite', price: 400, originalPrice: 510 },
    { id: 'wl_15', title: '15x Weekly Lite', price: 495, originalPrice: 630, badge: 'Mega Saver' },
    { id: 'wl_18', title: '18x Weekly Lite', price: 590, originalPrice: 750 },
    { id: 'wl_20', title: '20x Weekly Lite', price: 650, originalPrice: 830, badge: 'VIP Pack' },
    { id: 'wl_25', title: '25x Weekly Lite', price: 800, originalPrice: 1050, badge: 'Whale' },
    { id: 'wl_30', title: '30x Weekly Lite', price: 950, originalPrice: 1250, badge: 'Ultimate' },
  ];

  // 4. WEEKLY & MONTHLY OFFERS (User's Exact Requested Combinations - 20+ options)
  const membershipPackages = [
    { id: 'mem_w1', title: 'উইকলি মেম্বারশিপ (1x Weekly)', price: 140, originalPrice: 170, badge: '450💎 Total' },
    { id: 'mem_m1', title: 'মান্থলি মেম্বারশিপ (1x Monthly)', price: 760, originalPrice: 900, badge: '2600💎 Total' },
    { id: 'mem_wm', title: 'উইকলি প্লাস মান্থলি (1W + 1M)', price: 890, originalPrice: 1070, badge: 'Combo Offer' },
    { id: 'mem_mw', title: 'মান্থলি প্লাস উইকলি (1M + 1W)', price: 890, originalPrice: 1070, badge: 'Combo Offer' },
    { id: 'mem_2w_1m', title: 'দুইটা উইকলি প্লাস একটা মান্থলি (2W + 1M)', price: 1020, originalPrice: 1240, badge: 'VIP Combo' },
    { id: 'mem_3m_1w', title: 'তিনটা মান্থলি প্লাস একটা উইকলি (3M + 1W)', price: 2350, originalPrice: 2870, badge: 'Mega Pack' },
    { id: 'mem_w2', title: '2x Weekly Membership', price: 280, originalPrice: 340, badge: '900💎 Total' },
    { id: 'mem_w3', title: '3x Weekly Membership', price: 420, originalPrice: 510, badge: '1350💎 Total' },
    { id: 'mem_w4', title: '4x Weekly Membership', price: 550, originalPrice: 680, badge: '1800💎 Total' },
    { id: 'mem_w5', title: '5x Weekly Membership', price: 690, originalPrice: 850, badge: '2250💎 Total' },
    { id: 'mem_w6', title: '6x Weekly Membership', price: 820, originalPrice: 1020, badge: '2700💎 Total' },
    { id: 'mem_w8', title: '8x Weekly Membership', price: 1090, originalPrice: 1360, badge: '3600💎 Total' },
    { id: 'mem_w10', title: '10x Weekly Membership', price: 1370, originalPrice: 1700, badge: '4500💎 Total' },
    { id: 'mem_m2', title: '2x Monthly Membership', price: 1500, originalPrice: 1800, badge: '5200💎 Total' },
    { id: 'mem_m3', title: '3x Monthly Membership', price: 2240, originalPrice: 2700, badge: '7800💎 Total' },
    { id: 'mem_m4', title: '4x Monthly Membership', price: 2980, originalPrice: 3600, badge: '10,400💎 Total' },
    { id: 'mem_m5', title: '5x Monthly Membership', price: 3700, originalPrice: 4500, badge: '13,000💎 Total' },
    { id: 'mem_2w_2m', title: '২টা উইকলি + ২টা মান্থলি (2W + 2M)', price: 1760, originalPrice: 2140, badge: 'Double VIP' },
    { id: 'mem_3w_2m', title: '৩টা উইকলি + ২টা মান্থলি (3W + 2M)', price: 1890, originalPrice: 2310, badge: 'Pro Combo' },
    { id: 'mem_5w_1m', title: '৫টা উইকলি + ১টা মান্থলি (5W + 1M)', price: 1420, originalPrice: 1750, badge: 'Grand Saver' },
    { id: 'mem_5w_2m', title: '৫টা উইকলি + ২টা মান্থলি (5W + 2M)', price: 2150, originalPrice: 2650, badge: 'Elite VIP' },
    { id: 'mem_10w_5m', title: '১০টা উইকলি + ৫টা মান্থলি Super VIP', price: 5000, originalPrice: 6200, badge: 'Ultimate Whale' },
  ];

  // 5. NEW LEVEL UP PASS (15 options)
  const levelUpPackages = [
    { id: 'lup_1', title: 'Level Up Pass (802💎)', price: 160, originalPrice: 190, badge: 'Level 2-30' },
    { id: 'lup_2', title: '2x Level Up Pass Combo', price: 320, originalPrice: 380, badge: 'Double Pass' },
    { id: 'lup_3', title: '3x Level Up Pass Combo', price: 475, originalPrice: 570, badge: 'Triple Pass' },
    { id: 'lup_4', title: '4x Level Up Pass Combo', price: 630, originalPrice: 760 },
    { id: 'lup_5', title: '5x Level Up Pass Combo', price: 780, originalPrice: 950, badge: 'Whale Pass' },
    { id: 'lup_tier1', title: 'Tier 1 Pass (Level 2-10: 200💎)', price: 60, originalPrice: 80, badge: 'Tier 1' },
    { id: 'lup_tier2', title: 'Tier 2 Pass (Level 11-20: 300💎)', price: 90, originalPrice: 110, badge: 'Tier 2' },
    { id: 'lup_tier3', title: 'Tier 3 Pass (Level 21-30: 302💎)', price: 110, originalPrice: 135, badge: 'Tier 3' },
    { id: 'lup_w1_combo', title: 'Level Up Pass + 1x Weekly', price: 295, originalPrice: 360, badge: 'Saver Combo' },
    { id: 'lup_w2_combo', title: 'Level Up Pass + 2x Weekly', price: 430, originalPrice: 530, badge: 'Pro Combo' },
    { id: 'lup_m1_combo', title: 'Level Up Pass + 1x Monthly', price: 910, originalPrice: 1090, badge: 'Elite Combo' },
    { id: 'lup_wm_combo', title: 'Level Up Pass + 1W + 1M', price: 1040, originalPrice: 1260, badge: 'VIP Combo' },
    { id: 'lup_2w_2lup', title: '2x Pass + 2x Weekly Bundle', price: 580, originalPrice: 720 },
    { id: 'lup_2m_2lup', title: '2x Pass + 1x Monthly Bundle', price: 1060, originalPrice: 1300 },
    { id: 'lup_ultimate', title: 'Level Up Super Ultimate Bundle', price: 1290, originalPrice: 1590, badge: 'Super Combo' },
  ];

  // 6. INDONESIA SERVER (UID) (16 options)
  const indoPackages = [
    { id: 'indo_50', title: 'Indo 50 Diamonds', price: 35, originalPrice: 45 },
    { id: 'indo_70', title: 'Indo 70 Diamonds', price: 50, originalPrice: 65 },
    { id: 'indo_100', title: 'Indo 100 Diamonds', price: 70, originalPrice: 85 },
    { id: 'indo_140', title: 'Indo 140 Diamonds', price: 95, originalPrice: 115 },
    { id: 'indo_210', title: 'Indo 210 Diamonds', price: 145, originalPrice: 175, badge: 'Popular' },
    { id: 'indo_280', title: 'Indo 280 Diamonds', price: 190, originalPrice: 230 },
    { id: 'indo_355', title: 'Indo 355 Diamonds', price: 240, originalPrice: 280 },
    { id: 'indo_500', title: 'Indo 500 Diamonds', price: 340, originalPrice: 400 },
    { id: 'indo_720', title: 'Indo 720 Diamonds', price: 480, originalPrice: 560, badge: 'Hot' },
    { id: 'indo_1000', title: 'Indo 1000 Diamonds', price: 670, originalPrice: 790 },
    { id: 'indo_1440', title: 'Indo 1440 Diamonds', price: 950, originalPrice: 1120, badge: 'Mega' },
    { id: 'indo_2000', title: 'Indo 2000 Diamonds', price: 1330, originalPrice: 1550 },
    { id: 'indo_4000', title: 'Indo 4000 Diamonds', price: 2600, originalPrice: 3000, badge: 'Whale' },
    { id: 'indo_7290', title: 'Indo 7290 Diamonds', price: 4700, originalPrice: 5500, badge: 'VIP' },
    { id: 'indo_w1', title: 'Indo 1x Weekly Membership', price: 150, originalPrice: 180, badge: 'Weekly' },
    { id: 'indo_m1', title: 'Indo 1x Monthly Membership', price: 780, originalPrice: 920, badge: 'Monthly' },
    { id: 'indo_wm', title: 'Indo 1W + 1M Combo Pack', price: 920, originalPrice: 1100, badge: 'Combo' },
  ];

  // 7. UNIPIN VOUCHER (BD) (16 options)
  const unipinPackages = [
    { id: 'uni_25', title: 'UniPin 25 Diamonds', price: 22, originalPrice: 28 },
    { id: 'uni_50', title: 'UniPin 50 Diamonds', price: 32, originalPrice: 40 },
    { id: 'uni_70', title: 'UniPin 70 Diamonds', price: 45, originalPrice: 58 },
    { id: 'uni_100', title: 'UniPin 100 Diamonds', price: 65, originalPrice: 80 },
    { id: 'uni_115', title: 'UniPin 115 Diamonds', price: 72, originalPrice: 85, badge: 'Best Seller' },
    { id: 'uni_140', title: 'UniPin 140 Diamonds', price: 90, originalPrice: 110 },
    { id: 'uni_210', title: 'UniPin 210 Diamonds', price: 135, originalPrice: 160 },
    { id: 'uni_240', title: 'UniPin 240 Diamonds', price: 155, originalPrice: 180, badge: 'Hot' },
    { id: 'uni_355', title: 'UniPin 355 Diamonds', price: 225, originalPrice: 260, badge: 'Popular' },
    { id: 'uni_505', title: 'UniPin 505 Diamonds', price: 320, originalPrice: 380 },
    { id: 'uni_610', title: 'UniPin 610 Diamonds', price: 395, originalPrice: 450, badge: 'Bonus' },
    { id: 'uni_850', title: 'UniPin 850 Diamonds', price: 540, originalPrice: 620 },
    { id: 'uni_1090', title: 'UniPin 1090 Diamonds', price: 710, originalPrice: 810, badge: 'Mega' },
    { id: 'uni_1240', title: 'UniPin 1240 Diamonds', price: 770, originalPrice: 890 },
    { id: 'uni_2030', title: 'UniPin 2030 Diamonds', price: 1580, originalPrice: 1780, badge: 'Whale' },
    { id: 'uni_5060', title: 'UniPin 5060 Diamonds', price: 3150, originalPrice: 3550, badge: 'Titan' },
  ];

  // 8. PUBG MOBILE UC (16 options)
  const pubgPackages = [
    { id: 'pubg_30', title: '30 UC', price: 50, originalPrice: 65 },
    { id: 'pubg_60', title: '60 UC', price: 95, originalPrice: 115, badge: 'Starter' },
    { id: 'pubg_120', title: '120 UC', price: 185, originalPrice: 220 },
    { id: 'pubg_180', title: '180 UC', price: 275, originalPrice: 320 },
    { id: 'pubg_325', title: '325 UC (300+25)', price: 480, originalPrice: 550, badge: 'Popular' },
    { id: 'pubg_385', title: '385 UC', price: 570, originalPrice: 650 },
    { id: 'pubg_660', title: '660 UC (Royale Pass)', price: 950, originalPrice: 1100, badge: 'RP Pack' },
    { id: 'pubg_960', title: '960 UC', price: 1390, originalPrice: 1600 },
    { id: 'pubg_1200', title: '1200 UC', price: 1740, originalPrice: 2000 },
    { id: 'pubg_1800', title: '1800 UC (1500+300)', price: 2450, originalPrice: 2800, badge: 'Hot' },
    { id: 'pubg_2400', title: '2400 UC', price: 3250, originalPrice: 3700 },
    { id: 'pubg_3850', title: '3850 UC (3000+850)', price: 4900, originalPrice: 5600, badge: 'Mythic' },
    { id: 'pubg_5000', title: '5000 UC', price: 6400, originalPrice: 7200 },
    { id: 'pubg_8100', title: '8100 UC (6000+2100)', price: 9700, originalPrice: 11200, badge: 'Ultimate' },
    { id: 'pubg_10000', title: '10,000 UC Super Vault', price: 12200, originalPrice: 14000 },
    { id: 'pubg_16200', title: '16,200 UC Mythic Forge Pack', price: 19200, originalPrice: 22000, badge: 'X-Suit Whale' },
  ];

  // 9. MYSTERY BOXES (15 options)
  const defaultMysteryBoxes = [
    { id: 'mb_starter', title: 'Starter Mystery Box (25-80💎)', price: 29, badge: 'Starter' },
    { id: 'mb_bronze', title: 'Bronze Mystery Box (50-120💎)', price: 49, badge: 'Bronze' },
    { id: 'mb_silver', title: 'Silver Mystery Box (115-250💎)', price: 89, badge: 'Silver' },
    { id: 'mb_gold', title: 'Gold Mystery Box (240-500💎)', price: 149, badge: 'Gold' },
    { id: 'mb_popular', title: 'Popular Mystery Box (355-750💎)', price: 199, badge: 'Best Seller' },
    { id: 'mb_lucky', title: 'Diamond Lucky Mystery Box', price: 289, badge: 'Lucky' },
    { id: 'mb_vip', title: 'VIP Lucky Mystery Box (550-1200💎)', price: 399, badge: 'VIP Pick' },
    { id: 'mb_evo', title: 'Evo Gun Token Mystery Box', price: 499, badge: 'Evo Guns' },
    { id: 'mb_legendary', title: 'Legendary Mystery Box (1000-2500💎)', price: 699, badge: 'Legend' },
    { id: 'mb_heroic', title: 'Heroic Mystery Box (1500-3500💎)', price: 999, badge: 'Heroic' },
    { id: 'mb_master', title: 'Grand Master Mystery Box (2000-5000💎)', price: 1399, badge: 'Grand Master' },
    { id: 'mb_cobra', title: 'Cobra MP40 Mystery Box', price: 1699, badge: 'Rare Skin' },
    { id: 'mb_draco', title: 'Blue Flame Draco AK Mystery Box', price: 1999, badge: 'Ultra Rare' },
    { id: 'mb_titan', title: 'Titan Scar Legendary Box', price: 2499, badge: 'Mythic' },
    { id: 'mb_jackpot', title: 'Ultra Vault 10,000💎 Jackpot Box', price: 4999, badge: 'Jackpot' },
  ];

  const mysteryBoxPackages = mysteryBoxes.length >= 8
    ? mysteryBoxes.map((b) => ({
        id: b.id,
        title: b.name,
        price: b.price,
        badge: b.badge || '100% Drop',
        subtitle: `${b.guaranteedRewards.length} টি নিশ্চিত রিওয়ার্ড`,
        productRef: b,
      }))
    : defaultMysteryBoxes;

  // 10. BONUS OFFERS (16 options)
  const bonusOfferPackages = [
    { id: 'bon_115', title: '115💎 + 35💎 Bonus', price: 70, originalPrice: 85, badge: 'Starter' },
    { id: 'bon_240', title: '240💎 + 60💎 Friday Bonus', price: 150, originalPrice: 175, badge: 'Friday' },
    { id: 'bon_355', title: '355💎 + 90💎 Bonus', price: 220, originalPrice: 260 },
    { id: 'bon_550', title: '550💎 + 140💎 Bonus', price: 330, originalPrice: 380, badge: 'Special' },
    { id: 'bon_610', title: '610💎 + 160💎 Double Bonus', price: 390, originalPrice: 450, badge: 'Double' },
    { id: 'bon_850', title: '850💎 + 210💎 Bonus', price: 520, originalPrice: 600 },
    { id: 'bon_1090', title: '1090💎 + 300💎 Mega Bonus', price: 700, originalPrice: 800, badge: 'Mega' },
    { id: 'bon_1240', title: '1240💎 + 350💎 Bonus', price: 750, originalPrice: 870 },
    { id: 'bon_1500', title: '1500💎 + 400💎 Bonus', price: 920, originalPrice: 1050 },
    { id: 'bon_2030', title: '2030💎 + 600💎 Titan Bonus', price: 1550, originalPrice: 1750, badge: 'Titan' },
    { id: 'bon_2530', title: '2530💎 + 750💎 Bonus', price: 1750, originalPrice: 2000 },
    { id: 'bon_3040', title: '3040💎 + 900💎 Bonus', price: 2100, originalPrice: 2400 },
    { id: 'bon_5060', title: '5060💎 + 1500💎 Whale Bonus', price: 3100, originalPrice: 3500, badge: 'Whale' },
    { id: 'bon_7900', title: '7900💎 + 2200💎 Grand Bonus', price: 4600, originalPrice: 5200, badge: 'Grand' },
    { id: 'bon_10020', title: '10,020💎 + 3000💎 King Bonus', price: 6100, originalPrice: 7000, badge: 'Super King' },
    { id: 'bon_12000', title: '12,000💎 + 4000💎 Ultimate Bonus', price: 7200, originalPrice: 8500, badge: 'Ultimate' },
  ];

  // 10B. FIRST TIME 5000 DIAMOND BUNDLE PACKAGES (16 options)
  const firstTopupPackages = [
    { id: 'ft_50', title: '50💎 + 50💎 1st Bonus', price: 30, originalPrice: 45, badge: '100% Bonus' },
    { id: 'ft_115', title: '115💎 + 115💎 Double', price: 70, originalPrice: 95, badge: 'Double Bonus' },
    { id: 'ft_240', title: '240💎 + 240💎 Double', price: 150, originalPrice: 190, badge: 'Popular' },
    { id: 'ft_355', title: '355💎 + 355💎 Double', price: 220, originalPrice: 280, badge: 'Best Seller' },
    { id: 'ft_550', title: '550💎 + 550💎 Double', price: 330, originalPrice: 420 },
    { id: 'ft_610', title: '610💎 + 610💎 Double', price: 390, originalPrice: 490, badge: 'VIP Pack' },
    { id: 'ft_850', title: '850💎 + 850💎 Double', price: 520, originalPrice: 650 },
    { id: 'ft_1090', title: '1090💎 + 1090💎 Double', price: 700, originalPrice: 880, badge: 'Mega Double' },
    { id: 'ft_1240', title: '1240💎 + 1240💎 Double', price: 750, originalPrice: 950 },
    { id: 'ft_1500', title: '1500💎 + 1500💎 Double', price: 920, originalPrice: 1150 },
    { id: 'ft_2030', title: '2030💎 + 2030💎 Double', price: 1550, originalPrice: 1950, badge: 'Titan' },
    { id: 'ft_2530', title: '2530💎 + 2530💎 Double', price: 1750, originalPrice: 2200 },
    { id: 'ft_3040', title: '3040💎 + 3040💎 Double', price: 2100, originalPrice: 2600 },
    { id: 'ft_5000', title: '5,000💎 + 5,000💎 Official Grand Bundle', price: 3100, originalPrice: 4000, badge: '৫০০০💎 Bundle' },
    { id: 'ft_7900', title: '7,900💎 + 7,900💎 King Double Pack', price: 4600, originalPrice: 5800, badge: 'King' },
    { id: 'ft_12000', title: '12,000💎 + 12,000💎 Supreme Double', price: 7200, originalPrice: 9200, badge: 'Supreme Whale' },
  ];

  // 10C. VIP WELCOME SPIN WHEEL 8000 DIAMOND PACKAGES (16 options)
  const spinWheelPackages = [
    { id: 'sp_1', title: '1x VIP Spin (৫০ - ৫০০💎 নিশ্চিত ড্রপ)', price: 35, originalPrice: 50, badge: 'Starter Spin' },
    { id: 'sp_3', title: '3x VIP Spin (১৫০ - ১,৫০০💎 চান্স)', price: 99, originalPrice: 140, badge: 'Lucky 3X' },
    { id: 'sp_5', title: '5x VIP Spin (৩৫০ - ২,৫০০💎 ড্রপ)', price: 160, originalPrice: 230, badge: 'Hot' },
    { id: 'sp_10', title: '10x VIP Spin (৮০০ - ৪,৫০০💎 মেগা)', price: 299, originalPrice: 420, badge: 'Best Value' },
    { id: 'sp_pass', title: 'VIP Spin Pass (১,৫০০💎 নিশ্চিত ড্রপ)', price: 450, originalPrice: 600, badge: 'VIP Pass' },
    { id: 'sp_mega', title: 'Mega Wheel Spin (৩,০০০💎 গ্র্যান্ড চান্স)', price: 680, originalPrice: 900, badge: 'Mega' },
    { id: 'sp_jackpot_1', title: 'Jackpot Ultra Spin (সর্বোচ্চ ৮,০০০💎 উইন)', price: 990, originalPrice: 1350, badge: '৮০০০💎 Jackpot' },
    { id: 'sp_jackpot_2', title: '2x Jackpot Ultra Spin (সর্বোচ্চ ১৬,০০০💎 উইন)', price: 1890, originalPrice: 2500, badge: 'Double Jackpot' },
    { id: 'sp_whale_5k', title: 'Whale 5,000💎 Guaranteed Spin Vault', price: 2800, originalPrice: 3400, badge: '৫০০০💎 ড্রপ' },
    { id: 'sp_whale_8k', title: 'Supreme 8,000💎 Full Jackpot Box', price: 4500, originalPrice: 5500, badge: '৮০০০💎 ফুল জ্যাকপট' },
    { id: 'sp_115_spin', title: '115💎 + ১টি ফ্রি হুইল স্পিন', price: 70, originalPrice: 90, badge: 'Combo' },
    { id: 'sp_240_spin', title: '240💎 + ২টি ফ্রি হুইল স্পিন', price: 150, originalPrice: 190, badge: 'Combo' },
    { id: 'sp_610_spin', title: '610💎 + ৩টি ফ্রি হুইল স্পিন', price: 390, originalPrice: 490, badge: 'Combo' },
    { id: 'sp_1090_spin', title: '1090💎 + ৫টি ফ্রি হুইল স্পিন', price: 700, originalPrice: 880, badge: 'Combo' },
    { id: 'sp_2030_spin', title: '2030💎 + ১০টি ফ্রি হুইল স্পিন', price: 1550, originalPrice: 1950, badge: 'Combo' },
    { id: 'sp_5060_spin', title: '5060💎 + ২৫টি জ্যাকপট হুইল স্পিন', price: 3100, originalPrice: 3900, badge: 'Ultimate Combo' },
  ];

  // 11. FACEBOOK FOLLOWERS (18 options)
  const fbFollowerPackages = [
    { id: 'fb_f_100', title: '100 FB Followers (Test)', price: 20, originalPrice: 30, badge: 'Test Pack' },
    { id: 'fb_f_250', title: '250 FB Followers', price: 45, originalPrice: 60 },
    { id: 'fb_f_500', title: '500 FB Followers', price: 80, originalPrice: 100, badge: 'Fast' },
    { id: 'fb_f_1000', title: '1,000 FB Followers', price: 150, originalPrice: 190, badge: 'Popular' },
    { id: 'fb_f_2000', title: '2,000 FB Followers', price: 200, originalPrice: 260 },
    { id: 'fb_f_3000', title: '3,000 FB Followers', price: 280, originalPrice: 350 },
    { id: 'fb_f_5000', title: '5,000 FB Followers', price: 400, originalPrice: 500, badge: 'Profile' },
    { id: 'fb_f_7000', title: '7,000 FB Followers', price: 540, originalPrice: 680 },
    { id: 'fb_f_10000', title: '10,000 FB Followers', price: 720, originalPrice: 900, badge: 'Creator' },
    { id: 'fb_f_15000', title: '15,000 FB Followers', price: 1100, originalPrice: 1400 },
    { id: 'fb_f_20000', title: '20,000 FB Followers', price: 1500, originalPrice: 1900 },
    { id: 'fb_f_30000', title: '30,000 FB Followers', price: 2100, originalPrice: 2700 },
    { id: 'fb_f_50000', title: '50,000 FB Followers', price: 3000, originalPrice: 3800, badge: 'Pro Page' },
    { id: 'fb_f_75000', title: '75,000 FB Followers', price: 4200, originalPrice: 5200 },
    { id: 'fb_f_100000', title: '100,000 (1 Lakh) Followers', price: 5000, originalPrice: 6500, badge: 'Celeb VIP' },
    { id: 'fb_f_200000', title: '200,000 (2 Lakh) Followers', price: 9500, originalPrice: 12000 },
    { id: 'fb_f_500000', title: '500,000 (5 Lakh) Followers', price: 22000, originalPrice: 28000, badge: 'Mega Brand' },
    { id: 'fb_f_1000000', title: '1,000,000 (1 Million) Followers', price: 42000, originalPrice: 55000, badge: 'Empire' },
  ];

  // 12. FACEBOOK POST REACTS (16 options)
  const fbReactPackages = [
    { id: 'fb_r_100', title: '100 Post Reacts (Like/Love)', price: 10, originalPrice: 15 },
    { id: 'fb_r_200', title: '200 Post Reacts', price: 15, originalPrice: 22 },
    { id: 'fb_r_300', title: '300 Post Reacts (Like/Love)', price: 20, originalPrice: 30 },
    { id: 'fb_r_500', title: '500 Post Reacts', price: 40, originalPrice: 55 },
    { id: 'fb_r_800', title: '800 Post Reacts', price: 48, originalPrice: 65 },
    { id: 'fb_r_1000', title: '1,000 Post Reacts', price: 55, originalPrice: 75, badge: 'Popular' },
    { id: 'fb_r_1500', title: '1,500 Post Reacts', price: 80, originalPrice: 105 },
    { id: 'fb_r_2000', title: '2,000 Post Reacts', price: 100, originalPrice: 130 },
    { id: 'fb_r_3000', title: '3,000 Post Reacts', price: 110, originalPrice: 145 },
    { id: 'fb_r_5000', title: '5,000 Post Reacts', price: 120, originalPrice: 160, badge: 'Best Value' },
    { id: 'fb_r_8000', title: '8,000 Post Reacts', price: 140, originalPrice: 185 },
    { id: 'fb_r_10000', title: '10,000 Post Reacts', price: 150, originalPrice: 200, badge: 'Viral' },
    { id: 'fb_r_15000', title: '15,000 Post Reacts', price: 230, originalPrice: 300 },
    { id: 'fb_r_20000', title: '20,000 Post Reacts', price: 310, originalPrice: 400 },
    { id: 'fb_r_30000', title: '30,000 Post Reacts', price: 450, originalPrice: 600 },
    { id: 'fb_r_50000', title: '50,000 Post Reacts', price: 720, originalPrice: 950, badge: 'Super Viral' },
  ];

  // 13. FACEBOOK VIDEO VIEWS & WATCHTIME (16 options)
  const fbViewsPackages = [
    { id: 'fb_v_1000', title: '1,000 Video Views', price: 18, originalPrice: 25 },
    { id: 'fb_v_2500', title: '2,500 Video Views', price: 35, originalPrice: 50 },
    { id: 'fb_v_5000', title: '5,000 Video Views', price: 60, originalPrice: 80, badge: 'Fast' },
    { id: 'fb_v_10000', title: '10,000 Video Views', price: 110, originalPrice: 150, badge: 'Popular' },
    { id: 'fb_v_20000', title: '20,000 Video Views', price: 190, originalPrice: 250 },
    { id: 'fb_v_50000', title: '50,000 Video Views', price: 380, originalPrice: 500 },
    { id: 'fb_v_100000', title: '100,000 (100K) Views', price: 650, originalPrice: 850, badge: 'Viral' },
    { id: 'fb_v_250000', title: '250,000 (250K) Views', price: 1450, originalPrice: 1900 },
    { id: 'fb_v_500000', title: '500,000 (500K) Views', price: 2700, originalPrice: 3500 },
    { id: 'fb_v_1000000', title: '1,000,000 (1M) Views', price: 4900, originalPrice: 6500, badge: 'Celebrity' },
    { id: 'fb_v_15k_min', title: '15,000 Mins Watchtime', price: 250, originalPrice: 350 },
    { id: 'fb_v_30k_min', title: '30,000 Mins Watchtime', price: 420, originalPrice: 550 },
    { id: 'fb_v_60k_min', title: '60,000 Mins Watchtime (Monetization)', price: 650, originalPrice: 850, badge: 'Monetize' },
    { id: 'fb_v_120k_min', title: '120,000 Mins Watchtime', price: 1100, originalPrice: 1450 },
    { id: 'fb_v_300k_min', title: '300,000 Mins Watchtime', price: 1450, originalPrice: 1950 },
    { id: 'fb_v_600k_min', title: '600,000 Mins Full Watchtime', price: 1800, originalPrice: 2400, badge: 'Full Setup' },
  ];

  // 14. INSTAGRAM SERVICES (16 options)
  const igPackages = [
    { id: 'ig_f_100', title: '100 Instagram Followers', price: 25, originalPrice: 35 },
    { id: 'ig_f_250', title: '250 Instagram Followers', price: 55, originalPrice: 75 },
    { id: 'ig_f_500', title: '500 Instagram Followers', price: 95, originalPrice: 130 },
    { id: 'ig_f_1000', title: '1,000 Instagram Followers', price: 180, originalPrice: 240, badge: 'Popular' },
    { id: 'ig_f_2500', title: '2,500 Instagram Followers', price: 420, originalPrice: 550 },
    { id: 'ig_f_5000', title: '5,000 Instagram Followers', price: 790, originalPrice: 990, badge: 'Creator' },
    { id: 'ig_f_10000', title: '10,000 Instagram Followers', price: 1490, originalPrice: 1900, badge: 'Influencer' },
    { id: 'ig_f_25000', title: '25,000 Instagram Followers', price: 3500, originalPrice: 4500 },
    { id: 'ig_f_50000', title: '50,000 Instagram Followers', price: 6800, originalPrice: 8500, badge: 'VIP' },
    { id: 'ig_l_500', title: '500 Post Likes', price: 30, originalPrice: 45 },
    { id: 'ig_l_1000', title: '1,000 Post Likes', price: 55, originalPrice: 75, badge: 'Likes' },
    { id: 'ig_l_5000', title: '5,000 Post Likes', price: 220, originalPrice: 300 },
    { id: 'ig_v_5000', title: '5,000 Reel Views', price: 40, originalPrice: 60 },
    { id: 'ig_v_10000', title: '10,000 Reel Views', price: 75, originalPrice: 100, badge: 'Reels' },
    { id: 'ig_v_50000', title: '50,000 Reel Views', price: 290, originalPrice: 390 },
    { id: 'ig_v_100000', title: '100,000 Reel Views', price: 520, originalPrice: 700, badge: 'Viral Reel' },
  ];

  // 15. YOUTUBE SUBSCRIBERS & WATCHTIME (16 options)
  const ytSocialPackages = [
    { id: 'yts_100', title: '100 YouTube Subscribers', price: 120, originalPrice: 160 },
    { id: 'yts_250', title: '250 YouTube Subscribers', price: 280, originalPrice: 360 },
    { id: 'yts_500', title: '500 YouTube Subscribers', price: 520, originalPrice: 680, badge: 'Fast' },
    { id: 'yts_1000', title: '1,000 YouTube Subscribers', price: 950, originalPrice: 1250, badge: 'Monetize' },
    { id: 'yts_2000', title: '2,000 YouTube Subscribers', price: 1850, originalPrice: 2400 },
    { id: 'yts_5000', title: '5,000 YouTube Subscribers', price: 4400, originalPrice: 5500, badge: 'Silver Play' },
    { id: 'yts_10000', title: '10,000 YouTube Subscribers', price: 8500, originalPrice: 10500, badge: 'VIP' },
    { id: 'ytv_1000', title: '1,000 High Retention Views', price: 45, originalPrice: 60 },
    { id: 'ytv_5000', title: '5,000 High Retention Views', price: 190, originalPrice: 250 },
    { id: 'ytv_10000', title: '10,000 High Retention Views', price: 360, originalPrice: 480, badge: 'Popular' },
    { id: 'ytv_50000', title: '50,000 High Retention Views', price: 1650, originalPrice: 2200 },
    { id: 'ytw_500h', title: '500 Hours Watchtime', price: 450, originalPrice: 600 },
    { id: 'ytw_1000h', title: '1,000 Hours Watchtime', price: 850, originalPrice: 1100 },
    { id: 'ytw_2000h', title: '2,000 Hours Watchtime', price: 1600, originalPrice: 2100 },
    { id: 'ytw_4000h', title: '4,000 Hours Watchtime (Full Monetization)', price: 2800, originalPrice: 3600, badge: 'Monetize Ready' },
    { id: 'yt_combo_full', title: '1,000 Subs + 4,000 Hours Full Channel Combo', price: 3600, originalPrice: 4800, badge: 'Complete Setup' },
  ];

  // 16. TIKTOK FOLLOWERS & VIEWS (15 options)
  const tiktokPackages = [
    { id: 'tt_f_100', title: '100 TikTok Followers', price: 20, originalPrice: 30 },
    { id: 'tt_f_250', title: '250 TikTok Followers', price: 45, originalPrice: 65 },
    { id: 'tt_f_500', title: '500 TikTok Followers', price: 85, originalPrice: 115 },
    { id: 'tt_f_1000', title: '1,000 TikTok Followers (Live Unlocked)', price: 160, originalPrice: 220, badge: 'Unlock Live' },
    { id: 'tt_f_2500', title: '2,500 TikTok Followers', price: 380, originalPrice: 490 },
    { id: 'tt_f_5000', title: '5,000 TikTok Followers', price: 720, originalPrice: 920, badge: 'Creator' },
    { id: 'tt_f_10000', title: '10,000 TikTok Followers', price: 1390, originalPrice: 1750, badge: 'Viral' },
    { id: 'tt_l_500', title: '500 Video Likes', price: 25, originalPrice: 35 },
    { id: 'tt_l_1000', title: '1,000 Video Likes', price: 45, originalPrice: 65 },
    { id: 'tt_l_5000', title: '5,000 Video Likes', price: 190, originalPrice: 250 },
    { id: 'tt_v_5000', title: '5,000 Video Views', price: 15, originalPrice: 25 },
    { id: 'tt_v_10000', title: '10,000 Video Views', price: 25, originalPrice: 40 },
    { id: 'tt_v_50000', title: '50,000 Video Views', price: 95, originalPrice: 140 },
    { id: 'tt_v_100000', title: '100,000 Video Views', price: 170, originalPrice: 250, badge: 'ForYou' },
    { id: 'tt_v_1000000', title: '1 Million Video Views', price: 1200, originalPrice: 1600, badge: 'Super Viral' },
  ];

  // 17. DIGITAL SUBSCRIPTIONS (12 to 16 options each)
  const netflixPackages = [
    { id: 'nf_1m_p', title: '1 Month 4K UHD Profile (1 Device)', price: 190, originalPrice: 250, badge: '4K Ultra' },
    { id: 'nf_2m_p', title: '2 Months 4K UHD Profile', price: 370, originalPrice: 480 },
    { id: 'nf_3m_p', title: '3 Months 4K UHD Profile', price: 540, originalPrice: 700, badge: 'Popular' },
    { id: 'nf_6m_p', title: '6 Months 4K UHD Profile', price: 1050, originalPrice: 1350 },
    { id: 'nf_12m_p', title: '12 Months (1 Year) 4K UHD Profile', price: 1990, originalPrice: 2600, badge: '1 Year Saver' },
    { id: 'nf_1m_priv', title: '1 Month Private Account (5 Devices)', price: 750, originalPrice: 950, badge: 'Private Mail' },
    { id: 'nf_2m_priv', title: '2 Months Private Account (5 Devices)', price: 1450, originalPrice: 1850 },
    { id: 'nf_3m_priv', title: '3 Months Private Account (5 Devices)', price: 2150, originalPrice: 2750 },
    { id: 'nf_6m_priv', title: '6 Months Private Account (5 Devices)', price: 4200, originalPrice: 5400 },
    { id: 'nf_12m_priv', title: '12 Months Private Account (5 Devices)', price: 7990, originalPrice: 9900, badge: 'Full Access' },
    { id: 'nf_tv_1m', title: 'Smart TV UHD Dedicated Profile 1 Month', price: 250, originalPrice: 320 },
    { id: 'nf_tv_3m', title: 'Smart TV UHD Dedicated Profile 3 Months', price: 690, originalPrice: 880 },
  ];

  const crunchyrollPackages = [
    { id: 'cr_1m_f', title: '1 Month Fan Account', price: 90, originalPrice: 120 },
    { id: 'cr_1m_m', title: '1 Month Mega Fan (4 Devices + Offline)', price: 120, originalPrice: 160, badge: 'No Ads' },
    { id: 'cr_2m_m', title: '2 Months Mega Fan Account', price: 230, originalPrice: 300 },
    { id: 'cr_3m_m', title: '3 Months Mega Fan Account', price: 330, originalPrice: 440, badge: 'Popular' },
    { id: 'cr_6m_m', title: '6 Months Mega Fan Account', price: 590, originalPrice: 780 },
    { id: 'cr_12m_m', title: '1 Year Mega Fan Account', price: 950, originalPrice: 1300, badge: '1 Year VIP' },
    { id: 'cr_1m_priv', title: '1 Month Private Mail Mega Fan', price: 280, originalPrice: 350 },
    { id: 'cr_3m_priv', title: '3 Months Private Mail Mega Fan', price: 780, originalPrice: 980 },
    { id: 'cr_12m_priv', title: '1 Year Private Mail Full Account', price: 2200, originalPrice: 2800, badge: 'Whale' },
    { id: 'cr_lifetime', title: 'Crunchyroll Premium Lifetime Access', price: 3200, originalPrice: 4500, badge: 'Lifetime' },
  ];

  const ytPremiumPackages = [
    { id: 'yt_1m_inv', title: '1 Month Personal Mail Family Invite', price: 80, originalPrice: 100 },
    { id: 'yt_2m_inv', title: '2 Months Personal Mail Family Invite', price: 150, originalPrice: 190 },
    { id: 'yt_3m_inv', title: '3 Months Personal Mail Family Invite', price: 220, originalPrice: 280, badge: 'Popular' },
    { id: 'yt_6m_inv', title: '6 Months Personal Mail Family Invite', price: 420, originalPrice: 550 },
    { id: 'yt_12m_inv', title: '1 Year Personal Mail Family Invite', price: 790, originalPrice: 990, badge: 'Best Value' },
    { id: 'yt_1m_indiv', title: '1 Month Individual Dedicated Account', price: 130, originalPrice: 170 },
    { id: 'yt_3m_indiv', title: '3 Months Individual Dedicated Account', price: 360, originalPrice: 460 },
    { id: 'yt_6m_indiv', title: '6 Months Individual Dedicated Account', price: 680, originalPrice: 870 },
    { id: 'yt_12m_indiv', title: '1 Year Individual Dedicated Account', price: 1250, originalPrice: 1600, badge: 'Individual' },
    { id: 'yt_1m_fam', title: '1 Month Family Head Owner Account (5 Members)', price: 490, originalPrice: 650 },
    { id: 'yt_3m_fam', title: '3 Months Family Head Owner Account', price: 1350, originalPrice: 1750 },
    { id: 'yt_12m_fam', title: '1 Year Family Head Owner Account', price: 4500, originalPrice: 5800, badge: 'Family Head' },
  ];

  const spotifyPackages = [
    { id: 'sp_1m_inv', title: '1 Month Premium Family Invite', price: 90, originalPrice: 120 },
    { id: 'sp_2m_inv', title: '2 Months Premium Family Invite', price: 170, originalPrice: 220 },
    { id: 'sp_3m_inv', title: '3 Months Premium Family Invite', price: 240, originalPrice: 320, badge: 'Popular' },
    { id: 'sp_6m_inv', title: '6 Months Premium Family Invite', price: 460, originalPrice: 600 },
    { id: 'sp_12m_inv', title: '1 Year Premium Family Invite', price: 850, originalPrice: 1100, badge: '12 Months' },
    { id: 'sp_1m_indiv', title: '1 Month Individual Dedicated Account', price: 140, originalPrice: 180 },
    { id: 'sp_3m_indiv', title: '3 Months Individual Dedicated Account', price: 390, originalPrice: 490 },
    { id: 'sp_6m_indiv', title: '6 Months Individual Dedicated Account', price: 740, originalPrice: 950 },
    { id: 'sp_12m_indiv', title: '1 Year Individual Dedicated Account', price: 1390, originalPrice: 1800, badge: 'Dedicated' },
    { id: 'sp_duo_1m', title: '1 Month Spotify Duo (2 Accounts)', price: 220, originalPrice: 290 },
    { id: 'sp_fam_1m', title: '1 Month Spotify Family (6 Accounts)', price: 380, originalPrice: 490 },
    { id: 'sp_life', title: 'Spotify Premium Lifetime Mod Android/PC', price: 299, originalPrice: 450, badge: 'Lifetime' },
  ];

  const canvaPackages = [
    { id: 'canva_1m', title: 'Canva Pro 1 Month Team Invite', price: 29, originalPrice: 50 },
    { id: 'canva_3m', title: 'Canva Pro 3 Months Team Invite', price: 59, originalPrice: 90 },
    { id: 'canva_6m', title: 'Canva Pro 6 Months Team Invite', price: 79, originalPrice: 120 },
    { id: 'canva_1y', title: 'Canva Pro 1 Year Team Invite', price: 99, originalPrice: 150, badge: 'Hot' },
    { id: 'canva_2y', title: 'Canva Pro 2 Years Team Invite', price: 169, originalPrice: 250 },
    { id: 'canva_life', title: 'Canva Pro Lifetime Access', price: 199, originalPrice: 350, badge: 'Lifetime' },
    { id: 'canva_brand_1y', title: 'Canva Pro Brand Kit + Team 1 Year', price: 249, originalPrice: 390 },
    { id: 'canva_edu_life', title: 'Canva Pro Education Lifetime Single', price: 149, originalPrice: 280 },
    { id: 'canva_admin_team', title: 'Canva Pro Admin Access (Invite 100 Members)', price: 790, originalPrice: 1200, badge: 'Admin Role' },
    { id: 'canva_bulk_pack', title: 'Canva Pro 10 Email Bulk Invite Pack', price: 650, originalPrice: 990 },
  ];

  const telegramPackages = [
    { id: 'tg_1m', title: 'Telegram Premium 1 Month Gift', price: 280, originalPrice: 350 },
    { id: 'tg_3m', title: 'Telegram Premium 3 Months Gift', price: 750, originalPrice: 900 },
    { id: 'tg_6m', title: 'Telegram Premium 6 Months Gift', price: 1350, originalPrice: 1650, badge: 'Popular' },
    { id: 'tg_12m', title: 'Telegram Premium 12 Months (1 Year)', price: 2400, originalPrice: 3000, badge: '1 Year VIP' },
    { id: 'tg_24m', title: 'Telegram Premium 24 Months (2 Years)', price: 4400, originalPrice: 5600, badge: '2 Year Saver' },
    { id: 'tg_boost_1', title: 'Telegram Channel 1x Level Boost', price: 90, originalPrice: 120 },
    { id: 'tg_boost_5', title: 'Telegram Channel 5x Level Boosts', price: 420, originalPrice: 550 },
    { id: 'tg_boost_10', title: 'Telegram Channel 10x Level Boosts', price: 790, originalPrice: 1050, badge: 'Channel Boost' },
    { id: 'tg_mem_1k', title: 'Telegram 1,000 Group/Channel Members', price: 140, originalPrice: 190 },
    { id: 'tg_mem_5k', title: 'Telegram 5,000 Group/Channel Members', price: 650, originalPrice: 850, badge: 'Group Growth' },
    { id: 'tg_mem_10k', title: 'Telegram 10,000 Group/Channel Members', price: 1250, originalPrice: 1600, badge: 'VIP Channel' },
    { id: 'tg_mem_50k', title: 'Telegram 50,000 Group/Channel Members', price: 5800, originalPrice: 7500 },
  ];

  // 18. FACEBOOK LIVE PACKAGES (16 options)
  const fbLivePackages = [
    { id: 'fb_l_100_30m', title: '100 FB Live Viewers (30 Mins)', price: 40, originalPrice: 60, badge: 'Live 30M' },
    { id: 'fb_l_250_30m', title: '250 FB Live Viewers (30 Mins)', price: 80, originalPrice: 110 },
    { id: 'fb_l_500_30m', title: '500 FB Live Viewers (30 Mins)', price: 150, originalPrice: 200, badge: 'Popular' },
    { id: 'fb_l_1000_30m', title: '1,000 FB Live Viewers (30 Mins)', price: 280, originalPrice: 380, badge: 'Viral Live' },
    { id: 'fb_l_2000_30m', title: '2,000 FB Live Viewers (30 Mins)', price: 520, originalPrice: 680 },
    { id: 'fb_l_5000_30m', title: '5,000 FB Live Viewers (30 Mins)', price: 1200, originalPrice: 1600, badge: 'Mega Live' },
    { id: 'fb_l_100_60m', title: '100 FB Live Viewers (60 Mins / 1 Hr)', price: 75, originalPrice: 100 },
    { id: 'fb_l_250_60m', title: '250 FB Live Viewers (60 Mins / 1 Hr)', price: 150, originalPrice: 210 },
    { id: 'fb_l_500_60m', title: '500 FB Live Viewers (60 Mins / 1 Hr)', price: 280, originalPrice: 380, badge: 'Best Seller' },
    { id: 'fb_l_1000_60m', title: '1,000 FB Live Viewers (60 Mins / 1 Hr)', price: 520, originalPrice: 700, badge: 'Pro Streamer' },
    { id: 'fb_l_2500_60m', title: '2,500 FB Live Viewers (60 Mins / 1 Hr)', price: 1200, originalPrice: 1600 },
    { id: 'fb_l_5000_60m', title: '5,000 FB Live Viewers (60 Mins / 1 Hr)', price: 2200, originalPrice: 2900, badge: 'Superstar' },
    { id: 'fb_l_100_120m', title: '100 FB Live Viewers (120 Mins / 2 Hr)', price: 140, originalPrice: 190 },
    { id: 'fb_l_500_120m', title: '500 FB Live Viewers (120 Mins / 2 Hr)', price: 520, originalPrice: 700 },
    { id: 'fb_l_1000_120m', title: '1,000 FB Live Viewers (120 Mins / 2 Hr)', price: 980, originalPrice: 1300, badge: 'Marathon' },
    { id: 'fb_l_comments_500', title: '500 Live Stream Custom Comments', price: 110, originalPrice: 150, badge: 'Live Comments' },
  ];

  // Helper Card Component matching modern clean box layout
  const renderPapaCard = (item: TopupBoxItem) => (
    <div
      key={item.id}
      onClick={() => onOpenBoxPurchase(item)}
      className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-[#111827] border-slate-200/90 dark:border-slate-800"
    >
      {/* Top Image Banner with Delivery Badges (Zero extra text watermark) */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-900">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Top left badge: 5 SEC DELIVERY */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#0066FF] text-white shadow-md">
          5 SEC DELIVERY
        </div>
        {/* Top right space is kept completely clean with NO popup/watermark text */}
      </div>

      {/* Bottom Title Card (White box underneath) */}
      <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827] flex-1 flex flex-col justify-center items-center">
        <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-[#0066FF] transition-colors line-clamp-1">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* =========================================================================
          SECTION 1: Mystery Box ⚡ (Matching Screenshot 1 & 3)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-['Orbitron'] tracking-wide text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>Mystery Box</span>
            <span className="text-amber-500">⚡</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {mysteryBoxes.slice(0, 4).map((box) => (
            <div
              key={box.id}
              className="group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-[#111827] border-slate-200/90 dark:border-slate-800"
            >
              {/* Top Image Banner with 3D Chest & Shimmer */}
              <div
                onClick={() =>
                  onPreviewMysteryBox
                    ? onPreviewMysteryBox(box, 'view')
                    : onOpenBoxPurchase({
                        id: box.id,
                        category: 'mystery_box',
                        title: box.name,
                        image: box.image,
                        packages: mysteryBoxPackages,
                      })
                }
                className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-gradient-to-b from-amber-950/30 via-slate-900 to-[#0e1424] flex items-center justify-center p-3 cursor-pointer"
                title="মিষ্টি বক্সের ভেতরের পুরষ্কার দেখতে ক্লিক করুন"
              >
                {/* Radial golden glow */}
                <div className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-400/35 transition-all" />

                <img
                  src={box.image}
                  alt={box.name}
                  className="relative z-10 w-full h-full max-h-28 sm:max-h-36 object-contain filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.35)] group-hover:scale-108 transition-transform duration-500"
                />

                {/* Top left badge: 5 SEC DELIVERY */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-[#0066FF] text-white shadow-md z-20">
                  5 SEC DELIVERY
                </div>

                {/* Top right badge: 100% Guaranteed */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-amber-500 text-black shadow-md z-20">
                  {box.badge || '১০০% ড্রপ'}
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827] flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    {box.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1 text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px]">
                    <span className="text-emerald-500">✓</span>
                    <span>{box.guaranteedRewards?.length || 4} টি নিশ্চিত আইটেম</span>
                  </div>
                  <div className="mt-1 font-['Orbitron'] font-black text-sm sm:text-base text-amber-500 dark:text-amber-400">
                    ৳{box.price}
                  </div>
                </div>

                {/* Interactive Action Buttons: View Rewards & Open Box */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPreviewMysteryBox) {
                        onPreviewMysteryBox(box, 'view');
                      } else {
                        onOpenBoxPurchase({
                          id: box.id,
                          category: 'mystery_box',
                          title: box.name,
                          image: box.image,
                          packages: mysteryBoxPackages,
                        });
                      }
                    }}
                    className="py-1.5 px-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-cyan-300 text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="ভেতরের সকল পুরষ্কার ও ড্রপ চান্স দেখুন"
                  >
                    <span>👁️</span>
                    <span>পুরষ্কার</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPreviewMysteryBox) {
                        onPreviewMysteryBox(box, 'open');
                      } else {
                        onOpenBoxPurchase({
                          id: box.id,
                          category: 'mystery_box',
                          title: box.name,
                          image: box.image,
                          packages: mysteryBoxPackages,
                        });
                      }
                    }}
                    className="py-1.5 px-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                    title="৩ডি অ্যানিমেশনসহ বক্স খুলুন"
                  >
                    <span>🎁</span>
                    <span>খুলুন</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: BONUS OFFER (Matching Screenshot 1)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-['Orbitron'] tracking-wider text-slate-900 dark:text-white">
            BONUS OFFER
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {renderPapaCard({
            id: 'bonus_friday',
            category: 'friday_offer',
            title: 'Friday Double Diamond',
            subtitle: 'এআই ফ্রাইডে ডাবল ডায়মন্ড (১৬টি প্যাকেজ)',
            image: '/assets/branding/friday_double_diamond.svg',
            packages: bonusOfferPackages,
          })}

          {renderPapaCard({
            id: 'bonus_welcome',
            category: 'friday_offer',
            title: 'First TopUp Bonus (৫০০০💎)',
            subtitle: 'অফিশিয়াল ৫০০০💎 ডায়মন্ড বান্ডেল',
            image: '/assets/branding/first_topup_5000diamonds.svg',
            packages: firstTopupPackages,
          })}

          {renderPapaCard({
            id: 'bonus_vip_mega',
            category: 'friday_offer',
            title: 'VIP Welcome Spin Wheel (৮০০০💎)',
            subtitle: 'ইন্টারেক্টিভ চাকা ঘোরানো অফার',
            image: '/assets/branding/vip_spin_wheel_8000.svg',
            packages: spinWheelPackages,
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: GAMES TOPUP (Matching Screenshot 2)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-['Orbitron'] tracking-wider text-slate-900 dark:text-white">
            GAMES TOPUP
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {/* Card 1: FF LIKE */}
          {renderPapaCard({
            id: 'box_ff_like',
            category: 'diamond',
            title: 'FF LIKE',
            subtitle: 'ফ্রি ফায়ার লাইক টপআপ (১৮টি প্যাকেজ)',
            image: '/assets/banners/card_like.png',
            packages: ffLikePackages,
          })}

          {/* Card 2: Uid TopUp (BD) - ডায়মন্ডের ছবি/ব্যানার */}
          {renderPapaCard({
            id: 'box_ff_uid_topup',
            category: 'diamond',
            title: 'Uid TopUp (BD)',
            subtitle: '২৫💎 (১৮ ৳) থেকে ১২,০০০💎 ডায়মন্ড',
            image: '/assets/branding/ff_diamond_banner.svg',
            packages: ffDiamondPackages,
          })}

          {/* Card 3: Weekly Lite (BD Server) - উইকলি লাইটের নির্ধারিত ব্যানার */}
          {renderPapaCard({
            id: 'box_weekly_lite',
            category: 'membership',
            title: 'Weekly Lite (BD Server)',
            subtitle: 'উইকলি লাইট পাস (১৬টি প্যাকেজ)',
            image: '/assets/branding/weekly_lite_banner.svg',
            packages: weeklyLitePackages,
          })}

          {/* Card 4: Weekly/Monthly Offer - উইকলি/মান্থলি অফারের অফিশিয়াল ব্যানার */}
          {renderPapaCard({
            id: 'box_weekly_monthly_offer',
            category: 'membership',
            title: 'Weekly/Monthly Offer',
            subtitle: 'উইকলি ১৪০ ৳ / মান্থলি ৭৬০ ৳ (২২টি কম্বো)',
            image: '/assets/branding/weekly_monthly_banner.svg',
            packages: membershipPackages,
          })}

          {/* Card 5: New Level Up Pass - লেভেল আপ পাসের ব্যানার */}
          {renderPapaCard({
            id: 'box_level_up_pass',
            category: 'level_up',
            title: 'New Level Up Pass',
            subtitle: '৮০২💎 লেভেল পাস (১৫টি প্যাকেজ)',
            image: '/assets/branding/level_up_pass_banner.svg',
            packages: levelUpPackages,
          })}

          {/* Card 6: Indonesia Server (UID) - ইন্দোনেশিয়ান সার্ভার ডায়মন্ডের ব্যানার */}
          {renderPapaCard({
            id: 'box_indo_server',
            category: 'voucher',
            title: 'Indonesia Server (UID)',
            subtitle: 'ইন্দো সার্ভার ইউআইডি (১৭টি প্যাকেজ)',
            image: '/assets/branding/indonesia_server.svg',
            packages: indoPackages,
          })}

          {/* Card 7: Unipin Voucher (BD) - ইউনিপিন ভাউচার ডায়মন্ডের ব্যানার */}
          {renderPapaCard({
            id: 'box_unipin_voucher',
            category: 'voucher',
            title: 'Unipin Voucher (BD)',
            subtitle: 'ইউনিপিন গিফট কোড (১৬টি প্যাকেজ)',
            image: '/assets/branding/unipin_voucher.svg',
            packages: unipinPackages,
          })}

          {/* Card 8: PUBG Mobile UC - পাবজি ইউসি (PUBG UC) লোগো */}
          {renderPapaCard({
            id: 'box_pubg_uc',
            category: 'diamond',
            title: 'PUBG Mobile UC',
            subtitle: '৩০ থেকে ১৬,২০০ ইউসি (১৬টি প্যাকেজ)',
            image: '/assets/branding/pubg_uc.svg',
            packages: pubgPackages,
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ফেসবুক ও সোশ্যাল সার্ভিস
      ========================================================================= */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-['Orbitron'] tracking-wide text-slate-900 dark:text-white">
            ফেসবুক ও সোশ্যাল সার্ভিস
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {/* 1. ফেসবুক লাইভ (Facebook Live) - ফেসবুকের লোগো/ছবি */}
          {renderPapaCard({
            id: 'box_fb_live',
            category: 'social_fb',
            title: 'Facebook Live Stream',
            subtitle: 'লাইভ ভিউয়ার্স ও কমেন্টস (১৬টি প্যাকেজ)',
            image: '/assets/branding/facebook_live.svg',
            packages: fbLivePackages,
          })}

          {/* 2. ফেসবুক ফলোয়ার (Facebook Followers) - ফেসবুকের অফিশিয়াল লোগো */}
          {renderPapaCard({
            id: 'box_fb_followers',
            category: 'social_fb',
            title: 'Facebook Followers',
            subtitle: '১০০ থেকে ১০ লাখ ফলোয়ার (১৮টি অপশন)',
            image: '/assets/branding/facebook_followers.svg',
            packages: fbFollowerPackages,
          })}

          {/* 3. ফেসবুক রিলস বা পোস্ট (Facebook Reels/Post) - ফেসবুকের অরিজিনাল লোগো */}
          {renderPapaCard({
            id: 'box_fb_reacts',
            category: 'social_fb',
            title: 'Facebook Reels & Post Reacts',
            subtitle: '১০০ থেকে ৫০,০০০ রিয়েক্ট (১৬টি অপশন)',
            image: '/assets/branding/facebook_reels.svg',
            packages: fbReactPackages,
          })}

          {/* 4. ফেসবুক ভিউয়ার্স টাইম (Facebook Watch Time/Viewers) - ফেসবুকের অরিজিনাল লোগো */}
          {renderPapaCard({
            id: 'box_fb_views',
            category: 'social_fb',
            title: 'FB Watch Time & Views',
            subtitle: 'ভিউ ও মনিটাইজেশন ওয়াচটাইম (১৬টি অপশন)',
            image: '/assets/branding/facebook_watchtime.svg',
            packages: fbViewsPackages,
          })}

          {/* 5. Instagram Followers & Likes */}
          {renderPapaCard({
            id: 'box_ig_services',
            category: 'social_fb',
            title: 'Instagram Followers & Likes',
            subtitle: 'ইনস্টাগ্রাম গ্রোথ সার্ভিস (১৬টি অপশন)',
            image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80',
            packages: igPackages,
          })}

          {/* 6. YouTube Subs & Watchtime */}
          {renderPapaCard({
            id: 'box_yt_services',
            category: 'social_fb',
            title: 'YouTube Subs & Watchtime',
            subtitle: 'ইউটিউব মনিটাইজেশন প্যাকেজ (১৬টি অপশন)',
            image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
            packages: ytSocialPackages,
          })}

          {/* 7. TikTok Followers & Views */}
          {renderPapaCard({
            id: 'box_tiktok_services',
            category: 'social_fb',
            title: 'TikTok Followers & Views',
            subtitle: 'টিকটক লাইভ আনলক ও ভাইরাল ভিউজ (১৫টি অপশন)',
            image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=600&q=80',
            packages: tiktokPackages,
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: বিনোদনমূলক সাবস্ক্রিপশন (Matching Screenshot 2)
      ========================================================================= */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black font-['Orbitron'] tracking-wide text-slate-900 dark:text-white">
            বিনোদনমূলক সাবস্ক্রিপশন
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* NETFLIX */}
          {renderPapaCard({
            id: 'sub_netflix',
            category: 'entertainment',
            title: 'NETFLIX',
            subtitle: '4K UHD প্রোফাইল',
            image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80',
            packages: netflixPackages,
          })}

          {/* crunchyroll */}
          {renderPapaCard({
            id: 'sub_crunchyroll',
            category: 'entertainment',
            title: 'crunchyroll',
            subtitle: 'অ্যানিমে মেগা ফ্যান',
            image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
            packages: crunchyrollPackages,
          })}

          {/* YouTube Premium */}
          {renderPapaCard({
            id: 'sub_youtube',
            category: 'entertainment',
            title: 'YouTube Premium',
            subtitle: 'অ্যাড-ফ্রি ও ব্যাকগ্রাউন্ড প্লে',
            image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
            packages: ytPremiumPackages,
          })}

          {/* Spotify Premium */}
          {renderPapaCard({
            id: 'sub_spotify',
            category: 'entertainment',
            title: 'Spotify Premium',
            subtitle: 'হাই-কোয়ালিটি গান',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
            packages: spotifyPackages,
          })}

          {/* Canva Pro */}
          {renderPapaCard({
            id: 'sub_canva',
            category: 'entertainment',
            title: 'Canva Pro',
            subtitle: 'প্রফেশনাল ডিজাইন টুলস',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            packages: canvaPackages,
          })}

          {/* Telegram Premium */}
          {renderPapaCard({
            id: 'sub_telegram',
            category: 'entertainment',
            title: 'Telegram Premium',
            subtitle: '৪জিবি আপলোড ও স্পেশাল ব্যাজ',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
            packages: telegramPackages,
          })}
        </div>
      </section>
    </div>
  );
};
