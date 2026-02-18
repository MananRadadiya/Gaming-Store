import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../components';
import { useCart } from '../hooks';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { Check, Package, CreditCard, Eye } from 'lucide-react';
import { formatPrice, calculateCartTotal } from '../utils/helpers';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { items } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber] = useState(`ORD-${Date.now()}`);
  const [couponDiscount] = useState(0);

  const { subtotal, tax, shipping, discountAmount, total } = calculateCartTotal(items, couponDiscount);

  const steps = [
    { name: 'Shipping', icon: Package },
    { name: 'Payment', icon: CreditCard },
    { name: 'Review', icon: Eye },
  ];

  const handleCheckout = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      dispatch(clearCart());
    }, 1000);
  };

  if (orderSuccess) {
    return (
      <div className="bg-nexus-darker min-h-screen text-white pt-24 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-nexus-accent to-nexus-cyan rounded-full flex items-center justify-center"
          >
            <Check size={48} className="text-nexus-dark" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Order Confirmed!
          </h1>
          <p className="text-white/60 mb-6">Your order has been placed successfully</p>

          <div className="bg-nexus-gray/30 rounded-xl p-6 mb-8 border border-nexus-accent/20">
            <p className="text-white/60 mb-2">Order Number</p>
            <p className="text-2xl font-bold text-nexus-accent mb-4">{orderNumber}</p>
            <p className="text-white/60 text-sm">
              You'll receive a confirmation email shortly with shipping details.
            </p>
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
          >
            Continue Shopping
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-nexus-darker min-h-screen text-white pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent"
        >
          Checkout
        </motion.h1>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setCurrentStep(i)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                  currentStep === i
                    ? 'bg-nexus-accent/20 border-nexus-accent'
                    : 'bg-nexus-gray/30 border-nexus-accent/20 hover:border-nexus-accent/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep === i
                        ? 'bg-nexus-accent text-nexus-dark'
                        : 'bg-nexus-dark text-white/60'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="font-bold text-lg">{step.name}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl border border-nexus-accent/20 p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      className="bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentStep(1)}
                  className="w-full mt-6 px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
                >
                  Continue to Payment
                </motion.button>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl border border-nexus-accent/20 p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-nexus-accent rounded-lg cursor-pointer bg-nexus-accent/10">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-bold">Credit/Debit Card</p>
                      <p className="text-white/60 text-sm">Visa, Mastercard, American Express</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border-2 border-nexus-accent/20 rounded-lg cursor-pointer hover:border-nexus-accent/40 transition">
                    <input type="radio" name="payment" className="w-5 h-5" />
                    <div>
                      <p className="font-bold">UPI</p>
                      <p className="text-white/60 text-sm">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border-2 border-nexus-accent/20 rounded-lg cursor-pointer hover:border-nexus-accent/40 transition">
                    <input type="radio" name="payment" className="w-5 h-5" />
                    <div>
                      <p className="font-bold">Net Banking</p>
                      <p className="text-white/60 text-sm">All major banks</p>
                    </div>
                  </label>
                </div>
                <div className="mt-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    className="w-full bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="bg-nexus-dark border border-nexus-accent/30 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentStep(2)}
                  className="w-full mt-6 px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
                >
                  Review Order
                </motion.button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl border border-nexus-accent/20 p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Order Review</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 bg-nexus-dark/50 rounded-lg"
                    >
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-nexus-accent">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-nexus-accent/20 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-nexus-accent">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCheckout}
                  className="w-full px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
                >
                  Place Order
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl border border-nexus-accent/20 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-nexus-accent/10">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
