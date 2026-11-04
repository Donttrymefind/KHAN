import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Gamepad2,
  Phone,
} from 'lucide-react';
import { Order } from '../types';

interface MyOrderModalProps {
  orders: Order[];
  initialSearchQuery?: string;
  customerUser?: any;
  isLightMode?: boolean;
  onClose: () => void;
  onGoToShop?: () => void;
}

export const MyOrderModal: React.FC<MyOrderModalProps> = ({
  orders,
  initialSearchQuery = '',
  customerUser,
  isLightMode = true,
  onClose,
  onGoToShop,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'my_recent' | 'live'>(
    initialSearchQuery ? 'search' : 'my_recent'
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searched, setSearched] = useState(Boolean(initialSearchQuery));
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Load recently created orders for this browser
  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ktu_my_order_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const copyText = (text: string, type: 'order' | 'uid') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(text);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } else {
      setCopiedUid(text);
      setTimeout(() => setCopiedUid(null), 2000);
    }
  };

  // Matched orders by search query
  const matchedOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      (o.gameUid && o.gameUid.toLowerCase().includes(q)) ||
      o.customerPhone.includes(q) ||
      o.transactionId.toLowerCase().includes(q) ||
      (o.id && o.id.toLowerCase().includes(q))
    );
  });

  // Recent orders belonging to this user / browser device
  const myRecentOrders = orders.filter((o) => {
    if (myOrderIds.includes(o.orderNumber) || myOrderIds.includes(o.id)) return true;
    if (customerUser && o.customerId === customerUser.uid) return true;
    if (customerUser?.email && o.customerEmail === customerUser.email) return true;
    return false;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
      setSearched(true);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/50 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          🟢 Completed (সফলভাবে সম্পন্ন)
        </span>
      );
    }
    if (status === 'Processing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-600/50 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          🟡 Processing (প্রসেসিংয়ে আছে)
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-950/70 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600/50 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          🟡 Pending (অপেক্ষমান)
        </span>
      );
    }
    // Rejected / Cancelled
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-600/50 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
        🔴 Cancelled (বাতিল)
      </span>
    );
  };

  const renderOrderCard = (order: Order) => {
    const isCompleted = order.status === 'Completed';
    const isCancelled = order.status === 'Rejected';
    const isPendingOrProcessing = order.status === 'Pending' || order.status === 'Processing';

    const orderTime = new Date(order.createdAt).toLocaleString('bn-BD', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const completionTime = order.updatedAt
      ? new Date(order.updatedAt).toLocaleString('bn-BD', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : null;

    return (
      <div
        key={order.id}
        className={`rounded-2xl border transition-all p-4 sm:p-5 space-y-4 shadow-sm ${
          isLightMode
            ? 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-md'
            : 'bg-[#121929] border-slate-800 hover:border-cyan-500/40 hover:shadow-cyan-950/20'
        }`}
      >
        {/* Top Header: Order ID & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm sm:text-base text-blue-600 dark:text-cyan-400">
              {order.orderNumber}
            </span>
            <button
              onClick={() => copyText(order.orderNumber, 'order')}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="অর্ডার আইডি কপি করুন"
            >
              {copiedOrderId === order.orderNumber ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <span className="text-[11px] text-slate-400">({orderTime})</span>
          </div>

          <div>{getStatusBadge(order.status)}</div>
        </div>

        {/* Status Callout Banner */}
        {isCompleted && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                আপনার ডায়মন্ড বা প্যাকেজ সফলভাবে গেম একাউন্টে পাঠিয়ে দেওয়া হয়েছে।
                {completionTime && ` (সম্পন্ন: ${completionTime})`}
              </p>
            </div>
          </div>
        )}

        {isPendingOrProcessing && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-spin-slow" />
            <div className="flex-1">
              <span className="font-bold block">
                {order.status === 'Processing'
                  ? 'অর্ডার প্রসেসিংয়ে আছে (Processing)'
                  : 'পেমেন্ট ভেরিফিকেশন চলছে (Pending)'}
              </span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                এডমিন প্যানেলে পেমেন্ট যাচাই করা হচ্ছে। সাধারণত ২ থেকে ৫ মিনিটের মধ্যে ডায়মন্ড স্বয়ংক্রিয়ভাবে প্লেয়ার ইউআইডিতে যোগ হবে।
              </p>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-2.5 text-xs text-rose-900 dark:text-rose-200">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-rose-700 dark:text-rose-300 block">
                  অর্ডার বাতিল করা হয়েছে (Cancelled)
                </span>
                <p className="text-[11px] text-rose-600 dark:text-rose-300 mt-0.5 leading-relaxed">
                  {order.adminNote ||
                    'ভুল ট্রানজেকশন আইডি অথবা ইনভ্যালিড ইউআইডির কারণে অর্ডারটি সম্পন্ন করা সম্ভব হয়নি।'}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Support Button */}
            <a
              href={`https://wa.me/8801575630127?text=${encodeURIComponent(
                `আসসালামু আলাইকুম KHAN TOP UP, আমার অর্ডার ${order.orderNumber} বাতিল হয়েছে। প্লেয়ার UID: ${order.gameUid || 'N/A'}, TrxID: ${order.transactionId}. দয়া করে সাহায্য করবেন?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>সরাসরি হোয়াটসঅ্যাপে সাহায্য নিন (WhatsApp Support)</span>
            </a>
          </div>
        )}

        {/* Visual Step Progress Bar */}
        {!isCancelled && (
          <div className="pt-1 pb-2">
            <div className="relative flex items-center justify-between">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-700"
                style={{
                  width:
                    order.status === 'Completed'
                      ? '100%'
                      : order.status === 'Processing'
                      ? '50%'
                      : '20%',
                }}
              ></div>

              {[
                { title: 'অর্ডার গৃহীত', sub: 'Saved' },
                { title: 'পেমেন্ট চেক', sub: 'Verifying' },
                { title: 'ডেলিভারি', sub: 'Sent' },
              ].map((step, idx) => {
                const isStepDone =
                  order.status === 'Completed' ||
                  (order.status === 'Processing' && idx <= 1) ||
                  idx === 0;
                return (
                  <div
                    key={idx}
                    className="relative z-10 flex flex-col items-center bg-white dark:bg-[#121929] px-1.5"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isStepDone
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isStepDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-slate-600 dark:text-slate-300">
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Details Grid: Package, UID, Payment Method, TrxID, Amount */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium">প্যাকেজ (Item)</span>
            <span className="font-bold text-slate-800 dark:text-white truncate block">
              {order.productTitle}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium">টাকার পরিমাণ (Amount)</span>
            <span className="font-bold text-blue-600 dark:text-amber-400">
              ৳{order.amount} ({order.paymentMethod})
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-medium">Game UID / Player ID</span>
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 truncate">
                {order.gameUid || 'N/A'}
              </span>
              {order.gameUid && (
                <button
                  onClick={() => copyText(order.gameUid!, 'uid')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  title="UID কপি করুন"
                >
                  {copiedUid === order.gameUid ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 col-span-2">
            <span className="text-[10px] text-slate-400 block font-medium">Transaction ID (TrxID)</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold truncate block">
              {order.transactionId || 'N/A'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-medium">ডেলিভারি মাধ্যম</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              ২ সেকেন্ডে অফিশিয়াল UID
            </span>
          </div>
        </div>

        {/* Admin Note if available & not cancelled */}
        {order.adminNote && !isCancelled && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-cyan-950/30 border border-blue-200 dark:border-cyan-800/40 text-[11px] text-blue-900 dark:text-cyan-200">
            <span className="font-bold text-blue-800 dark:text-cyan-300 block mb-0.5">এডমিন আপডেট নোট:</span>
            <span>{order.adminNote}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl my-6 transition-colors border ${
          isLightMode
            ? 'bg-[#f8fafc] text-slate-800 border-blue-200 shadow-blue-500/10'
            : 'bg-[#0b0e17] text-white border-cyan-500/30 shadow-black/80'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
            isLightMode
              ? 'bg-slate-200/80 hover:bg-slate-300 text-slate-600'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
          }`}
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
              isLightMode
                ? 'bg-[#0066FF] text-white shadow-blue-500/20'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
            }`}
          >
            <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg sm:text-xl tracking-tight">
                My Order (অর্ডার স্ট্যাটাস দেখার ব্যবস্থা)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-cyan-950 dark:text-cyan-300 border border-blue-300 dark:border-cyan-800">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Order ID অথবা Game UID দিয়ে যে কোনো অর্ডারের লাইভ স্ট্যাটাস দেখুন
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/70 dark:bg-[#13192b] mb-5 border border-slate-300/60 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('my_recent')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'my_recent'
                ? isLightMode
                  ? 'bg-white text-[#0066FF] shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>আমার অর্ডার ({myRecentOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'search'
                ? isLightMode
                  ? 'bg-white text-[#0066FF] shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>অর্ডার অনুসন্ধান (Search)</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'live'
                ? isLightMode
                  ? 'bg-white text-[#0066FF] shadow-sm'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>লাইভ ফিড ({orders.length})</span>
          </button>
        </div>

        {/* Search Bar Input (Shown on Search tab or as a quick input) */}
        <form onSubmit={handleSearchSubmit} className="mb-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Order ID (যেমন: ORD-202502-1234) অথবা Game UID (যেমন: 284918294)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'search') setActiveTab('search');
                  setSearched(true);
                }}
                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium outline-none transition-all ${
                  isLightMode
                    ? 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm'
                    : 'bg-[#121929] border border-slate-700/80 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                }`}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20"
            >
              খুঁজুন
            </button>
          </div>

          {/* Quick example search chips */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-[11px] text-slate-500 dark:text-slate-400 pb-1">
            <span className="font-medium shrink-0">উদাহরণ:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ORD-202502-1234');
                setActiveTab('search');
                setSearched(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-700 transition-colors font-mono"
            >
              ORD-202502-1234 (Cancelled)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('284918294');
                setActiveTab('search');
                setSearched(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-700 transition-colors font-mono"
            >
              UID: 284918294
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('KTU-892401');
                setActiveTab('search');
                setSearched(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-700 transition-colors font-mono"
            >
              KTU-892401 (Completed)
            </button>
          </div>
        </form>

        {/* Tab 1: My Recent Orders */}
        {activeTab === 'my_recent' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {myRecentOrders.length === 0 ? (
              <div
                className={`p-8 rounded-2xl text-center space-y-3 border ${
                  isLightMode
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-[#121929] border-slate-800 text-slate-300'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-cyan-950/60 text-[#0066FF] dark:text-cyan-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-slate-800 dark:text-white">
                  আপনার কোনো সাম্প্রতিক অর্ডার নেই
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  আপনি এই ব্রাউজার থেকে এখনও কোনো টপ-আপ অর্ডার করেননি। অর্ডার করলে স্বয়ংক্রিয়ভাবে এখানে তার ৩টি স্ট্যাটাস (Completed, Processing, Cancelled) দেখতে পাবেন।
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onGoToShop?.();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>এখনই টপআপ করুন (Top-Up Now)</span>
                  </button>
                </div>
              </div>
            ) : (
              myRecentOrders.map((order) => renderOrderCard(order))
            )}
          </div>
        )}

        {/* Tab 2: Search Results */}
        {activeTab === 'search' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {!searchQuery.trim() ? (
              <div className="p-8 rounded-2xl text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-800 text-slate-400">
                <Search className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs">আপনার Order ID বা Game UID লিখে সার্চ করুন</p>
              </div>
            ) : matchedOrders.length === 0 ? (
              <div
                className={`p-8 rounded-2xl text-center space-y-3 border ${
                  isLightMode
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-[#121929] border-slate-800 text-slate-300'
                }`}
              >
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-bold text-base text-slate-800 dark:text-white">
                  কোনো অর্ডার খুঁজে পাওয়া যায়নি
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  &ldquo;{searchQuery}&rdquo; এর সাথে কোনো অর্ডার মেলেনি। অনুগ্রহ করে আপনার Order ID (যেমন KTU-892401) বা গেম UID ভালো করে চেক করুন।
                </p>
                <a
                  href={`https://wa.me/8801575630127?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম KHAN TOP UP, আমি আমার অর্ডার সার্চ করছি কিন্তু খুঁজে পাচ্ছি না। কোয়েরি: ${searchQuery}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>হোয়াটসঅ্যাপে হেল্প নিন</span>
                </a>
              </div>
            ) : (
              matchedOrders.map((order) => renderOrderCard(order))
            )}
          </div>
        )}

        {/* Tab 3: Live Orders Feed */}
        {activeTab === 'live' && (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-cyan-950/40 border border-blue-200 dark:border-cyan-800/40 text-xs text-blue-800 dark:text-cyan-300 flex items-center justify-between">
              <span>সারাদেশে সম্পন্ন হওয়া সাম্প্রতিক টপ-আপের লাইভ তালিকা</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Active Server
              </span>
            </div>
            {orders.slice(0, 8).map((order) => renderOrderCard(order))}
          </div>
        )}

        {/* Footer info & WhatsApp Helpline */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>হেল্পলাইন: 01575630127 (২৪ ঘণ্টা চালু)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
