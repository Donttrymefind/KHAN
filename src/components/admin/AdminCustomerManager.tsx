import React, { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShoppingBag,
  Phone,
  Mail,
  Edit2,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { Customer, Order } from '../../types';

interface AdminCustomerManagerProps {
  customers: Customer[];
  orders: Order[];
  onToggleCustomerStatus: (customerId: string, status: 'active' | 'suspended') => Promise<void>;
  onUpdateSupportNote: (customerId: string, note: string) => Promise<void>;
  onUpdateCustomerWallet?: (customerId: string, balance: number) => Promise<void>;
}

export const AdminCustomerManager: React.FC<AdminCustomerManagerProps> = ({
  customers,
  orders,
  onToggleCustomerStatus,
  onUpdateSupportNote,
  onUpdateCustomerWallet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [walletInput, setWalletInput] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  const handleStartEditNote = (c: Customer) => {
    setEditingNoteId(c.id);
    setNoteInput(c.supportNotes || '');
  };

  const handleSaveNote = async (customerId: string) => {
    await onUpdateSupportNote(customerId, noteInput);
    setEditingNoteId(null);
  };

  // Get orders for customer modal
  const customerOrders = selectedCustomer
    ? orders.filter(
        (o) =>
          o.customerPhone === selectedCustomer.phone ||
          (selectedCustomer.email && o.customerEmail === selectedCustomer.email) ||
          o.customerId === selectedCustomer.id
      )
    : [];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-[#0e1424] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="font-['Orbitron'] font-black text-xl text-white">
              Customer Accounts &amp; Activity
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            View customer order histories, contact information, support notes, and account status
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13192b] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-3xl bg-[#0e1424] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#13192b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Wallet Balance</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Support &amp; Admin Notes</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-[#13192b]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{c.name}</div>
                    <div className="text-[10px] text-slate-400">
                      Joined {new Date(c.joinedAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-cyan-300 font-bold">{c.phone}</div>
                    {c.email && <div className="text-[10px] text-slate-400">{c.email}</div>}
                  </td>

                  <td className="py-3.5 px-4">
                    {editingWalletId === c.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={walletInput}
                          onChange={(e) => setWalletInput(Number(e.target.value))}
                          className="w-20 bg-[#13192b] border border-emerald-400 rounded px-2 py-0.5 text-xs text-emerald-400 font-mono font-bold"
                        />
                        <button
                          onClick={async () => {
                            if (onUpdateCustomerWallet) {
                              await onUpdateCustomerWallet(c.id, walletInput);
                            }
                            setEditingWalletId(null);
                          }}
                          className="p-1 rounded bg-emerald-600 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingWalletId(null)}
                          className="p-1 rounded bg-slate-700 text-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingWalletId(c.id);
                          setWalletInput(c.walletBalance || 0);
                        }}
                        className="cursor-pointer group flex items-center gap-1.5 p-1 rounded hover:bg-[#13192b]"
                        title="Click to modify wallet funds"
                      >
                        <span className="font-['Orbitron'] font-bold text-emerald-400">
                          ৳{c.walletBalance || 0}
                        </span>
                        <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100" />
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-['Orbitron'] font-bold text-white">
                    {c.totalOrders}
                  </td>

                  <td className="py-3.5 px-4 font-['Orbitron'] font-bold text-amber-400">
                    ৳{c.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    {editingNoteId === c.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          className="w-full bg-[#13192b] border border-cyan-400 rounded-lg px-2 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => handleSaveNote(c.id)}
                          className="p-1 rounded bg-emerald-600 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="p-1 rounded bg-slate-700 text-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleStartEditNote(c)}
                        className="cursor-pointer group flex items-center justify-between p-1.5 rounded-lg hover:bg-[#13192b] text-slate-300"
                        title="Click to edit internal support note"
                      >
                        <span className="line-clamp-1 text-[11px]">
                          {c.supportNotes || 'No notes added. Click to add.'}
                        </span>
                        <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100" />
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() =>
                        onToggleCustomerStatus(
                          c.id,
                          c.status === 'active' ? 'suspended' : 'active'
                        )
                      }
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        c.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-red-950/60 text-red-300 border-red-500/50 hover:bg-red-900/60'
                      }`}
                    >
                      {c.status === 'active' ? 'Active' : 'Suspended'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-3 py-1.5 rounded-xl bg-[#13192b] hover:bg-[#1a233c] text-cyan-300 border border-slate-700 text-xs font-semibold"
                    >
                      History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Orders History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-1">
              {selectedCustomer.name}&rsquo;s Orders
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Phone: {selectedCustomer.phone} &bull; Total Spent: ৳{selectedCustomer.totalSpent}
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {customerOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-[#13192b] rounded-2xl">
                  No historical orders found under this account phone.
                </div>
              ) : (
                customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-xl bg-[#13192b] border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white text-xs">{ord.productTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ord.orderNumber} &bull; {ord.paymentMethod} &bull; ৳{ord.amount}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
