import axios from 'axios';
import dbData from '../../db.json';

// Transform database data into unified product format
const transformProducts = () => {
  const products = [];
  
  const categories = {
    'keyboards': 'Keyboard',
    'mouse': 'Mouse',
    'headsets': 'Headset',
    'monitors': 'Monitor',
    'mousepads': 'Mousepad',
    'gamingchairs': 'Gaming Chair',
    'controllers': 'Controller',
    'webcams': 'Webcam',
    'microphones': 'Microphone',
    'graphicscards': 'Graphics Card',
  };

  Object.entries(dbData).forEach(([key, items]) => {
    if (Array.isArray(items) && categories[key]) {
      items.forEach(item => {
        products.push({
          id: item.id,
          name: item.title,
          category: categories[key],
          price: item.discountPrice || item.price,
          originalPrice: item.price,
          image: item.images?.[0] || 'https://via.placeholder.com/500',
          images: item.images || [],
          rating: item.rating || 4.5,
          reviews: Math.floor(Math.random() * 500) + 50,
          badge: item.badge || null,
          stock: item.stock || 50,
          description: item.description || '',
          specifications: item.specs ? Object.entries(item.specs).map(([label, value]) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1'),
            value: value
          })) : [],
          features: item.features || [],
          brand: item.brand || '',
        });
      });
    }
  });

  return products;
};

const products = transformProducts();
const blogs = dbData.blogs || [];
const tournaments = dbData.tournaments || [];

// API endpoints
export const productsAPI = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: products }), 300);
    });
  },
  getById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = products.find(p => p.id === parseInt(id));
        resolve({ data: product });
      }, 200);
    });
  },
  search: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = products.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        );
        resolve({ data: results });
      }, 200);
    });
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const categories = {};
    products.forEach(p => {
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

    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: result }), 200);
    });
  },
};

export const blogsAPI = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: blogs }), 300);
    });
  },
};

export const esportsAPI = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: tournaments }), 300);
    });
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
