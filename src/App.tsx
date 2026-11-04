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
import { TopupPapaBoxGrid, TopupBoxItem } from './components/TopupPapaBoxGrid';
import { TopupBuzzProductPage } from './components/TopupBuzzProductPage';
import { AddMoneyModal } from './components/AddMoneyModal';
import { BottomMobileBar } from './components/BottomMobileBar';
import { DiamondShopPortal } from './components/DiamondShopPortal';
import { SocialBoostPortal } from './components/SocialBoostPortal';
import { RecentLiveOrdersWidget } from './components/RecentLiveOrdersWidget';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { FloatingSupportButton } from './components/FloatingSupportButton';
import { ProductCard } from './components/ProductCard';
import { MysteryBoxCard } from './components/MysteryBoxCard';
import { GuaranteedRewardsModal } from './components/GuaranteedRewardsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { MyOrderModal } from './components/MyOrderModal';
import { WelcomeBonusSpinModal } from './components/WelcomeBonusSpinModal';
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
      const stored = localStorage.getItem('ktu_theme');
      return stored !== null ? stored === 'light' : true;
    } catch {
      return true;
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

  // TopupPapa Box / Dedicated TopupBuzz Product Page state
  const [selectedTopupBox, setSelectedTopupBox] = useState<TopupBoxItem | null>(null);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [userVouchersOpen, setUserVouchersOpen] = useState(false);

  // Customer Modals
  const [welcomeSpinOpen, setWelcomeSpinOpen] = useState(false);
  const [previewBox, setPreviewBox] = useState<MysteryBox | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<Product | MysteryBox | null>(null);
  const [checkoutInitialUid, setCheckoutInitialUid] = useState('');
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [customerProfileOpen, setCustomerProfileOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<'terms' | 'privacy' | 'refund' | null>(
    null
  );

  // Helper to store user's recent orders in localStorage for instant tracking
  const recordUserRecentOrderId = (orderNum: string) => {
    try {
      const raw = localStorage.getItem('ktu_my_order_ids');
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(orderNum)) {
        list.unshift(orderNum);
        localStorage.setItem('ktu_my_order_ids', JSON.stringify(list.slice(0, 30)));
      }
    } catch {}
  };

  // Welcome Bonus Spin Auto Popup on first visit
  useEffect(() => {
    try {
      const hasSeenSpin = sessionStorage.getItem('ktu_welcome_spin_opened');
      if (!hasSeenSpin) {
        sessionStorage.setItem('ktu_welcome_spin_opened', 'true');
        const timer = setTimeout(() => {
          setWelcomeSpinOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

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

  // Current logged in customer & wallet balance
  const currentCustomer = customers.find(
    (c) =>
      customerUser &&
      (c.id === customerUser.uid || (c.email && c.email === customerUser.email))
  );
  const customerWalletBalance = currentCustomer?.walletBalance || 0;

  const handleProceedBoxOrder = async (
    pkg: any,
    gameUid: string,
    paymentMethod: 'Wallet' | 'Instant'
  ) => {
    if (!selectedTopupBox) return;

    if (paymentMethod === 'Wallet') {
      const order = await store.createOrder({
        customerId: customerUser?.uid || 'guest_' + Date.now(),
        customerName: customerUser?.displayName || 'Player ' + gameUid.slice(-4),
        customerPhone: currentCustomer?.phone || '01700000000',
        customerEmail: customerUser?.email || '',
        productTitle: `${selectedTopupBox.title} - ${pkg.title}`,
        productId: pkg.id,
        productCategory: selectedTopupBox.category,
        amount: pkg.price,
        gameUid: gameUid,
        paymentMethod: 'Wallet',
        paymentNumber: 'Wallet Balance',
        transactionId: 'WAL-' + Date.now(),
        status: 'Completed',
        adminNote: 'Instant purchase via Wallet Balance. Diamonds sent to UID.',
      });

      // Deduct wallet balance
      if (currentCustomer?.id) {
        const remaining = Math.max(0, (currentCustomer.walletBalance || 0) - pkg.price);
        await store.updateCustomerWallet(currentCustomer.id, remaining);
      }

      recordUserRecentOrderId(order.orderNumber);
      setSelectedTopupBox(null);
      setTrackOrderNumber(order.orderNumber);
      setTrackOrderOpen(true);
    } else {
      // Instant Pay (bKash / Nagad / Rocket)
      const fakeProduct: Product = {
        id: pkg.id,
        name: `${selectedTopupBox.title} - ${pkg.title}`,
        category: (selectedTopupBox.category as any) || 'diamond',
        price: pkg.price,
        originalPrice: pkg.originalPrice || pkg.price,
        stock: -1,
        isUnlimited: true,
        isOutOfStock: false,
        isActive: true,
        description: `Instant recharge for ${selectedTopupBox.title} (${pkg.title}) to UID: ${gameUid}`,
        image: selectedTopupBox.image,
        updatedAt: new Date().toISOString(),
      };
      setCheckoutInitialUid(gameUid);
      setCheckoutItem(fakeProduct);
      setSelectedTopupBox(null);
    }
  };

  const handleAddMoneySuccess = async (amount: number, trxId: string, method: string) => {
    const custId = customerUser?.uid || currentCustomer?.id || 'cust_' + Date.now();
    const custName = customerUser?.displayName || currentCustomer?.name || 'Customer';
    const custEmail = customerUser?.email || currentCustomer?.email || '';
    const custPhone = currentCustomer?.phone || '01700000000';

    await store.depositCustomerWallet(custId, custName, custEmail, custPhone, amount);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-200 ${
        isLightMode ? 'bg-[#f4f7fb] text-slate-800' : 'bg-[#0b0e17] text-slate-100'
      }`}
    >
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
          <PromoNotice notice={settings.promoNotice} isLightMode={isLightMode} />

          {/* Main Navigation Bar */}
          <Navbar
            settings={settings}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSelectedTopupBox(null);
            }}
            onOpenTrackModal={() => setTrackOrderOpen(true)}
            onOpenWelcomeSpin={() => setWelcomeSpinOpen(true)}
            onOpenAdmin={() => {
              if (adminToken) {
                setCurrentView('admin');
              } else {
                setCurrentView('admin_login');
              }
            }}
            onOpenCustomerProfile={() => setCustomerProfileOpen(true)}
            customerUser={customerUser}
            customerWalletBalance={customerWalletBalance}
            onGoogleLogin={loginWithGoogle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isAdminLoggedIn={Boolean(adminToken)}
            isLightMode={isLightMode}
            onToggleTheme={toggleTheme}
            onScrollToLiveOrders={() => {
              setSelectedTopupBox(null);
              setTimeout(() => {
                document.getElementById('recent-live-orders-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onScrollToContact={() => {
              setSelectedTopupBox(null);
              setTimeout(() => {
                document.getElementById('customer-footer-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          />

          {/* DEDICATED PRODUCT RECHARGE PAGE OR HOMEPAGE BOXES */}
          {selectedTopupBox ? (
            <TopupBuzzProductPage
              boxId={selectedTopupBox.id}
              boxTitle={selectedTopupBox.title}
              boxCategory={selectedTopupBox.category}
              boxImage={selectedTopupBox.image}
              badge={selectedTopupBox.badge || '২ সেকেন্ডে টপআপ'}
              packages={selectedTopupBox.packages}
              onBack={() => setSelectedTopupBox(null)}
              onProceedOrder={handleProceedBoxOrder}
              walletBalance={customerWalletBalance}
              onOpenAddMoney={() => setAddMoneyOpen(true)}
              isLightMode={isLightMode}
            />
          ) : (
            <>
              {/* Hero Promotional Carousel */}
              <HeroBanner
                banners={settings.banners}
                onSelectCategory={(cat) => handleSelectShopCategory(cat)}
                onOpenTrackModal={() => setTrackOrderOpen(true)}
                isLightMode={isLightMode}
              />

              {/* Main Content Area */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
                {/* 1. TOPUPPAPA BOX SECTIONS (Mystery Box, Bonus Offer, Games Topup, FB Services, Entertainment) */}
                <TopupPapaBoxGrid
                  products={products}
                  mysteryBoxes={mysteryBoxes}
                  onOpenBoxPurchase={(box) => setSelectedTopupBox(box)}
                  isLightMode={isLightMode}
                />

                {/* 2. RECENT LIVE ORDERS WIDGET (Matching Screenshot 4) */}
                <div id="recent-live-orders-section" className="pt-2">
                  <RecentLiveOrdersWidget
                    orders={orders}
                    onTrackOrder={(num) => {
                      setTrackOrderNumber(num);
                      setTrackOrderOpen(true);
                    }}
                    isLightMode={isLightMode}
                  />
                </div>
              </main>
            </>
          )}

          {/* Customer Footer */}
          <div id="customer-footer-section">
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
          </div>

          {/* Fixed Bottom Mobile Navigation Bar (Screenshot 4) */}
          <BottomMobileBar
            onGoHome={() => setSelectedTopupBox(null)}
            onOpenOrders={() => setTrackOrderOpen(true)}
            onOpenAddMoney={() => setAddMoneyOpen(true)}
            onOpenCodes={() => setUserVouchersOpen(true)}
            onOpenAccount={() => {
              if (customerUser) {
                setCustomerProfileOpen(true);
              } else {
                loginWithGoogle();
              }
            }}
            isLightMode={isLightMode}
          />

          {/* Floating Headset Support Button */}
          <FloatingSupportButton
            whatsappNumber="01575630127"
            telegramChannelUrl="https://t.me/khantopupbd"
            telegramGroupUrl="https://t.me/khantopupgroup"
            contactPhone="01575630127"
            isLightMode={isLightMode}
          />

          {/* Add Money Modal */}
          {addMoneyOpen && (
            <AddMoneyModal
              currentBalance={customerWalletBalance}
              paymentConfigs={payments}
              onClose={() => setAddMoneyOpen(false)}
              onAddMoneySuccess={handleAddMoneySuccess}
              isLightMode={isLightMode}
            />
          )}

          {/* User Codes / Vouchers Modal */}
          {userVouchersOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#121929] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span className="text-xl">🎟️</span>
                    <span>My Codes &amp; Vouchers (ডিজিটাল ভাউচার)</span>
                  </h3>
                  <button
                    onClick={() => setUserVouchersOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                  >
                    ✕
                  </button>
                </div>

                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#0066FF] flex items-center justify-center mx-auto">
                    <span className="text-2xl font-mono">🎫</span>
                  </div>
                  <h4 className="font-bold text-sm">কোন সক্রিয় ভাউচার কোড নেই</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    ইউনিপিন বা ডিজিটাল সাবস্ক্রিপশন কোড কিনলে এখানে আপনার সক্রিয় কোড ও রিডিম পিন দেখতে পাবেন।
                  </p>
                </div>

                <button
                  onClick={() => setUserVouchersOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#0066FF] text-white font-bold text-xs"
                >
                  বন্ধ করুন (Close)
                </button>
              </div>
            </div>
          )}

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
                recordUserRecentOrderId(order.orderNumber);
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

          {/* Floating Welcome Spin Button */}
          <div className="fixed bottom-16 left-3 sm:bottom-6 sm:left-6 z-40 animate-bounce-subtle">
            <button
              onClick={() => setWelcomeSpinOpen(true)}
              className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 border-2 border-white dark:border-amber-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Welcome Bonus Spin - Win up to 8,000 Diamonds!"
            >
              <span className="text-xl animate-spin-slow">🎡</span>
              <div className="flex flex-col text-left">
                <span className="font-['Orbitron'] font-black leading-tight text-slate-950">
                  Welcome Spin
                </span>
                <span className="text-[10px] text-amber-950 font-bold opacity-90">
                  ৮,০০০💎 বোনাস
                </span>
              </div>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            </button>
          </div>

          {/* My Order & Status Tracker Modal */}
          {trackOrderOpen && (
            <MyOrderModal
              orders={orders}
              initialSearchQuery={trackOrderNumber}
              customerUser={customerUser}
              isLightMode={isLightMode}
              onClose={() => {
                setTrackOrderOpen(false);
                setTrackOrderNumber('');
              }}
              onGoToShop={() => {
                setSelectedTopupBox(null);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
            />
          )}

          {/* Welcome Bonus Spin Wheel Modal */}
          <WelcomeBonusSpinModal
            isOpen={welcomeSpinOpen}
            onClose={() => setWelcomeSpinOpen(false)}
            onClaimToShop={() => {
              setWelcomeSpinOpen(false);
              setSelectedTopupBox(null);
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            isLightMode={isLightMode}
          />

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
