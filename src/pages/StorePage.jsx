import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Search, Package, X, Box } from 'lucide-react';
import { ProductCard, Footer } from '../components';
import FilterSidebar from '../components/FilterSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const CATEGORY_MAP = {
  keyboards: 'Keyboard',
  keyboard: 'Keyboard',
  mice: 'Mouse',
  mouse: 'Mouse',
  headsets: 'Headset',
  headset: 'Headset',
  monitors: 'Monitor',
  monitor: 'Monitor',
  gpus: 'Graphics Card',
  'graphics cards': 'Graphics Card',
  'graphics card': 'Graphics Card',
  graphicscards: 'Graphics Card',
  graphicscard: 'Graphics Card',
  chairs: 'Gaming Chair',
  'gaming chairs': 'Gaming Chair',
  'gaming chair': 'Gaming Chair',
  gamingchairs: 'Gaming Chair',
  mousepads: 'Mousepad',
  mousepad: 'Mousepad',
  controllers: 'Controller',
  controller: 'Controller',
  webcams: 'Webcam',
  webcam: 'Webcam',
  microphones: 'Microphone',
  microphone: 'Microphone',
};

const StorePage = () => {
  const dispatch = useDispatch();
  const { products: allProducts, loading, error } = useSelector((s) => s.products);

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const hasFetchedRef = useRef(false);

  // Build filters from URL
  const [filters, setFiltersState] = useState(() => {
    const catParam = searchParams.get('category') || searchParams.get('cat') || '';
    const mapped = CATEGORY_MAP[catParam.toLowerCase()] || catParam;
    return {
      categories: mapped ? [mapped] : [],
      priceRange: [0, 200000],
      minRating: 0,
      inStock: false,
      sort: searchParams.get('sort') || '',
    };
  });

  // Sync URL when filters change
  const setFilters = useCallback((next) => {
    setFiltersState(next);
    const params = new URLSearchParams();
    if (next.categories?.length === 1) params.set('category', next.categories[0].toLowerCase());
    if (next.sort) params.set('sort', next.sort);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Sync from URL on navigation
  useEffect(() => {
    const catParam = searchParams.get('category') || searchParams.get('cat') || '';
    const mapped = CATEGORY_MAP[catParam.toLowerCase()] || catParam;
    setFiltersState((prev) => ({
      ...prev,
      categories: mapped ? [mapped] : [],
      sort: searchParams.get('sort') || prev.sort || '',
    }));
  }, [searchParams]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!import.meta.env?.DEV) return;
    console.log('[StorePage] Redux state:', {
      products: allProducts?.length,
      loading,
      error,
    });
  }, [allProducts, loading, error]);

  // Apply filters + sort + search
  const filtered = useMemo(() => {
    const startCount = allProducts?.length || 0;
    let result = [...(allProducts || [])];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    // Categories
    if (filters.categories?.length) {
      const selected = (filters.categories || []).map((c) => (c || '').toLowerCase());
      result = result.filter((p) => selected.includes((p.category || '').toLowerCase()));
    }

    // Price
    if (filters.priceRange) {
      result = result.filter(
        (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    // Rating
    if (filters.minRating) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Stock
    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sort
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    if (import.meta.env?.DEV) {
      console.log('[StorePage] Filter debug:', {
        startCount,
        endCount: result.length,
        filters,
        searchQuery,
      });
    }

    return result;
  }, [allProducts, filters, searchQuery]);

  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sort) || SORT_OPTIONS[0];

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            {filters.categories?.length === 1 ? (
              <>
                {filters.categories[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E0FF]">s</span>
              </>
            ) : (
              <>
                All{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E0FF]">
                  Products
                </span>
              </>
            )}
          </h1>
          <p className="text-white/30 text-base">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
          </p>

          {/* Enter Virtual 3D Store */}
          <Link
            to="/virtual-store"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                       bg-gradient-to-r from-cyan-500/10 to-purple-500/10
                       border border-cyan-500/30 text-cyan-400
                       hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,224,255,0.15)]
                       transition-all duration-300 group"
          >
            <Box size={18} className="group-hover:rotate-12 transition-transform" />
            Enter 3D Virtual Store
            <span className="ml-1 px-1.5 py-0.5 text-[10px] uppercase tracking-widest rounded bg-cyan-500/20 text-cyan-300">
              New
            </span>
          </Link>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#00FF88]/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 text-sm font-medium hover:border-white/[0.1] transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
              {filters.categories?.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#00FF88]/15 text-[#00FF88] text-[10px] font-bold flex items-center justify-center">
                  {filters.categories.length}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative ml-auto sm:ml-0">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 text-sm font-medium hover:border-white/[0.1] transition-colors min-w-[180px] justify-between"
              >
                {currentSort.label}
                <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[#0f0f10] border border-white/[0.08] shadow-2xl z-30 py-1"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setFilters({ ...filters, sort: opt.value });
                          setSortOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          filters.sort === opt.value
                            ? 'text-[#00FF88] bg-[#00FF88]/5'
                            : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {filters.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, categories: filters.categories.filter((c) => c !== cat) })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/15 text-[#00FF88] text-xs font-bold"
              >
                {cat}
                <X size={12} />
              </button>
            ))}
            <button
              onClick={() => setFilters({ ...filters, categories: [] })}
              className="text-xs text-white/25 hover:text-white/50 px-2 py-1.5 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Layout */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            productCount={filtered.length}
          />

          {/* Product grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
                  <Package size={32} className="text-white/10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Failed to load products</h3>
                <p className="text-white/25 text-sm max-w-sm mb-6">{String(error)}</p>
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-medium hover:text-white hover:border-white/15 transition-all"
                >
                  Retry
                </button>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
                  <Package size={32} className="text-white/10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-white/25 text-sm max-w-sm mb-6">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
                <button
                  onClick={() => {
                    setFilters({ categories: [], priceRange: [0, 200000], minRating: 0, inStock: false, sort: '' });
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-medium hover:text-white hover:border-white/15 transition-all"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StorePage;
