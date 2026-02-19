import React from 'react';
import { Star, Heart, ShoppingCart, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { useCart, useWishlist } from '../hooks';

export const ProductCard = React.memo(({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);
  const isLowStock = product.stock <= 10;
  const isFlashSale = product.isFlashSale || (product.badge && product.badge.toLowerCase().includes('sale'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <div className="relative h-full rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-[#00FF88]/20 hover:shadow-[0_8px_40px_rgba(0,255,136,0.06)]">
        {/* Hover glow accent */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00FF88]/[0.06] rounded-full blur-[80px]" />
        </div>

        {/* Image */}
        <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-50" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-[#BD00FF]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                -{discount}%
              </span>
            )}
            {isFlashSale && (
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                <Flame size={10} /> Flash
              </span>
            )}
            {product.badge && !isFlashSale && (
              <span className="px-2.5 py-1 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
              inWishlist
                ? 'bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30'
                : 'bg-black/30 text-white/40 border border-white/10 hover:text-white hover:border-white/25'
            }`}
          >
            <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
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
            <span className="text-[10px] text-white/25 font-medium">({product.reviews})</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-3 group-hover:text-[#00FF88] transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-[#00FF88]">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-white/20 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {/* Stock indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isLowStock ? 'text-orange-400' : 'text-white/20'}`}>
                {isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
              </span>
            </div>
            <div className="h-0.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLowStock
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-[#00FF88]/60 to-[#00E0FF]/60'
                }`}
                style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Add to Cart */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addToCart(product)}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#00FF88]/10 hover:border-[#00FF88]/20 hover:text-[#00FF88] transition-all duration-300 mt-auto"
          >
            <ShoppingCart size={13} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';
