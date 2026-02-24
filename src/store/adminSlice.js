import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDbData } from '../services/api';

const CATEGORY_KEYS = [
  'keyboards', 'mouse', 'headsets', 'monitors',
  'mousepads', 'gamingchairs', 'controllers',
  'webcams', 'microphones', 'graphicscards',
];

// ---------- Async Thunks ----------

/** Fetch all products from db.json for admin management */
export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const db = await getDbData();
      const products = [];
      CATEGORY_KEYS.forEach((cat) => {
        const items = db[cat];
        if (Array.isArray(items)) {
          items.forEach((item) => products.push({ ...item, _category: cat }));
        }
      });
      return products;
    } catch (err) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

/** Add a product (in-memory only — no backend in production) */
export const addProduct = createAsyncThunk(
  'admin/addProduct',
  async ({ category, product }, { rejectWithValue }) => {
    try {
      const newProduct = {
        ...product,
        id: Date.now(),
        _category: category,
      };
      return newProduct;
    } catch (err) {
      return rejectWithValue('Failed to add product');
    }
  }
);

/** Update an existing product (in-memory only) */
export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ category, id, product }, { rejectWithValue }) => {
    try {
      return { ...product, id, _category: category };
    } catch (err) {
      return rejectWithValue('Failed to update product');
    }
  }
);

/** Delete a product (in-memory only) */
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async ({ category, id }, { rejectWithValue }) => {
    try {
      return { category, id };
    } catch (err) {
      return rejectWithValue('Failed to delete product');
    }
  }
);

/** Fetch orders from localStorage + db.json seed data */
export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Merge localStorage orders with db.json seed orders
      const localOrders = JSON.parse(localStorage.getItem('nexus_orders')) || [];
      const db = await getDbData();
      const dbOrders = Array.isArray(db.orders) ? db.orders : [];
      // Combine, deduplicate by id, newest first
      const merged = new Map();
      [...dbOrders, ...localOrders].forEach((o) => merged.set(o.id, o));
      return [...merged.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      return rejectWithValue('Failed to fetch orders');
    }
  }
);

// ---------- Slice ----------

const initialState = {
  products: [],
  orders: [],
  loading: false,
  error: null,
  success: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminMessage: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchAdminProducts ---
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- addProduct ---
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.success = 'Product added successfully';
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- updateProduct ---
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.products.findIndex(
          (p) => p.id === action.payload.id && p._category === action.payload._category
        );
        if (idx !== -1) state.products[idx] = action.payload;
        state.success = 'Product updated successfully';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- deleteProduct ---
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => !(p.id === action.payload.id && p._category === action.payload.category)
        );
        state.success = 'Product deleted successfully';
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- fetchOrders ---
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearAdminMessage } = adminSlice.actions;
export default adminSlice.reducer;
