import React, { useState } from 'react';
import {
  X,
  Wallet,
  CheckCircle2,
  Copy,
  AlertCircle,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PaymentMethodConfig, Customer } from '../types';

interface AddMoneyModalProps {
  currentBalance: number;
  paymentConfigs: PaymentMethodConfig[];
  onClose: () => void;
  onAddMoneySuccess: (amount: number, trxId: string, method: string) => void;
  isLightMode?: boolean;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  currentBalance,
  paymentConfigs,
  onClose,
  onAddMoneySuccess,
  isLightMode = true,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [amount, setAmount] = useState<string>('100');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeConfig = paymentConfigs.find((p) => p.method === selectedMethod) || {
    id: 'def',
    method: selectedMethod,
    number: '01700000000',
    accountType: 'Personal' as const,
    isEnabled: true,
    instructions: 'Send Money to this personal number and enter TrxID below.',
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activeConfig.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 10) {
      setErrorMsg('ন্যূনতম ১০ টাকা ডিপোজিট করতে হবে');
      return;
    }
    if (!trxId.trim() || trxId.trim().length < 6) {
      setErrorMsg('সঠিক ৮-১০ ডিজিটের Transaction ID (TrxID) লিখুন');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onAddMoneySuccess(numAmount, trxId.trim(), selectedMethod);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
        isLightMode
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#101726] border-slate-800 text-slate-100'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              টাকা সফলভাবে যোগ হয়েছে!
            </h3>
            <p className="text-xs text-slate-500">
              আপনার ওয়ালেটে <span className="font-bold text-emerald-600 font-mono">৳ {amount}</span> যুক্ত করা হয়েছে।
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              নতুন ওয়ালেট ব্যালেন্স: <span className="font-black text-[#0066FF] font-mono text-sm">৳ {currentBalance + parseFloat(amount || '0')}</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#0066FF] text-white font-bold text-sm shadow-lg shadow-blue-500/20"
            >
              ঠিক আছে (Done)
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0066FF] flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  Add Money (ওয়ালেটে টাকা যোগ করুন)
                </h3>
                <p className="text-xs text-slate-500">
                  বর্তমান ব্যালেন্স: <span className="font-bold text-[#0066FF] font-mono">৳ {currentBalance}</span>
                </p>
              </div>
            </div>

            {/* Select Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {(['bKash', 'Nagad', 'Rocket'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedMethod === method
                      ? 'border-[#0066FF] bg-blue-50 dark:bg-blue-950 text-[#0066FF] shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Official Number Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {selectedMethod} ({activeConfig.accountType || 'Personal'} Number):
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  Send Money
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-black text-base text-slate-900 dark:text-white tracking-wider">
                  {activeConfig.number}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0066FF] text-white hover:bg-blue-600 transition-all shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  টাকার পরিমাণ (Amount in BDT) *
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {['50', '100', '250', '500'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        amount === preset
                          ? 'border-[#0066FF] bg-[#0066FF] text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ৳ {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="10"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold outline-none border ${
                    isLightMode
                      ? 'border-slate-300 bg-white focus:border-[#0066FF]'
                      : 'border-slate-700 bg-[#13192b] focus:border-cyan-500'
                  }`}
                  placeholder="টাকার পরিমাণ লিখুন"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number)
                </label>
                <input
                  type="text"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono outline-none border ${
                    isLightMode
                      ? 'border-slate-300 bg-white focus:border-[#0066FF]'
                      : 'border-slate-700 bg-[#13192b] focus:border-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => {
                    setTrxId(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="e.g. BL924KLX8P"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold uppercase outline-none border ${
                    errorMsg
                      ? 'border-red-500 bg-red-50/50'
                      : isLightMode
                      ? 'border-slate-300 bg-white focus:border-[#0066FF]'
                      : 'border-slate-700 bg-[#13192b] focus:border-cyan-500'
                  }`}
                />
                {errorMsg && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-black text-sm bg-[#0066FF] hover:bg-blue-600 text-white transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>ভেরিফাই হচ্ছে...</span>
                ) : (
                  <>
                    <span>টাকা যোগ করুন (Add ৳ {amount || 0})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
