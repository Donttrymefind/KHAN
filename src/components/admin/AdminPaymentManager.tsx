import React, { useState } from 'react';
import {
  CreditCard,
  Edit2,
  Check,
  X,
  Phone,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Search,
  CheckCircle2,
  XCircle,
  FileImage,
} from 'lucide-react';
import { PaymentMethodConfig, Order } from '../../types';

interface AdminPaymentManagerProps {
  payments: PaymentMethodConfig[];
  orders: Order[];
  onUpdatePayment: (
    id: string,
    number: string,
    accountType: 'Personal' | 'Agent' | 'Merchant' | 'Digital Wallet',
    isEnabled: boolean,
    instructions: string
  ) => Promise<void>;
  onVerifyOrderPayment: (orderId: string, status: 'Processing' | 'Completed' | 'Rejected') => Promise<void>;
}

export const AdminPaymentManager: React.FC<AdminPaymentManagerProps> = ({
  payments,
  orders,
  onUpdatePayment,
  onVerifyOrderPayment,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState('');
  const [editAccountType, setEditAccountType] = useState<'Personal' | 'Agent' | 'Merchant' | 'Digital Wallet'>('Personal');
  const [editIsEnabled, setEditIsEnabled] = useState(true);
  const [editInstructions, setEditInstructions] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [searchTrx, setSearchTrx] = useState('');
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  const handleStartEdit = (p: PaymentMethodConfig) => {
    setEditingId(p.id);
    setEditNumber(p.number);
    setEditAccountType(p.accountType);
    setEditIsEnabled(p.isEnabled);
    setEditInstructions(p.instructions);
    setSavedSuccess(false);
  };

  const handleSavePayment = async (id: string) => {
    if (!editNumber.trim()) return;
    await onUpdatePayment(id, editNumber.trim(), editAccountType, editIsEnabled, editInstructions);
    setEditingId(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Payments verification queue (Pending and recent verified orders)
  const filteredPayments = orders.filter((o) => {
    if (!searchTrx.trim()) return true;
    const clean = searchTrx.trim().toLowerCase();
    return (
      o.transactionId.toLowerCase().includes(clean) ||
      o.customerPhone.includes(clean) ||
      o.orderNumber.toLowerCase().includes(clean)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-pink-400" />
            <h2 className="font-['Orbitron'] font-black text-xl text-white">
              bKash &amp; Nagad Payment Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure payment numbers, instructions, and audit incoming TrxID verifications
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Payment Settings Updated!</span>
          </div>
        )}
      </div>

      {/* Payment Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {payments.map((p) => {
          const isEditing = editingId === p.id;
          const isBkash = p.method === 'bKash';

          return (
            <div
              key={p.id}
              className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
                isBkash
                  ? 'bg-gradient-to-br from-[#1c1221] to-[#0e1424] border-pink-500/30'
                  : 'bg-gradient-to-br from-[#20150e] to-[#0e1424] border-orange-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-lg ${
                        isBkash ? 'bg-[#E2136E]' : 'bg-[#F7941D]'
                      }`}
                    >
                      {isBkash ? 'bK' : 'নগদ'}
                    </div>
                    <div>
                      <h3 className="font-['Orbitron'] font-bold text-lg text-white">
                        {p.method} Gateway
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {p.accountType} Account
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      p.isEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {p.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>

                {/* Number & Config Display or Edit */}
                {isEditing ? (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {p.method} Payment Number *
                      </label>
                      <input
                        type="text"
                        value={editNumber}
                        onChange={(e) => setEditNumber(e.target.value)}
                        className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Account Type
                        </label>
                        <select
                          value={editAccountType}
                          onChange={(e) => setEditAccountType(e.target.value as any)}
                          className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                        >
                          <option value="Personal">Personal</option>
                          <option value="Merchant">Merchant</option>
                          <option value="Agent">Agent</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editIsEnabled}
                            onChange={(e) => setEditIsEnabled(e.target.checked)}
                            className="w-4 h-4 rounded text-cyan-500"
                          />
                          <span>Enable Method</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Customer Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={editInstructions}
                        onChange={(e) => setEditInstructions(e.target.value)}
                        className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSavePayment(p.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Save Number
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Current Send Money Number
                      </span>
                      <div className="font-mono text-2xl font-black text-amber-300 tracking-wider">
                        {p.number}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-slate-800/80">
                      {p.instructions}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#141c2e] hover:bg-[#1d273f] text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Number &amp; Text</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Verification Queue Table */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1424] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-['Orbitron'] font-bold text-base text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>Incoming Transaction ID Verification Queue</span>
            </h3>
            <p className="text-xs text-slate-400">
              Cross-check incoming TrxID with your bKash / Nagad statement before approving
            </p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search TrxID or phone..."
              value={searchTrx}
              onChange={(e) => setSearchTrx(e.target.value)}
              className="w-full bg-[#13192b] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#13192b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">TrxID &amp; Gateway</th>
                <th className="py-3 px-4">Customer Mobile</th>
                <th className="py-3 px-4">Amount Expected</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Proof Slip</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#13192b]/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-emerald-400 font-bold text-xs block">
                      {ord.transactionId}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        ord.paymentMethod === 'bKash' ? 'text-pink-400' : 'text-orange-400'
                      }`}
                    >
                      {ord.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-white">
                    {ord.customerPhone}
                  </td>

                  <td className="py-3 px-4 font-['Orbitron'] font-bold text-amber-300">
                    ৳{ord.amount}
                  </td>

                  <td className="py-3 px-4 font-['Orbitron'] font-semibold text-cyan-400">
                    {ord.orderNumber}
                  </td>

                  <td className="py-3 px-4">
                    {ord.paymentScreenshot ? (
                      <button
                        onClick={() => setPreviewScreenshot(ord.paymentScreenshot!)}
                        className="flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
                      >
                        <FileImage className="w-4 h-4" />
                        <span>View Slip</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">No image</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
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
                    {ord.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => onVerifyOrderPayment(ord.id, 'Processing')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          Verify TrxID
                        </button>
                        <button
                          onClick={() => onVerifyOrderPayment(ord.id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/30 font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-lg w-full bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-5 text-center space-y-4">
            <button
              onClick={() => setPreviewScreenshot(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-['Orbitron'] font-bold text-white text-base">
              Customer Payment Slip
            </h4>
            <div className="max-h-[70vh] overflow-hidden rounded-2xl border border-slate-800">
              <img
                src={previewScreenshot}
                alt="Payment Slip"
                className="w-full h-auto object-contain"
              />
            </div>
            <button
              onClick={() => setPreviewScreenshot(null)}
              className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
