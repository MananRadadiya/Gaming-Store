import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

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
          label: label
            .charAt(0)
            .toUpperCase()
            + label
              .slice(1)
              .replace(/([A-Z])/g, ' $1'),
          value,
        }))
      : [],
    features: item.features || [],
    brand: item.brand || '',
    _category: categoryKey,
  };
};

const fetchAllProducts = async () => {
  const responses = await Promise.all(
    CATEGORY_KEYS.map((key) =>
      apiClient.get(`/${key}`).then((r) => ({ key, data: r.data })).catch((err) => {
        if (import.meta.env?.DEV) {
          console.error(`[API] Failed to load /${key}:`, err?.message || err);
        }
        return { key, data: [] };
      })
    )
  );

  const products = [];
  for (const res of responses) {
    if (!Array.isArray(res.data)) continue;
    for (const item of res.data) {
      const p = toUnifiedProduct(item, res.key);
      if (p) products.push(p);
    }
  }

  if (import.meta.env?.DEV) {
    console.log('[API] fetchAllProducts ->', products.length, 'items');
  }

  return products;
};

// API endpoints
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
        p.name.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q)
        || p.brand?.toLowerCase().includes(q)
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
      count
    }));

    return { data: result };
  },
};

export const blogsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/blogs');
    return { data: Array.isArray(data) ? data : [] };
  },
  getBySlug: async (slug) => {
    const { data } = await apiClient.get('/blogs');
    const posts = Array.isArray(data) ? data : [];
    return { data: posts.find((p) => p.slug === slug || String(p.id) === slug) };
  },
};

export const authorsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/authors');
    return { data: Array.isArray(data) ? data : [] };
  },
  getById: async (id) => {
    const { data } = await apiClient.get('/authors');
    const authors = Array.isArray(data) ? data : [];
    return { data: authors.find((a) => a.id === id) };
  },
};

export const esportsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/tournaments');
    return { data: Array.isArray(data) ? data : [] };
  },
};

export const couponsAPI = {
  validate: async (code) => {
    const coupons = {
      'NEXUS10': { discount: 10, valid: true },
      'PRO20': { discount: 20, valid: true },
      'FLASH15': { discount: 15, valid: true },
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        const coupon = coupons[code.toUpperCase()];
        resolve({
          data: {
            valid: !!coupon,
            discount: coupon?.discount || 0,
            message: coupon ? 'Coupon applied successfully' : 'Invalid coupon code',
          }
        });
      }, 200);
    });
  },
};
