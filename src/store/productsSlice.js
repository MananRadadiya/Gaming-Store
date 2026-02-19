import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      if (import.meta.env?.DEV) {
        console.log('[products/fetchProducts] -> start');
      }

      const { data } = await productsAPI.getAll();

      if (import.meta.env?.DEV) {
        console.log('[products/fetchProducts] -> success', data?.length, data?.slice?.(0, 2));
      }

      return Array.isArray(data) ? data : [];
    } catch (err) {
      const message =
        err?.response?.data?.message
        || err?.response?.statusText
        || err?.message
        || 'Failed to fetch products';

      console.error('[products/fetchProducts] -> error', err);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
      state.loading = false;
      state.error = null;
      state.lastFetchedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.payload || 'Failed to fetch products';
      });
  },
});

export const { clearProductsError, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
