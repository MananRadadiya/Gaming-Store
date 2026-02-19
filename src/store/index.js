import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    theme: themeReducer,
    auth: authReducer,
    admin: adminReducer,
    products: productsReducer,
  },
});

export default store;
