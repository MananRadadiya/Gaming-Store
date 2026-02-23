import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  ShoppingCart,
  BookmarkPlus,
  Zap,
  TrendingUp,
  Check,
  Gauge,
  Eye,
  Crosshair,
  ChevronRight,
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../hooks';

const CATEGORY_META = {
  gpu: { label: 'Graphics Card', icon: Cpu, color: '#00FF88', delay: 0 },
  monitor: { label: 'Monitor', icon: Monitor, color: '#00E0FF', delay: 0.1 },
  keyboard: { label: 'Keyboard', icon: Keyboard, color: '#BD00FF', delay: 0.2 },
  mouse: { label: 'Mouse', icon: Mouse, color: '#FFD600', delay: 0.3 },
  headset: { label: 'Headset', icon: Headphones, color: '#FF6B6B', delay: 0.4 },
};

const TIER_LABELS = {
  mid: { label: 'Mid-Range', color: 'from-yellow-400 to-orange-500', emoji: '⚡' },
  high: { label: 'High-End', color: 'from-cyan-400 to-blue-500', emoji: '🔥' },
  ultra: { label: 'Ultra', color: 'from-purple-400 to-pink-500', emoji: '💎' },
  flagship: { label: 'Flagship', color: 'from-[#00FF88] to-[#00E0FF]', emoji: '👑' },
};

/* ───────── Product Card ───────── */
const RecommendedCard = ({ item, meta, index }) => {
  const IconComponent = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: meta.delay + 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* Card glow on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${meta.color}30, transparent 60%)`,
        }}
      />

      <div className="relative h-full rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] overflow-hidden transition-all duration-500 group-hover:border-white/[0.15]">
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border"
            style={{
              backgroundColor: `${meta.color}15`,
              borderColor: `${meta.color}30`,
              color: meta.color,
            }}
          >
            <IconComponent size={10} />
            {meta.label}
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
          <img
            src={item.images?.[0]}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x400/0B0F14/333?text=${encodeURIComponent(meta.label)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />

          {/* Tier badge */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`px-2 py-0.5 rounded-md bg-gradient-to-r ${
                TIER_LABELS[item.tier]?.color || 'from-gray-400 to-gray-500'
              } text-black text-[9px] font-black uppercase`}
            >
              {TIER_LABELS[item.tier]?.emoji} {TIER_LABELS[item.tier]?.label || item.tier}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-white/30 font-medium">{item.brand}</p>
          <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 min-h-[2.5rem]">
            {item.title}
          </h4>
          <p className="text-[11px] text-white/40 font-medium">{item.spec}</p>
          <div className="pt-1 flex items-center gap-2">
            <span className="text-lg font-black bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent">
              {formatPrice(item.discountPrice)}
            </span>
            {item.price > item.discountPrice && (
              <span className="text-xs text-white/20 line-through">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ───────── Performance Summary ───────── */
const PerformanceSummary = ({ performance, tier }) => {
  const tierInfo = TIER_LABELS[tier] || TIER_LABELS.mid;

  const stats = [
    {
      label: 'Est. FPS',
      value: `${performance.estimatedFps}+`,
      icon: Gauge,
      color: '#00FF88',
    },
    {
      label: 'Refresh Rate',
      value: `${performance.refreshRate} Hz`,
      icon: Eye,
      color: '#00E0FF',
    },
    {
      label: 'Competitive',
      value: performance.competitiveReady ? 'Ready' : 'Casual',
      icon: Crosshair,
      color: performance.competitiveReady ? '#00FF88' : '#FFD600',
    },
    {
      label: 'Ray Tracing',
      value: performance.rayTracingCapable ? 'Yes' : 'No',
      icon: Zap,
      color: performance.rayTracingCapable ? '#BD00FF' : '#666',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-6 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/30 to-transparent" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <TrendingUp size={18} className="text-[#00FF88]" />
          <h3 className="font-bold text-white">Performance Summary</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full bg-gradient-to-r ${tierInfo.color} text-black text-xs font-black uppercase`}
        >
          {tierInfo.emoji} {tierInfo.label} Build
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center"
            >
              <StatIcon size={16} className="mx-auto mb-1.5" style={{ color: stat.color }} />
              <p className="text-lg font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Budget utilization bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Budget Utilization</span>
          <span className="text-[#00FF88] font-bold">{performance.budgetUtilization}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(performance.budgetUtilization, 100)}%` }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF]"
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ───────── Main Results Component ───────── */
const RecommendationResults = ({ recommendation, onSaveBuild }) => {
  const { addToCart } = useCart();
  const [addedAll, setAddedAll] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!recommendation) return null;

  const { items, totalPrice, performance, tier } = recommendation;
  const categories = Object.entries(items);

  const handleAddAllToCart = () => {
    Object.values(items).forEach((item) => {
      addToCart({
        id: item.id,
        name: item.title,
        title: item.title,
        price: item.discountPrice,
        originalPrice: item.price,
        image: item.images?.[0],
        brand: item.brand,
        category: item.category,
        quantity: 1,
      });
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 3000);
  };

  const handleSaveBuild = () => {
    onSaveBuild();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Performance Summary */}
      <PerformanceSummary performance={performance} tier={tier} />

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map(([category, item]) => (
          <RecommendedCard key={category} item={item} meta={CATEGORY_META[category]} />
        ))}
      </div>

      {/* Total & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BD00FF]/30 to-transparent" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Total Price */}
          <div>
            <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">
              Total Build Cost
            </p>
            <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] bg-clip-text text-transparent">
              {formatPrice(totalPrice)}
            </span>
            <p className="text-xs text-white/20 mt-1">
              {categories.length} items · Free shipping over ₹50,000
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <motion.button
              onClick={handleSaveBuild}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={saved}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 border ${
                saved
                  ? 'bg-[#BD00FF]/10 border-[#BD00FF]/40 text-[#BD00FF]'
                  : 'bg-white/[0.04] border-white/[0.1] text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              {saved ? <Check size={16} /> : <BookmarkPlus size={16} />}
              {saved ? 'Saved!' : 'Save Build'}
            </motion.button>

            <motion.button
              onClick={handleAddAllToCart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={addedAll}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 border ${
                addedAll
                  ? 'bg-[#00FF88]/10 border-[#00FF88]/40 text-[#00FF88]'
                  : 'bg-gradient-to-r from-[#00FF88]/20 to-[#00E0FF]/20 border-[#00FF88]/30 text-white hover:border-[#00FF88]/60 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]'
              }`}
            >
              {addedAll ? (
                <>
                  <Check size={16} /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Add All to Cart
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationResults;
