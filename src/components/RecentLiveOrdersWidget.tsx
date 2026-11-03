import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  User,
} from 'lucide-react';
import { Order } from '../types';

interface RecentLiveOrdersWidgetProps {
  orders: Order[];
  onTrackOrder?: (orderNumber: string) => void;
  isLightMode?: boolean;
}

export const RecentLiveOrdersWidget: React.FC<RecentLiveOrdersWidgetProps> = ({
  orders,
  onTrackOrder,
  isLightMode = false,
}) => {
  // Generate sample dynamic live orders if list is short
  const mockLiveOrders = [
    {
      id: 'm1',
      orderNumber: 'KTU-920412',
      uidMasked: '29481****',
      productTitle: 'Free Fire 690 Diamonds',
      amount: 475,
      status: 'Completed',
      timeAgo: '১ মিনিট আগে',
    },
    {
      id: 'm2',
      orderNumber: 'KTU-920411',
      uidMasked: '18402****',
      productTitle: '1x Weekly Membership',
      amount: 160,
      status: 'Completed',
      timeAgo: '৩ মিনিট আগে',
    },
    {
      id: 'm3',
      orderNumber: 'KTU-920410',
      uidMasked: '39105****',
      productTitle: 'Friday Special: 240💎 + 60💎',
      amount: 170,
      status: 'Completed',
      timeAgo: '৫ মিনিট আগে',
    },
    {
      id: 'm4',
      orderNumber: 'KTU-920409',
      uidMasked: '59201****',
      productTitle: 'Netflix 1 Month 4K Profile',
      amount: 250,
      status: 'Processing',
      timeAgo: '৬ মিনিট আগে',
    },
    {
      id: 'm5',
      orderNumber: 'KTU-920408',
      uidMasked: '49182****',
      productTitle: 'Free Fire 1,000 Diamonds',
      amount: 690,
      status: 'Completed',
      timeAgo: '৮ মিনিট আগে',
    },
    {
      id: 'm6',
      orderNumber: 'KTU-920407',
      uidMasked: '79201****',
      productTitle: 'Complete Level Up Pass (802💎)',
      amount: 190,
      status: 'Completed',
      timeAgo: '১১ মিনিট আগে',
    },
  ];

  // Combine real store orders with recent live feed
  const displayOrders = orders.slice(0, 8).map((o, idx) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    uidMasked: o.gameUid
      ? `${o.gameUid.slice(0, 4)}****`
      : o.socialLink
      ? 'FB/Link'
      : `${o.customerPhone.slice(0, 3)}****${o.customerPhone.slice(-2)}`,
    productTitle: o.productTitle,
    amount: o.amount,
    status: o.status === 'Completed' ? 'Completed' : 'Processing',
    timeAgo: `${(idx + 1) * 2} মিনিট আগে`,
  }));

  const activeFeed = displayOrders.length >= 4 ? displayOrders : mockLiveOrders;

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isLightMode
          ? 'bg-white border-blue-200/80 shadow-md shadow-blue-500/5'
          : 'bg-[#0f1422] border-blue-500/30 shadow-xl'
      }`}
    >
      {/* Widget Header */}
      <div
        className={`px-4 sm:px-6 py-3.5 flex items-center justify-between border-b ${
          isLightMode
            ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-blue-100'
            : 'bg-[#141b2d] border-blue-500/20'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3
              className={`font-['Orbitron'] font-black text-sm sm:text-base tracking-wider ${
                isLightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              Recent Live Orders (লাইভ অর্ডার আপডেট)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <Zap className="w-3 h-3" />
            <span>অটো-ডেলিভারি চালু আছে</span>
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500">
            {activeFeed.length}টি লাইভ
          </span>
        </div>
      </div>

      {/* Orders Grid/Ticker */}
      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {activeFeed.map((item) => (
          <div
            key={item.id}
            onClick={() => onTrackOrder?.(item.orderNumber)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              isLightMode
                ? 'bg-slate-50/70 hover:bg-blue-50/60 border-slate-200/80 hover:border-blue-300'
                : 'bg-[#151c2e] hover:bg-[#1b253d] border-slate-800 hover:border-blue-500/40'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                  {item.orderNumber}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  UID: {item.uidMasked}
                </span>
              </div>
              <p
                className={`text-xs font-semibold truncate ${
                  isLightMode ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                {item.productTitle}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                <Clock className="w-3 h-3" />
                <span>{item.timeAgo}</span>
                <span>•</span>
                <span className="font-bold text-amber-500">৳{item.amount}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              {item.status === 'Completed' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Done</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  <Clock className="w-3 h-3 animate-spin" />
                  <span>Processing</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
