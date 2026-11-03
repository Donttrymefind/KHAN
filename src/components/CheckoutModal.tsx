import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Upload,
  Send,
  Zap,
  Phone,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Wallet,
  CheckCircle2,
  HelpCircle,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, MysteryBox, PaymentMethodConfig, Order, PaymentMethodType } from '../types';

interface CheckoutModalProps {
  item: Product | MysteryBox | null;
  paymentConfigs: PaymentMethodConfig[];
  customerUser: any;
  customerWalletBalance?: number;
  initialGameUid?: string;
  isLightMode?: boolean;
  onClose: () => void;
  onSubmitOrder: (orderData: {
    productTitle: string;
    productId: string;
    productCategory: string;
    amount: number;
    gameUid?: string;
    socialLink?: string;
    accountType?: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    paymentMethod: PaymentMethodType;
    paymentNumber: string;
    transactionId: string;
    paymentScreenshot?: string;
  }) => Promise<Order>;
  onTrackOrder: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  item,
  paymentConfigs,
  customerUser,
  customerWalletBalance = 0,
  initialGameUid = '',
  isLightMode = false,
  onClose,
  onSubmitOrder,
  onTrackOrder,
}) => {
  if (!item) return null;

  const isMysteryBox = 'guaranteedRewards' in item;
  const isSocialService = !isMysteryBox && (item.category === 'social_fb' || item.category === 'social_insta');
  const isSubscription = !isMysteryBox && item.category === 'entertainment';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('bKash');
  const [gameUid, setGameUid] = useState(isSocialService ? '' : initialGameUid);
  const [socialLink, setSocialLink] = useState(isSocialService ? initialGameUid : '');
  const [subscriptionEmail, setSubscriptionEmail] = useState(customerUser?.email || '');
  const [customerName, setCustomerName] = useState(customerUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState(customerUser?.email || '');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const currentPayment =
    paymentConfigs.find((p) => p.method === selectedMethod) || paymentConfigs[0];
  const paymentNumber = currentPayment?.number || '01575630127';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Screenshot file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation Step 2: Account Info
    if (!isSocialService && !isSubscription && !gameUid.trim()) {
      setErrorMessage('Please enter your Free Fire Player ID (UID)');
      return;
    }

    if (isSocialService && !socialLink.trim()) {
      setErrorMessage('Please enter your Facebook page/post or Instagram link');
      return;
    }

    if (isSubscription && !subscriptionEmail.trim()) {
      setErrorMessage('Please enter your email to receive the subscription invite/credentials');
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage('Please enter a valid 11-digit mobile number for order delivery notifications');
      return;
    }

    // Validation Step 3: Payment
    if (selectedMethod === 'Wallet') {
      if (customerWalletBalance < item.price) {
        setErrorMessage(`আপনার ওয়ালেট ব্যালেন্স (৳${customerWalletBalance}) পর্যাপ্ত নয়। প্যাকেজের মূল্য ৳${item.price}। অন্য পেমেন্ট মেথড বেছে নিন।`);
        return;
      }
    } else {
      if (!transactionId.trim() || transactionId.length < 4) {
        setErrorMessage('Please enter the TrxID received from your payment SMS');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const order = await onSubmitOrder({
        productTitle: item.name,
        productId: item.id,
        productCategory: isMysteryBox ? 'mystery_box' : item.category,
        amount: item.price,
        gameUid: !isSocialService && !isSubscription ? gameUid.trim() : undefined,
        socialLink: isSocialService ? socialLink.trim() : undefined,
        accountType: isSubscription ? 'Subscription Email' : isSocialService ? 'Social Media Link' : 'In-Game UID',
        customerName: customerName.trim() || 'Valued Gamer',
        customerPhone: customerPhone.trim(),
        customerEmail: isSubscription ? subscriptionEmail.trim() : customerEmail.trim(),
        paymentMethod: selectedMethod,
        paymentNumber: selectedMethod === 'Wallet' ? 'KHAN Digital Wallet' : paymentNumber,
        transactionId: selectedMethod === 'Wallet' ? `WAL-${Date.now().toString().slice(-6)}` : transactionId.trim().toUpperCase(),
        paymentScreenshot: screenshotBase64 || undefined,
      });

      setCompletedOrder(order);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit order. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className={`relative w-full max-w-xl rounded-3xl p-5 sm:p-7 shadow-2xl transition-all my-8 border ${
          isLightMode
            ? 'bg-white text-slate-900 border-blue-200'
            : 'bg-[#0e1424] text-white border-blue-500/40 shadow-blue-950/80'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Success View */
          <div className="text-center py-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8 text-emerald-500 stroke-[3]" />
            </div>

            <div className="inline-block px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
              Order Received Successfully
            </div>

            <h3 className="font-['Orbitron'] font-black text-2xl mb-1">
              Thank You for Your Order!
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
              আপনার পেমেন্ট ভেরিফিকেশন সফল হয়েছে। সাধারণত <strong>৫ থেকে ১৫ মিনিটের</strong> মধ্যে ডায়মন্ড সরাসরি আপনার Free Fire UID তে পাঠিয়ে দেওয়া হবে।
            </p>

            {/* Order Card Summary */}
            <div
              className={`p-4 rounded-2xl border max-w-md mx-auto text-left mb-6 space-y-2 text-xs sm:text-sm ${
                isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-[#13192b] border-slate-700/80'
              }`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Order ID:</span>
                <span className="font-['Orbitron'] font-bold text-blue-600 dark:text-cyan-400 text-base">
                  {completedOrder.orderNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">প্যাকেজ:</span>
                <span className="font-semibold text-right">{completedOrder.productTitle}</span>
              </div>

              {completedOrder.gameUid && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Player UID:</span>
                  <span className="font-mono font-bold text-amber-500">
                    {completedOrder.gameUid}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">পেমেন্ট মেথড:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {completedOrder.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">পরিশোধিত টাকা:</span>
                <span className="font-['Orbitron'] font-black text-amber-500 text-base">
                  ৳{completedOrder.amount}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onTrackOrder(completedOrder.orderNumber);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Live Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/8801575630127?text=${encodeURIComponent(
                  `Hello KHAN TOP UP, I placed order ${completedOrder.orderNumber} for ${completedOrder.productTitle} (${completedOrder.amount} TK). Please confirm!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Helpline</span>
              </a>
            </div>
          </div>
        ) : (
          /* Checkout Form View with 4 Clear Steps */
          <div>
            {/* Modal Title */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Orbitron'] font-black text-lg sm:text-xl">
                  Product Purchase &amp; Checkout
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ইনস্ট্যান্ট অটো-টপআপ ও সিকিউর পেমেন্ট সিস্টেম
                </p>
              </div>
            </div>

            {/* STEP 1: Select Recharge Amount / Package Summary */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 mb-5 ${
                isLightMode
                  ? 'bg-blue-50/70 border-blue-200'
                  : 'bg-[#13192b] border-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                      Step 1: প্যাকেজ
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-['Orbitron'] font-bold text-sm sm:text-base mt-0.5">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isMysteryBox
                      ? `${item.guaranteedRewards.length} Guaranteed Rewards Included`
                      : isSubscription
                      ? 'Entertainment Subscription'
                      : 'Free Fire Direct UID Recharge'}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                  Amount
                </span>
                <span className="font-['Orbitron'] font-black text-xl sm:text-2xl text-amber-500">
                  ৳{item.price}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 2: Account Info (Player UID / Social Link / Email) */}
              <div>
                <label className="block text-xs font-bold text-blue-600 dark:text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>
                    Step 2: Account Info (
                    {isSubscription
                      ? 'Subscription Email'
                      : isSocialService
                      ? 'Post / Profile Link'
                      : 'Free Fire Player UID'}
                    ) *
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>১০০% নিরাপদ</span>
                  </span>
                </label>

                {!isSocialService && !isSubscription ? (
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="আপনার Free Fire Player ID (UID) দিন (e.g. 2948190248)"
                      value={gameUid}
                      onChange={(e) => setGameUid(e.target.value.replace(/\D/g, ''))}
                      className={`w-full rounded-xl px-4 py-2.5 text-sm font-mono font-bold tracking-wider outline-none border transition-all ${
                        isLightMode
                          ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
                          : 'bg-[#151c30] border-slate-700 text-amber-300 focus:border-blue-400'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      UID Only (পাসওয়ার্ড লাগে না)
                    </div>
                  </div>
                ) : isSubscription ? (
                  <input
                    type="email"
                    required
                    placeholder="আপনার ব্যক্তিগত ইমেইল এড্রেস লিখুন (যেখানে ইনভাইট পাঠানো হবে)"
                    value={subscriptionEmail}
                    onChange={(e) => setSubscriptionEmail(e.target.value)}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-all ${
                      isLightMode
                        ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
                        : 'bg-[#151c30] border-slate-700 text-white focus:border-blue-400'
                    }`}
                  />
                ) : (
                  <input
                    type="url"
                    required
                    placeholder="https://facebook.com/... or https://instagram.com/..."
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-all ${
                      isLightMode
                        ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
                        : 'bg-[#151c30] border-slate-700 text-white focus:border-blue-400'
                    }`}
                  />
                )}
              </div>

              {/* STEP 3: Payment Option (Wallet Pay vs bKash / Nagad / Rocket / Upay) */}
              <div>
                <label className="block text-xs font-bold text-blue-600 dark:text-cyan-300 uppercase tracking-wider mb-2">
                  Step 3: Payment Option (Wallet Pay or Instant Auto Pay) *
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: KHAN Wallet Pay */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Wallet')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'Wallet'
                        ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30'
                        : isLightMode
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-[#13192b] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs">Wallet Pay</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                          ব্যালেন্স: ৳{customerWalletBalance}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: bKash */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bKash')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'bKash'
                        ? 'bg-pink-500/15 border-pink-500 ring-2 ring-pink-500/30'
                        : isLightMode
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-[#13192b] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white font-black text-xs flex items-center justify-center shrink-0">
                        bK
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs">bKash</div>
                        <div className="text-[10px] text-slate-400">Personal</div>
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Nagad */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Nagad')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'Nagad'
                        ? 'bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/30'
                        : isLightMode
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-[#13192b] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F7941D] text-white font-black text-xs flex items-center justify-center shrink-0">
                        নগদ
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs">Nagad</div>
                        <div className="text-[10px] text-slate-400">Personal</div>
                      </div>
                    </div>
                  </button>

                  {/* Option 4: Rocket */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Rocket')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'Rocket'
                        ? 'bg-purple-500/15 border-purple-500 ring-2 ring-purple-500/30'
                        : isLightMode
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-[#13192b] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#8C3494] text-white font-black text-xs flex items-center justify-center shrink-0">
                        🚀
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs">Rocket</div>
                        <div className="text-[10px] text-slate-400">Personal</div>
                      </div>
                    </div>
                  </button>

                  {/* Option 5: Upay */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Upay')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'Upay'
                        ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30'
                        : isLightMode
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-[#13192b] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#005CA9] text-white font-black text-xs flex items-center justify-center shrink-0">
                        UP
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs">Upay</div>
                        <div className="text-[10px] text-slate-400">Personal</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Details box based on method */}
              {selectedMethod === 'Wallet' ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>তাৎক্ষণিক ওয়ালেট পেমেন্ট</span>
                    </span>
                    <span>বর্তমান ব্যালেন্স: ৳{customerWalletBalance}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-300">
                    আপনার একাউন্ট থেকে ৳{item.price} টাকা সরাসরি কেটে নেওয়া হবে এবং কোনো TrxID দেওয়া লাগবে না। ১-ক্লিকেই অর্ডার সম্পন্ন হবে।
                  </p>
                </div>
              ) : (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                    isLightMode
                      ? 'bg-blue-50/70 border-blue-200'
                      : 'bg-[#13192b] border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Send <strong>৳{item.price}</strong> to this {selectedMethod} Number:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="font-mono text-xl font-black text-blue-600 dark:text-amber-300 tracking-wider">
                    {paymentNumber}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-300">
                    আপনার {selectedMethod} অ্যাপ বা ডায়াল করে Send Money করুন {paymentNumber} নম্বরে। টাকা পাঠানো শেষ হলে এসএমএস-এ প্রাপ্ত Transaction ID (TrxID) নিচে দিন।
                  </p>
                </div>
              )}

              {/* Customer Phone & TrxID Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Your Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none border transition-all ${
                      isLightMode
                        ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
                        : 'bg-[#151c30] border-slate-700 text-white focus:border-blue-400'
                    }`}
                  />
                </div>

                {selectedMethod !== 'Wallet' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Payment TrxID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BKA8921094"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono font-bold uppercase outline-none border transition-all ${
                        isLightMode
                          ? 'bg-slate-100 border-slate-300 text-blue-700 focus:border-blue-600 focus:bg-white'
                          : 'bg-[#151c30] border-slate-700 text-emerald-400 focus:border-emerald-400'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* STEP 4: Rules & Conditions Section (BD Server Topup) */}
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  isLightMode
                    ? 'bg-amber-50/70 border-amber-200 text-slate-800'
                    : 'bg-[#121829] border-amber-500/20 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Step 4: শর্তাবলী ও নিয়মাবলী (Rules &amp; Conditions):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  <li>শুধুমাত্র বাংলাদেশ (BD) সার্ভার প্লেয়ার আইডি (Player UID) টপআপ হবে।</li>
                  <li>ভুল Player UID দিলে ডায়মন্ড অন্য আইডিতে চলে গেলে কোনো রিফান্ড প্রযোজ্য হবে না।</li>
                  <li>পেমেন্ট সম্পন্ন করার পর প্রাপ্ত TrxID সঠিক ও নির্ভুলভাবে দিতে হবে।</li>
                  <li>সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যে ডায়মন্ড স্বয়ংক্রিয়ভাবে ইন-গেম মেইলবক্সে চলে যায়।</li>
                  <li>যেকোনো প্রয়োজনে ২৪/৭ সরাসরি হোয়াটসঅ্যাপ সাপোর্ট: <strong>01575630127</strong></li>
                </ul>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-['Orbitron'] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying &amp; Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Confirm &amp; Place Top-Up Order (৳{item.price})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
