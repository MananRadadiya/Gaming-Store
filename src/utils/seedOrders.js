/**
 * ═══════════════════════════════════════════════════════════════
 * Order Seed Data — Pre-populates localStorage with realistic
 * orders so the customer-facing Orders page looks like a real site.
 * Fetches real product data from db.json via JSON Server.
 * ═══════════════════════════════════════════════════════════════
 */

import axios from 'axios';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

const CATEGORY_KEYS = [
  'keyboards', 'mouse', 'headsets', 'monitors', 'mousepads',
  'gamingchairs', 'controllers', 'webcams', 'microphones', 'graphicscards',
];

const CATEGORY_LABELS = {
  keyboards: 'Keyboard', mouse: 'Mouse', headsets: 'Headset',
  monitors: 'Monitor', mousepads: 'Mousepad', gamingchairs: 'Gaming Chair',
  controllers: 'Controller', webcams: 'Webcam', microphones: 'Microphone',
  graphicscards: 'Graphics Card',
};

/** Fetch all products from db.json and build a lookup map by id */
const fetchProductCatalog = async () => {
  const catalog = {};
  try {
    const responses = await Promise.all(
      CATEGORY_KEYS.map((key) =>
        axios.get(`${API_URL}/${key}`)
          .then((r) => ({ key, data: r.data }))
          .catch(() => ({ key, data: [] }))
      )
    );
    for (const { key, data } of responses) {
      if (!Array.isArray(data)) continue;
      for (const item of data) {
        catalog[item.id] = {
          name: item.title,
          image: item.images?.[0] || '',
          category: CATEGORY_LABELS[key] || key,
          brand: item.brand || '',
        };
      }
    }
  } catch {
    /* API unavailable — catalog stays empty */
  }
  return catalog;
};

// Helper: build a line-item from product id + price + qty (catalog injected)
const makeItem = (catalog, productId, price, quantity = 1) => {
  const p = catalog[productId] || {};
  return {
    id: productId,
    name: p.name || `Product #${productId}`,
    image: p.image || '',
    price,
    quantity,
    category: p.category || '',
  };
};

// Helper: build a completed timeline for delivered orders
const deliveredTimeline = (dateStr) => {
  const d = new Date(dateStr);
  return [
    { step: 'Order Placed',       completed: true, date: d.toISOString() },
    { step: 'Payment Confirmed',  completed: true, date: new Date(d.getTime() + 600_000).toISOString() },
    { step: 'Processing',         completed: true, date: new Date(d.getTime() + 86_400_000).toISOString() },
    { step: 'Shipped',            completed: true, date: new Date(d.getTime() + 2 * 86_400_000).toISOString() },
    { step: 'Out for Delivery',   completed: true, date: new Date(d.getTime() + 5 * 86_400_000).toISOString() },
    { step: 'Delivered',          completed: true, date: new Date(d.getTime() + 6 * 86_400_000).toISOString() },
  ];
};

const shippedTimeline = (dateStr) => {
  const d = new Date(dateStr);
  return [
    { step: 'Order Placed',       completed: true,  date: d.toISOString() },
    { step: 'Payment Confirmed',  completed: true,  date: new Date(d.getTime() + 600_000).toISOString() },
    { step: 'Processing',         completed: true,  date: new Date(d.getTime() + 86_400_000).toISOString() },
    { step: 'Shipped',            completed: true,  date: new Date(d.getTime() + 2 * 86_400_000).toISOString() },
    { step: 'Out for Delivery',   completed: false, date: null },
    { step: 'Delivered',          completed: false, date: null },
  ];
};

const processingTimeline = (dateStr) => {
  const d = new Date(dateStr);
  return [
    { step: 'Order Placed',       completed: true,  date: d.toISOString() },
    { step: 'Payment Confirmed',  completed: true,  date: new Date(d.getTime() + 600_000).toISOString() },
    { step: 'Processing',         completed: true,  date: new Date(d.getTime() + 86_400_000).toISOString() },
    { step: 'Shipped',            completed: false, date: null },
    { step: 'Out for Delivery',   completed: false, date: null },
    { step: 'Delivered',          completed: false, date: null },
  ];
};

