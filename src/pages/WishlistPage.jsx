import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Footer, EmptyState } from '../components';
import { useWishlist, useCart } from '../hooks';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../utils/helpers';

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-nexus-darker min-h-screen text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <EmptyState
            title="Your wishlist is empty"
            description="Save your favorite gaming gear to your wishlist"
            icon={Heart}
          />
          <div className="text-center mt-12">
            <Link
              to="/store"
              className="inline-block px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
            >
              Explore Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-nexus-darker min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent"
        >
          My Wishlist
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const discount = calculateDiscount(item.originalPrice, item.price);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl overflow-hidden border border-nexus-accent/10 hover:border-nexus-accent/40 transition h-full flex flex-col">
                  {/* Image */}
                  <Link
                    to={`/product/${item.id}`}
                    className="relative overflow-hidden aspect-square"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-nexus-accent text-nexus-dark px-3 py-1 rounded-lg text-xs font-bold">
                        -{discount}%
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-bold text-white line-clamp-2 hover:text-nexus-accent transition mb-3"
                    >
                      {item.name}
                    </Link>

                    <div className="mb-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-nexus-accent">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-sm text-white/40 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => addToCart(item)}
                        className="flex-1 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold py-2 rounded-lg hover:shadow-lg transition text-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} /> Add
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-3 py-2 rounded-lg transition border-2 border-red-500/30 text-red-500 hover:border-red-500 hover:bg-red-500/10"
                      >
                        <Heart size={16} fill="currentColor" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;
