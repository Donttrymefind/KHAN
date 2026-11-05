import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Eye,
  Sliders,
  AlertTriangle,
  Clock,
  RefreshCw,
  History,
  Flame,
  Crown,
  Search,
} from 'lucide-react';
import { MysteryBox, GuaranteedReward } from '../../types';

interface AdminMysteryBoxManagerProps {
  mysteryBoxes: MysteryBox[];
  onSaveBox: (box: MysteryBox) => Promise<void>;
  onDeleteBox: (boxId: string) => Promise<void>;
}

export const AdminMysteryBoxManager: React.FC<AdminMysteryBoxManagerProps> = ({
  mysteryBoxes,
  onSaveBox,
  onDeleteBox,
}) => {
  const [activeTab, setActiveTab] = useState<'boxes' | 'history' | 'cooldowns'>('boxes');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentBox, setCurrentBox] = useState<Partial<MysteryBox>>({});
  const [rewardsList, setRewardsList] = useState<GuaranteedReward[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New reward temporary input
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardQuantity, setNewRewardQuantity] = useState('');
  const [newRewardRarity, setNewRewardRarity] = useState<'Mythic' | 'Legendary' | 'Epic' | 'Rare'>('Legendary');
  const [newRewardIcon, setNewRewardIcon] = useState('💎');
  const [newRewardProbability, setNewRewardProbability] = useState('20');
  const [newRewardIsJackpot, setNewRewardIsJackpot] = useState(false);

  // Live Opening History & Cooldown state
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [cooldownList, setCooldownList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchOpeningData = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/mystery-box/history');
      const data = await res.json();
      if (data.success) {
        setHistoryList(data.history || []);
        setCooldownList(data.activeCooldowns || []);
      }
    } catch {
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history' || activeTab === 'cooldowns') {
      fetchOpeningData();
    }
  }, [activeTab]);

  const handleResetCooldown = async (userId: string, boxId?: string) => {
    const adminToken = localStorage.getItem('ktu_admin_token');
    try {
      const res = await fetch('/api/admin/mystery-box/reset-cooldown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken || ''}`,
        },
        body: JSON.stringify({ userId, boxId }),
      });
      const data = await res.json();
      if (data.success) {
        setResetMessage(`সফলভাবে ${userId} এর Cooldown রিসেট করা হয়েছে!`);
        setTimeout(() => setResetMessage(null), 4000);
        fetchOpeningData();
      } else {
        alert(data.message || 'Cooldown reset failed');
      }
    } catch (e: any) {
      alert('Error resetting cooldown: ' + e.message);
    }
  };

  const handleOpenAdd = () => {
    setCurrentBox({
      id: 'mb_custom_' + Date.now(),
      name: '',
      price: 299,
      image: '/assets/branding/mb_starter.svg',
      badge: '১০০% নিশ্চিত ড্রপ',
      stock: 50,
      isUnlimited: true,
      isActive: true,
      cooldownHours: 0,
      description: '১০০% নিশ্চিত পুরষ্কার ড্রপ ও স্বচ্ছ রেট',
    });
    setRewardsList([
      {
        id: 'r_' + Date.now(),
        name: 'Free Fire Diamonds',
        quantity: '355 💎',
        icon: '💎',
        rarity: 'Mythic',
        probability: 30,
        description: 'Direct in-game UID delivery',
      },
    ]);
    setModalMode('add');
  };

  const handleOpenEdit = (box: MysteryBox) => {
    setCurrentBox({ ...box });
    setRewardsList([...box.guaranteedRewards]);
    setModalMode('edit');
  };

  const handleAddRewardItem = () => {
    if (!newRewardName.trim() || !newRewardQuantity.trim()) return;
    const item: GuaranteedReward = {
      id: 'r_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: newRewardName.trim(),
      quantity: newRewardQuantity.trim(),
      rarity: newRewardRarity,
      icon: newRewardIcon || '🎁',
      probability: Number(newRewardProbability) || 20,
      isJackpot: newRewardIsJackpot,
    };
    setRewardsList([...rewardsList, item]);
    setNewRewardName('');
    setNewRewardQuantity('');
    setNewRewardProbability('20');
    setNewRewardIsJackpot(false);
  };

  const handleRemoveRewardItem = (id: string) => {
    setRewardsList(rewardsList.filter((r) => r.id !== id));
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBox.name || !currentBox.price) return;

    const fullBox: MysteryBox = {
      id: currentBox.id || 'mb_' + Date.now(),
      name: currentBox.name,
      price: Number(currentBox.price),
      image: currentBox.image || '/assets/branding/mb_starter.svg',
      badge: currentBox.badge || '100% Guaranteed',
      stock: Number(currentBox.stock) || 0,
      isUnlimited: Boolean(currentBox.isUnlimited),
      isActive: currentBox.isActive !== undefined ? currentBox.isActive : true,
      cooldownHours: Number(currentBox.cooldownHours) || 0,
      description: currentBox.description || '১০০% নিশ্চিত পুরষ্কার ড্রপ',
      guaranteedRewards: rewardsList,
      createdAt: currentBox.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSaveBox(fullBox);
    setModalMode(null);
  };

  // Calculate sum of probabilities in current edit modal
  const totalProbability = rewardsList.reduce((sum, r) => sum + (Number(r.probability) || 0), 0);

  const filteredHistory = historyList.filter((h) => {
    const q = historySearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (h.userName && h.userName.toLowerCase().includes(q)) ||
      (h.userId && h.userId.toLowerCase().includes(q)) ||
      (h.boxName && h.boxName.toLowerCase().includes(q)) ||
      (h.rewardWon?.name && h.rewardWon.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0e1424] border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="font-['Orbitron'] font-black text-xl text-white">
              Mystery Box &amp; 24H Cooldown Control Panel
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ১৫টি মিষ্টি বক্স কনফিগার করুন, পুরস্কারের ড্রপ রেট পরিবর্তন করুন এবং সার্ভার-সাইড ২৪ ঘণ্টার Cooldown মনিটর করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>নতুন বক্স তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Boxes / Opening History / Active Cooldowns */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0e1424] border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('boxes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'boxes'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>সকল ১৫টি মিষ্টি বক্স ({mysteryBoxes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cooldowns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cooldowns'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>সক্রিয় Cooldown মনিটর ({cooldownList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>ইউজার ওপেনিং হিস্টোরি ({historyList.length})</span>
        </button>
      </div>

      {resetMessage && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: 15 BOXES GRID & EDIT
      ========================================================================= */}
      {activeTab === 'boxes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mysteryBoxes.map((box) => {
            const hasCooldown = box.cooldownHours && box.cooldownHours > 0;
            return (
              <div
                key={box.id}
                className={`rounded-3xl bg-[#0e1424] border transition-all p-5 flex flex-col justify-between shadow-xl space-y-4 ${
                  hasCooldown ? 'border-purple-500/50 shadow-purple-950/20' : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div>
                  {/* Header Visual */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-16 h-16 rounded-2xl object-contain bg-slate-900 border border-amber-500/30 p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {box.badge}
                        </span>
                        {hasCooldown && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-purple-900/60 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{box.cooldownHours}H Cooldown</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-['Orbitron'] font-bold text-base text-white mt-1 truncate">
                        {box.name}
                      </h3>
                      <div className="font-['Orbitron'] font-black text-xl text-amber-400">
                        ৳{box.price}
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Items Summary */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        নিশ্চিত পুরস্কার ({box.guaranteedRewards.length})
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        ১০০% রেট
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {box.guaranteedRewards.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#13192b] border border-slate-800/80"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{r.icon || '🎁'}</span>
                            <span className="text-white font-medium truncate">{r.name}</span>
                            {r.probability && (
                              <span className="text-[9px] px-1 rounded bg-black/40 text-emerald-400 font-bold">
                                {r.probability}%
                              </span>
                            )}
                          </div>
                          <span className="font-['Orbitron'] font-bold text-amber-300 text-[11px] shrink-0">
                            {r.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      box.isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {box.isActive ? 'Active on Store' : 'Hidden'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(box)}
                      className="px-3 py-1.5 rounded-xl bg-[#13192b] hover:bg-[#1a233c] text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Box</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(box.id)}
                      className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ACTIVE 24-HOUR COOLDOWNS MONITOR
      ========================================================================= */}
      {activeTab === 'cooldowns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0e1424] border border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>বর্তমান সক্রিয় ইউজার Cooldowns (Server Authoritative)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                রয়েল বক্স ও স্পেশাল বক্সের ২৪ ঘণ্টার সার্ভার টাইমস্ট্যাম্প। গ্রাহক রিফ্রেশ বা ব্রাউজার পরিবর্তন করলেও এটি সার্ভারে সংরক্ষিত থাকে।
              </p>
            </div>
            <button
              onClick={fetchOpeningData}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          {cooldownList.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[#0e1424] border border-slate-800 text-slate-400 text-sm">
              বর্তমানে কোনো ইউজারের সক্রিয় Cooldown নেই। গ্রাহকরা স্বাধীনভাবে বক্স খুলতে পারবেন।
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#0e1424]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#13192b] text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="p-3.5">User / UID</th>
                    <th className="p-3.5">Box</th>
                    <th className="p-3.5">Last Opened</th>
                    <th className="p-3.5">Expires At</th>
                    <th className="p-3.5">Remaining</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {cooldownList.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#13192b]/50">
                      <td className="p-3.5 font-mono text-cyan-300 font-bold">{c.userId}</td>
                      <td className="p-3.5 font-bold text-white">{c.boxId}</td>
                      <td className="p-3.5 text-slate-400">
                        {new Date(c.lastOpenedAt).toLocaleString('bn-BD')}
                      </td>
                      <td className="p-3.5 text-purple-300">
                        {new Date(c.nextAvailableAt).toLocaleString('bn-BD')}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-500/40 font-mono font-bold">
                          {c.remainingFormatted}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleResetCooldown(c.userId, c.boxId)}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 text-[11px] font-bold cursor-pointer"
                        >
                          রিসেট Cooldown
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: USER BOX OPENING HISTORY
      ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0e1424] border border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>মিষ্টি বক্স ওপেনিং ইতিহাস (Opening Logs)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                গ্রাহকরা কোন বক্স খুলেছেন, কত টাকা পেমেন্ট করেছেন এবং কি পুরস্কার পেয়েছেন তার পূর্ণ রেকর্ড
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="ইউজার বা বক্স খুঁজুন..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-[#13192b] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
                />
              </div>
              <button
                onClick={fetchOpeningData}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[#0e1424] border border-slate-800 text-slate-400 text-sm">
              কোনো ওপেনিং হিস্টোরি পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#0e1424]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#13192b] text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5">Customer / User</th>
                    <th className="p-3.5">Box Name</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Won Reward</th>
                    <th className="p-3.5">Rarity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredHistory.map((h, idx) => (
                    <tr key={idx} className="hover:bg-[#13192b]/50">
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(h.openedAt).toLocaleString('bn-BD')}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{h.userName || 'Gamer'}</div>
                        <div className="font-mono text-[10px] text-slate-500">{h.userId}</div>
                      </td>
                      <td className="p-3.5 font-bold text-amber-300">{h.boxName}</td>
                      <td className="p-3.5 font-['Orbitron'] font-black text-amber-400">
                        ৳{h.pricePaid}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                          <span>{h.rewardWon?.icon || '🎁'}</span>
                          <span>{h.rewardWon?.name}</span>
                          <span className="font-mono text-amber-400 text-[11px]">
                            ({h.rewardWon?.quantity})
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-black/50 text-cyan-300 border border-white/10">
                          {h.rewardWon?.rarity || 'Epic'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
      ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e1424] border border-red-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-['Orbitron'] font-bold text-lg text-white">Delete Mystery Box?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this Mystery Box? Customers will no longer be able to purchase it.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteBox(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD / EDIT MODAL
      ========================================================================= */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0e1424] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-6">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>{modalMode === 'add' ? 'Create Mystery Box' : 'Edit Mystery Box'}</span>
            </h3>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Box Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Box"
                    value={currentBox.name || ''}
                    onChange={(e) => setCurrentBox({ ...currentBox, name: e.target.value })}
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={currentBox.price || ''}
                    onChange={(e) =>
                      setCurrentBox({ ...currentBox, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-amber-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Image Asset
                  </label>
                  <input
                    type="text"
                    value={currentBox.image || ''}
                    onChange={(e) => setCurrentBox({ ...currentBox, image: e.target.value })}
                    placeholder="/assets/branding/mb_royal.svg"
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={currentBox.badge || ''}
                    onChange={(e) => setCurrentBox({ ...currentBox, badge: e.target.value })}
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1 text-purple-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Cooldown (Hours)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={168}
                    value={currentBox.cooldownHours ?? 0}
                    onChange={(e) =>
                      setCurrentBox({ ...currentBox, cooldownHours: Number(e.target.value) })
                    }
                    className="w-full bg-[#13192b] border border-purple-500/50 rounded-xl px-3 py-2 text-xs text-purple-300 font-bold"
                  />
                </div>
              </div>

              {/* Guaranteed Reward Items Builder */}
              <div className="p-4 rounded-2xl bg-[#13192b] border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Guaranteed Rewards List (100% Transparent)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        totalProbability === 100
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      মোট চান্স: {totalProbability}%
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {rewardsList.length} items
                    </span>
                  </div>
                </div>

                {/* Existing items */}
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {rewardsList.map((reward) => (
                    <div
                      key={reward.id}
                      className="p-2 rounded-xl bg-[#0e1424] border border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{reward.icon}</span>
                        <span className="font-semibold text-white">{reward.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">
                          ({reward.quantity})
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                          {reward.rarity}
                        </span>
                        {reward.probability !== undefined && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold">
                            {reward.probability}% চান্স
                          </span>
                        )}
                        {reward.isJackpot && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                            👑 Jackpot
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRewardItem(reward.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new reward sub-form */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Reward Name (e.g. 500 💎)"
                    value={newRewardName}
                    onChange={(e) => setNewRewardName(e.target.value)}
                    className="flex-1 min-w-[120px] bg-[#0e1424] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />

                  <input
                    type="text"
                    placeholder="Quantity (e.g. 1x / 355💎)"
                    value={newRewardQuantity}
                    onChange={(e) => setNewRewardQuantity(e.target.value)}
                    className="w-24 bg-[#0e1424] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />

                  <div className="flex items-center gap-1 bg-[#0e1424] border border-slate-700 rounded-lg px-2 py-1">
                    <span className="text-[10px] text-slate-400">চান্স:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      placeholder="%"
                      value={newRewardProbability}
                      onChange={(e) => setNewRewardProbability(e.target.value)}
                      className="w-12 bg-transparent text-xs text-amber-300 font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-amber-400 font-bold">%</span>
                  </div>

                  <select
                    value={newRewardRarity}
                    onChange={(e) => setNewRewardRarity(e.target.value as any)}
                    className="bg-[#0e1424] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="Mythic">Mythic</option>
                    <option value="Legendary">Legendary</option>
                    <option value="Epic">Epic</option>
                    <option value="Rare">Rare</option>
                  </select>

                  <label className="flex items-center gap-1 text-[11px] text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRewardIsJackpot}
                      onChange={(e) => setNewRewardIsJackpot(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-amber-500"
                    />
                    <span>Jackpot</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddRewardItem}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    + Add Item
                  </button>
                </div>
              </div>

              {/* Status & Unlimited Stock */}
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#13192b] border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(currentBox.isActive)}
                    onChange={(e) => setCurrentBox({ ...currentBox, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Active &amp; Visible on Customer Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(currentBox.isUnlimited)}
                    onChange={(e) =>
                      setCurrentBox({ ...currentBox, isUnlimited: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span>Unlimited Box Stock</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider"
                >
                  Save Mystery Box
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