// Customer personas for realism
const CUSTOMERS = [
  { firstName: 'Arjun',   lastName: 'Patel',    email: 'arjun.patel@gmail.com',    phone: '9876543210', address: '42 Cyber Lane, Electronic City', city: 'Bengaluru', pinCode: '560100' },
  { firstName: 'Priya',   lastName: 'Sharma',   email: 'priya.sharma@outlook.com', phone: '9988776655', address: '15 Tech Park Road, Whitefield',  city: 'Bengaluru', pinCode: '560066' },
  { firstName: 'Rahul',   lastName: 'Verma',    email: 'rahul.verma@yahoo.com',    phone: '8877665544', address: '78 MG Road, Camp',               city: 'Pune',      pinCode: '411001' },
  { firstName: 'Sneha',   lastName: 'Reddy',    email: 'sneha.r@gmail.com',        phone: '7766554433', address: '22 Banjara Hills',               city: 'Hyderabad', pinCode: '500034' },
  { firstName: 'Vikram',  lastName: 'Singh',    email: 'vikram.singh@icloud.com',  phone: '9654321087', address: '101 Sector 15, Noida',            city: 'Delhi NCR', pinCode: '201301' },
  { firstName: 'Ananya',  lastName: 'Desai',    email: 'ananya.d@proton.me',       phone: '8543219876', address: '6 Marine Drive, Colaba',          city: 'Mumbai',    pinCode: '400005' },
];

// Build the order with status-appropriate timelines
const buildOrder = (idx, dateStr, status, items, totalAmount, customerIdx) => {
  const year = new Date(dateStr).getFullYear();
  const orderId = `ORD-${year}-${String(idx).padStart(3, '0')}`;
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : 499;
  const customer = CUSTOMERS[customerIdx % CUSTOMERS.length];

  const statusMap = { Delivered: 'Delivered', Shipped: 'Shipped', Processing: 'Processing' };
  const orderStatus = statusMap[status] || 'Processing';

  let timeline;
  if (orderStatus === 'Delivered')  timeline = deliveredTimeline(dateStr);
  else if (orderStatus === 'Shipped') timeline = shippedTimeline(dateStr);
  else timeline = processingTimeline(dateStr);

  return {
    id: orderId,
    createdAt: new Date(dateStr).toISOString(),
    estimatedDelivery: new Date(new Date(dateStr).getTime() + 7 * 86_400_000).toISOString(),
    orderStatus,
    timeline,
    items,
    totalAmount: totalAmount || subtotal + tax + shipping,
    subtotal,
    tax,
    shipping,
    discount: 0,
    paymentMethod: 'razorpay',
    paymentId: `pay_${Math.random().toString(36).slice(2, 14)}`,
    paymentStatus: 'success',
    customer,
  };
};

