import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Footer, ProductGrid } from '../components';
import { formatPrice } from '../utils/helpers';
import { useCart, useWishlist } from '../hooks';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(parseInt(id));

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="text-white text-center pt-40">Loading...</div>;
  if (!product) return <div className="text-white text-center pt-40">Product not found</div>;

  const images = [product.image, product.image, product.image];

  return (
    <div className="bg-nexus-darker min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 text-sm text-white/60 mb-8"
        >
          <a href="/" className="hover:text-nexus-accent">Home</a>
          <span>/</span>
          <a href="/store" className="hover:text-nexus-accent">Store</a>
          <span>/</span>
          <span className="text-nexus-accent">{product.name}</span>
        </motion.div>

        {/* Main Product Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          {/* Images */}
          <div>
            <motion.div
              layout
              className="bg-nexus-gray rounded-2xl aspect-square overflow-hidden mb-4 border border-nexus-accent/20"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex gap-4">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === i ? 'border-nexus-accent' : 'border-nexus-accent/30'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              {product.name}
            </motion.h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating) ? 'fill-nexus-accent text-nexus-accent' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-white/60">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl font-bold text-nexus-accent">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl text-white/40 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
              <p className="text-nexus-accent font-bold">
                Save {formatPrice(product.originalPrice - product.price)}
              </p>
            </motion.div>

            {/* Stock */}
            <div className="mb-8">
              <div className="h-2 bg-nexus-dark rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-nexus-accent to-nexus-cyan"
                  style={{ width: `${(product.stock / 50) * 100}%` }}
                />
              </div>
              <p className="text-white/60">{product.stock} in stock</p>
            </div>

            {/* Description */}
            <p className="text-white/70 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.features?.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-nexus-accent rounded-full" />
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8 flex items-center gap-4">
              <span className="text-white/60">Quantity:</span>
              <div className="flex items-center border border-nexus-accent/30 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-nexus-dark transition"
                >
                  −
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-nexus-dark transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => addToCart({ ...product, quantity })}
                className="flex-1 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-nexus-accent/50 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Cart
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
                className={`px-6 py-3 rounded-lg transition border-2 font-bold flex items-center gap-2 ${
                  inWishlist
                    ? 'bg-nexus-accent/20 border-nexus-accent text-nexus-accent'
                    : 'border-nexus-accent/30 text-white hover:border-nexus-accent'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                Wishlist
              </motion.button>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              {[
                { icon: <Truck size={18} />, label: 'Free shipping on orders over ₹50,000' },
                { icon: <Shield size={18} />, label: '2-year manufacturer warranty' },
                { icon: <RotateCcw size={18} />, label: '30-day returns policy' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-nexus-gray/30 rounded-lg">
                  <span className="text-nexus-accent">{item.icon}</span>
                  <span className="text-white/70 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-t border-nexus-accent/10 pt-16"
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Specifications
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.specifications?.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center p-4 bg-nexus-gray/30 rounded-lg border border-nexus-accent/10 hover:border-nexus-accent/30 transition"
              >
                <span className="text-white/70">{spec.label}</span>
                <span className="font-bold text-nexus-accent">{spec.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            You Might Also Like
          </h2>
          <ProductGrid filters={{ category: product.category }} />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
