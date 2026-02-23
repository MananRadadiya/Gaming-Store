import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, ShoppingCart, Users, CreditCard, BarChart3,
} from 'lucide-react';
import { fetchAnalytics } from '../../store/analyticsSlice';
import StatCard from '../../components/admin/StatCard';
import RevenueChart from '../../components/admin/RevenueChart';
import { formatCurrency } from '../../utils/analyticsCalculations';

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

const SkeletonChart = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-5 animate-pulse">
    <div className="w-36 h-4 bg-white/[0.06] rounded mb-2" />
    <div className="w-56 h-2.5 bg-white/[0.04] rounded mb-6" />
    <div className="h-[280px] bg-white/[0.02] rounded-xl" />
  </div>
);

const RevenueOverview = () => {
  const dispatch = useDispatch();
  const { stats, revenueData, dailyRevenue, weeklyRevenue, loading } = useSelector((s) => s.analytics);

  useEffect(() => {
    if (!stats) dispatch(fetchAnalytics());
  }, [dispatch, stats]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue || 0,
      growth: 18.5,
      icon: DollarSign,
      color: '#00FF88',
      isCurrency: true,
    },
    {
      title: 'Monthly Revenue',
      value: stats?.monthlyRevenue || 0,
      growth: 12.3,
      icon: TrendingUp,
      color: '#00E0FF',
      isCurrency: true,
    },
    {
      title: 'Avg Order Value',
      value: stats?.avgOrderValue || 0,
      growth: 5.8,
      icon: ShoppingCart,
      color: '#BD00FF',
      isCurrency: true,
    },
    {
      title: 'Conversion Rate',
      value: stats?.conversionRate || 0,
      suffix: '%',
      growth: 2.1,
      icon: CreditCard,
      color: '#FFD700',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      growth: 24.7,
      icon: Users,
      color: '#FF6B35',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      growth: 15.2,
      icon: BarChart3,
      color: '#FF4081',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl font-bold text-white">Revenue Overview</h1>
        <p className="text-xs text-neutral-500 mt-1">Track your revenue performance and financial metrics</p>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
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
      {loading ? (
        <SkeletonChart />
      ) : (
        <RevenueChart
          revenueData={revenueData}
          dailyRevenue={dailyRevenue}
          weeklyRevenue={weeklyRevenue}
        />
      )}
    </div>
  );
};

export default RevenueOverview;
