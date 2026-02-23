import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { logout } from '../store/authSlice';
import {
  showAddToCartToast,
  showRemoveFromCartToast,
  showCartClearedToast,
  showAddToWishlistToast,
  showRemoveFromWishlistToast,
  showAlreadyInWishlistToast,
  showLogoutToast,
} from '../utils/toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);

  return {
    items,
    addToCart: (product) => {
      dispatch(addToCart(product));
      showAddToCartToast(product.name || product.title);
    },
    removeFromCart: (id) => {
      const item = items.find(i => i.id === id);
      dispatch(removeFromCart(id));
      showRemoveFromCartToast(item?.name || item?.title);
    },
    updateQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => {
      dispatch(clearCart());
      showCartClearedToast();
    },
    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    count: items.reduce((acc, item) => acc + item.quantity, 0),
  };
};

export const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.wishlist.items);

  return {
    items,
    addToWishlist: (product) => {
      const alreadyExists = items.some(item => item.id === product.id);
      if (alreadyExists) {
        showAlreadyInWishlistToast();
        return;
      }
      dispatch(addToWishlist(product));
      showAddToWishlistToast(product.name || product.title);
    },
    removeFromWishlist: (id) => {
      const item = items.find(i => i.id === id);
      dispatch(removeFromWishlist(id));
      showRemoveFromWishlistToast(item?.name || item?.title);
    },
    isInWishlist: (id) => items.some(item => item.id === id),
    count: items.length,
  };
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  return {
    ...auth,
    logout: () => {
      dispatch(logout());
      showLogoutToast();
    },
    isAdmin: auth.user?.role === 'admin',
  };
};

export const useTheme = () => {
  return useSelector(state => state.theme.isDark);
};
