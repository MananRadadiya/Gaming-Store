import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart, useWishlist } from '../hooks';
import { formatPrice } from '../utils/helpers';

// ---------- Stagger animation variants (module-level = created once) ----------
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 60, damping: 18 },
  },
};

/* PERF: Pre-generate star arrays to avoid [...Array(5)].map on every render */
const STARS = [0, 1, 2, 3, 4];

// ---------- Premium Product Card ----------
/* PERF: Wrapped in React.memo — prevents re-render when parent products array
   reference changes but individual product data hasn't.
   Also: cart/wishlist actions lifted to parent to avoid creating
   useCart/useWishlist hooks per card instance */
const FeaturedCard = React.memo(({ product, onAddToCart, onToggleWishlist, inWishlist }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex-shrink-0 w-[300px] sm:w-[320px]"
    >
      <div className="relative h-full rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-[#00FF88]/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.08)]">
        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#00FF88]/10 rounded-full blur-[80px]" />
        </div>

        {/* Image — PERF: added loading="lazy" for below-fold images */}
        <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-[10px] font-bold uppercase tracking-wider">
              {product.badge}
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product);
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              inWishlist
                ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30'
                : 'bg-white/5 text-white/40 border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </Link>

        {/* Content */}
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-0.5">
              {STARS.map((i) => (
                <Star
                  key={i}
                  size={11}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-white/10'
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-white/30 font-medium">({product.reviews})</span>
          </div>

          {/* Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-3 group-hover:text-[#00FF88] transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-[#00FF88]">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-white/25 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Add to cart */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(product)}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#00FF88]/10 hover:border-[#00FF88]/20 hover:text-[#00FF88] transition-all duration-300"
          >
            <ShoppingCart size={13} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
FeaturedCard.displayName = 'FeaturedCard';

// ---------- Main Section ----------
const FeaturedShowcase = () => {
  const [products, setProducts] = useState([]);
  /* PERF: Single hook instance shared across all cards instead of per-card */
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleToggleWishlist = useCallback((product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  useEffect(() => {
    productsAPI.getAll().then(({ data }) => {
      /* PERF: moved sort logic out of render */
      const featured = data
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      setProducts(featured);
    });
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#00FF88]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#BD00FF]/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00FF88] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Sparkles size={12} />
              Curated Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E0FF]">Gear</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/store"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white/50 hover:text-[#00FF88] border border-white/[0.08] hover:border-[#00FF88]/30 transition-all duration-300 group"
            >
              View All
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Horizontal scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, i) => (
            <FeaturedCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onToggleWishlist={handleToggleWishlist}
              inWishlist={isInWishlist(product.id)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedShowcase;
