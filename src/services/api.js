import axios from 'axios';

// ─── Axios client ────────────────────────────────────────────────────
export const apiClient = axios.create({ timeout: 15000 });

// ─── Constants ──────────────────────────────────────────────────────
const CATEGORY_KEYS = [
  'keyboards',
  'mouse',
  'headsets',
  'monitors',
  'mousepads',
  'gamingchairs',
  'controllers',
  'webcams',
  'microphones',
  'graphicscards',
];

const CATEGORY_LABELS = {
  keyboards: 'Keyboard',
  mouse: 'Mouse',
  headsets: 'Headset',
  monitors: 'Monitor',
  mousepads: 'Mousepad',
  gamingchairs: 'Gaming Chair',
  controllers: 'Controller',
  webcams: 'Webcam',
  microphones: 'Microphone',
  graphicscards: 'Graphics Card',
};

// ─── Helpers ────────────────────────────────────────────────────────
const normalizeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toUnifiedProduct = (item, categoryKey) => {
  if (!item || item.id == null || !item.title) return null;

  const originalPrice = normalizeNumber(item.price, 0);
  const price = normalizeNumber(item.discountPrice ?? item.price, originalPrice);

  return {
    id: item.id,
    name: item.title,
    category: CATEGORY_LABELS[categoryKey] || categoryKey,
    price,
    originalPrice,
    image: item.images?.[0] || 'https://via.placeholder.com/500',
    images: item.images || [],
    rating: normalizeNumber(item.rating, 4.5),
    reviews: item.reviews ?? Math.floor(Math.random() * 500) + 50,
    badge: item.badge || null,
    stock: item.stock ?? 50,
    description: item.description || '',
    specifications: item.specs
      ? Object.entries(item.specs).map(([label, value]) => ({
          label:
            label.charAt(0).toUpperCase() +
            label.slice(1).replace(/([A-Z])/g, ' $1'),
          value,
        }))
      : [],
    features: item.features || [],
    brand: item.brand || '',
    _category: categoryKey,
  };
};

// ─── Production in-memory cache (fetches /db.json once) ─────────────
let _dbCache = null;
let _dbPromise = null;

const getDbData = () => {
  if (_dbCache) return Promise.resolve(_dbCache);
  if (_dbPromise) return _dbPromise;

  _dbPromise = axios
    .get('/db.json', { timeout: 15000 })
    .then((res) => {
      _dbCache = res.data;
      _dbPromise = null;
      return _dbCache;
    })
    .catch((err) => {
      _dbPromise = null;
      console.error('[API] Failed to load /db.json:', err?.message || err);
      throw err;
    });

  return _dbPromise;
};

// ─── Data fetchers (always from /db.json) ───────────────────────────

const fetchAllProducts = async () => {
  const db = await getDbData();
  const products = [];

  for (const key of CATEGORY_KEYS) {
    const items = db[key];
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      const p = toUnifiedProduct(item, key);
      if (p) products.push(p);
    }
  }

  return products;
};

const fetchCollection = async (collectionKey) => {
  const db = await getDbData();
  const data = db[collectionKey];
  return Array.isArray(data) ? data : [];
};

// ─── Public API ─────────────────────────────────────────────────────

export const productsAPI = {
  getAll: async () => {
    const products = await fetchAllProducts();
    return { data: products };
  },

  getById: async (id) => {
    const products = await fetchAllProducts();
    const product = products.find((p) => p.id === parseInt(id));
    return { data: product };
  },

  search: async (query) => {
    const products = await fetchAllProducts();
    const q = (query || '').toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
    return { data: results };
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const { data: products } = await productsAPI.getAll();
    const categories = {};
    products.forEach((p) => {
      if (categories[p.category]) {
        categories[p.category]++;
      } else {
        categories[p.category] = 1;
      }
    });

    const result = Object.entries(categories).map(([name, count], id) => ({
      id: id + 1,
      name,
      count,
    }));

    return { data: result };
  },
};

export const blogsAPI = {
  getAll: async () => {
    const data = await fetchCollection('blogs');
    return { data };
  },

  getBySlug: async (slug) => {
    const posts = await fetchCollection('blogs');
    return { data: posts.find((p) => p.slug === slug || String(p.id) === slug) };
  },
};

export const authorsAPI = {
  getAll: async () => {
    const data = await fetchCollection('authors');
    return { data };
  },

  getById: async (id) => {
    const authors = await fetchCollection('authors');
    return { data: authors.find((a) => a.id === id) };
  },
};

export const esportsAPI = {
  getAll: async () => {
    const data = await fetchCollection('tournaments');
    return { data };
  },
};

export const couponsAPI = {
  validate: async (code) => {
    const coupons = {
      NEXUS10: { discount: 10, valid: true },
      PRO20: { discount: 20, valid: true },
      FLASH15: { discount: 15, valid: true },
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        const coupon = coupons[code.toUpperCase()];
        resolve({
          data: {
            valid: !!coupon,
            discount: coupon?.discount || 0,
            message: coupon
              ? 'Coupon applied successfully'
              : 'Invalid coupon code',
          },
        });
      }, 200);
    });
  },
};
