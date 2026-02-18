import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductGrid, Footer } from '../components';
import { Filter } from 'lucide-react';

const StorePage = () => {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200000]);

  const categories = ['Mouse', 'Keyboard', 'Headset', 'Monitor', 'Graphics Card', 'Gaming Chair'];

  return (
    <div className="bg-nexus-darker min-h-screen text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Gaming Store
          </h1>
          <p className="text-white/60">Discover elite gaming hardware</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${showFilters ? 'block' : 'hidden'} lg:block`}
          >
            <div className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-xl border border-nexus-accent/20 p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Filter size={18} /> Filters
              </h2>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, category: cat });
                          } else {
                            const { category, ...rest } = filters;
                            setFilters(rest);
                          }
                        }}
                        className="w-4 h-4 rounded accent-nexus-accent"
                      />
                      <span className="text-white/70 hover:text-nexus-accent transition">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newRange = [priceRange[0], parseInt(e.target.value)];
                      setPriceRange(newRange);
                      setFilters({ ...filters, minPrice: newRange[0], maxPrice: newRange[1] });
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-white/60">
                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="font-bold mb-4">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded accent-nexus-accent"
                      />
                      <span className="text-white/70">
                        {'⭐'.repeat(rating)} & up
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products */}
          <motion.div className="lg:col-span-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 px-4 py-2 bg-nexus-accent text-nexus-dark font-bold rounded-lg flex items-center gap-2"
            >
              <Filter size={18} /> Filters
            </button>
            <ProductGrid filters={filters} />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StorePage;
