import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpDown,
  Sliders,
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';

interface AdminProductControlProps {
  products: Product[];
  onUpdatePrice: (productId: string, newPrice: number, originalPrice?: number) => Promise<void>;
  onUpdateStock: (
    productId: string,
    stock: number,
    isUnlimited: boolean,
    isOutOfStock: boolean
  ) => Promise<void>;
  onToggleStatus: (productId: string, isActive: boolean) => Promise<void>;
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export const AdminProductControl: React.FC<AdminProductControlProps> = ({
  products,
  onUpdatePrice,
  onUpdateStock,
  onToggleStatus,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline price editing state: { [productId]: number }
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>({});
  const [editingOriginalPrices, setEditingOriginalPrices] = useState<Record<string, number>>({});
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);

  // Add / Edit Product Modal state
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentEditProduct, setCurrentEditProduct] = useState<Partial<Product>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'diamond', label: 'FF Diamonds' },
    { id: 'membership', label: 'Memberships' },
    { id: 'level_up', label: 'Level Up Pass' },
    { id: 'evo_access', label: 'Evo Access' },
    { id: 'social_fb', label: 'Facebook Boost' },
    { id: 'social_insta', label: 'Instagram Boost' },
    { id: 'other', label: 'Other Services' },
  ];

  const handleStartInlineEdit = (p: Product) => {
    setEditingPrices((prev) => ({ ...prev, [p.id]: p.price }));
    setEditingOriginalPrices((prev) => ({ ...prev, [p.id]: p.originalPrice }));
  };

  const handleSaveInlinePrice = async (p: Product) => {
    const newPrice = editingPrices[p.id];
    const newOriginal = editingOriginalPrices[p.id];
    if (newPrice === undefined || isNaN(newPrice) || newPrice <= 0) return;

    setSavingPriceId(p.id);
    try {
      await onUpdatePrice(p.id, Number(newPrice), Number(newOriginal) || p.originalPrice);
      // Remove from editing state
      setEditingPrices((prev) => {
        const copy = { ...prev };
        delete copy[p.id];
        return copy;
      });
    } finally {
      setSavingPriceId(null);
    }
  };

  const handleCancelInlinePrice = (p: Product) => {
    setEditingPrices((prev) => {
      const copy = { ...prev };
      delete copy[p.id];
      return copy;
    });
  };

  const handleOpenAddModal = () => {
    setCurrentEditProduct({
      id: 'prod_' + Date.now(),
      name: '',
      category: 'diamond',
      price: 100,
      originalPrice: 120,
      stock: 100,
      isUnlimited: true,
      isOutOfStock: false,
      isActive: true,
      badge: 'New',
      description: 'Official UID instant delivery package.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    });
    setModalMode('add');
  };

  const handleOpenEditModal = (p: Product) => {
    setCurrentEditProduct({ ...p });
    setModalMode('edit');
  };

  const handleSaveModalProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditProduct.name || !currentEditProduct.price) return;

    const fullProduct: Product = {
      id: currentEditProduct.id || 'prod_' + Date.now(),
      name: currentEditProduct.name,
      category: currentEditProduct.category || 'diamond',
      price: Number(currentEditProduct.price),
      originalPrice: Number(currentEditProduct.originalPrice) || Number(currentEditProduct.price),
      stock: Number(currentEditProduct.stock) || 0,
      isUnlimited: Boolean(currentEditProduct.isUnlimited),
      isOutOfStock: Boolean(currentEditProduct.isOutOfStock),
      isActive: currentEditProduct.isActive !== undefined ? currentEditProduct.isActive : true,
      badge: currentEditProduct.badge || '',
      description: currentEditProduct.description || '',
      image: currentEditProduct.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
      diamondCount: currentEditProduct.diamondCount,
      bonus: currentEditProduct.bonus,
      updatedAt: new Date().toISOString(),
    };

    await onSaveProduct(fullProduct);
    setModalMode(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0e1424] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h2 className="font-['Orbitron'] font-black text-xl text-white">
              Product &amp; Price Control Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time control over Free Fire Diamond packages, Memberships, Evo Access &amp; Stock
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Category selector & Search bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-[#13192b] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#13192b] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-[#0e1424] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#13192b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Item &amp; Category</th>
                <th className="py-3 px-4">Current Price (৳ BDT)</th>
                <th className="py-3 px-4">Stock Management</th>
                <th className="py-3 px-4">Catalog Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const isEditingPrice = editingPrices[p.id] !== undefined;
                const isOutOfStock = p.isOutOfStock || (!p.isUnlimited && p.stock <= 0);

                return (
                  <tr key={p.id} className="hover:bg-[#13192b]/40 transition-colors">
                    {/* Item Name & Visual */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-['Orbitron'] font-bold text-white text-sm flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            {p.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price Control (Inline Edit & Immediate Customer Sync) */}
                    <td className="py-3.5 px-4">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-[#13192b] border border-amber-400 rounded-lg px-2 py-1">
                            <span className="text-amber-400 font-bold">৳</span>
                            <input
                              type="number"
                              value={editingPrices[p.id]}
                              onChange={(e) =>
                                setEditingPrices((prev) => ({
                                  ...prev,
                                  [p.id]: Number(e.target.value),
                                }))
                              }
                              className="w-20 bg-transparent text-white font-['Orbitron'] font-bold text-xs focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={() => handleSaveInlinePrice(p)}
                            disabled={savingPriceId === p.id}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                            title="Save new price"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleCancelInlinePrice(p)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartInlineEdit(p)}
                          className="cursor-pointer group/price flex items-baseline gap-2 inline-flex py-1 px-2 rounded-lg hover:bg-[#13192b] border border-transparent hover:border-slate-700 transition-all"
                          title="Click to quickly edit price"
                        >
                          <span className="font-['Orbitron'] font-black text-base text-amber-400">
                            ৳{p.price}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-[10px] text-slate-500 line-through">
                              ৳{p.originalPrice}
                            </span>
                          )}
                          <Edit2 className="w-3 h-3 text-slate-500 group-hover/price:text-amber-400 opacity-0 group-hover/price:opacity-100 transition-opacity ml-1" />
                        </div>
                      )}
                    </td>

                    {/* Stock Management */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5 max-w-xs">
                        <div className="flex items-center gap-2">
                          {p.isUnlimited ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                              Unlimited Digital Stock
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  onUpdateStock(
                                    p.id,
                                    Math.max(0, p.stock - 5),
                                    p.isUnlimited,
                                    p.stock - 5 <= 0
                                  )
                                }
                                className="w-6 h-6 rounded bg-[#13192b] border border-slate-700 text-white font-bold hover:bg-slate-700 flex items-center justify-center text-xs"
                                title="Decrease 5"
                              >
                                -5
                              </button>
                              <span className="font-mono font-bold text-white text-xs px-2">
                                {p.stock} units
                              </span>
                              <button
                                onClick={() =>
                                  onUpdateStock(
                                    p.id,
                                    p.stock + 5,
                                    p.isUnlimited,
                                    false
                                  )
                                }
                                className="w-6 h-6 rounded bg-[#13192b] border border-slate-700 text-white font-bold hover:bg-slate-700 flex items-center justify-center text-xs"
                                title="Increase 5"
                              >
                                +5
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Quick stock toggles */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <button
                            onClick={() =>
                              onUpdateStock(
                                p.id,
                                p.stock,
                                !p.isUnlimited,
                                !p.isUnlimited ? false : p.isOutOfStock
                              )
                            }
                            className={`underline ${p.isUnlimited ? 'text-cyan-400' : 'text-slate-400'}`}
                          >
                            {p.isUnlimited ? 'Set Numeric Limit' : 'Make Unlimited'}
                          </button>

                          <span className="text-slate-600">&bull;</span>

                          <button
                            onClick={() =>
                              onUpdateStock(
                                p.id,
                                p.stock,
                                p.isUnlimited,
                                !p.isOutOfStock
                              )
                            }
                            className={`font-semibold ${
                              isOutOfStock ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {isOutOfStock ? 'Mark In Stock' : 'Mark Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Catalog Status (Active / Disabled) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => onToggleStatus(p.id, !p.isActive)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                            p.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.isActive ? 'bg-emerald-400' : 'bg-slate-500'
                            }`}
                          />
                          <span>{p.isActive ? 'Active in Store' : 'Temporarily Disabled'}</span>
                        </button>

                        {isOutOfStock && p.isActive && (
                          <div className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Out of Stock (Button Disabled)</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 rounded-xl bg-[#13192b] hover:bg-[#1f2845] text-cyan-300 border border-slate-700 transition-colors"
                        title="Edit full product details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e1424] border border-red-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-['Orbitron'] font-bold text-lg text-white">Delete Product?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this product from the KHAN TOP UP catalog? Customers will no longer see it.
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
                  await onDeleteProduct(deleteConfirmId);
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

      {/* Add / Edit Product Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0e1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-6">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</span>
            </h3>

            <form onSubmit={handleSaveModalProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 505 Diamonds or Level Up Pass"
                  value={currentEditProduct.name || ''}
                  onChange={(e) =>
                    setCurrentEditProduct({ ...currentEditProduct, name: e.target.value })
                  }
                  className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={currentEditProduct.category || 'diamond'}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="diamond">FF Diamonds</option>
                    <option value="membership">Memberships</option>
                    <option value="level_up">Level Up Pass</option>
                    <option value="evo_access">Evo Access</option>
                    <option value="social_fb">Facebook Boost</option>
                    <option value="social_insta">Instagram Boost</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hot Seller, Best Value"
                    value={currentEditProduct.badge || ''}
                    onChange={(e) =>
                      setCurrentEditProduct({ ...currentEditProduct, badge: e.target.value })
                    }
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Selling Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={currentEditProduct.price || ''}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Original Price (৳ Strike)
                  </label>
                  <input
                    type="number"
                    value={currentEditProduct.originalPrice || ''}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-400"
                  />
                </div>
              </div>

              {/* Stock controls */}
              <div className="p-3.5 rounded-2xl bg-[#13192b] border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Unlimited Digital Stock</label>
                  <input
                    type="checkbox"
                    checked={Boolean(currentEditProduct.isUnlimited)}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        isUnlimited: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                </div>

                {!currentEditProduct.isUnlimited && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min={0}
                      value={currentEditProduct.stock || 0}
                      onChange={(e) =>
                        setCurrentEditProduct({
                          ...currentEditProduct,
                          stock: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0e1424] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <label className="text-xs font-bold text-red-400">Mark as Out of Stock</label>
                  <input
                    type="checkbox"
                    checked={Boolean(currentEditProduct.isOutOfStock)}
                    onChange={(e) =>
                      setCurrentEditProduct({
                        ...currentEditProduct,
                        isOutOfStock: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-red-500"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={currentEditProduct.image || ''}
                  onChange={(e) =>
                    setCurrentEditProduct({ ...currentEditProduct, image: e.target.value })
                  }
                  className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={currentEditProduct.description || ''}
                  onChange={(e) =>
                    setCurrentEditProduct({ ...currentEditProduct, description: e.target.value })
                  }
                  className="w-full bg-[#13192b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
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
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
