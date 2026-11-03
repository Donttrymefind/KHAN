export type ProductCategory =
  | 'diamond'
  | 'membership'
  | 'level_up'
  | 'evo_access'
  | 'mystery_box'
  | 'friday_offer'
  | 'entertainment'
  | 'voucher'
  | 'social_fb'
  | 'social_insta'
  | 'other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  stock: number;
  isUnlimited: boolean;
  isOutOfStock: boolean;
  isActive: boolean;
  description: string;
  image: string;
  badge?: string;
  diamondCount?: number;
  bonus?: string;
  updatedAt: string;
}

export interface GuaranteedReward {
  id: string;
  name: string;
  quantity: string | number;
  icon: string;
  rarity: 'Mythic' | 'Legendary' | 'Epic' | 'Rare';
  description?: string;
}

export interface MysteryBox {
  id: string;
  name: string;
  price: number;
  image: string;
  badge: string;
  stock: number;
  isUnlimited: boolean;
  isActive: boolean;
  guaranteedRewards: GuaranteedReward[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Rejected';
export type PaymentMethodType = 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Wallet';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productTitle: string;
  productId: string;
  productCategory: string;
  amount: number;
  gameUid?: string;
  accountType?: string; // 'In-Game UID' | 'Player ID' | 'Account Link' | 'Subscription Email'
  socialLink?: string;
  paymentMethod: PaymentMethodType;
  paymentNumber: string;
  transactionId: string;
  paymentScreenshot?: string;
  status: OrderStatus;
  autoTopupStatus?: 'pending' | 'success' | 'failed' | 'manual';
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodConfig {
  id: string;
  method: PaymentMethodType;
  number: string;
  accountType: 'Personal' | 'Agent' | 'Merchant' | 'Digital Wallet';
  isEnabled: boolean;
  instructions: string;
  qrCodeUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance?: number;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'suspended';
  joinedAt: string;
  supportNotes?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  ctaText: string;
  categoryFilter?: ProductCategory;
}

export interface WebsiteSettings {
  websiteName: string;
  logoUrl: string;
  promoNotice: string;
  telegramChannelUrl?: string;
  telegramGroupUrl?: string;
  banners: BannerSlide[];
  contactPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  facebookLink: string;
  instagramLink: string;
  privacyPolicy: string;
  refundPolicy: string;
  termsAndConditions: string;
}

export interface AdminLog {
  id: string;
  action: string;
  details: string;
  adminUser: string;
  createdAt: string;
}
