import React, { useState } from 'react';
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
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentBox, setCurrentBox] = useState<Partial<MysteryBox>>({});
  const [rewardsList, setRewardsList] = useState<GuaranteedReward[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New reward temporary input
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardQuantity, setNewRewardQuantity] = useState('');
  const [newRewardRarity, setNewRewardRarity] = useState<'Mythic' | 'Legendary' | 'Epic' | 'Rare'>('Legendary');
  const [newRewardIcon, setNewRewardIcon] = useState('💎');

  const handleOpenAdd = () => {
    setCurrentBox({
      id: 'box_' + Date.now(),
      name: '',
      price: 299,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      badge: '100% Guaranteed',
      stock: 50,
      isUnlimited: true,
      isActive: true,
    });
    setRewardsList([
      {
        id: 'r_' + Date.now(),
        name: 'Free Fire Diamonds',
        quantity: '355 💎',
        icon: '💎',
        rarity: 'Mythic',
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
    };
    setRewardsList([...rewardsList, item]);
    setNewRewardName('');
    setNewRewardQuantity('');
  };

  const handleRemoveRewardItem = (id: string) => {
    setRewardsList(rewardsList.filter((r) => r.id !== id));
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBox.name || !currentBox.price) return;

    const fullBox: MysteryBox = {
      id: currentBox.id || 'box_' + Date.now(),
      name: currentBox.name,
      price: Number(currentBox.price),
      image: currentBox.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      badge: currentBox.badge || '100% Guaranteed',
      stock: Number(currentBox.stock) || 0,
      isUnlimited: Boolean(currentBox.isUnlimited),
      isActive: currentBox.isActive !== undefined ? currentBox.isActive : true,
      guaranteedRewards: rewardsList,
      createdAt: currentBox.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSaveBox(fullBox);
    setModalMode(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0e1424] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="font-['Orbitron'] font-black text-xl text-white">
              Mystery Box &amp; Guaranteed Loot Manager
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure boxes, set prices, and specify 100% transparent guaranteed rewards for customers
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-['Orbitron'] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Mystery Box</span>
        </button>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mysteryBoxes.map((box) => (
          <div
            key={box.id}
            className="rounded-3xl bg-[#0e1424] border border-slate-800 hover:border-amber-500/40 p-5 flex flex-col justify-between shadow-xl space-y-4"
          >
            <div>
              {/* Header Visual */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-amber-500/30 shrink-0"
                />
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {box.badge}
                  </span>
                  <h3 className="font-['Orbitron'] font-bold text-base text-white mt-1">
                    {box.name}
                  </h3>
                  <div className="font-['Orbitron'] font-black text-xl text-amber-400">
                    ৳{box.price}
                  </div>
                </div>
              </div>

              {/* Guaranteed Items Summary */}
              <div className="pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Guaranteed Items ({box.guaranteedRewards.length})
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {box.guaranteedRewards.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#13192b] border border-slate-800/80"
                    >
                      <div className="flex items-center gap-2">
                        <span>{r.icon}</span>
                        <span className="text-white font-medium">{r.name}</span>
                      </div>
                      <span className="font-['Orbitron'] font-bold text-amber-300 text-[11px]">
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
                  className="px-3 py-1.5 rounded-xl bg-[#13192b] hover:bg-[#1a233c] text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Box</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(box.id)}
                  className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
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

      {/* Add / Edit Mystery Box Modal */}
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
                    placeholder="e.g. Booyah Legendary Crate"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={currentBox.image || ''}
                    onChange={(e) => setCurrentBox({ ...currentBox, image: e.target.value })}
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
              </div>

              {/* Guaranteed Reward Items Builder */}
              <div className="p-4 rounded-2xl bg-[#13192b] border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Guaranteed Rewards List (100% Transparent)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {rewardsList.length} items configured
                  </span>
                </div>

                {/* Existing items */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {rewardsList.map((reward) => (
                    <div
                      key={reward.id}
                      className="p-2 rounded-xl bg-[#0e1424] border border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{reward.icon}</span>
                        <span className="font-semibold text-white">{reward.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">
                          ({reward.quantity})
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-slate-400">
                          {reward.rarity}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRewardItem(reward.id)}
                        className="text-red-400 hover:text-red-300 p-1"
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
                    placeholder="Reward Name (e.g. 355 💎)"
                    value={newRewardName}
                    onChange={(e) => setNewRewardName(e.target.value)}
                    className="flex-1 min-w-[120px] bg-[#0e1424] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />

                  <input
                    type="text"
                    placeholder="Quantity (e.g. 5x Crates)"
                    value={newRewardQuantity}
                    onChange={(e) => setNewRewardQuantity(e.target.value)}
                    className="w-24 bg-[#0e1424] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />

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

                  <button
                    type="button"
                    onClick={handleAddRewardItem}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
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
