import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Flame, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { useCart, useWishlist } from '../hooks';

/* ── Compact inline rating ── */
const MiniRating = React.memo(({ rating, reviews }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-0.5">
      <Star size={11} className="fill-amber-400 text-amber-400" />
      <span className="text-[11px] font-semibold text-white/70">{rating?.toFixed(1)}</span>
    </div>
    <span className="text-[10px] text-white/20">({reviews})</span>
  </div>
));
MiniRating.displayName = 'MiniRating';

/* ── Stock micro-bar ── */
const StockIndicator = React.memo(({ stock }) => {
  const isLow = stock <= 10;
  const pct = Math.min((stock / 50) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-[3px] rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isLow
              ? 'bg-gradient-to-r from-orange-500 to-red-500'
              : 'bg-gradient-to-r from-[#00FF88]/50 to-[#00E0FF]/50'
          }`}
        />
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
        isLow ? 'text-orange-400/80' : 'text-white/15'
      }`}>
        {isLow ? `${stock} left` : 'In stock'}
      </span>
    </div>
  );
});
StockIndicator.displayName = 'StockIndicator';

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCT CARD — premium cyberpunk design
   ═════════════════════════════════════════════════════════════════════ */

export const ProductCard = React.memo(({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);
  const isFlashSale = product.isFlashSale || (product.badge && product.badge.toLowerCase().includes('sale'));
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col rounded-xl bg-[#0a0a0c] border border-white/[0.05] overflow-hidden transition-all duration-500 hover:border-[#00FF88]/15 hover:shadow-[0_0_1px_rgba(0,255,136,0.15),0_16px_48px_-8px_rgba(0,0,0,0.6)]">

        {/* ─ Top accent line ─ */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent z-10" />
        <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/30 to-transparent transition-all duration-700 z-10" />

        {/* ─ Image section ─ */}
        <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#080809]">
          {/* Skeleton while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-white/[0.02] animate-pulse" />
          )}

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges — top left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-[#BD00FF] text-white text-[10px] font-bold tracking-wide">
                -{discount}%
              </span>
            )}
            {isFlashSale && (
              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold tracking-wide flex items-center gap-1">
                <Flame size={9} /> FLASH
              </span>
            )}
            {product.badge && !isFlashSale && (
              <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur text-white/90 text-[10px] font-bold tracking-wide border border-white/10">
                {product.badge}
              </span>
            )}
          </div>

          {/* Action buttons — top right */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                inWishlist
                  ? 'bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/25 shadow-[0_0_12px_rgba(0,255,136,0.15)]'
                  : 'bg-black/40 text-white/40 border border-white/[0.08] hover:text-white hover:bg-black/60'
              }`}
            >
              <Heart size={13} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={2} />
            </button>
          </div>

          {/* Quick view button — appears on hover */}
          <Link
            to={`/product/${product.id}`}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/[0.08] text-white/70 text-[11px] font-medium hover:text-white hover:border-white/15 transition-colors">
              <Eye size={12} />
              Quick View
            </span>
          </Link>
        </Link>

        {/* ─ Content ─ */}
        <div className="flex flex-col flex-1 p-4 pt-3.5 gap-2.5">
          {/* Category + Rating row */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/20">
              {product.category}
            </span>
            <MiniRating rating={product.rating} reviews={product.reviews} />
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-semibold text-[13px] text-white/85 leading-snug line-clamp-2 group-hover:text-white transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Spacer to push price + button down */}
          <div className="flex-1" />

          {/* Stock */}
          <StockIndicator stock={product.stock} />

          {/* Price + Cart row */}
          <div className="flex items-end justify-between gap-3 pt-1">
            <div className="flex flex-col">
              {product.originalPrice > product.price && (
                <span className="text-[10px] text-white/20 line-through leading-none mb-0.5">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-[#00FF88] leading-none tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => addToCart(product)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-white/[0.04] border border-white/[0.06] text-white/50 hover:bg-[#00FF88]/10 hover:border-[#00FF88]/20 hover:text-[#00FF88] transition-all duration-300 shrink-0"
            >
              <ShoppingCart size={12} />
              <span className="hidden sm:inline">Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';
