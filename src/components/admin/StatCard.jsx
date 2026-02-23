import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/analyticsCalculations';

const StatCard = ({ title, value, prefix = '', suffix = '', growth, icon: Icon, color = '#00FF88', delay = 0, isCurrency = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const animRef = useRef(null);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const duration = 2000;
    const startTime = performance.now();
    const startDelay = delay * 150;

    const timeout = setTimeout(() => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime - startDelay;
        if (elapsed < 0) {
          animRef.current = requestAnimationFrame(animate);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setDisplayValue(Math.floor(numValue * eased));
        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        }
      };
      animRef.current = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value, delay]);

  const isPositive = growth > 0;
  const formattedValue = isCurrency ? formatCurrency(displayValue) : formatNumber(displayValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] ${
        fullscreen ? 'fixed inset-4 z-50 flex items-center justify-center' : ''
      }`}
      style={{
        boxShadow: `0 0 0 0 ${color}00, inset 0 1px 0 0 rgba(255,255,255,0.03)`,
      }}
      whileHover={{
        boxShadow: `0 0 30px -5px ${color}20, inset 0 1px 0 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* Glow accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition"
        >
          {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition"
        >
          {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>
      </div>

      <div className={`p-5 ${collapsed ? 'pb-2' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}12`, border: `1px solid ${color}20` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">{title}</p>
              <motion.p
                className="text-2xl font-bold text-white mt-0.5 tabular-nums"
                key={displayValue}
              >
                {prefix}{formattedValue}{suffix}
              </motion.p>
            </div>
          </div>
        </div>

        {!collapsed && growth !== undefined && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2"
          >
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                isPositive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-red-400 bg-red-500/10'
              }`}
            >
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{growth}%
            </div>
            <span className="text-[11px] text-neutral-600">vs last month</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
