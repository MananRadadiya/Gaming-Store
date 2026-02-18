import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { useCart, useWishlist } from '../hooks';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <div className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl overflow-hidden border border-nexus-accent/10 hover:border-nexus-accent/40 transition backdrop-blur-sm h-full flex flex-col">
        {/* Image Container */}
        <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
          {product.badge && (
            <div className="absolute top-3 right-3 bg-nexus-accent text-nexus-dark px-3 py-1 rounded-lg text-xs font-bold">
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-nexus-purple text-white px-3 py-1 rounded-lg text-xs font-bold">
              -{discount}%
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <Link to={`/product/${product.id}`} className="hover:text-nexus-accent transition">
            <h3 className="font-bold text-white line-clamp-2 mb-2">{product.name}</h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'fill-nexus-accent text-nexus-accent' : 'text-gray-600'}
                />
              ))}
            </div>
            <span className="text-xs text-white/60">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="mb-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-nexus-accent">{formatPrice(product.price)}</span>
              <span className="text-sm text-white/40 line-through">{formatPrice(product.originalPrice)}</span>
            </div>
          </div>

          {/* Stock */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1 flex-1 bg-nexus-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-nexus-accent to-nexus-cyan"
                style={{ width: `${(product.stock / 50) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/60">{product.stock} left</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => addToCart(product)}
              className="flex-1 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold py-2 rounded-lg hover:shadow-lg hover:shadow-nexus-accent/50 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} /> Add
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (inWishlist) {
                  removeFromWishlist(product.id);
                } else {
                  addToWishlist(product);
                }
              }}
              className={`px-4 py-2 rounded-lg transition border-2 ${
                inWishlist
                  ? 'bg-nexus-accent/20 border-nexus-accent text-nexus-accent'
                  : 'border-nexus-accent/30 text-white hover:border-nexus-accent'
              }`}
            >
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
