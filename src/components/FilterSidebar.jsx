import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Star, X, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'Keyboard',
  'Mouse',
  'Headset',
  'Monitor',
  'Graphics Card',
  'Gaming Chair',
  'Mousepad',
  'Controller',
  'Webcam',
  'Microphone',
];

const RATINGS = [4, 3, 2];

const FilterSidebar = ({
  filters,
  setFilters,
  isOpen,
  onClose,
  productCount = 0,
}) => {
  const activeCount = useMemo(() => {
    let c = 0;
    if (filters.categories?.length) c += filters.categories.length;
    if (filters.minRating) c++;
    if (filters.priceRange?.[1] < 200000) c++;
    if (filters.inStock) c++;
    return c;
  }, [filters]);

  const resetFilters = () => {
    setFilters({ categories: [], priceRange: [0, 200000], minRating: 0, inStock: false, sort: filters.sort || '' });
  };

  const toggleCategory = (cat) => {
    const current = filters.categories || [];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setFilters({ ...filters, categories: next });
  };

  const content = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#00FF88]" />
          <h2 className="font-bold text-white text-sm uppercase tracking-wider">Filters</h2>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#00FF88]/15 text-[#00FF88] text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/30 hover:text-[#00FF88] transition-colors"
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-4">Category</h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const active = (filters.categories || []).includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/15'
                    : 'text-white/35 hover:text-white/60 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                    active ? 'border-[#00FF88] bg-[#00FF88]' : 'border-white/15'
                  }`}
                >
                  {active && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-4">Price Range</h3>
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={200000}
            step={1000}
            value={filters.priceRange?.[1] ?? 200000}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: [0, parseInt(e.target.value)],
              })
            }
            className="w-full accent-[#00FF88] h-1 bg-white/[0.06] rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00FF88] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,136,0.4)]"
          />
          <div className="flex justify-between mt-3 text-[11px] text-white/25 font-medium">
            <span>₹0</span>
            <span className="text-[#00FF88]">₹{(filters.priceRange?.[1] ?? 200000).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-4">Rating</h3>
        <div className="space-y-1.5">
          {RATINGS.map((r) => {
            const active = filters.minRating === r;
            return (
              <button
                key={r}
                onClick={() => setFilters({ ...filters, minRating: active ? 0 : r })}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                  active
                    ? 'bg-yellow-500/10 border border-yellow-500/15'
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < r ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}
                    />
                  ))}
                </div>
                <span className="text-white/25 text-xs">& up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <button
          onClick={() => setFilters({ ...filters, inStock: !filters.inStock })}
          className="w-full flex items-center justify-between px-3 py-3 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
        >
          <span className="text-sm text-white/40 font-medium">In Stock Only</span>
          <div
            className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${
              filters.inStock ? 'bg-[#00FF88]' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                filters.inStock ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Result count */}
      <div className="pt-4 border-t border-white/[0.04]">
        <p className="text-[11px] text-white/15 text-center">
          Showing <span className="text-white/40 font-bold">{productCount}</span> products
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          {content}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[320px] bg-[#0a0a0a] border-r border-white/[0.06] z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-white text-lg">Filters</h2>
                  <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                {content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;
