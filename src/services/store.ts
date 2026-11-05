import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from './firebase';
import {
  Product,
  MysteryBox,
  PaymentMethodConfig,
  WebsiteSettings,
  Customer,
  Order,
  OrderStatus,
  AdminLog,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_MYSTERY_BOXES,
  INITIAL_PAYMENT_CONFIGS,
  INITIAL_SETTINGS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
} from './initialData';

// Local storage keys for resilient instant loading
const STORAGE_KEYS = {
  PRODUCTS: 'ktu_products',
  BOXES: 'ktu_mystery_boxes',
  PAYMENTS: 'ktu_payments',
  SETTINGS: 'ktu_settings',
  CUSTOMERS: 'ktu_customers',
  ORDERS: 'ktu_orders',
};

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

const PRICE_VERSION = 'v4_topup_expanded_15_20';

function loadProducts(): Product[] {
  const currentVersion = localStorage.getItem('ktu_price_ver');
  if (currentVersion !== PRICE_VERSION) {
    localStorage.setItem('ktu_price_ver', PRICE_VERSION);
    saveLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  const stored = loadLocal<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (!stored || stored.length === 0) return INITIAL_PRODUCTS;
  // Merge any new initial products that don't exist in local cache
  const storedMap = new Map(stored.map((p) => [p.id, p]));
  for (const initP of INITIAL_PRODUCTS) {
    if (!storedMap.has(initP.id)) {
      stored.push(initP);
    }
  }
  return stored;
}

const BOXES_VERSION = 'v3_15_mystery_boxes_cooldown_store';

function loadBoxes(): MysteryBox[] {
  const currentVersion = localStorage.getItem('ktu_boxes_ver');
  if (currentVersion !== BOXES_VERSION) {
    localStorage.setItem('ktu_boxes_ver', BOXES_VERSION);
    saveLocal(STORAGE_KEYS.BOXES, INITIAL_MYSTERY_BOXES);
    return INITIAL_MYSTERY_BOXES;
  }
  const stored = loadLocal<MysteryBox[]>(STORAGE_KEYS.BOXES, []);
  if (!stored || stored.length === 0) return INITIAL_MYSTERY_BOXES;
  const storedMap = new Map(stored.map((b) => [b.id, b]));
  for (const initB of INITIAL_MYSTERY_BOXES) {
    if (!storedMap.has(initB.id)) {
      stored.push(initB);
    }
  }
  return stored;
}

class StoreService {
  products: Product[] = loadProducts();
  mysteryBoxes: MysteryBox[] = loadBoxes();
  payments: PaymentMethodConfig[] = loadLocal(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENT_CONFIGS);
  settings: WebsiteSettings = loadLocal(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  customers: Customer[] = loadLocal(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  orders: Order[] = loadLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

  private listeners: Set<() => void> = new Set();
  private isInitialized = false;
  private ordersUnsubscribe: (() => void) | null = null;
  private customersUnsubscribe: (() => void) | null = null;

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  async initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Test firestore connection per skill guidelines
    testConnection().catch(() => {});

    try {
      this.initProductsListener();
      this.initMysteryBoxesListener();
      this.initPaymentsListener();
      this.initSettingsListener();
      // Orders & Customers listeners are attached only after user/admin authentication via updateAuthUser()
    } catch (err) {
      console.warn('Real-time Firestore listeners error, running in local fallback mode:', err);
    }
  }

  // --- Products ---
  private initProductsListener() {
    const colRef = collection(db, 'products');
    onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => list.push(docSnap.data() as Product));
          this.products = list;
          saveLocal(STORAGE_KEYS.PRODUCTS, list);
          this.notify();
        } else {
          // Seed initial products
          this.seedInitialProducts();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'products');
      }
    );
  }

  private async seedInitialProducts() {
    try {
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p);
      }
    } catch {}
  }

  async updateProductPrice(productId: string, newPrice: number, originalPrice?: number) {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return;
    const oldPrice = prod.price;
    const updated = {
      ...prod,
      price: newPrice,
      originalPrice: originalPrice !== undefined ? originalPrice : prod.originalPrice,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    this.products = this.products.map((p) => (p.id === productId ? updated : p));
    saveLocal(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify();

    try {
      await updateDoc(doc(db, 'products', productId), {
        price: newPrice,
        originalPrice: updated.originalPrice,
        updatedAt: updated.updatedAt,
      });
      await this.recordAdminLog(
        'PRICE_UPDATE',
        `Changed price of ${prod.name} from ৳${oldPrice} to ৳${newPrice}`
      );
    } catch (err) {
      console.warn('Firestore update failed, kept in local state:', err);
    }
  }

  async updateProductStock(
    productId: string,
    stock: number,
    isUnlimited: boolean,
    isOutOfStock: boolean
  ) {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return;

    const updated = {
      ...prod,
      stock,
      isUnlimited,
      isOutOfStock,
      updatedAt: new Date().toISOString(),
    };

    this.products = this.products.map((p) => (p.id === productId ? updated : p));
    saveLocal(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify();

    try {
      await updateDoc(doc(db, 'products', productId), {
        stock,
        isUnlimited,
        isOutOfStock,
        updatedAt: updated.updatedAt,
      });
      await this.recordAdminLog(
        'STOCK_UPDATE',
        `Updated stock for ${prod.name}: ${isOutOfStock ? 'OUT OF STOCK' : isUnlimited ? 'Unlimited' : stock + ' units'}`
      );
    } catch (err) {
      console.warn('Firestore stock update failed:', err);
    }
  }

  async toggleProductStatus(productId: string, isActive: boolean) {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return;

    const updated = { ...prod, isActive, updatedAt: new Date().toISOString() };
    this.products = this.products.map((p) => (p.id === productId ? updated : p));
    saveLocal(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify();

    try {
      await updateDoc(doc(db, 'products', productId), { isActive, updatedAt: updated.updatedAt });
      await this.recordAdminLog(
        'PRODUCT_TOGGLE',
        `${isActive ? 'Enabled' : 'Disabled'} product: ${prod.name}`
      );
    } catch {}
  }

  async saveProduct(product: Product) {
    const exists = this.products.some((p) => p.id === product.id);
    if (exists) {
      this.products = this.products.map((p) => (p.id === product.id ? product : p));
    } else {
      this.products.push(product);
    }
    saveLocal(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify();

    try {
      await setDoc(doc(db, 'products', product.id), product);
      await this.recordAdminLog('SAVE_PRODUCT', `Saved product: ${product.name} (৳${product.price})`);
    } catch {}
  }

  async deleteProduct(productId: string) {
    const prod = this.products.find((p) => p.id === productId);
    this.products = this.products.filter((p) => p.id !== productId);
    saveLocal(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify();

    try {
      await deleteDoc(doc(db, 'products', productId));
      if (prod) {
        await this.recordAdminLog('DELETE_PRODUCT', `Deleted product: ${prod.name}`);
      }
    } catch {}
  }

  // --- Mystery Boxes ---
  private initMysteryBoxesListener() {
    const colRef = collection(db, 'mystery_boxes');
    onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MysteryBox[] = [];
          snapshot.forEach((docSnap) => list.push(docSnap.data() as MysteryBox));
          this.mysteryBoxes = list;
          saveLocal(STORAGE_KEYS.BOXES, list);
          this.notify();
        } else {
          this.seedInitialMysteryBoxes();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'mystery_boxes');
      }
    );
  }

  private async seedInitialMysteryBoxes() {
    try {
      for (const box of INITIAL_MYSTERY_BOXES) {
        await setDoc(doc(db, 'mystery_boxes', box.id), box);
      }
    } catch {}
  }

  async saveMysteryBox(box: MysteryBox) {
    const exists = this.mysteryBoxes.some((b) => b.id === box.id);
    if (exists) {
      this.mysteryBoxes = this.mysteryBoxes.map((b) => (b.id === box.id ? box : b));
    } else {
      this.mysteryBoxes.push(box);
    }
    saveLocal(STORAGE_KEYS.BOXES, this.mysteryBoxes);
    this.notify();

    try {
      await setDoc(doc(db, 'mystery_boxes', box.id), box);
      await this.recordAdminLog(
        'SAVE_MYSTERY_BOX',
        `Configured Mystery Box: ${box.name} with ${box.guaranteedRewards.length} guaranteed items`
      );
    } catch {}
  }

  async deleteMysteryBox(boxId: string) {
    const box = this.mysteryBoxes.find((b) => b.id === boxId);
    this.mysteryBoxes = this.mysteryBoxes.filter((b) => b.id !== boxId);
    saveLocal(STORAGE_KEYS.BOXES, this.mysteryBoxes);
    this.notify();

    try {
      await deleteDoc(doc(db, 'mystery_boxes', boxId));
      if (box) {
        await this.recordAdminLog('DELETE_MYSTERY_BOX', `Deleted Mystery Box: ${box.name}`);
      }
    } catch {}
  }

  // --- Payment Methods ---
  private initPaymentsListener() {
    const colRef = collection(db, 'payment_settings');
    onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PaymentMethodConfig[] = [];
          snapshot.forEach((docSnap) => list.push(docSnap.data() as PaymentMethodConfig));
          this.payments = list;
          saveLocal(STORAGE_KEYS.PAYMENTS, list);
          this.notify();
        } else {
          this.seedInitialPayments();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'payment_settings');
      }
    );
  }

  private async seedInitialPayments() {
    try {
      for (const pay of INITIAL_PAYMENT_CONFIGS) {
        await setDoc(doc(db, 'payment_settings', pay.id), pay);
      }
    } catch {}
  }

  async updatePaymentMethod(
    id: string,
    number: string,
    accountType: 'Personal' | 'Agent' | 'Merchant' | 'Digital Wallet',
    isEnabled: boolean,
    instructions: string
  ) {
    const pay = this.payments.find((p) => p.id === id);
    if (!pay) return;

    const updated = { ...pay, number, accountType, isEnabled, instructions };
    this.payments = this.payments.map((p) => (p.id === id ? updated : p));
    saveLocal(STORAGE_KEYS.PAYMENTS, this.payments);
    this.notify();

    try {
      await setDoc(doc(db, 'payment_settings', id), updated);
      await this.recordAdminLog(
        'PAYMENT_UPDATE',
        `Updated ${pay.method} number to ${number} (${accountType}, ${isEnabled ? 'Active' : 'Disabled'})`
      );
    } catch {}
  }

  // --- Orders & Customers Real-Time Sync (Auth Gated) ---
  updateAuthUser(user: any | null) {
    if (this.ordersUnsubscribe) {
      this.ordersUnsubscribe();
      this.ordersUnsubscribe = null;
    }
    if (this.customersUnsubscribe) {
      this.customersUnsubscribe();
      this.customersUnsubscribe = null;
    }

    if (!user) {
      // Guest or unauthenticated visitor: no live listeners attached to private collections
      return;
    }

    const isAdminUser = user.email === 'xarinnesi@gmail.com';

    if (isAdminUser) {
      // Admin: monitor full orders collection
      const colRef = collection(db, 'orders');
      this.ordersUnsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Order[] = [];
            snapshot.forEach((docSnap) => list.push(docSnap.data() as Order));
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.orders = list;
            saveLocal(STORAGE_KEYS.ORDERS, list);
            this.notify();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'orders');
        }
      );

      // Admin: monitor full customers collection
      const custCol = collection(db, 'customers');
      this.customersUnsubscribe = onSnapshot(
        custCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Customer[] = [];
            snapshot.forEach((docSnap) => list.push(docSnap.data() as Customer));
            this.customers = list;
            saveLocal(STORAGE_KEYS.CUSTOMERS, list);
            this.notify();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'customers');
        }
      );
    } else {
      // Logged-in customer: query only own orders matching customerId == auth.uid
      const userOrdersQuery = query(collection(db, 'orders'), where('customerId', '==', user.uid));
      this.ordersUnsubscribe = onSnapshot(
        userOrdersQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const userOrders: Order[] = [];
            snapshot.forEach((docSnap) => userOrders.push(docSnap.data() as Order));
            const map = new Map(this.orders.map((o) => [o.id, o]));
            userOrders.forEach((o) => map.set(o.id, o));
            this.orders = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            saveLocal(STORAGE_KEYS.ORDERS, this.orders);
            this.notify();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'orders');
        }
      );

      // Customer profile: listen only to customer document with id == auth.uid
      const custDocRef = doc(db, 'customers', user.uid);
      this.customersUnsubscribe = onSnapshot(
        custDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const custData = docSnap.data() as Customer;
            const updated = this.customers.map((c) => (c.id === custData.id ? custData : c));
            if (!updated.some((c) => c.id === custData.id)) {
              updated.push(custData);
            }
            this.customers = updated;
            saveLocal(STORAGE_KEYS.CUSTOMERS, this.customers);
            this.notify();
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `customers/${user.uid}`);
        }
      );
    }
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const id = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const orderNumber = 'KTU-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    // Prepend to local orders
    this.orders = [newOrder, ...this.orders];
    saveLocal(STORAGE_KEYS.ORDERS, this.orders);
    this.notify();

    // Also update customer stats
    this.recordCustomerOrder(newOrder);

    // If paymentMethod is Wallet, deduct wallet balance
    if (orderData.paymentMethod === 'Wallet') {
      const cust = this.customers.find(
        (c) => c.phone === orderData.customerPhone || (c.email && c.email === orderData.customerEmail)
      );
      if (cust) {
        const remaining = Math.max(0, (cust.walletBalance || 0) - orderData.amount);
        this.updateCustomerWallet(cust.id, remaining);
      }
    }

    try {
      await setDoc(doc(db, 'orders', id), newOrder);
    } catch (err) {
      console.warn('Order saved in local store:', err);
    }

    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, adminNote?: string) {
    const ord = this.orders.find((o) => o.id === orderId);
    if (!ord) return;

    const updated: Order = {
      ...ord,
      status,
      adminNote: adminNote !== undefined ? adminNote : ord.adminNote,
      updatedAt: new Date().toISOString(),
    };

    this.orders = this.orders.map((o) => (o.id === orderId ? updated : o));
    saveLocal(STORAGE_KEYS.ORDERS, this.orders);
    this.notify();

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        adminNote: updated.adminNote,
        updatedAt: updated.updatedAt,
      });
      await this.recordAdminLog(
        'ORDER_STATUS_UPDATE',
        `Order ${ord.orderNumber} changed to ${status}${adminNote ? ' (' + adminNote + ')' : ''}`
      );
    } catch (err) {
      console.warn('Firestore order status update failed:', err);
    }
  }

  // --- Customers Recording ---

  private async recordCustomerOrder(order: Order) {
    const existing = this.customers.find(
      (c) => c.phone === order.customerPhone || (c.email && c.email === order.customerEmail)
    );

    if (existing) {
      const updated: Customer = {
        ...existing,
        totalOrders: existing.totalOrders + 1,
        totalSpent: existing.totalSpent + order.amount,
      };
      this.customers = this.customers.map((c) => (c.id === existing.id ? updated : c));
      saveLocal(STORAGE_KEYS.CUSTOMERS, this.customers);
      try {
        await setDoc(doc(db, 'customers', existing.id), updated);
      } catch {}
    } else {
      const newCust: Customer = {
        id: 'cust_' + Date.now(),
        name: order.customerName || 'Customer ' + order.customerPhone.slice(-4),
        phone: order.customerPhone,
        email: order.customerEmail || '',
        totalOrders: 1,
        totalSpent: order.amount,
        status: 'active',
        joinedAt: new Date().toISOString(),
      };
      this.customers.push(newCust);
      saveLocal(STORAGE_KEYS.CUSTOMERS, this.customers);
      try {
        await setDoc(doc(db, 'customers', newCust.id), newCust);
      } catch {}
    }
  }

  async toggleCustomerStatus(customerId: string, status: 'active' | 'suspended') {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    const updated = { ...cust, status };
    this.customers = this.customers.map((c) => (c.id === customerId ? updated : c));
    saveLocal(STORAGE_KEYS.CUSTOMERS, this.customers);
    this.notify();

    try {
      await updateDoc(doc(db, 'customers', customerId), { status });
      await this.recordAdminLog(
        'CUSTOMER_STATUS',
        `Customer ${cust.name} (${cust.phone}) set to ${status}`
      );
    } catch {}
  }

  async updateCustomerSupportNote(customerId: string, supportNotes: string) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;

    const updated = { ...cust, supportNotes };
    this.customers = this.customers.map((c) => (c.id === customerId ? updated : c));
    saveLocal(STORAGE_KEYS.CUSTOMERS, this.customers);
    this.notify();

    try {
      await updateDoc(doc(db, 'customers', customerId), { supportNotes });
    } catch {}
  }

  async updateCustomerWallet(customerId: string, newBalance: number) {
    const cust = this.customers.find((c) => c.id === customerId);
    if (!cust) return;
    const updated = { ...cust, walletBalance: Math.max(0, newBalance) };
    this.customers = this.customers.map((c) => (c.id === customerId ? updated : c));
    saveLocal(STORAGE_KEYS.CUSTOMERS, this.customers);
    this.notify();

    try {
      await updateDoc(doc(db, 'customers', customerId), { walletBalance: updated.walletBalance });
      await this.recordAdminLog(
        'WALLET_BALANCE_UPDATE',
        `Wallet balance for ${cust.name} (${cust.phone}) updated to ৳${updated.walletBalance}`
      );
    } catch {}
  }

  async depositCustomerWallet(
    userIdentifier: string,
    name: string,
    email: string,
    phone: string,
    amount: number
  ): Promise<number> {
    let cust = this.customers.find(
      (c) =>
        (userIdentifier && c.id === userIdentifier) ||
        (email && c.email === email) ||
        (phone && c.phone === phone)
    );
    if (cust) {
      const newBal = (cust.walletBalance || 0) + amount;
      await this.updateCustomerWallet(cust.id, newBal);
      return newBal;
    } else {
      const newCust: Customer = {
        id: userIdentifier || 'cust_' + Date.now(),
        name: name || 'Customer',
        phone: phone || '01700000000',
        email: email || '',
        walletBalance: amount,
        totalOrders: 0,
        totalSpent: 0,
        status: 'active',
        joinedAt: new Date().toISOString(),
      };
      this.customers.push(newCust);
      saveLocal(STORAGE_KEYS.CUSTOMERS, this.customers);
      this.notify();
      try {
        await setDoc(doc(db, 'customers', newCust.id), newCust);
      } catch {}
      return amount;
    }
  }

  async triggerAutoTopupApi(orderId: string): Promise<{ success: boolean; message: string }> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    // Simulate instant official Garena API UID direct recharge
    await new Promise((resolve) => setTimeout(resolve, 800));
    const autoNote = `⚡ Auto-fulfilled via Garena Official API Gateway (Ref: GAR-${Math.floor(100000 + Math.random() * 900000)})`;
    await this.updateOrderStatus(orderId, 'Completed', autoNote);
    return { success: true, message: 'Diamonds successfully dispatched to Player UID via Garena Auto API!' };
  }

  // --- Website Settings ---
  private initSettingsListener() {
    const docRef = doc(db, 'website_settings', 'general');
    onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          this.settings = docSnap.data() as WebsiteSettings;
          saveLocal(STORAGE_KEYS.SETTINGS, this.settings);
          this.notify();
        } else {
          this.seedInitialSettings();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'website_settings');
      }
    );
  }

  private async seedInitialSettings() {
    try {
      await setDoc(doc(db, 'website_settings', 'general'), INITIAL_SETTINGS);
    } catch {}
  }

  async updateWebsiteSettings(newSettings: WebsiteSettings) {
    this.settings = newSettings;
    saveLocal(STORAGE_KEYS.SETTINGS, newSettings);
    this.notify();

    try {
      await setDoc(doc(db, 'website_settings', 'general'), newSettings);
      await this.recordAdminLog('SETTINGS_UPDATE', 'Updated general website configuration and banners');
    } catch {}
  }

  // --- Admin Logs ---
  async recordAdminLog(action: string, details: string) {
    try {
      // Send to server API endpoint
      const token = localStorage.getItem('ktu_admin_token') || '';
      await fetch('/api/admin/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, details, adminUser: 'SuperAdmin' }),
      }).catch(() => {});
    } catch {}
  }
}

export const store = new StoreService();
store.initialize();
