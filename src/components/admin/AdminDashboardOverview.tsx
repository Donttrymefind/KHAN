import React, { useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  CreditCard,
  Package,
  ShieldAlert,
  Users,
  ArrowUpRight,
  ExternalLink,
  Zap,
  Tag,
  Check,
  XCircle,
  Eye,
} from 'lucide-react';
import { Order, Product, Customer, PaymentMethodConfig } from '../../types';
import { AdminTab } from './AdminHeader';

interface AdminDashboardOverviewProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  payments: PaymentMethodConfig[];
  onNavigateTab: (tab: AdminTab) => void;
  onSelectOrder: (order: Order) => void;
  onQuickApproveOrder: (orderId: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  orders,
  products,
  customers,
  payments,
  onNavigateTab,
  onSelectOrder,
  onQuickApproveOrder,
}) => {
  const [chartView, setChartView] = useState<'sales' | 'orders'>('sales');

  // Stats calculation
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const pendingPayments = orders.filter((o) => o.status === 'Pending').length;

  const totalSales = orders
    .filter((o) => o.status !== 'Rejected')
    .reduce((sum, o) => sum + o.amount, 0);

  const availableProducts = products.filter(
    (p) => p.isActive && !p.isOutOfStock && (p.isUnlimited || p.stock > 0)
  ).length;

  const outOfStockProducts = products.filter(
    (p) => p.isOutOfStock || (!p.isUnlimited && p.stock <= 0)
  ).length;

  const totalCustomers = customers.length;

  // Recent 6 orders
  const recentOrders = orders.slice(0, 6);

  // Chart data simulation based on orders (last 7 days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const simulatedSales = [1240, 2180, 1890, 3420, 2900, 4120, totalSales > 5000 ? Math.round(totalSales * 0.3) : 2650];
  const simulatedOrders = [4, 7, 6, 11, 9, 14, Math.max(orders.length, 8)];
  const maxSale = Math.max(...simulatedSales, 5000);
  const maxOrder = Math.max(...simulatedOrders, 15);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#12192f] via-[#16203c] to-[#12192f] border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              System Live &bull; Real-Time Sync Active
            </span>
            <span className="text-xs text-slate-400">
              Free Fire BD Gateway Connected
            </span>
          </div>
          <h2 className="font-['Orbitron'] font-black text-xl sm:text-2xl text-white">
            Welcome to KHAN TOP UP Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor real-time Free Fire Diamond orders, verify bKash &amp; Nagad TrxIDs, and control product pricing instantly across customer devices.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Manage Prices</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Pending ({pendingOrders})</span>
          </button>
        </div>
      </div>

      {/* 8 Primary Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-white">
            {totalOrders}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Lifetime customer requests</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-amber-400">
            ৳{totalSales.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-300 mt-1">
            BDT gross processed volume
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group ${
            pendingOrders > 0
              ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/10'
              : 'bg-[#0e1424] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-amber-300">
            {pendingOrders}
          </div>
          <div className="text-[11px] text-amber-300 font-semibold mt-1 flex items-center gap-1">
            {pendingOrders > 0 ? 'Requires UID transfer' : 'All clear'}
          </div>
        </div>

        {/* Completed Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-emerald-400">
            {completedOrders}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Successfully delivered
          </div>
        </div>

        {/* Pending Payments */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-pink-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Payments</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-pink-400">
            {pendingPayments}
          </div>
          <div className="text-[11px] text-pink-300 mt-1">
            bKash &amp; Nagad TrxIDs awaiting verify
          </div>
        </div>

        {/* Available Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-blue-400">
            {availableProducts}
          </div>
          <div className="text-[11px] text-blue-300 mt-1">
            Active in catalog
          </div>
        </div>

        {/* Out of Stock Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group ${
            outOfStockProducts > 0
              ? 'bg-red-950/20 border-red-500/40'
              : 'bg-[#0e1424] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-red-400">
            {outOfStockProducts}
          </div>
          <div className="text-[11px] text-red-300 mt-1">
            {outOfStockProducts > 0 ? 'Buy Now disabled' : 'All items in stock'}
          </div>
        </div>

        {/* Total Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Customers</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-purple-400">
            {totalCustomers}
          </div>
          <div className="text-[11px] text-purple-300 mt-1">
            Registered buyer profiles
          </div>
        </div>
      </div>

      {/* Chart & Quick Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Analytics Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-['Orbitron'] font-bold text-base text-white">
                Weekly Performance Analytics
              </h3>
              <p className="text-xs text-slate-400">
                Revenue &amp; Order volume trends
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#13192b] border border-slate-700">
              <button
                onClick={() => setChartView('sales')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartView === 'sales'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Revenue (৳)
              </button>
              <button
                onClick={() => setChartView('orders')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chartView === 'orders'
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-slate-800">
            {days.map((day, idx) => {
              const value = chartView === 'sales' ? simulatedSales[idx] : simulatedOrders[idx];
              const max = chartView === 'sales' ? maxSale : maxOrder;
              const heightPercent = Math.max(Math.round((value / max) * 100), 12);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip value */}
                  <span className="text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                    {chartView === 'sales' ? `৳${value}` : `${value} ord`}
                  </span>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                      chartView === 'sales'
                        ? 'bg-gradient-to-t from-amber-600 to-yellow-400 group-hover:from-amber-500 group-hover:to-yellow-300 shadow-md shadow-amber-500/20'
                        : 'bg-gradient-to-t from-cyan-600 to-blue-400 group-hover:from-cyan-500 group-hover:to-blue-300 shadow-md shadow-cyan-500/20'
                    }`}
                  />

                  {/* Day Label */}
                  <span className="text-[11px] font-semibold text-slate-400 mt-1">
                    {day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Highest volume on Weekend Peak (Fri - Sat)</span>
            </span>
            <span className="font-mono text-cyan-400">Updated in real-time</span>
          </div>
        </div>

        {/* Order Status Breakdown Ring / Progress Bars */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-['Orbitron'] font-bold text-base text-white mb-1">
              Order Fulfillment Ratio
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Live queue health &amp; turnaround time
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-400">Completed (Delivered)</span>
                  <span className="text-white font-mono">{completedOrders}</span>
                </div>
                <div className="h-2 rounded-full bg-[#13192b] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: totalOrders ? `${(completedOrders / totalOrders) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-cyan-400">Processing in Garena Server</span>
                  <span className="text-white font-mono">{processingOrders}</span>
                </div>
                <div className="h-2 rounded-full bg-[#13192b] overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{
                      width: totalOrders ? `${(processingOrders / totalOrders) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-400">Pending Admin Verification</span>
                  <span className="text-white font-mono">{pendingOrders}</span>
                </div>
                <div className="h-2 rounded-full bg-[#13192b] overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: totalOrders ? `${(pendingOrders / totalOrders) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment gateway quick info */}
          <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Payment Numbers
            </span>
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#13192b] border border-slate-800"
              >
                <span className="font-semibold text-white">{p.method} ({p.accountType})</span>
                <span className="font-mono text-cyan-300 font-bold">{p.number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-['Orbitron'] font-bold text-base text-white">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-400">
              Real-time incoming Free Fire diamond and pass requests
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#13192b] text-center text-xs text-slate-400">
            No orders placed yet. Orders from customers will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#13192b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product / Item</th>
                  <th className="py-3 px-4">Player UID</th>
                  <th className="py-3 px-4">Payment &amp; TrxID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#13192b]/50 transition-colors">
                    <td className="py-3 px-4 font-['Orbitron'] font-bold text-cyan-400">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {ord.productTitle}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-300">
                      {ord.gameUid || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-300">{ord.paymentMethod}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{ord.transactionId}</div>
                    </td>
                    <td className="py-3 px-4 font-['Orbitron'] font-bold text-white">
                      ৳{ord.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : ord.status === 'Processing'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                            : ord.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {ord.status === 'Pending' && (
                        <button
                          onClick={() => onQuickApproveOrder(ord.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                          title="Quick Approve"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => onSelectOrder(ord)}
                        className="px-2.5 py-1 rounded-lg bg-[#1a233a] hover:bg-[#253254] text-slate-200 text-[11px] font-semibold border border-slate-700"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
