import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/helpers';

const BudgetSlider = ({ value, onChange, min = 30000, max = 200000 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;

  const getBudgetLabel = useCallback((val) => {
    if (val < 50000) return { label: 'Entry', color: 'from-yellow-400 to-orange-500' };
    if (val < 80000) return { label: 'Mid-Range', color: 'from-cyan-400 to-blue-500' };
    if (val < 130000) return { label: 'High-End', color: 'from-purple-400 to-pink-500' };
    return { label: 'Enthusiast', color: 'from-[#00FF88] to-[#00E0FF]' };
  }, []);

  const { label: tierLabel, color: tierColor } = getBudgetLabel(value);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Budget
        </label>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${tierColor} text-black`}>
            {tierLabel}
          </span>
        </div>
      </div>

      {/* Price Display */}
      <motion.div
        key={value}
        initial={{ scale: 0.95, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <span className="text-3xl font-black bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] bg-clip-text text-transparent">
          {formatPrice(value)}
        </span>
      </motion.div>

      {/* Slider Track */}
      <div className="relative pt-2 pb-1">
        <div className="relative h-3 rounded-full bg-white/[0.06] border border-white/[0.08] overflow-hidden">
          {/* Filled portion */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF]"
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00FF88]/40 via-[#00E0FF]/40 to-[#BD00FF]/40 blur-md"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Input range (invisible, on top for interaction) */}
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{ top: '8px', height: '12px' }}
        />

        {/* Custom Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ left: `calc(${percentage}% - 10px)`, top: '16px' }}
          animate={{
            scale: isDragging ? 1.3 : 1,
            boxShadow: isDragging
              ? '0 0 30px rgba(0,255,136,0.6), 0 0 60px rgba(0,224,255,0.3)'
              : '0 0 15px rgba(0,255,136,0.3)',
          }}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00E0FF] border-2 border-white/30 shadow-lg" />
        </motion.div>
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-[11px] text-white/30 font-medium">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>

      {/* Quick Presets */}
      <div className="flex gap-2 mt-1">
        {[50000, 80000, 120000, 175000].map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border ${
              Math.abs(value - preset) < 5000
                ? 'bg-[#00FF88]/10 border-[#00FF88]/40 text-[#00FF88]'
                : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15'
            }`}
          >
            {preset >= 100000 ? `₹${preset / 1000}K` : `₹${preset / 1000}K`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BudgetSlider;