/** Build all 30 seed orders using real product data from db.json */
const buildSeedOrders = (catalog) => {
  const i = (pid, price, qty) => makeItem(catalog, pid, price, qty);
  return [
    buildOrder(1,  '2025-11-02', 'Delivered',  [i(3, 19999), i(21, 4299)],                           24298,  0),
    buildOrder(2,  '2025-11-08', 'Delivered',  [i(46, 179999)],                                      179999, 1),
    buildOrder(3,  '2025-11-15', 'Delivered',  [i(6, 11999), i(23, 3799)],                           15798,  2),
    buildOrder(4,  '2025-11-22', 'Delivered',  [i(14, 21999), i(1, 24999)],                          46998,  3),
    buildOrder(5,  '2025-12-01', 'Delivered',  [i(26, 31999)],                                       31999,  4),
    buildOrder(6,  '2025-12-05', 'Delivered',  [i(47, 99999), i(16, 94999)],                         194998, 5),
    buildOrder(7,  '2025-12-10', 'Delivered',  [i(7, 12999), i(22, 3499)],                           16498,  0),
    buildOrder(8,  '2025-12-14', 'Delivered',  [i(42, 32999), i(38, 14499)],                         47498,  1),
    buildOrder(9,  '2025-12-19', 'Delivered',  [i(31, 13999), i(11, 14999)],                         28998,  2),
    buildOrder(10, '2025-12-24', 'Delivered',  [i(2, 21999), i(10, 4999), i(24, 1999)],              28997,  3),
    buildOrder(11, '2025-12-28', 'Delivered',  [i(17, 29999)],                                       29999,  4),
    buildOrder(12, '2026-01-03', 'Delivered',  [i(48, 67999), i(20, 24499)],                         92498,  5),
    buildOrder(13, '2026-01-07', 'Delivered',  [i(4, 26999), i(13, 10999), i(25, 2499)],             40497,  0),
    buildOrder(14, '2026-01-12', 'Delivered',  [i(36, 16499), i(44, 11499)],                         27998,  1),
    buildOrder(15, '2026-01-16', 'Delivered',  [i(27, 134999)],                                      134999, 2),
    buildOrder(16, '2026-01-20', 'Delivered',  [i(8, 7499), i(12, 6499)],                            13998,  3),
    buildOrder(17, '2026-01-24', 'Delivered',  [i(49, 47999), i(19, 37999)],                         85998,  4),
    buildOrder(18, '2026-01-28', 'Delivered',  [i(5, 12999), i(9, 6499), i(15, 8499)],               27997,  5),
    buildOrder(19, '2026-01-31', 'Delivered',  [i(32, 16999), i(35, 11999)],                         28998,  0),
    buildOrder(20, '2026-02-02', 'Delivered',  [i(50, 29999), i(18, 46999)],                         76998,  1),
    buildOrder(21, '2026-02-05', 'Delivered',  [i(43, 9999), i(39, 6999), i(33, 4999, 2)],           26996,  2),
    buildOrder(22, '2026-02-08', 'Delivered',  [i(1, 24999), i(6, 11999)],                           36998,  3),
    buildOrder(23, '2026-02-10', 'Shipped',    [i(46, 179999), i(16, 94999)],                        274998, 4),
    buildOrder(24, '2026-02-12', 'Shipped',    [i(28, 18999), i(37, 12999)],                         31998,  5),
    buildOrder(25, '2026-02-14', 'Shipped',    [i(14, 21999), i(7, 12999), i(23, 3799)],             38797,  0),
    buildOrder(26, '2026-02-16', 'Processing', [i(29, 10999), i(34, 2999)],                          13998,  1),
    buildOrder(27, '2026-02-18', 'Processing', [i(47, 99999)],                                       99999,  2),
    buildOrder(28, '2026-02-19', 'Processing', [i(3, 19999), i(41, 18999), i(22, 3499)],             42497,  3),
    buildOrder(29, '2026-02-21', 'Processing', [i(30, 23999), i(45, 21999)],                         45998,  4),
    buildOrder(30, '2026-02-23', 'Processing', [i(40, 3999), i(10, 4999), i(24, 1999, 2)],           12996,  5),
  ];
};

/**
 * Seed localStorage with fake orders using real product data from db.json.
 * Merges seed data with any existing user-placed orders.
 * Uses a flag so seed IDs are only injected once.
 */
export const seedOrders = async () => {
  const STORAGE_KEY = 'nexus_orders';
  const SEED_FLAG = 'nexus_orders_seeded_v2';

  // Don't re-seed if we already merged once
  if (localStorage.getItem(SEED_FLAG)) return;

  // Fetch real product data from db.json
  const catalog = await fetchProductCatalog();

  // If API is down and catalog is empty, skip seeding
  if (Object.keys(catalog).length === 0) return;

  // Build orders with real product names & images
  const SEED_ORDERS = buildSeedOrders(catalog);

  let existing = [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(raw)) existing = raw;
  } catch {
    /* corrupted — start fresh */
  }

  // Collect IDs of orders the user already placed to avoid duplicates
  const existingIds = new Set(existing.map((o) => o.id));

  // Only add seed orders whose IDs don't clash with real user orders
  const newSeeds = SEED_ORDERS.filter((o) => !existingIds.has(o.id));

  // Merge: user orders first (newest), then seed orders newest-first
  const merged = [...existing, ...newSeeds.reverse()];

  // Sort all orders newest-first by createdAt
  merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  localStorage.setItem(SEED_FLAG, 'true');

  if (import.meta.env?.DEV) {
    console.log('[seedOrders] Merged', newSeeds.length, 'seed orders (with real db.json data) +', existing.length, 'existing → total', merged.length);
  }
};

export default seedOrders;