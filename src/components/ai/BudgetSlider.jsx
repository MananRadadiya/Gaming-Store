import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/helpers';

const PRESETS = [50000, 80000, 120000, 175000];

const getBudgetLabel = (val) => {
  if (val < 50000) return { label: 'Entry',      color: 'from-yellow-400 to-orange-500', text: 'text-orange-400' };
  if (val < 80000) return { label: 'Mid-Range',  color: 'from-cyan-400 to-blue-500',    text: 'text-cyan-400'   };
  if (val < 130000) return { label: 'High-End',  color: 'from-purple-400 to-pink-500',  text: 'text-purple-400' };
  return                  { label: 'Enthusiast', color: 'from-[#00FF88] to-[#00E0FF]',  text: 'text-[#00FF88]'  };
};

const BudgetSlider = ({ value, onChange, min = 30000, max = 200000 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);

  // Clamp percentage to [0, 100] — avoids thumb overflowing border radius
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  // Thumb offset corrects for thumb radius (10px) so it stays on the track ends
  const thumbOffset = `calc(${pct}% - ${Math.round(pct * 0.2)}px - 10px)`;

  const { label: tierLabel, color: tierColor } = getBudgetLabel(value);

  const handleChange = useCallback(
    (e) => onChange(Number(e.target.value)),
    [onChange],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Budget
        </label>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${tierColor} text-black`}>
          {tierLabel}
        </span>
      </div>

      {/* Price Display — no key re-mount, just text changes */}
      <div className="text-center select-none">
        <span className="text-3xl font-black bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] bg-clip-text text-transparent tabular-nums">
          {formatPrice(value)}
        </span>
      </div>

      {/* ── Slider ── */}
      <div className="pt-3 pb-2">
        {/*
          Wrapper: relative + explicit height so the native input
          and custom visuals share the same coordinate space.
        */}
        <div ref={trackRef} className="relative h-5 flex items-center">

          {/* Track background */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-white/[0.06] border border-white/[0.06]" />

          {/* Filled portion — CSS width, no framer-motion animation (prevents jitter) */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] pointer-events-none"
            style={{ width: `${pct}%` }}
          />

          {/* Glow under fill */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-gradient-to-r from-[#00FF88]/30 via-[#00E0FF]/30 to-[#BD00FF]/30 blur-[4px] pointer-events-none"
            style={{ width: `${pct}%` }}
          />

          {/* Native input — transparent, sits over the full track */}
          <input
            type="range"
            min={min}
            max={max}
            step={5000}
            value={value}
            onChange={handleChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
          />

          {/* Custom thumb — pointer-events-none so input stays interactive */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ left: thumbOffset }}
            animate={{
              scale: isDragging ? 1.35 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div
              className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00E0FF] border-2 border-black/40"
              style={{
                boxShadow: isDragging
                  ? '0 0 0 4px rgba(0,255,136,0.2), 0 0 20px rgba(0,255,136,0.5)'
                  : '0 0 0 2px rgba(0,255,136,0.15), 0 0 12px rgba(0,255,136,0.25)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-[11px] text-white/25 font-medium -mt-1">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>

      {/* Quick Presets */}
      <div className="flex gap-2">
        {PRESETS.map((preset) => {
          const active = Math.abs(value - preset) < 2500;
          return (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-200 border ${
                active
                  ? 'bg-[#00FF88]/10 border-[#00FF88]/35 text-[#00FF88]'
                  : 'bg-white/[0.03] border-white/[0.05] text-white/35 hover:text-white/60 hover:border-white/10'
              }`}
            >
              ₹{preset / 1000}K
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetSlider;
