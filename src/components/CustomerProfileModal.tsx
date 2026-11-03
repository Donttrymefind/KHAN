import React from 'react';
import { X, User, ShoppingBag, ShieldCheck, LogOut, Phone, Mail } from 'lucide-react';
import { Order } from '../types';

interface CustomerProfileModalProps {
  user: any;
  orders: Order[];
  onClose: () => void;
  onLogout: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  user,
  orders,
  onClose,
  onLogout,
  onTrackOrder,
}) => {
  if (!user) return null;

  // Filter orders by customer
  const userOrders = orders.filter(
    (o) =>
      o.customerEmail === user.email ||
      (user.phoneNumber && o.customerPhone === user.phoneNumber) ||
      o.customerId === user.uid
  );

  const totalSpent = userOrders.reduce((sum, o) => sum + (o.status !== 'Rejected' ? o.amount : 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-16 h-16 rounded-2xl border-2 border-cyan-400 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-cyan-900 border-2 border-cyan-400 flex items-center justify-center text-xl font-bold">
              {user.displayName?.[0] || 'U'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Orbitron'] font-bold text-lg text-white">
                {user.displayName || 'Customer Account'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Verified Gamer
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3" />
              <span>{user.email || 'No email attached'}</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3.5 rounded-2xl bg-[#13192b] border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Orders</span>
            <div className="font-['Orbitron'] font-black text-xl text-cyan-400 mt-0.5">
              {userOrders.length}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#13192b] border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Spent</span>
            <div className="font-['Orbitron'] font-black text-xl text-amber-400 mt-0.5">
              ৳{totalSpent}
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Your Order History
          </h4>

          {userOrders.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#13192b] text-center text-xs text-slate-400">
              You haven&rsquo;t placed any orders with this account yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {userOrders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    onClose();
                    onTrackOrder(o.orderNumber);
                  }}
                  className="p-3 rounded-xl bg-[#13192b] hover:bg-[#182138] border border-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-xs text-white">{o.productTitle}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {o.orderNumber} • ৳{o.amount}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      o.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : o.status === 'Processing'
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Logout */}
        <div className="pt-5 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
