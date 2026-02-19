import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// ---------- Async Thunks ----------

/** Fetch all products (from all category endpoints) for admin management */
export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch from every category endpoint in parallel
      const categories = [
        'keyboards', 'mouse', 'headsets', 'monitors',
        'mousepads', 'gamingchairs', 'controllers',
        'webcams', 'microphones', 'graphicscards',
      ];
      const responses = await Promise.all(
        categories.map((cat) => axios.get(`${API_URL}/${cat}`).catch(() => ({ data: [] })))
      );

      const products = [];
      responses.forEach((res, idx) => {
        if (Array.isArray(res.data)) {
          res.data.forEach((item) => {
            products.push({ ...item, _category: categories[idx] });
          });
        }
      });

      return products;
    } catch (err) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

/** Add a product to a specific category */
export const addProduct = createAsyncThunk(
  'admin/addProduct',
  async ({ category, product }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/${category}`, product);
      return { ...data, _category: category };
    } catch (err) {
      return rejectWithValue('Failed to add product');
    }
  }
);

/** Update an existing product */
export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ category, id, product }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/${category}/${id}`, product);
      return { ...data, _category: category };
    } catch (err) {
      return rejectWithValue('Failed to update product');
    }
  }
);

/** Delete a product */
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async ({ category, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${category}/${id}`);
      return { category, id };
    } catch (err) {
      return rejectWithValue('Failed to delete product');
    }
  }
);

/** Fetch orders */
export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`);
      return data;
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
