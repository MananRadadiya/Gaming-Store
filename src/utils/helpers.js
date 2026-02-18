export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const calculateDiscount = (original, current) => {
  return Math.round(((original - current) / original) * 100);
};

export const calculateCartTotal = (items, couponDiscount = 0) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 50000 ? 0 : 499;
  const discountAmount = Math.round(subtotal * (couponDiscount / 100));
  const total = subtotal + tax + shipping - discountAmount;

  return {
    subtotal,
    tax,
    shipping,
    discountAmount,
    total,
  };
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
