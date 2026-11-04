import React from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Zap,
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
  isLightMode = true,
}) => {
  // Sample realistic recent orders matching TOPUPPAPA screenshot feed
  const mockLiveOrders = [
    {
      id: 'm1',
      name: 'Md Imran Hossain',
      avatar: 'M',
      color: 'bg-amber-600',
      productTitle: 'Premium Mystery Box',
      orderNumber: 'KTU-920412',
    },
    {
      id: 'm2',
      name: 'Zxxxx',
      avatar: 'Z',
      color: 'bg-blue-600',
      productTitle: '50 Diamond',
      orderNumber: 'KTU-920411',
    },
    {
      id: 'm3',
      name: 'Md Imran Hossain',
      avatar: 'M',
      color: 'bg-amber-600',
      productTitle: 'Premium Mystery Box',
      orderNumber: 'KTU-920410',
    },
    {
      id: 'm4',
      name: 'Md Imran Hossain',
      avatar: 'M',
      color: 'bg-amber-600',
      productTitle: 'Legendary Mystery Box',
      orderNumber: 'KTU-920409',
    },
    {
      id: 'm5',
      name: 'ador khan',
      avatar: 'a',
      color: 'bg-emerald-600',
      productTitle: '1x Weekly Lite',
      orderNumber: 'KTU-920408',
    },
    {
      id: 'm6',
      name: 'Siam Hossain',
      avatar: 'S',
      color: 'bg-rose-600',
      productTitle: 'Premium Mystery Box',
      orderNumber: 'KTU-920407',
    },
    {
      id: 'm7',
      name: 'Salman FF',
      avatar: 'S',
      color: 'bg-purple-600',
      productTitle: 'Lucky Mystery Box',
      orderNumber: 'KTU-920406',
    },
    {
      id: 'm8',
      name: 'Free Fire',
      avatar: 'F',
      color: 'bg-indigo-600',
      productTitle: '355 Diamond',
      orderNumber: 'KTU-920405',
    },
    {
      id: 'm9',
      name: 'sakib bhuiyan',
      avatar: 's',
      color: 'bg-cyan-600',
      productTitle: 'Legendary Mystery Box',
      orderNumber: 'KTU-920404',
    },
    {
      id: 'm10',
      name: 'Arafat Rahman',
      avatar: 'A',
      color: 'bg-blue-700',
      productTitle: '25 Diamond',
      orderNumber: 'KTU-920403',
    },
  ];

  // Map real store orders if present
  const realOrdersFormatted = orders.slice(0, 10).map((o) => ({
    id: o.id,
    name: o.customerName || (o.gameUid ? `Player ${o.gameUid.slice(0, 4)}` : 'Customer'),
    avatar: (o.customerName || 'C')[0].toUpperCase(),
    color: 'bg-[#0066FF]',
    productTitle: o.productTitle,
    orderNumber: o.orderNumber,
  }));

  const displayList = realOrdersFormatted.length >= 4 ? realOrdersFormatted : mockLiveOrders;

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isLightMode
          ? 'bg-white border-slate-200/90 shadow-sm'
          : 'bg-[#0f1422] border-slate-800 shadow-xl'
      }`}
    >
      {/* Widget Header */}
      <div
        className={`px-4 sm:px-6 py-3.5 flex items-center justify-between border-b ${
          isLightMode
            ? 'bg-slate-50/80 border-slate-200'
            : 'bg-[#141b2d] border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0066FF]" />
            <h3
              className={`font-['Orbitron'] font-black text-sm sm:text-base tracking-wider ${
                isLightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              Recent Orders (সাম্প্রতিক সফল অর্ডার)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Zap className="w-3 h-3 text-emerald-500" />
            <span>অটো-ডেলিভারি একটিভ</span>
          </span>
        </div>
      </div>

      {/* Orders List matching TOPUPPAPA Screenshot 4 */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {displayList.map((item) => (
          <div
            key={item.id}
            onClick={() => onTrackOrder?.(item.orderNumber)}
            className={`px-4 sm:px-6 py-3 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
              isLightMode
                ? 'hover:bg-slate-50/80'
                : 'hover:bg-slate-800/40'
            }`}
          >
            {/* Left: Avatar + Customer info */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ${item.color}`}
              >
                {item.avatar}
              </div>

              <div className="min-w-0">
                <h4
                  className={`font-bold text-xs sm:text-sm truncate ${
                    isLightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {item.productTitle}
                </p>
              </div>
            </div>

            {/* Right: Green Done Badge matching screenshot */}
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Done</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
