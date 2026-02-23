import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import productsReducer from './productsSlice';
import esportsReducer from './esportsSlice';
import communityReducer from './communitySlice';
import notificationReducer from './notificationSlice';
import ordersReducer from './ordersSlice';
import analyticsReducer from './analyticsSlice';
import blogReducer from './blogSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    theme: themeReducer,
    auth: authReducer,
    admin: adminReducer,
    products: productsReducer,
    esports: esportsReducer,
    community: communityReducer,
    notifications: notificationReducer,
    orders: ordersReducer,
    analytics: analyticsReducer,
    blog: blogReducer,
  },
});

export default store;
