import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAnalytics } from '../../store/analyticsSlice';
import SalesBarChart from '../../components/admin/SalesBarChart';
import CategoryPieChart from '../../components/admin/CategoryPieChart';
import TopProductsTable from '../../components/admin/TopProductsTable';
import ConversionFunnel from '../../components/admin/ConversionFunnel';
import { formatCurrency } from '../../utils/analyticsCalculations';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';

/* ── Flash Sale Impact Panel ──────────────────────────────────────── */
const FlashSaleImpact = ({ data }) => {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
          <Zap size={16} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Flash Sale Impact</h3>
          <p className="text-[11px] text-neutral-500">Revenue comparison & performance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 pb-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Sale Revenue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="p-3 rounded-xl bg-gradient-to-br from-[#00FF88]/5 to-transparent border border-[#00FF88]/10"
        >
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Sale Revenue</p>
          <p className="text-lg font-bold text-[#00FF88] mt-1">{formatCurrency(data.totalRevenue)}</p>
        </motion.div>

        {/* Normal Revenue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Normal Revenue</p>
          <p className="text-lg font-bold text-neutral-300 mt-1">{formatCurrency(data.normalRevenue)}</p>
        </motion.div>

        {/* Uplift */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="p-3 rounded-xl bg-gradient-to-br from-[#00E0FF]/5 to-transparent border border-[#00E0FF]/10"
        >
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Uplift</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={16} className="text-[#00E0FF]" />
            <p className="text-lg font-bold text-[#00E0FF]">+{data.upliftPercent}%</p>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Sale Orders</p>
          <p className="text-lg font-bold text-white mt-1">{data.totalOrders}</p>
        </motion.div>
      </div>

      {/* Top Discounted Product */}
      {data.topProduct && (
        <div className="mx-5 mb-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 via-transparent to-[#00FF88]/5 border border-amber-500/10">
          <div className="flex items-center justify-between">
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

/* ── Skeletons ────────────────────────────────────────────────────── */
const SkeletonChart = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-5 animate-pulse">
    <div className="w-36 h-4 bg-white/[0.06] rounded mb-2" />
    <div className="w-56 h-2.5 bg-white/[0.04] rounded mb-6" />
    <div className="h-[280px] bg-white/[0.02] rounded-xl" />
  </div>
);

/* ── Main Page ────────────────────────────────────────────────────── */
const SalesAnalytics = () => {
  const dispatch = useDispatch();
  const { salesData, topProducts, conversionData, flashSaleData, loading } = useSelector((s) => s.analytics);

  useEffect(() => {
    if (!salesData?.length) dispatch(fetchAnalytics());
  }, [dispatch, salesData]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl font-bold text-white">Sales Analytics</h1>
        <p className="text-xs text-neutral-500 mt-1">Detailed sales performance, category insights & conversion data</p>
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonChart />
          <SkeletonChart />
          <SkeletonChart />
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesBarChart salesData={salesData} />
            <CategoryPieChart salesData={salesData} />
          </div>

          {/* Top Products */}
          <TopProductsTable products={topProducts} />

          {/* Conversion Funnel */}
          <ConversionFunnel conversionData={conversionData} />

          {/* Flash Sale Impact */}
          <FlashSaleImpact data={flashSaleData} />
        </>
      )}
    </div>
  );
};

export default SalesAnalytics;
