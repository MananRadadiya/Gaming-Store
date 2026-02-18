import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../hooks';

export const QuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-nexus-gray rounded-2xl border border-nexus-accent/20 p-8 max-w-2xl w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-nexus-dark rounded-lg transition"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">{product?.name}</h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product?.rating) ? 'fill-nexus-accent text-nexus-accent' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <span className="text-white/60">({product?.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-nexus-accent">
                      {formatPrice(product?.price)}
                    </span>
                    <span className="text-lg text-white/40 line-through">
                      {formatPrice(product?.originalPrice)}
                    </span>
                  </div>
                  <p className="text-white/60">{product?.stock} in stock</p>
                </div>

                {/* Description */}
                <p className="text-white/70 mb-6 leading-relaxed">
                  {product?.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-bold text-white mb-2">Key Features:</h3>
                  <ul className="space-y-1">
                    {product?.features?.map((feature, i) => (
                      <li key={i} className="text-white/60 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-nexus-accent rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-nexus-accent/50 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
