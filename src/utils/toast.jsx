import React from 'react';
import { toast } from 'react-toastify';
import {
  ShoppingCart,
  Heart,
  HeartOff,
  LogIn,
  LogOut,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Users,
  Trophy,
} from 'lucide-react';

const ToastIcon = ({ icon: Icon, gradient }) => (
  <div
    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${gradient}`}
    style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
  >
    <Icon size={18} className="text-white" />
  </div>
);

const ToastContent = ({ icon, gradient, title, message }) => (
  <div className="flex items-center gap-3 py-1">
    <ToastIcon icon={icon} gradient={gradient} />
    <div className="flex flex-col min-w-0">
      <span className="text-white font-semibold text-[13px] leading-tight truncate">
        {title}
      </span>
      <span className="text-neutral-400 text-[11px] mt-0.5 leading-tight truncate">
        {message}
      </span>
    </div>
  </div>
);

export const showAddToCartToast = (productName) => {
  toast(
    <ToastContent
      icon={ShoppingCart}
      gradient="bg-gradient-to-br from-[#00FF88] to-[#00CC6A]"
      title="Added to Cart"
      message={productName || 'Item added successfully'}
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showRemoveFromCartToast = (productName) => {
  toast(
    <ToastContent
      icon={Trash2}
      gradient="bg-gradient-to-br from-red-500 to-red-600"
      title="Removed from Cart"
      message={productName || 'Item removed'}
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showCartClearedToast = () => {
  toast(
    <ToastContent
      icon={ShoppingBag}
      gradient="bg-gradient-to-br from-orange-500 to-amber-500"
      title="Cart Cleared"
      message="All items have been removed"
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showAddToWishlistToast = (productName) => {
  toast(
    <ToastContent
      icon={Heart}
      gradient="bg-gradient-to-br from-pink-500 to-rose-500"
      title="Added to Wishlist"
      message={productName || 'Saved for later'}
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showRemoveFromWishlistToast = (productName) => {
  toast(
    <ToastContent
      icon={HeartOff}
      gradient="bg-gradient-to-br from-neutral-500 to-neutral-600"
      title="Removed from Wishlist"
      message={productName || 'Item removed'}
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showLoginSuccessToast = (userName) => {
  toast(
    <ToastContent
      icon={Zap}
      gradient="bg-gradient-to-br from-[#00FF88] to-[#00E0FF]"
      title={`Welcome back${userName ? `, ${userName}` : ''}!`}
      message="You're now logged in"
    />,
    { icon: false, autoClose: 3500 }
  );
};

export const showLoginErrorToast = (errorMsg) => {
  toast(
    <ToastContent
      icon={XCircle}
      gradient="bg-gradient-to-br from-red-500 to-red-600"
      title="Login Failed"
      message={errorMsg || 'Invalid credentials'}
    />,
    { icon: false, autoClose: 4000 }
  );
};

export const showLogoutToast = () => {
  toast(
    <ToastContent
      icon={LogOut}
      gradient="bg-gradient-to-br from-violet-500 to-purple-600"
      title="Signed Out"
      message="See you next time!"
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showAlreadyInWishlistToast = () => {
  toast(
    <ToastContent
      icon={Sparkles}
      gradient="bg-gradient-to-br from-amber-400 to-yellow-500"
      title="Already Saved"
      message="This item is already in your wishlist"
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showFollowToast = (username) => {
  toast(
    <ToastContent
      icon={Users}
      gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
      title="Following"
      message={`You are now following ${username}`}
    />,
    { icon: false, autoClose: 3000 }
  );
};

export const showAchievementToast = (achievementName) => {
  toast(
    <ToastContent
      icon={Trophy}
      gradient="bg-gradient-to-br from-amber-400 to-yellow-500"
      title="Achievement Unlocked!"
      message={achievementName}
    />,
    { icon: false, autoClose: 4000 }
  );
};
