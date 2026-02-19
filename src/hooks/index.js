import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { logout } from '../store/authSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);

  return {
    items,
    addToCart: (product) => dispatch(addToCart(product)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    updateQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    count: items.reduce((acc, item) => acc + item.quantity, 0),
  };
};

export const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.wishlist.items);

  return {
    items,
    addToWishlist: (product) => dispatch(addToWishlist(product)),
    removeFromWishlist: (id) => dispatch(removeFromWishlist(id)),
    isInWishlist: (id) => items.some(item => item.id === id),
    count: items.length,
  };
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  return {
    ...auth,
    logout: () => dispatch(logout()),
    isAdmin: auth.user?.role === 'admin',
  };
};

export const useTheme = () => {
  return useSelector(state => state.theme.isDark);
};
