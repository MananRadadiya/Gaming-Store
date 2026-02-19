import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard, Footer } from '../components';
import { productsAPI } from '../services/api';

/* ── Countdown Timer ── */
const CountdownTimer = () => {
  const [time, setTime] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    // Set end to midnight tonight
    const getRemaining = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end - now);
      return {
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };

    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="flex items-center gap-3">
      {blocks.map((b, i) => (
        <React.Fragment key={b.label}>
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                {String(b.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider mt-2 block">
              {b.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="text-2xl font-black text-[#00FF88]/40 -mt-5">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ── Flash Sale Page ── */
const FlashSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll().then(({ data }) => {
      // Flash sale = products with discounts > 15% or badge containing "sale"
      const flash = data.filter((p) => {
        const discount = p.originalPrice > 0 ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0;
        return discount >= 15 || (p.badge && p.badge.toLowerCase().includes('sale'));
      });
      // Tag them
      flash.forEach((p) => { p.isFlashSale = true; });
      setProducts(flash);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24">
      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden">
        {/* BG effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-500/[0.06] rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#BD00FF]/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
                <Flame size={12} />
                Limited Time Only
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-5">
                FLASH
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-[#00FF88] to-[#00E0FF]">
                  SALE
                </span>
              </h1>
              <p className="text-white/30 text-lg max-w-md mb-2">
                Massive discounts on premium gaming gear. Don&apos;t miss out — deals expire at midnight.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-orange-400" />
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Ends In</span>
              </div>
              <CountdownTimer />
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { icon: Zap, label: 'Up to 40% Off', color: '#00FF88' },
              { icon: Flame, label: `${products.length} Deals Live`, color: '#FF6B35' },
              { icon: Clock, label: 'Today Only', color: '#00E0FF' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.icon size={16} style={{ color: stat.color }} />
                <span className="text-sm font-bold text-white/40">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <Flame size={48} className="mx-auto text-white/10 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">No flash deals right now</h3>
            <p className="text-white/25 text-sm mb-6">Check back soon for amazing deals!</p>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-bold hover:text-white hover:border-white/15 transition-all"
            >
              Browse Store <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default FlashSalePage;
