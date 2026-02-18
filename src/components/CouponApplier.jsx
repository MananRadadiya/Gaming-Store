import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { couponsAPI } from '../services/api';

export const CouponApplier = ({ onApply, currentDiscount }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await couponsAPI.validate(code);
      if (response.data.valid) {
        setMessage(response.data.message);
        onApply(response.data.discount);
        setCode('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to validate coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-nexus-gray rounded-xl border border-nexus-accent/20 p-4"
    >
      <h3 className="font-bold text-white mb-3">Apply Coupon</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Enter coupon code"
          className="flex-1 bg-nexus-dark border border-nexus-accent/30 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-nexus-accent"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleApply}
          disabled={loading}
          className="px-4 py-2 bg-nexus-accent text-nexus-dark font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50"
        >
          {loading ? 'Validating...' : 'Apply'}
        </motion.button>
      </div>
      <div className="text-xs space-y-1">
        {message && <p className="text-nexus-accent">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {currentDiscount > 0 && (
          <p className="text-nexus-accent">Discount: {currentDiscount}% applied</p>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-nexus-accent/10 text-xs text-white/60">
        <p className="mb-2 font-bold">Try these codes:</p>
        <div className="space-y-1">
          <p>• NEXUS10 (10% off)</p>
          <p>• PRO20 (20% off)</p>
          <p>• FLASH15 (15% off)</p>
        </div>
      </div>
    </motion.div>
  );
};
