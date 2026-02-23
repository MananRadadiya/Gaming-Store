/**
 * ═══════════════════════════════════════════════════════════════
 * ChatMessage — Individual message bubble for the NEXUS AI chat
 * ═══════════════════════════════════════════════════════════════
 *
 * Renders user and bot messages with product recommendation cards.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink, Star, Tag } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

/* ── Mini product card shown inside chat ── */
const ProductCard = React.memo(({ product, onAddToCart, onView }) => {
  const discount = product.originalPrice > product.price
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]
                 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.03]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-1"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-cyan-400/70 font-medium tracking-wide uppercase mb-0.5">
          {product.brand} • {product.category}
        </p>
        <h4 className="text-xs font-semibold text-white/90 truncate leading-tight">
          {product.name}
        </h4>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] text-white/50">{product.rating?.toFixed(1)}</span>
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#00FF88]">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-[9px] text-white/25 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[9px] font-bold text-orange-400 bg-orange-400/10 px-1 rounded">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              title="Add to Cart"
              className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/25
                         transition-colors duration-200"
            >
              <ShoppingCart size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onView(product); }}
              title="View Product"
              className="p-1 rounded-md bg-white/[0.06] text-white/50 hover:bg-white/[0.12]
                         hover:text-white transition-colors duration-200"
            >
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';

/* ── Main ChatMessage component ── */
const ChatMessage = React.memo(({ message, onAddToCart, onViewProduct }) => {
  const isBot = message.role === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}
    >
      <div
        className={`max-w-[85%] ${
          isBot
            ? 'bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm'
            : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 rounded-2xl rounded-tr-sm'
        } px-3.5 py-2.5`}
      >
        {/* Text content */}
        {message.text && (
          <div
            className={`text-[13px] leading-relaxed whitespace-pre-wrap ${
              isBot ? 'text-white/80' : 'text-white/90'
            }`}
          >
            {/* Simple markdown-like bold rendering */}
            {message.text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={i} className="text-white font-semibold">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </div>
        )}

        {/* Product recommendation cards */}
        {message.products?.length > 0 && (
          <div className="mt-2.5 space-y-2">
            {message.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onView={onViewProduct}
              />
            ))}

            {/* Show total count if more results available */}
            {message.totalFound > message.products.length && (
              <p className="text-[10px] text-white/30 text-center pt-1">
                Showing top {message.products.length} of {message.totalFound} results
              </p>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[9px] mt-1.5 ${isBot ? 'text-white/20' : 'text-cyan-300/30'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
});
ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
