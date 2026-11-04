import React from 'react';
import {
  Home,
  ShoppingBag,
  Plus,
  CreditCard,
  User,
} from 'lucide-react';

interface BottomMobileBarProps {
  onGoHome: () => void;
  onOpenOrders: () => void;
  onOpenAddMoney: () => void;
  onOpenCodes: () => void;
  onOpenAccount: () => void;
  isLightMode?: boolean;
}

export const BottomMobileBar: React.FC<BottomMobileBarProps> = ({
  onGoHome,
  onOpenOrders,
  onOpenAddMoney,
  onOpenCodes,
  onOpenAccount,
  isLightMode = true,
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md px-2 py-1.5 transition-all shadow-lg ${
      isLightMode
        ? 'bg-white/95 border-slate-200 text-slate-600'
        : 'bg-[#0e1424]/95 border-slate-800 text-slate-300'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Tab 1: Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center p-1.5 text-[#0066FF] hover:opacity-80 transition-opacity"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        {/* Tab 2: My Orders */}
        <button
          onClick={onOpenOrders}
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#0066FF] transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">My Orders</span>
        </button>

        {/* Tab 3: Elevated Center + Add Money Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={onOpenAddMoney}
            className="w-12 h-12 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-white dark:border-[#0e1424] transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
          <span className="text-[10px] font-bold text-[#0066FF] mt-0.5">Add Money</span>
        </div>

        {/* Tab 4: My Codes */}
        <button
          onClick={onOpenCodes}
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#0066FF] transition-colors"
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">My Codes</span>
        </button>

        {/* Tab 5: My Account */}
        <button
          onClick={onOpenAccount}
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#0066FF] transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">My Account</span>
        </button>
      </div>
    </div>
  );
};
