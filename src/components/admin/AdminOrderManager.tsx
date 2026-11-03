import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Eye,
  ExternalLink,
  MessageSquare,
  Phone,
  FileImage,
  X,
  Send,
  Zap,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrderManagerProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus, adminNote?: string) => Promise<void>;
  selectedOrderFromDashboard?: Order | null;
  onClearSelectedOrder?: () => void;
  onAutoTopupApi?: (orderId: string) => Promise<{ success: boolean; message: string }>;
}

export const AdminOrderManager: React.FC<AdminOrderManagerProps> = ({
  orders,
  onUpdateStatus,
  selectedOrderFromDashboard,
  onClearSelectedOrder,
  onAutoTopupApi,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');

  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(
    selectedOrderFromDashboard || null
  );
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync if selected from dashboard
  React.useEffect(() => {
    if (selectedOrderFromDashboard) {
      setActiveModalOrder(selectedOrderFromDashboard);
      setAdminNoteInput(selectedOrderFromDashboard.adminNote || '');
    }
  }, [selectedOrderFromDashboard]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenDetail = (order: Order) => {
    setActiveModalOrder(order);
    setAdminNoteInput(order.adminNote || '');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(orderId, newStatus, adminNoteInput || undefined);
      if (activeModalOrder && activeModalOrder.id === orderId) {
        setActiveModalOrder({ ...activeModalOrder, status: newStatus, adminNote: adminNoteInput });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const cleanQ = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !cleanQ ||
      o.orderNumber.toLowerCase().includes(cleanQ) ||
      o.customerName.toLowerCase().includes(cleanQ) ||
      o.customerPhone.includes(cleanQ) ||
      (o.gameUid && o.gameUid.includes(cleanQ)) ||
      o.transactionId.toLowerCase().includes(cleanQ) ||
      o.productTitle.toLowerCase().includes(cleanQ);

    let matchesDate = true;
    if (dateFilter === 'today') {
      const orderDate = new Date(o.createdAt).toDateString();
      const today = new Date().toDateString();
      matchesDate = orderDate === today;
    } else if (dateFilter === 'week') {
      const diffMs = Date.now() - new Date(o.createdAt).getTime();
      matchesDate = diffMs <= 7 * 24 * 60 * 60 * 1000;
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0e1424] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="font-['Orbitron'] font-black text-xl text-white">
              Customer Orders Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review Free Fire UID top-ups, verify bKash &amp; Nagad payments, and notify customers
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
            Total: {orders.length} orders
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
            Pending: {orders.filter((o) => o.status === 'Pending').length}
          </span>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'Pending', 'Processing', 'Completed', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? st === 'Pending'
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : st === 'Completed'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : st === 'Processing'
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                    : st === 'Rejected'
                    ? 'bg-red-500 text-white font-bold'
                    : 'bg-slate-200 text-black font-bold'
                  : 'bg-[#13192b] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>

        {/* Date Filter & Search */}
        <div className="flex items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="bg-[#13192b] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Dates</option>
            <option value="today">Today Only</option>
            <option value="week">Last 7 Days</option>
          </select>

          <div className="relative min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, UID, TrxID, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13192b] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#0e1424] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#13192b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Order ID &amp; Time</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Product / Item</th>
                <th className="py-3.5 px-4">Free Fire UID</th>
                <th className="py-3.5 px-4">Payment &amp; TrxID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#13192b]/40 transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-['Orbitron'] font-black text-cyan-400 text-sm">
                        {ord.orderNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        &bull; {new Date(ord.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <span>{ord.customerPhone}</span>
                      </div>
                    </td>

                    {/* Product & Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{ord.productTitle}</div>
                      <div className="text-amber-400 font-['Orbitron'] font-bold text-xs">
                        ৳{ord.amount}
                      </div>
                    </td>

                    {/* FF UID */}
                    <td className="py-3.5 px-4">
                      {ord.gameUid ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-amber-300 text-xs">
                            {ord.gameUid}
                          </span>
                          <button
                            onClick={() => handleCopy(ord.gameUid!, 'uid_' + ord.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                            title="Copy UID"
                          >
                            {copiedKey === 'uid_' + ord.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">{ord.accountType || 'N/A'}</span>
                      )}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold text-[11px] ${
                            ord.paymentMethod === 'bKash' ? 'text-pink-400' : 'text-orange-400'
                          }`}
                        >
                          {ord.paymentMethod}
                        </span>
                        {ord.paymentScreenshot && (
                          <span
                            className="text-cyan-400 cursor-pointer"
                            onClick={() => handleOpenDetail(ord)}
                            title="Payment proof attached"
                          >
                            <FileImage className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <span>{ord.transactionId}</span>
                        <button
                          onClick={() => handleCopy(ord.transactionId, 'trx_' + ord.id)}
                          className="p-0.5 rounded text-slate-400 hover:text-white"
                          title="Copy TrxID"
                        >
                          {copiedKey === 'trx_' + ord.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : ord.status === 'Processing'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : ord.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {ord.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(ord.id, 'Processing')}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold"
                          title="Mark Processing"
                        >
                          Process
                        </button>
                      )}

                      {ord.status !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(ord.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                          title="Approve & Complete"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDetail(ord)}
                        className="px-2.5 py-1 rounded-lg bg-[#1a233a] hover:bg-[#263456] text-slate-200 text-[11px] font-semibold border border-slate-700"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Approval Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-6">
            <button
              onClick={() => {
                setActiveModalOrder(null);
                onClearSelectedOrder?.();
              }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-['Orbitron'] font-bold text-lg text-white">
                  Order Details: {activeModalOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Placed {new Date(activeModalOrder.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Status Selector Bar */}
            <div className="p-3.5 rounded-2xl bg-[#13192b] border border-slate-700 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Update Order Status (Synchronizes Instantly to Customer)
              </span>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {(['Pending', 'Processing', 'Completed', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeModalOrder.id, st)}
                    disabled={isUpdating}
                    className={`py-2 px-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      activeModalOrder.status === st
                        ? st === 'Completed'
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                          : st === 'Processing'
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                          : st === 'Rejected'
                          ? 'bg-red-600 text-white border-red-500 shadow-md'
                          : 'bg-amber-500 text-black border-amber-400 shadow-md'
                        : 'bg-[#0e1424] text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Automatic API Topup Trigger */}
              {onAutoTopupApi && activeModalOrder.gameUid && (
                <button
                  type="button"
                  disabled={isUpdating || activeModalOrder.status === 'Completed'}
                  onClick={async () => {
                    setIsUpdating(true);
                    try {
                      await onAutoTopupApi(activeModalOrder.id);
                      setActiveModalOrder({ ...activeModalOrder, status: 'Completed', adminNote: '⚡ Auto-fulfilled via Garena Official API Gateway' });
                    } finally {
                      setIsUpdating(false);
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-['Orbitron'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border ${
                    activeModalOrder.status === 'Completed'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-cyan-400 shadow-lg shadow-blue-500/25 cursor-pointer'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>
                    {activeModalOrder.status === 'Completed'
                      ? '✓ Top-Up Already Dispatched to UID'
                      : '⚡ Instant Auto-Fulfill via Garena API'}
                  </span>
                </button>
              )}
            </div>

            {/* Order Information Breakdown */}
            <div className="space-y-3 text-xs sm:text-sm mb-5">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#13192b]">
                <div>
                  <span className="text-slate-400 text-xs">Customer Name</span>
                  <div className="font-bold text-white text-sm">{activeModalOrder.customerName}</div>
                </div>

                <div>
                  <span className="text-slate-400 text-xs">Customer Phone</span>
                  <div className="font-mono font-bold text-cyan-300 flex items-center gap-2">
                    <span>{activeModalOrder.customerPhone}</span>
                    <a
                      href={`tel:${activeModalOrder.customerPhone}`}
                      className="p-1 rounded bg-slate-800 hover:text-white text-slate-400"
                      title="Call Customer"
                    >
                      <Phone className="w-3 h-3" />
                    </a>
                    <a
                      href={`https://wa.me/88${activeModalOrder.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${activeModalOrder.customerName}, this is KHAN TOP UP regarding Order ${activeModalOrder.orderNumber}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded bg-emerald-950 text-emerald-400 hover:text-white"
                      title="WhatsApp Customer"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-xs">Ordered Item</span>
                  <div className="font-semibold text-white">{activeModalOrder.productTitle}</div>
                </div>

                <div>
                  <span className="text-slate-400 text-xs">Amount &amp; Method</span>
                  <div className="font-['Orbitron'] font-bold text-amber-300">
                    ৳{activeModalOrder.amount} ({activeModalOrder.paymentMethod})
                  </div>
                </div>
              </div>

              {/* Free Fire UID Highlight */}
              {activeModalOrder.gameUid && (
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      Free Fire Player ID (UID)
                    </span>
                    <div className="font-mono text-xl font-black text-amber-300">
                      {activeModalOrder.gameUid}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(activeModalOrder.gameUid!, 'modal_uid')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5"
                  >
                    {copiedKey === 'modal_uid' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UID</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Payment TrxID */}
              <div className="p-3.5 rounded-2xl bg-[#13192b] border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Payment Transaction ID (TrxID)
                  </span>
                  <div className="font-mono text-base font-black text-emerald-400">
                    {activeModalOrder.transactionId}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(activeModalOrder.transactionId, 'modal_trx')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedKey === 'modal_trx' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy TrxID</span>
                </button>
              </div>

              {/* Payment Screenshot Preview */}
              {activeModalOrder.paymentScreenshot && (
                <div className="p-3.5 rounded-2xl bg-[#13192b] border border-slate-700">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
                    Customer Uploaded Payment Proof
                  </span>
                  <div className="max-h-56 rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                    <img
                      src={activeModalOrder.paymentScreenshot}
                      alt="Payment Slip"
                      className="max-h-56 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Admin Note for Customer */}
              <div className="p-3.5 rounded-2xl bg-[#13192b] border border-slate-700 space-y-2">
                <label className="text-xs font-bold uppercase text-slate-300 block">
                  Admin Note for Customer (Visible in Order Tracker)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Diamonds sent successfully to your game mailbox! Thanks"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    className="flex-1 bg-[#0e1424] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(activeModalOrder.id, activeModalOrder.status)
                    }
                    className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveModalOrder(null);
                  onClearSelectedOrder?.();
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
