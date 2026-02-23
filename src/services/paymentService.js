let _modalResolver = null;
let _modalState = null;

export const generatePaymentId = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `PAY_NEXUS_${num}`;
};

export const getModalState = () => _modalState;

export const openFakeRazorpayCheckout = ({ amount, customer, onSuccess, onFailure, onDismiss }) => {
  return new Promise((resolve) => {
    _modalState = {
      isOpen: true,
      amount,
      customer,
      onSuccess,
      onFailure,
      onDismiss,
    };
    _modalResolver = resolve;
    window.dispatchEvent(new CustomEvent('nexus-payment-modal', { detail: _modalState }));
  });
};

export const processPayment = () => {
  return new Promise((resolveProcess) => {
    setTimeout(() => {
      const success = Math.random() < 0.85;
      if (success) {
        const paymentId = generatePaymentId();
        resolveProcess({ status: 'success', paymentId });
      } else {
        resolveProcess({ status: 'failed', message: 'Transaction declined by bank.' });
      }
    }, 2500);
  });
};

export const closePaymentModal = () => {
  _modalState = null;
  if (_modalResolver) {
    _modalResolver();
    _modalResolver = null;
  }
};
