import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Home, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer, CouponApplier, EmptyState } from '../components';
import { useCart } from '../hooks';
import { calculateCartTotal, formatPrice } from '../utils/helpers';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [couponDiscount, setCouponDiscount] = useState(0);

  const { subtotal, tax, shipping, discountAmount, total } = calculateCartTotal(items, couponDiscount);

  if (items.length === 0) {
    return (
      <div className="bg-nexus-darker min-h-screen text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <EmptyState
            title="Your cart is empty"
            description="Start shopping to add items to your cart"
            icon={ShoppingBag}
          />
          <div className="text-center mt-12">
            <Link
              to="/store"
              className="inline-block px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-nexus-darker min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <motion.div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-6 bg-gradient-to-r from-nexus-gray/30 to-nexus-dark/30 rounded-xl border border-nexus-accent/10 hover:border-nexus-accent/30 transition"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-bold hover:text-nexus-accent transition"
                    >
                      {item.name}
                    </Link>
                    <p className="text-nexus-accent font-bold mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center border border-nexus-accent/30 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-nexus-dark transition"
                    >
                      −
                    </button>
                    <span className="px-4 py-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-nexus-dark transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="text-right flex flex-col justify-between">
                    <p className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400 transition p-2"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Link
                to="/store"
                className="flex items-center gap-2 text-nexus-accent hover:text-nexus-cyan transition"
              >
                <Home size={16} /> Continue Shopping
              </Link>
            </motion.div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl border border-nexus-accent/20 p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-nexus-accent/10">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-nexus-accent font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Coupon */}
              <CouponApplier onApply={setCouponDiscount} currentDiscount={couponDiscount} />

              {/* Checkout Button */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/checkout"
                className="block w-full mt-6 p-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg text-center hover:shadow-lg hover:shadow-nexus-accent/50 transition"
              >
                Proceed to Checkout
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
