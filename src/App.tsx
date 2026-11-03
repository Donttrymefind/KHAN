import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser } from './services/firebase';
import { store } from './services/store';
import {
  Product,
  MysteryBox,
  ProductCategory,
  Order,
  OrderStatus,
  WebsiteSettings,
} from './types';

// Customer Components
import { Navbar } from './components/Navbar';
import { PromoNotice } from './components/PromoNotice';
import { TelegramNoticeBar } from './components/TelegramNoticeBar';
import { HeroBanner } from './components/HeroBanner';
import { GameShopBoxes } from './components/GameShopBoxes';
import { DiamondShopPortal } from './components/DiamondShopPortal';
import { SocialBoostPortal } from './components/SocialBoostPortal';
import { RecentLiveOrdersWidget } from './components/RecentLiveOrdersWidget';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { FloatingSupportButton } from './components/FloatingSupportButton';
import { ProductCard } from './components/ProductCard';
import { MysteryBoxCard } from './components/MysteryBoxCard';
import { GuaranteedRewardsModal } from './components/GuaranteedRewardsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { PolicyModal } from './components/PolicyModal';
import { Footer } from './components/Footer';
import { GeminiChatbot } from './components/GeminiChatbot';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminHeader, AdminTab } from './components/admin/AdminHeader';
import { AdminDashboardOverview } from './components/admin/AdminDashboardOverview';
import { AdminProductControl } from './components/admin/AdminProductControl';
import { AdminMysteryBoxManager } from './components/admin/AdminMysteryBoxManager';
import { AdminOrderManager } from './components/admin/AdminOrderManager';
import { AdminPaymentManager } from './components/admin/AdminPaymentManager';
import { AdminCustomerManager } from './components/admin/AdminCustomerManager';
import { AdminWebsiteSettings } from './components/admin/AdminWebsiteSettings';
import { AdminActivityLogsModal } from './components/admin/AdminActivityLogsModal';
import { ChangePasswordModal } from './components/admin/ChangePasswordModal';

import { ArrowLeft, Sparkles, Flame, CheckCircle2, Film, Ticket } from 'lucide-react';

