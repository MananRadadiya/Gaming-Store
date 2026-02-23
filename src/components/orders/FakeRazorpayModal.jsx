import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  CreditCard,
  Smartphone,
  Landmark,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { processPayment, closePaymentModal } from '../../services/paymentService';
import { formatPrice } from '../../utils/helpers';

const TABS = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Netbanking', icon: Landmark },
];

const ShimmerOverlay = () => (
  <motion.div
    className="absolute inset-0 z-30 rounded-2xl overflow-hidden pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.div>
);

const FakeRazorpayModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [activeTab, setActiveTab] = useState('card');
  const [phase, setPhase] = useState('form');
  const [error, setError] = useState(null);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const handler = (e) => {
      setModalData(e.detail);
      setIsOpen(true);
      setPhase('form');
      setError(null);
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setCardName('');
      setUpiId('');
      setActiveTab('card');
    };
    window.addEventListener('nexus-payment-modal', handler);
    return () => window.removeEventListener('nexus-payment-modal', handler);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    modalData?.onDismiss?.();
    closePaymentModal();
    setModalData(null);
  }, [modalData]);

  const handlePay = useCallback(async () => {
    setPhase('processing');
    setError(null);

    await new Promise((r) => setTimeout(r, 1200));
    setPhase('verifying-otp');

    await new Promise((r) => setTimeout(r, 1400));
    setPhase('verifying-payment');

    const result = await processPayment();

    if (result.status === 'success') {
      setPhase('success');
      await new Promise((r) => setTimeout(r, 1000));
      setPhase('redirecting');
      await new Promise((r) => setTimeout(r, 1200));
      setIsOpen(false);
      modalData?.onSuccess?.({ paymentId: result.paymentId, status: 'success' });
      closePaymentModal();
      setModalData(null);
    } else {
      setPhase('form');
      setError(result.message);
      modalData?.onFailure?.({ status: 'failed', message: result.message });
    }
  }, [modalData]);

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const isFormValid = () => {
    if (activeTab === 'card') {
      return (
        cardNumber.replace(/\s/g, '').length >= 15 &&
        expiry.length >= 4 &&
        cvv.length >= 3 &&
        cardName.trim().length >= 2
      );
    }
    if (activeTab === 'upi') {
      return upiId.includes('@') && upiId.length >= 5;
    }
    return true;
  };

  const isProcessing = ['processing', 'verifying-otp', 'verifying-payment', 'success', 'redirecting'].includes(phase);

  const inputCls =
    'w-full bg-[#0a0e17] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#00FFAA]/50 focus:shadow-[0_0_15px_rgba(0,255,170,0.06)] transition-all disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <AnimatePresence>
      {isOpen && modalData && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) handleDismiss(); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_0_80px_rgba(0,255,170,0.08),0_30px_60px_rgba(0,0,0,0.6)]"
          >
            {isProcessing && <ShimmerOverlay />}

            <div className="bg-gradient-to-br from-[#0d1320] via-[#111827] to-[#0d1320]">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-5 border-b border-white/[0.06]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00FFAA]/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00FFAA]/20 to-[#00E5FF]/10 flex items-center justify-center border border-[#00FFAA]/20">
                      <Lock size={16} className="text-[#00FFAA]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Secure Payment</h3>
                      <p className="text-white/30 text-[10px]">NEXUS Gaming Store</p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={handleDismiss}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-white/40 text-xs">Amount</span>
                  <span className="text-2xl font-black bg-gradient-to-r from-[#00FFAA] to-[#00E5FF] bg-clip-text text-transparent">
                    {formatPrice(modalData.amount)}
                  </span>
                </div>

                {(modalData.customer?.firstName || modalData.customer?.email) && (
                  <div className="mt-2 flex items-center gap-2 text-white/30 text-xs">
                    <span>
                      {modalData.customer.firstName} {modalData.customer.lastName}
                    </span>
                    {modalData.customer.email && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{modalData.customer.email}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Phases */}
              <AnimatePresence mode="wait">
                {/* ── FORM ───────────────────────── */}
                {phase === 'form' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Tabs */}
                    <div className="px-6 pt-5">
                      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        {TABS.map((tab) => {
                          const Icon = tab.icon;
                          const active = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                active
                                  ? 'bg-[#00FFAA]/10 text-[#00FFAA] border border-[#00FFAA]/20 shadow-[0_0_15px_rgba(0,255,170,0.08)]'
                                  : 'text-white/30 hover:text-white/50'
                              }`}
                            >
                              <Icon size={14} />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pt-4"
                        >
                          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                            <p className="text-xs text-red-300">{error}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Card form */}
                    {activeTab === 'card' && (
                      <div className="px-6 pt-4 pb-2 space-y-3">
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">Card Number</label>
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className={inputCls}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                              maxLength={5}
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">CVV</label>
                            <input
                              type="password"
                              placeholder="•••"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              maxLength={4}
                              className={inputCls}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">Name on Card</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    )}

                    {/* UPI form */}
                    {activeTab === 'upi' && (
                      <div className="px-6 pt-4 pb-2 space-y-3">
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">UPI ID</label>
                          <input
                            type="text"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          {['GPay', 'PhonePe', 'Paytm'].map((app) => (
                            <button
                              key={app}
                              onClick={() => setUpiId(`user@${app.toLowerCase()}`)}
                              className="flex-1 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-white/50 font-medium hover:border-[#00FFAA]/20 hover:text-white/70 transition-all"
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Netbanking */}
                    {activeTab === 'netbanking' && (
                      <div className="px-6 pt-4 pb-2 space-y-2">
                        {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map((bank) => (
                          <button
                            key={bank}
                            onClick={() => setActiveTab('netbanking')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:border-[#00FFAA]/20 hover:bg-[#00FFAA]/[0.03] transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                              <Landmark size={14} className="text-white/30 group-hover:text-[#00FFAA]/60 transition-colors" />
                            </div>
                            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{bank}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Pay button */}
                    <div className="px-6 pt-4 pb-6">
                      <motion.button
                        whileHover={{ scale: isFormValid() ? 1.01 : 1 }}
                        whileTap={{ scale: isFormValid() ? 0.98 : 1 }}
                        onClick={handlePay}
                        disabled={!isFormValid()}
                        className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                          isFormValid()
                            ? 'bg-gradient-to-r from-[#00FFAA] to-[#00E5FF] text-[#0B0F14] shadow-[0_0_30px_rgba(0,255,170,0.2)] hover:shadow-[0_0_40px_rgba(0,255,170,0.35)]'
                            : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                        }`}
                      >
                        <Lock size={14} />
                        Pay {formatPrice(modalData.amount)}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── PROCESSING ─────────────────── */}
                {phase === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-16 flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    >
                      <Loader2 size={36} className="text-[#00FFAA]" />
                    </motion.div>
                    <p className="text-white/70 text-sm font-semibold mt-5">Processing payment</p>
                    <motion.div className="flex gap-1 mt-2">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#00FFAA]"
                        />
                      ))}
                    </motion.div>
                    <p className="text-white/20 text-xs mt-6">Do not close or refresh this window</p>
                  </motion.div>
                )}

                {/* ── OTP VERIFICATION ────────────── */}
                {phase === 'verifying-otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-14 flex flex-col items-center"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 w-14 h-14 rounded-full bg-[#00E5FF]/20 blur-lg"
                      />
                      <div className="relative w-14 h-14 rounded-full bg-[#111827] border border-[#00E5FF]/30 flex items-center justify-center">
                        <Smartphone size={22} className="text-[#00E5FF]" />
                      </div>
                    </div>
                    <p className="text-white/70 text-sm font-semibold mt-5">Verifying OTP</p>
                    <p className="text-white/30 text-xs mt-1.5 text-center max-w-[220px]">
                      Authenticating with your bank's secure gateway
                    </p>
                    <div className="flex gap-2 mt-5">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
                          className="w-8 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center"
                        >
                          <motion.span
                            animate={{ opacity: [0, 1] }}
                            transition={{ delay: 0.4 + i * 0.15, duration: 0.3 }}
                            className="text-white/60 font-mono text-sm"
                          >
                            {Math.floor(Math.random() * 10)}
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── PAYMENT VERIFYING ──────────── */}
                {phase === 'verifying-payment' && (
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-16 flex flex-col items-center"
                  >
                    <div className="relative w-14 h-14">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#00FFAA]/20"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <div className="relative w-14 h-14 rounded-full border-2 border-t-[#00FFAA] border-r-[#00FFAA] border-b-transparent border-l-transparent">
                        <motion.div
                          className="w-full h-full"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield size={18} className="text-[#00FFAA]" />
                      </div>
                    </div>
                    <p className="text-white/70 text-sm font-semibold mt-5">Verifying payment</p>
                    <p className="text-white/25 text-xs mt-1.5">Confirming with payment gateway</p>
                  </motion.div>
                )}

                {/* ── SUCCESS ────────────────────── */}
                {phase === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-16 flex flex-col items-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00FFAA] to-[#00E5FF] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,170,0.4)]"
                    >
                      <CheckCircle2 size={32} className="text-[#0B0F14]" />
                    </motion.div>
                    <p className="text-[#00FFAA] text-lg font-bold mt-5">Payment Successful!</p>
                    <p className="text-white/30 text-xs mt-1">{formatPrice(modalData.amount)} paid</p>
                  </motion.div>
                )}

                {/* ── REDIRECTING ────────────────── */}
                {phase === 'redirecting' && (
                  <motion.div
                    key="redirect"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-6 py-16 flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    >
                      <Loader2 size={28} className="text-[#00E5FF]" />
                    </motion.div>
                    <p className="text-white/60 text-sm font-semibold mt-4">Redirecting to order confirmation</p>
                    <motion.div className="flex gap-1 mt-2">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25 }}
                          className="w-1 h-1 rounded-full bg-[#00E5FF]"
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-center gap-2">
                <Lock size={10} className="text-white/15" />
                <span className="text-[10px] text-white/15 font-medium">256-bit encrypted payment · NEXUS Secure</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FakeRazorpayModal;
