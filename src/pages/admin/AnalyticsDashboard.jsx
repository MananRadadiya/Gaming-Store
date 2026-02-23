import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, ShoppingCart, Users, CreditCard, BarChart3,
  Download, FileText, FileDown, RefreshCw, ArrowUp, Sun, Moon, Zap,
} from 'lucide-react';
import { fetchAnalytics, setDateRange, toggleAutoRefresh } from '../../store/analyticsSlice';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import SalesBarChart from '../../components/admin/SalesBarChart';
import CategoryPieChart from '../../components/admin/CategoryPieChart';
import TopProductsTable from '../../components/admin/TopProductsTable';
import ConversionFunnel from '../../components/admin/ConversionFunnel';
import DateRangePicker from '../../components/admin/DateRangePicker';
import {
  formatCurrency, generateCSV, generatePDFContent, downloadFile, exportPDF,
} from '../../utils/analyticsCalculations';

/* ── Skeleton loaders ─────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-5 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
      <div className="space-y-2">
        <div className="w-20 h-2.5 bg-white/[0.04] rounded" />
        <div className="w-28 h-5 bg-white/[0.06] rounded" />
      </div>
    </div>
    <div className="mt-3 pt-3 border-t border-white/[0.04]">
      <div className="w-24 h-3 bg-white/[0.04] rounded" />
    </div>
  </div>
);

const SkeletonChart = ({ className = '' }) => (
  <div className={`rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-5 animate-pulse ${className}`}>
    <div className="w-36 h-4 bg-white/[0.06] rounded mb-2" />
    <div className="w-56 h-2.5 bg-white/[0.04] rounded mb-6" />
    <div className="h-[280px] bg-white/[0.02] rounded-xl" />
  </div>
);

/* ── Flash Sale Impact Panel (inline) ─────────────────────────────── */
const FlashSaleImpact = ({ data }) => {
  if (!data) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-5 pb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
          <Zap size={16} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Flash Sale Impact</h3>
          <p className="text-[11px] text-neutral-500">Revenue comparison & uplift</p>
        </div>
      </div>

      <div className="px-5 pb-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#00FF88]/5 to-transparent border border-[#00FF88]/10">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Sale Revenue</p>
          <p className="text-lg font-bold text-[#00FF88] mt-1">{formatCurrency(data.totalRevenue)}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Normal Revenue</p>
          <p className="text-lg font-bold text-neutral-300 mt-1">{formatCurrency(data.normalRevenue)}</p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#00E0FF]/5 to-transparent border border-[#00E0FF]/10">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Uplift</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={16} className="text-[#00E0FF]" />
            <p className="text-lg font-bold text-[#00E0FF]">+{data.upliftPercent}%</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Sale Orders</p>
          <p className="text-lg font-bold text-white mt-1">{data.totalOrders}</p>
        </div>
      </div>

      {data.topProduct && (
        <div className="mx-5 mb-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 via-transparent to-[#00FF88]/5 border border-amber-500/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-medium">Top Discounted Product</p>
              <p className="text-sm font-bold text-white mt-1">{data.topProduct.name}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-neutral-500 line-through">₹{data.topProduct.originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold text-[#00FF88]">₹{data.topProduct.salePrice.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  -{Math.round((1 - data.topProduct.salePrice / data.topProduct.originalPrice) * 100)}% OFF
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">{data.topProduct.unitsSold} sold</p>
              <p className="text-sm font-bold text-[#00FF88]">{formatCurrency(data.topProduct.revenue)}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ── Export Dropdown ───────────────────────────────────────────────── */
const ExportDropdown = ({ stats, topProducts, salesData }) => {
  const [open, setOpen] = useState(false);

  const handleCSV = () => {
    const csv = generateCSV(stats, topProducts, salesData);
    downloadFile(csv, `nexus-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    setOpen(false);
  };

  const handlePDF = () => {
    const html = generatePDFContent(stats, topProducts, salesData);
    exportPDF(html);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00FF88]/15 to-[#00E0FF]/15 border border-[#00FF88]/20 text-xs font-semibold text-[#00FF88] hover:from-[#00FF88]/25 hover:to-[#00E0FF]/25 hover:border-[#00FF88]/30 transition-all"
      >
        <Download size={14} />
        Export Report
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#0d0d0d] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50"
            >
              <button
                onClick={handleCSV}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.04] transition"
              >
                <FileText size={14} className="text-[#00FF88]" />
                Export as CSV
              </button>
              <button
                onClick={handlePDF}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.04] transition border-t border-white/[0.04]"
              >
                <FileDown size={14} className="text-[#00E0FF]" />
                Export as PDF
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Dashboard ───────────────────────────────────────────────── */
const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const {
    stats, revenueData, dailyRevenue, weeklyRevenue, salesData,
    topProducts, conversionData, flashSaleData, loading, dateRange,
    autoRefresh, lastUpdated,
  } = useSelector((s) => s.analytics);

  const [darkMode, setDarkMode] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        dispatch(fetchAnalytics());
      }, 30000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, dispatch]);

  // Scroll-to-top visibility
  useEffect(() => {
    const main = scrollRef.current?.closest('main');
    if (!main) return;
    const handleScroll = () => setShowScrollTop(main.scrollTop > 400);
    main.addEventListener('scroll', handleScroll);
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const main = scrollRef.current?.closest('main');
    main?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statCards = [
    { title: 'Total Revenue', value: stats?.totalRevenue || 0, growth: 18.5, icon: DollarSign, color: '#00FF88', isCurrency: true },
    { title: 'Monthly Revenue', value: stats?.monthlyRevenue || 0, growth: 12.3, icon: TrendingUp, color: '#00E0FF', isCurrency: true },
    { title: 'Avg Order Value', value: stats?.avgOrderValue || 0, growth: 5.8, icon: ShoppingCart, color: '#BD00FF', isCurrency: true },
    { title: 'Conversion Rate', value: stats?.conversionRate || 0, suffix: '%', growth: 2.1, icon: CreditCard, color: '#FFD700' },
    { title: 'Active Users', value: stats?.activeUsers || 0, growth: 24.7, icon: Users, color: '#FF6B35' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, growth: 15.2, icon: BarChart3, color: '#FF4081' },
  ];

  return (
    <div ref={scrollRef} className="space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 -mx-6 lg:-mx-8 px-6 lg:px-8 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold text-white"
            >
              Analytics Dashboard
            </motion.h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[11px] text-neutral-500">
                Comprehensive performance analytics
              </p>
              {lastUpdated && (
                <span className="text-[10px] text-neutral-600">
                  Updated {new Date(lastUpdated).toLocaleTimeString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => dispatch(toggleAutoRefresh())}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium border transition-all ${
                autoRefresh
                  ? 'border-[#00FF88]/30 text-[#00FF88] bg-[#00FF88]/10'
                  : 'border-white/[0.08] text-neutral-500 bg-white/[0.03] hover:text-white'
              }`}
            >
              <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
              Auto-refresh
            </button>

            {/* Dark/Light toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] transition"
              title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Date range */}
            <DateRangePicker
              value={dateRange}
              onChange={(v) => dispatch(setDateRange(v))}
            />

            {/* Manual refresh */}
            <button
              onClick={() => dispatch(fetchAnalytics())}
              disabled={loading}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] disabled:opacity-40 transition"
              title="Refresh data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>

            {/* Export */}
            <ExportDropdown stats={stats} topProducts={topProducts} salesData={salesData} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={card.title} {...card} delay={i} />
          ))}
        </div>
      )}

      {/* Revenue Chart */}
      {loading && !revenueData?.length ? (
        <SkeletonChart />
      ) : (
        <RevenueChart
          revenueData={revenueData}
          dailyRevenue={dailyRevenue}
          weeklyRevenue={weeklyRevenue}
        />
      )}

      {/* Sales Charts Row */}
      {loading && !salesData?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesBarChart salesData={salesData} />
          <CategoryPieChart salesData={salesData} />
        </div>
      )}

      {/* Top Products */}
      {loading && !topProducts?.length ? (
        <SkeletonChart />
      ) : (
        <TopProductsTable products={topProducts} />
      )}

      {/* Conversion Funnel */}
      {loading && !conversionData ? (
        <SkeletonChart />
      ) : (
        <ConversionFunnel conversionData={conversionData} />
      )}

      {/* Flash Sale Impact */}
      <FlashSaleImpact data={flashSaleData} />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88] hover:bg-[#00FF88]/30 transition-all z-50 shadow-lg shadow-[#00FF88]/10"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsDashboard;