export default function App() {
  // Navigation View: 'store' | 'admin_login' | 'admin'
  const [currentView, setCurrentView] = useState<'store' | 'admin_login' | 'admin'>('store');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Light / Dark Theme state (defaulting to TopupPapa/TopupBuzz clean style)
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ktu_theme') === 'light';
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ktu_theme', next ? 'light' : 'dark');
      } catch {}
      return next;
    });
  };

  // Reactive store state
  const [, setTick] = useState(0);

  // Authentication
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem('ktu_admin_token')
  );
  const [customerUser, setCustomerUser] = useState<FirebaseUser | null>(null);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Modals
  const [previewBox, setPreviewBox] = useState<MysteryBox | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<Product | MysteryBox | null>(null);
  const [checkoutInitialUid, setCheckoutInitialUid] = useState('');
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [customerProfileOpen, setCustomerProfileOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<'terms' | 'privacy' | 'refund' | null>(
    null
  );

  // Admin Modals & Selection
  const [adminLogsOpen, setAdminLogsOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [selectedDashboardOrder, setSelectedDashboardOrder] = useState<Order | null>(null);

  // Listen to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  // Customer Firebase Auth listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCustomerUser(user);
    });
    return unsubAuth;
  }, []);

  // Verify Admin Session Token on boot
  useEffect(() => {
    const token = localStorage.getItem('ktu_admin_token');
    if (token) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setAdminToken(token);
          } else {
            localStorage.removeItem('ktu_admin_token');
            setAdminToken(null);
          }
        })
        .catch(() => {
          setAdminToken(token);
        });
    }
  }, []);

  // Data pointers from store
  const products = store.products;
  const mysteryBoxes = store.mysteryBoxes;
  const payments = store.payments;
  const settings = store.settings;
  const customers = store.customers;
  const orders = store.orders;

  // Filtered products for customer store
  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const cleanQ = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !cleanQ ||
      p.name.toLowerCase().includes(cleanQ) ||
      p.description.toLowerCase().includes(cleanQ) ||
      p.category.toLowerCase().includes(cleanQ);
    return matchesCategory && matchesSearch;
  });

  // Filtered mystery boxes for customer store
  const activeMysteryBoxes = mysteryBoxes.filter((b) => b.isActive);
  const showMysteryBoxes =
    (activeCategory === 'all' || activeCategory === 'mystery_box') &&
    activeMysteryBoxes.length > 0 &&
    (!searchQuery.trim() ||
      activeMysteryBoxes.some((b) =>
        b.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ));

  // Admin Actions Handlers
  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setCurrentView('admin');
  };

  const handleAdminLogout = async () => {
    try {
      const token = localStorage.getItem('ktu_admin_token');
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {}
    localStorage.removeItem('ktu_admin_token');
    setAdminToken(null);
    setCurrentView('store');
  };

  const handleQuickApproveOrder = async (orderId: string) => {
    await store.updateOrderStatus(orderId, 'Completed', 'Payment verified, diamonds sent to UID');
  };

  const handleSelectOrderFromDashboard = (order: Order) => {
    setSelectedDashboardOrder(order);
    setAdminTab('orders');
  };

  const handleSelectShopCategory = (cat: ProductCategory) => {
    setActiveCategory(cat);
    // Smooth scroll to dedicated shop section
    const el = document.getElementById('shop-content-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* =========================================================================
          VIEW 1: ADMIN LOGIN SCREEN
      ========================================================================= */}
      {currentView === 'admin_login' && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToStore={() => setCurrentView('store')}
        />
      )}

      {/* =========================================================================
          VIEW 2: ADMIN MANAGEMENT DASHBOARD
      ========================================================================= */}
      {currentView === 'admin' && (
        <div className="min-h-screen bg-[#070a13] flex flex-col">
          <AdminHeader
            activeTab={adminTab}
            onSelectTab={setAdminTab}
            pendingOrdersCount={orders.filter((o) => o.status === 'Pending').length}
            onOpenChangePassword={() => setChangePasswordOpen(true)}
            onOpenLogs={() => setAdminLogsOpen(true)}
            onLogout={handleAdminLogout}
            onViewStore={() => setCurrentView('store')}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Tab 1: Dashboard Overview */}
            {adminTab === 'overview' && (
              <AdminDashboardOverview
                orders={orders}
                products={products}
                customers={customers}
                payments={payments}
                onNavigateTab={setAdminTab}
                onSelectOrder={handleSelectOrderFromDashboard}
                onQuickApproveOrder={handleQuickApproveOrder}
              />
            )}

            {/* Tab 2: Product & Price Control */}
            {adminTab === 'products' && (
              <AdminProductControl
                products={products}
                onUpdatePrice={(id, price, original) =>
                  store.updateProductPrice(id, price, original)
                }
                onUpdateStock={(id, stock, unl, oos) =>
                  store.updateProductStock(id, stock, unl, oos)
                }
                onToggleStatus={(id, act) => store.toggleProductStatus(id, act)}
                onSaveProduct={(prod) => store.saveProduct(prod)}
                onDeleteProduct={(id) => store.deleteProduct(id)}
              />
            )}

            {/* Tab 3: Mystery Box Management */}
            {adminTab === 'mystery_boxes' && (
              <AdminMysteryBoxManager
                mysteryBoxes={mysteryBoxes}
                onSaveBox={(box) => store.saveMysteryBox(box)}
                onDeleteBox={(boxId) => store.deleteMysteryBox(boxId)}
              />
            )}

            {/* Tab 4: Order Management */}
            {adminTab === 'orders' && (
              <AdminOrderManager
                orders={orders}
                onUpdateStatus={(id, status, note) => store.updateOrderStatus(id, status, note)}
                selectedOrderFromDashboard={selectedDashboardOrder}
                onClearSelectedOrder={() => setSelectedDashboardOrder(null)}
              />
            )}

            {/* Tab 5: Payment Gateway Control */}
            {adminTab === 'payments' && (
              <AdminPaymentManager
                payments={payments}
                orders={orders}
                onUpdatePayment={(id, num, acc, enb, ins) =>
                  store.updatePaymentMethod(id, num, acc, enb, ins)
                }
                onVerifyOrderPayment={(id, status) => store.updateOrderStatus(id, status)}
              />
            )}

            {/* Tab 6: Customer Management */}
            {adminTab === 'customers' && (
              <AdminCustomerManager
                customers={customers}
                orders={orders}
                onToggleCustomerStatus={(id, status) => store.toggleCustomerStatus(id, status)}
                onUpdateSupportNote={(id, note) => store.updateCustomerSupportNote(id, note)}
              />
            )}

            {/* Tab 7: Website Settings */}
            {adminTab === 'settings' && (
              <AdminWebsiteSettings
                settings={settings}
                onSaveSettings={(s) => store.updateWebsiteSettings(s)}
              />
            )}

            {/* Tab 8: Security & Activity Logs Tab Shortcut */}
            {adminTab === 'logs' && (
              <div className="space-y-4">
                <AdminActivityLogsModal onClose={() => setAdminTab('overview')} />
              </div>
            )}
          </main>

          {/* Admin Change Password Modal */}
          {changePasswordOpen && (
            <ChangePasswordModal
              onClose={() => setChangePasswordOpen(false)}
              onSuccess={() => {}}
            />
          )}

          {/* Admin Activity Logs Modal Drawer */}
          {adminLogsOpen && (
            <AdminActivityLogsModal onClose={() => setAdminLogsOpen(false)} />
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 3: CUSTOMER KHAN TOP UP STORE
      ========================================================================= */}
      {currentView === 'store' && (
        <div className="flex-1 flex flex-col">
          {/* Top Announcement Marquee */}
          <PromoNotice notice={settings.promoNotice} />

          {/* Main Navigation Bar */}
          <Navbar
            settings={settings}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onOpenTrackModal={() => setTrackOrderOpen(true)}
            onOpenAdmin={() => {
              if (adminToken) {
                setCurrentView('admin');
              } else {
                setCurrentView('admin_login');
              }
            }}
            onOpenCustomerProfile={() => setCustomerProfileOpen(true)}
            customerUser={customerUser}
            onGoogleLogin={loginWithGoogle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isAdminLoggedIn={Boolean(adminToken)}
          />

          {/* Hero Promotional Carousel */}
          <HeroBanner
            banners={settings.banners}
            onSelectCategory={(cat) => handleSelectShopCategory(cat)}
            onOpenTrackModal={() => setTrackOrderOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
            {/* FRONT HUB: Sleek Category / Shop Boxes right in front */}
            <GameShopBoxes
              onSelectShop={handleSelectShopCategory}
              activeShop={activeCategory}
            />

            {/* DEDICATED FREE FIRE DIAMONDS PORTAL BOX (When All or Diamond selected) */}
            {(activeCategory === 'all' || activeCategory === 'diamond') && (
              <div id="diamond-portal-box" className="pt-2">
                <DiamondShopPortal
                  products={products}
                  onBuyDiamondPackage={(item, uid) => {
                    setCheckoutInitialUid(uid);
                    setCheckoutItem(item);
                  }}
                />
              </div>
            )}

            {/* DEDICATED SHOP SECTION (Based on category selected) */}
            <div id="shop-content-section" className="space-y-6 pt-4">
              {/* Back to all button when a specific category is active */}
              {activeCategory !== 'all' && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#13192b] hover:bg-[#1c2540] text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>সকল শপ দেখুন (Back to All Shops)</span>
                  </button>

                  <span className="text-xs text-slate-400 font-mono">
                    {activeCategory === 'membership'
                      ? '১০টি উইকলি ও মান্থলি কম্বো'
                      : activeCategory === 'mystery_box'
                      ? '৫টি গ্যারান্টিড মিষ্টি বক্স'
                      : activeCategory === 'level_up'
                      ? '৫টি লেভেল আপ পাস'
                      : activeCategory === 'social_fb' || activeCategory === 'social_insta'
                      ? '১০০ থেকে ১০ মিলিয়ন সার্ভিস'
                      : 'প্যাকেজ তালিকা'}
                  </span>
                </div>
              )}

              {/* Mystery Boxes Section (when active or all) */}
              {showMysteryBoxes && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎁</span>
                        <h2 className="font-['Orbitron'] font-black text-xl sm:text-2xl text-white tracking-wider">
                          100% Guaranteed Mystery Boxes
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ১০০% গ্যারান্টিড ড্রপ। কেনার সাথে সাথে প্রতিটি বক্সের সম্পূর্ণ রিওয়ার্ড সরাসরি ইন-গেম UID তে চলে যায়।
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden sm:inline-block">
                      ৫টি মিষ্টি বক্স এভেইলেবল
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeMysteryBoxes.map((box) => (
                      <MysteryBoxCard
                        key={box.id}
                        box={box}
                        onPreview={(b) => setPreviewBox(b)}
                        onBuy={(b) => {
                          setCheckoutInitialUid('');
                          setCheckoutItem(b);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Memberships & Combinations Section (When All or Membership) */}
              {(activeCategory === 'all' || activeCategory === 'membership') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h2 className="font-['Orbitron'] font-black text-xl sm:text-2xl text-white tracking-wider flex items-center gap-2">
                        <span>👑 Weekly &amp; Monthly Memberships (১০টি কম্বো আইটেম)</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ১টি মান্থলি, ১টি উইকলি, ২টি মান্থলি, ৫টি, ১০টি মেম্বারশিপ ও সুপার মেগা কম্বো প্যাক
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-purple-400 font-mono">
                      {products.filter((p) => p.category === 'membership' && p.isActive).length} টি আইটেম
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {products
                      .filter((p) => p.category === 'membership' && p.isActive)
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onBuyNow={(prod) => {
                            setCheckoutInitialUid('');
                            setCheckoutItem(prod);
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Level Up Passes Section (When All or Level Up) */}
              {(activeCategory === 'all' || activeCategory === 'level_up') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h2 className="font-['Orbitron'] font-black text-xl sm:text-2xl text-white tracking-wider flex items-center gap-2">
                        <span>🎯 Level Up Passes (৮০২💎 পর্যন্ত আনলক)</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        লেভেল ২ থেকে ৩০ পর্যন্ত বিভিন্ন টায়ার এবং কমপ্লিট লেভেল আপ পাস
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-blue-400 font-mono">
                      {products.filter((p) => p.category === 'level_up' && p.isActive).length} টি পাস
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {products
                      .filter((p) => p.category === 'level_up' && p.isActive)
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onBuyNow={(prod) => {
                            setCheckoutInitialUid('');
                            setCheckoutItem(prod);
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Evo Access Trials (When All or Evo) */}
              {(activeCategory === 'all' || activeCategory === 'evo_access') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h2 className="font-['Orbitron'] font-black text-xl sm:text-2xl text-white tracking-wider flex items-center gap-2">
                        <span>⚡ Evo Gun Access (৩d, ৭d, ৩০d ট্রায়াল)</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        সকল ম্যাক্স ইভো গানের প্রিভিলেজ ট্রায়াল
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-yellow-400 font-mono">
                      {products.filter((p) => p.category === 'evo_access' && p.isActive).length} টি অপশন
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                    {products
                      .filter((p) => p.category === 'evo_access' && p.isActive)
                      .map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onBuyNow={(prod) => {
                            setCheckoutInitialUid('');
                            setCheckoutItem(prod);
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Facebook & Instagram Boost Services (100 to 10 Million) with Rate List & Customizer */}
              {(activeCategory === 'all' ||
                activeCategory === 'social_fb' ||
                activeCategory === 'social_insta') && (
                <div id="social-boost-portal-section" className="pt-4">
                  <SocialBoostPortal
                    products={products}
                    onBuySocialPackage={(customItem, targetUrl) => {
                      setCheckoutInitialUid(targetUrl);
                      setCheckoutItem(customItem);
                    }}
                  />
                </div>
              )}
            </div>
          </main>

          {/* Customer Footer */}
          <Footer
            settings={settings}
            onOpenPolicy={(type) => setPolicyModalType(type)}
            onOpenAdmin={() => {
              if (adminToken) {
                setCurrentView('admin');
              } else {
                setCurrentView('admin_login');
              }
            }}
          />

          {/* Gemini AI Chatbot */}
          <GeminiChatbot />

          {/* Guaranteed Rewards Modal for Mystery Boxes */}
          {previewBox && (
            <GuaranteedRewardsModal
              box={previewBox}
              onClose={() => setPreviewBox(null)}
              onBuy={(b) => {
                setPreviewBox(null);
                setCheckoutInitialUid('');
                setCheckoutItem(b);
              }}
            />
          )}

          {/* Checkout & Instant Order Modal */}
          {checkoutItem && (
            <CheckoutModal
              item={checkoutItem}
              paymentConfigs={payments}
              customerUser={customerUser}
              initialGameUid={checkoutInitialUid}
              onClose={() => {
                setCheckoutItem(null);
                setCheckoutInitialUid('');
              }}
              onSubmitOrder={async (orderData) => {
                const order = await store.createOrder({
                  ...orderData,
                  customerId: customerUser?.uid || 'guest_' + Date.now(),
                  status: 'Pending',
                  adminNote: 'Order submitted. Awaiting admin bKash/Nagad verification.',
                });
                return order;
              }}
              onTrackOrder={(orderNumber) => {
                setCheckoutItem(null);
                setCheckoutInitialUid('');
                setTrackOrderNumber(orderNumber);
                setTrackOrderOpen(true);
              }}
            />
          )}

          {/* Live Order Tracker Modal */}
          {trackOrderOpen && (
            <TrackOrderModal
              orders={orders}
              initialOrderNumber={trackOrderNumber}
              onClose={() => {
                setTrackOrderOpen(false);
                setTrackOrderNumber('');
              }}
            />
          )}

          {/* Customer Profile & Past Orders Modal */}
          {customerProfileOpen && (
            <CustomerProfileModal
              user={customerUser}
              orders={orders}
              onClose={() => setCustomerProfileOpen(false)}
              onLogout={() => logoutUser()}
              onTrackOrder={(num) => {
                setCustomerProfileOpen(false);
                setTrackOrderNumber(num);
                setTrackOrderOpen(true);
              }}
            />
          )}

          {/* Legal Policy Modal */}
          {policyModalType && (
            <PolicyModal
              type={policyModalType}
              settings={settings}
              onClose={() => setPolicyModalType(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
