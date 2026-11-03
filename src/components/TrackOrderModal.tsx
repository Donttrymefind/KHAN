import React, { useState } from 'react';
import {
  X,
  Search,
  Crosshair,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Order } from '../types';

interface TrackOrderModalProps {
  orders: Order[];
  initialOrderNumber?: string;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  orders,
  initialOrderNumber = '',
  onClose,
}) => {
  const [query, setQuery] = useState(initialOrderNumber);
  const [searched, setSearched] = useState(Boolean(initialOrderNumber));
  const [copiedId, setCopiedId] = useState(false);

  const matchedOrders = orders.filter((o) => {
    if (!query.trim()) return false;
    const cleanQuery = query.trim().toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(cleanQuery) ||
      o.customerPhone.includes(cleanQuery) ||
      (o.gameUid && o.gameUid.includes(cleanQuery)) ||
      o.transactionId.toLowerCase().includes(cleanQuery)
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const copyOrder = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/80 text-white my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Orbitron'] font-bold text-lg text-white">
              Live Order Tracker
            </h3>
            <p className="text-xs text-slate-400">
              Track your Free Fire diamond delivery status in real time
            </p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. KTU-892401) or Phone / UID"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearched(false);
                }}
                className="w-full bg-[#13192b] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Track
            </button>
          </div>
        </form>

        {/* Results Stream */}
        {searched && matchedOrders.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#13192b] border border-slate-800 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-semibold text-sm text-white">No Order Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't locate an order matching &ldquo;{query}&rdquo;. Please verify your Order ID or phone number.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {matchedOrders.map((order) => {
              const statusSteps = ['Pending', 'Processing', 'Completed'];
              const isRejected = order.status === 'Rejected';
              const currentIndex = statusSteps.indexOf(order.status);

              return (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#13192b] border border-slate-700/80 shadow-md space-y-4"
                >
                  {/* Order header row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-['Orbitron'] font-black text-cyan-400 text-sm sm:text-base">
                        {order.orderNumber}
                      </span>
                      <button
                        onClick={() => copyOrder(order.orderNumber)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          order.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : order.status === 'Processing'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : order.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {!isRejected ? (
                    <div className="py-2">
                      <div className="flex items-center justify-between relative">
                        {/* Connecting line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                          style={{
                            width:
                              currentIndex === 0 ? '15%' : currentIndex === 1 ? '50%' : '100%',
                          }}
                        />

                        {/* Steps */}
                        {[
                          { title: 'Order Placed', desc: 'Saved' },
                          { title: 'Payment Check', desc: 'Verifying' },
                          { title: 'Delivered', desc: 'In-Game UID' },
                        ].map((step, idx) => {
                          const isDone = currentIndex >= idx;
                          const isCurrent = currentIndex === idx;
                          return (
                            <div
                              key={idx}
                              className="relative z-10 flex flex-col items-center text-center bg-[#13192b] px-1"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/40'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[11px] font-bold mt-1 ${
                                  isCurrent
                                    ? 'text-cyan-300'
                                    : isDone
                                    ? 'text-white'
                                    : 'text-slate-500'
                                }`}
                              >
                                {step.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>
                        This order was rejected. Please contact our support hotline with your TrxID.
                      </span>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-400">Package:</span>
                      <div className="font-semibold text-white">{order.productTitle}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Amount Paid:</span>
                      <div className="font-semibold text-amber-300">৳{order.amount} ({order.paymentMethod})</div>
                    </div>
                    {order.gameUid && (
                      <div>
                        <span className="text-slate-400">Free Fire UID:</span>
                        <div className="font-mono text-cyan-300 font-bold">{order.gameUid}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400">TrxID:</span>
                      <div className="font-mono text-slate-300 font-semibold">{order.transactionId}</div>
                    </div>
                  </div>

                  {/* Admin Note if available */}
                  {order.adminNote && (
                    <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs">
                      <span className="font-bold text-cyan-300 block mb-0.5">Admin Update Note:</span>
                      <p className="text-slate-200 leading-relaxed">{order.adminNote}</p>
                    </div>
                  )}

                  {/* Support Link */}
                  <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <a
                      href={`https://wa.me/8801575630127?text=${encodeURIComponent(
                        `Hi KHAN TOP UP, I am checking status of Order ${order.orderNumber}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Need Help?</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
