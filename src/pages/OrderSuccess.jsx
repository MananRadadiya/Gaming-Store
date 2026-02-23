import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Package, ArrowRight, ShoppingBag, Copy, PartyPopper } from 'lucide-react';
import { Footer } from '../components';
import { formatPrice } from '../utils/helpers';
import { getEstimatedDelivery } from '../services/orderService';

/* ── tiny confetti ─────────────────────────────────────── */
const ConfettiPiece = ({ delay }) => {
  const style = useMemo(() => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
    backgroundColor: ['#00FF88', '#00E0FF', '#BD00FF', '#FFD700', '#FF6B6B'][
      Math.floor(Math.random() * 5)
    ],
    width: `${Math.random() * 8 + 4}px`,
    height: `${Math.random() * 8 + 4}px`,
  }), [delay]);

  return (
    <motion.div
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: '100vh', opacity: 0, rotate: Math.random() * 720 - 360 }}
      transition={{ duration: Math.random() * 3 + 2, delay: delay, ease: 'easeIn' }}
      className="absolute rounded-sm pointer-events-none"
      style={style}
    />
  );
};

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const currentOrder = useSelector(state => state.orders.currentOrder);
  const [copied, setCopied] = useState(false);
  const [payIdCopied, setPayIdCopied] = useState(false);

  useEffect(() => {
    if (!currentOrder) {
      const timer = setTimeout(() => navigate('/store'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentOrder, navigate]);

  const handleCopy = () => {
    if (currentOrder?.id) {
      navigator.clipboard.writeText(currentOrder.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentOrder) {
    return (
      <div className="bg-[#0B0F14] min-h-screen text-white flex items-center justify-center">
        <p className="text-white/50">No order found. Redirecting to store…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white pt-24 relative overflow-hidden">
      {/* Confetti layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <ConfettiPiece key={i} delay={i * 0.06} />
        ))}
      </div>

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FF88]/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 w-28 h-28 rounded-full bg-[#00FF88]/20 blur-xl"
            />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00E0FF] flex items-center justify-center shadow-[0_0_60px_rgba(0,255,136,0.4)]">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <Check size={52} className="text-[#0B0F14]" strokeWidth={3} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-black mb-3 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
            Order Confirmed!
          </h1>
          <p className="text-white/50 text-lg">
            Your order has been placed successfully. Thank you for shopping with NEXUS!
          </p>
        </motion.div>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-xl overflow-hidden mb-6"
        >
          <div className="p-6 sm:p-8">
            {/* Order number */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Order Number</p>
                <p className="text-2xl font-black text-[#00FF88]">{currentOrder.id}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-2 rounded-lg border border-white/10 hover:border-[#00FF88]/30 transition-colors"
              >
                {copied ? (
                  <Check size={16} className="text-[#00FF88]" />
                ) : (
                  <Copy size={16} className="text-white/40" />
                )}
              </motion.button>
            </div>

            {/* Items summary */}
            <div className="space-y-3 mb-6 pb-6 border-b border-white/[0.06]">
              {currentOrder.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={14} className="text-white/30" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white/80">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total + delivery */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Paid</p>
                <p className="text-xl font-bold bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
                  {formatPrice(currentOrder.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Est. Delivery</p>
                <p className="text-sm font-semibold text-white/80">
                  {getEstimatedDelivery(currentOrder.createdAt)}
                </p>
              </div>
            </div>

            {/* Payment badge */}
            {currentOrder.paymentId && (
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <span>Payment ID:</span>
                    <span className="text-[#00FF88]/70 font-mono">{currentOrder.paymentId}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(currentOrder.paymentId);
                      setPayIdCopied(true);
                      setTimeout(() => setPayIdCopied(false), 2000);
                    }}
                    className="p-1.5 rounded-md border border-white/10 hover:border-[#00FF88]/30 transition-colors"
                  >
                    {payIdCopied ? (
                      <Check size={12} className="text-[#00FF88]" />
                    ) : (
                      <Copy size={12} className="text-white/40" />
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Email mock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl border border-[#00FF88]/10 bg-[#00FF88]/[0.03] p-4 mb-8 flex items-center gap-3"
        >
          <PartyPopper size={20} className="text-[#00FF88] flex-shrink-0" />
          <p className="text-sm text-white/60">
            A confirmation email has been sent to{' '}
            <span className="text-white/80 font-medium">
              {currentOrder.customer?.email || 'your email'}
            </span>
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to={`/orders/${currentOrder.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#0B0F14] font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-shadow"
          >
            <Package size={18} />
            Track Order
          </Link>
          <Link
            to="/store"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-white/10 text-white font-semibold rounded-xl hover:border-[#00FF88]/30 transition-colors"
          >
            <ShoppingBag size={18} />
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
