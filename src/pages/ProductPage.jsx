import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingCart, Heart, Truck, Shield, RotateCcw,
  ChevronRight, Minus, Plus, Check, Package, Zap,
} from 'lucide-react';
import { productsAPI } from '../services/api';
import { Footer, ProductCard } from '../components';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { useCart, useWishlist } from '../hooks';

const TABS = ['Description', 'Specifications', 'Reviews'];

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setQuantity(1);
    setActiveTab('Description');
    const load = async () => {
      setLoading(true);
      try {
        const [productRes, allRes] = await Promise.all([
          productsAPI.getById(id),
          productsAPI.getAll(),
        ]);
        setProduct(productRes.data);
        if (productRes.data) {
          setRelated(
            allRes.data
              .filter((p) => p.category === productRes.data.category && p.id !== productRes.data.id)
              .slice(0, 4)
          );
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#050505] min-h-screen text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 w-3/4 rounded-lg bg-white/[0.03] animate-pulse" />
              <div className="h-5 w-1/2 rounded-lg bg-white/[0.02] animate-pulse" />
              <div className="h-12 w-1/3 rounded-lg bg-white/[0.03] animate-pulse" />
              <div className="h-32 rounded-lg bg-white/[0.02] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#050505] min-h-screen text-white pt-24 flex flex-col items-center justify-center">
        <Package size={48} className="text-white/10 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-white/25 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/store" className="px-6 py-3 rounded-xl bg-[#00FF88]/10 text-[#00FF88] font-bold text-sm hover:bg-[#00FF88]/15 transition-colors">
          Back to Store
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image, product.image, product.image];
  const discount = calculateDiscount(product.originalPrice, product.price);
  const isLowStock = product.stock <= 10;

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-white/20 mb-10"
        >
          <Link to="/" className="hover:text-white/40 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/store" className="hover:text-white/40 transition-colors">Store</Link>
          <ChevronRight size={12} />
          <Link
            to={`/store?category=${product.category?.toLowerCase()}`}
            className="hover:text-white/40 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/40 truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        {/* Main Product */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-24"
        >
          {/* Image Gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06] mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#BD00FF]/90 text-white text-xs font-bold backdrop-blur-sm">
                    -{discount}% OFF
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-xs font-bold backdrop-blur-sm">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === i
                      ? 'border-[#00FF88]/50 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                      : 'border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Brand + Category */}
            {product.brand && (
              <span className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3 block">
                {product.brand}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-5 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-white/10'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-white/25">{product.rating}</span>
              <span className="text-sm text-white/15">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-black text-[#00FF88]">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-white/20 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-[#00FF88]/60 font-bold">
                  You save {formatPrice(product.originalPrice - product.price)} ({discount}% off)
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isLowStock ? 'bg-orange-400 animate-pulse' : 'bg-[#00FF88]'}`} />
                <span className={`text-sm font-bold ${isLowStock ? 'text-orange-400' : 'text-white/40'}`}>
                  {product.stock === 0 ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left!` : `${product.stock} in stock`}
                </span>
              </div>
              <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isLowStock ? 'bg-orange-400' : 'bg-[#00FF88]/40'}`}
                  style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-white/30 font-medium">Quantity</span>
              <div className="flex items-center rounded-xl border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-14 h-11 flex items-center justify-center text-white font-bold text-sm border-x border-white/[0.06]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart({ ...product, quantity })}
                disabled={product.stock === 0}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,136,0.25)] transition-shadow duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                  inWishlist
                    ? 'bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88]'
                    : 'border-white/[0.08] text-white/30 hover:text-white hover:border-white/20'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Buy Now */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                addToCart({ ...product, quantity });
                window.location.href = '/checkout';
              }}
              disabled={product.stock === 0}
              className="w-full py-4 rounded-2xl border border-white/[0.08] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 mb-8 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Zap size={16} />
              Buy Now
            </motion.button>

            {/* Trust badges */}
            <div className="space-y-3">
              {[
                { icon: Truck, label: 'Free shipping on orders above ₹50,000', color: '#00FF88' },
                { icon: Shield, label: '2-year manufacturer warranty', color: '#00E0FF' },
                { icon: RotateCcw, label: '30-day hassle-free returns', color: '#BD00FF' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <item.icon size={16} style={{ color: item.color }} />
                  <span className="text-white/30 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-24">
          {/* Tab headers */}
          <div className="flex gap-1 mb-8 border-b border-white/[0.04]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab ? 'text-[#00FF88]' : 'text-white/25 hover:text-white/50'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00FF88]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'Description' && (
                <div className="max-w-3xl">
                  <p className="text-white/35 text-base leading-relaxed mb-8">
                    {product.description || 'No description available.'}
                  </p>
                  {product.features?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-5">Key Features</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {product.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            <Check size={14} className="text-[#00FF88] mt-0.5 flex-shrink-0" />
                            <span className="text-white/40 text-sm">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Specifications' && (
                <div className="grid md:grid-cols-2 gap-3 max-w-4xl">
                  {product.specifications?.length > 0 ? (
                    product.specifications.map((spec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                      >
                        <span className="text-white/25 text-sm">{spec.label}</span>
                        <span className="font-bold text-white text-sm">{spec.value}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-white/20 text-sm col-span-2">No specifications available.</p>
                  )}
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-center">
                      <div className="text-4xl font-black text-white">{product.rating}</div>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'} />
                        ))}
                      </div>
                      <span className="text-[11px] text-white/20 mt-1 block">{product.reviews} reviews</span>
                    </div>
                    <div className="flex-1 ml-6 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-[11px] text-white/20 w-3">{star}</span>
                            <Star size={10} className="fill-yellow-500 text-yellow-500" />
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                              <div className="h-full rounded-full bg-yellow-500/50" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-white/15 w-8 text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-white/20 text-sm text-center">Review feature coming soon.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-2xl font-black text-white tracking-tight mb-8">
              You Might Also{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E0FF]">Like</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
