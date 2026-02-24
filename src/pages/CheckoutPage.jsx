import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '../components';
import { useCart } from '../hooks';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/cartSlice';
import { createOrder, updatePaymentStatus } from '../store/ordersSlice';
import {
  Check,
  Package,
  CreditCard,
  Eye,
  MapPin,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { formatPrice, calculateCartTotal } from '../utils/helpers';
import { buildOrderObject } from '../services/orderService';
import { openFakeRazorpayCheckout } from '../services/paymentService';
import FakeRazorpayModal from '../components/orders/FakeRazorpayModal';

/* ── Shimmer bar ─────────────────────────────────────── */
const ShimmerBar = () => (
  <div className="w-full h-1 rounded-full overflow-hidden bg-white/5">
    <motion.div
      className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#00FF88]/60 to-transparent rounded-full"
      animate={{ x: ['-100%', '400%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [couponDiscount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const errorRef = useRef(null);

  const [customer, setCustomer] = useState({
    firstName: 'Manan',
    lastName: 'Radadiya',
    email: 'manan.radadiya@gmail.com',
    phone: '9876543210',
    address: '42 Cyber Lane, Electronic City',
    city: 'Bengaluru',
    pinCode: '560100',
  });

  const { subtotal, tax, shipping, discountAmount, total } = calculateCartTotal(items, couponDiscount);

  const checkoutSteps = [
    { name: 'Shipping', icon: MapPin, desc: 'Address' },
    { name: 'Payment', icon: CreditCard, desc: 'Pay' },
    { name: 'Review', icon: Eye, desc: 'Confirm' },
  ];

  /* auto-scroll to errors */
  useEffect(() => {
    if (paymentError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [paymentError]);

  const handleCustomerChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateShipping = () => {
    const errors = {};
    if (!customer.firstName.trim()) errors.firstName = 'Required';
    if (!customer.lastName.trim()) errors.lastName = 'Required';
    if (!customer.email.trim() || !/\S+@\S+\.\S+/.test(customer.email)) errors.email = 'Valid email required';
    if (!customer.phone.trim() || customer.phone.length < 10) errors.phone = 'Valid phone required';
    if (!customer.address.trim()) errors.address = 'Required';
    if (!customer.city.trim()) errors.city = 'Required';
    if (!customer.pinCode.trim() || customer.pinCode.length < 6) errors.pinCode = 'Valid PIN required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToStep = (step) => {
    if (step === 1 && !validateShipping()) return;
    setCurrentStep(step);
  };

  /* ── Razorpay checkout ───────────────────────────── */
  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setPaymentLoading(true);
    setPaymentError(null);

    const totals = { subtotal, tax, shipping, discountAmount, total };
    const orderData = buildOrderObject({ items, totals, customer, paymentMethod: 'razorpay' });

    // Create the order in Redux first (status pending)
    dispatch(createOrder(orderData));

    openFakeRazorpayCheckout({
      amount: total,
      customer,
      onSuccess: (data) => {
        const state = JSON.parse(localStorage.getItem('nexus_orders')) || [];
        const latestOrder = state[0];
        if (latestOrder) {
          dispatch(updatePaymentStatus({
            orderId: latestOrder.id,
            paymentId: data.paymentId,
            paymentStatus: 'success',
          }));
        }
        dispatch(clearCart());
        setPaymentLoading(false);
        navigate('/order-success');
      },
      onFailure: (error) => {
        const state = JSON.parse(localStorage.getItem('nexus_orders')) || [];
        const latestOrder = state[0];
        if (latestOrder) {
          dispatch(updatePaymentStatus({
            orderId: latestOrder.id,
            paymentId: '',
            paymentStatus: 'failed',
          }));
        }
        setPaymentError(error.message || 'Payment failed. Please try again.');
        setPaymentLoading(false);
      },
      onDismiss: () => {
        setPaymentLoading(false);
      },
    });
    setPaymentLoading(false);
  };

  const inputClass = (field) =>
    `w-full bg-[#0B0F14] border ${
      formErrors[field] ? 'border-red-500/60' : 'border-white/10'
    } rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-[#00FF88]/60 focus:shadow-[0_0_20px_rgba(0,255,136,0.08)] transition-all text-sm`;

  /* ── If cart empty ─────────────────────────────────── */
  if (items.length === 0 && !paymentLoading) {
    return (
      <div className="bg-[#0B0F14] min-h-screen text-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto mb-4 text-white/20" />
          <h2 className="text-xl font-bold text-white/50 mb-2">Your cart is empty</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/store')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] font-bold rounded-xl"
          >
            Browse Store
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
            Checkout
          </h1>
        </motion.div>

        {/* ── Progress bar ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between relative">
            {/* connector line */}
            <div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-white/[0.06]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00FF88] to-[#00E0FF]"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / (checkoutSteps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {checkoutSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = currentStep === i;
              const isDone = currentStep > i;
              return (
                <div key={step.name} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      if (i < currentStep) setCurrentStep(i);
                      else if (i === currentStep + 1) goToStep(i);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-300 ${
                      isDone
                        ? 'bg-[#00FF88] border-[#00FF88] text-[#0B0F14]'
                        : isActive
                        ? 'bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                        : 'bg-white/[0.03] border-white/10 text-white/30'
                    }`}
                  >
                    {isDone ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  </motion.div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      isActive ? 'text-[#00FF88]' : isDone ? 'text-white/60' : 'text-white/25'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main form area ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {/* STEP 0: SHIPPING */}
              {currentStep === 0 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl p-8"
                >
                  <h2 className="text-xl font-bold mb-6 text-white">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="First Name"
                          value={customer.firstName}
                          onChange={e => handleCustomerChange('firstName', e.target.value)}
                          className={inputClass('firstName')}
                        />
                        {formErrors.firstName && <p className="text-red-400 text-xs mt-1">{formErrors.firstName}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={customer.lastName}
                          onChange={e => handleCustomerChange('lastName', e.target.value)}
                          className={inputClass('lastName')}
                        />
                        {formErrors.lastName && <p className="text-red-400 text-xs mt-1">{formErrors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={customer.email}
                        onChange={e => handleCustomerChange('email', e.target.value)}
                        className={inputClass('email')}
                      />
                      {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={customer.phone}
                        onChange={e => handleCustomerChange('phone', e.target.value)}
                        className={inputClass('phone')}
                      />
                      {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Address"
                        value={customer.address}
                        onChange={e => handleCustomerChange('address', e.target.value)}
                        className={inputClass('address')}
                      />
                      {formErrors.address && <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          value={customer.city}
                          onChange={e => handleCustomerChange('city', e.target.value)}
                          className={inputClass('city')}
                        />
                        {formErrors.city && <p className="text-red-400 text-xs mt-1">{formErrors.city}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="PIN Code"
                          value={customer.pinCode}
                          onChange={e => handleCustomerChange('pinCode', e.target.value)}
                          className={inputClass('pinCode')}
                        />
                        {formErrors.pinCode && <p className="text-red-400 text-xs mt-1">{formErrors.pinCode}</p>}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToStep(1)}
                    className="w-full mt-8 px-8 py-3.5 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-shadow"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 1: PAYMENT METHOD */}
              {currentStep === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl p-8"
                >
                  <h2 className="text-xl font-bold mb-6 text-white">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Razorpay (Cards, UPI, Wallets)', desc: 'All payment methods via Razorpay', selected: true },
                      { label: 'UPI Direct', desc: 'Google Pay, PhonePe, Paytm', selected: false },
                      { label: 'Net Banking', desc: 'All major banks', selected: false },
                    ].map((method, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          method.selected
                            ? 'bg-[#00FF88]/[0.06] border-[#00FF88]/40 shadow-[0_0_20px_rgba(0,255,136,0.06)]'
                            : 'border-white/[0.06] hover:border-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          defaultChecked={method.selected}
                          className="w-4 h-4 accent-[#00FF88]"
                        />
                        <div>
                          <p className="font-semibold text-sm text-white">{method.label}</p>
                          <p className="text-white/40 text-xs">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Secure badge */}
                  <div className="mt-6 rounded-xl border border-[#00FF88]/10 bg-[#00FF88]/[0.03] p-4 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-[#00FF88] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#00FF88]">Secure Payment</p>
                      <p className="text-[10px] text-white/30">256-bit SSL encrypted · PCI DSS compliant · NEXUS Secure Pay</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(2)}
                    className="w-full mt-6 px-8 py-3.5 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-shadow"
                  >
                    Review Order
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 2: REVIEW */}
              {currentStep === 2 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl p-8"
                >
                  <h2 className="text-xl font-bold mb-6 text-white">Order Review</h2>

                  {/* Items */}
                  <div className="space-y-3 max-h-80 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-nexus-dark border border-white/10 overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={16} className="text-white/20" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-white">{item.name || item.title}</p>
                            <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-sm text-[#00FF88]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info summary */}
                  <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Shipping to</p>
                    <p className="text-sm text-white font-medium">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {customer.address}, {customer.city} - {customer.pinCode}
                    </p>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-white/[0.06] pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-white/50">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/50">
                      <span>GST (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/50">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 mt-2 border-t border-[#00FF88]/20">
                      <span className="text-white">Total</span>
                      <span className="bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Payment error */}
                  {paymentError && (
                    <motion.div
                      ref={errorRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                    >
                      <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-400">Payment Failed</p>
                        <p className="text-xs text-red-300/70 mt-1">{paymentError}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment loading shimmer */}
                  {paymentLoading && (
                    <div className="mb-4">
                      <ShimmerBar />
                      <p className="text-xs text-white/30 text-center mt-2">Initializing secure payment…</p>
                    </div>
                  )}

                  {/* Place order / Retry */}
                  <motion.button
                    whileHover={{ scale: paymentLoading ? 1 : 1.02 }}
                    whileTap={{ scale: paymentLoading ? 1 : 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={paymentLoading}
                    className={`w-full px-8 py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                      paymentLoading
                        ? 'bg-white/[0.06] text-white/30 cursor-not-allowed'
                        : paymentError
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-[0_0_30px_rgba(255,100,50,0.3)]'
                        : 'bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]'
                    }`}
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing…
                      </>
                    ) : paymentError ? (
                      <>
                        <RefreshCw size={18} />
                        Retry Payment
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Pay {formatPrice(total)}
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Sidebar summary ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6 text-white">Order Summary</h2>

              {/* Mini items list */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/[0.06]">
                {items.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={12} className="text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 truncate">{item.name || item.title}</p>
                      <p className="text-[10px] text-white/30">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-white/60">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
                {items.length > 4 && (
                  <p className="text-xs text-white/30 text-center">+{items.length - 4} more items</p>
                )}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-white/[0.06]">
                <div className="flex justify-between text-sm text-white/40">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/40">
                  <span>Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/40">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Secure badge */}
              <div className="mt-6 flex items-center gap-2 justify-center text-white/20">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-medium">Secured by NEXUS Pay · 256-bit SSL</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <FakeRazorpayModal />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
