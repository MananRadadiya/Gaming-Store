import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Users, UserPlus, UserCheck, Clock, Heart, Timer, Maximize2, Minimize2 } from 'lucide-react';
import { fetchAnalytics } from '../../store/analyticsSlice';
import StatCard from '../../components/admin/StatCard';
import { calcUserKPIs, formatNumber } from '../../utils/analyticsCalculations';
import { useState } from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d0d]/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-xs text-neutral-400 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-neutral-400">{entry.name}:</span>
          <span className="text-sm font-bold text-white">{formatNumber(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex items-center justify-center gap-5 mt-2">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
        <span className="text-[11px] text-neutral-400 font-medium">{entry.value}</span>
      </div>
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 p-5 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
      <div className="space-y-2">
        <div className="w-20 h-2.5 bg-white/[0.04] rounded" />
        <div className="w-28 h-5 bg-white/[0.06] rounded" />
      </div>
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

const UserAnalytics = () => {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((s) => s.analytics);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!userData?.length) dispatch(fetchAnalytics());
  }, [dispatch, userData]);

  const kpis = calcUserKPIs(userData);
  const latestData = userData?.[userData.length - 1];

  const kpiCards = [
    {
      title: 'New Users',
      value: latestData?.newUsers || 0,
      growth: parseFloat(kpis.newUserGrowth) || 15.3,
      icon: UserPlus,
      color: '#00FF88',
    },
    {
      title: 'Active Users',
      value: latestData?.activeUsers || 0,
      growth: parseFloat(kpis.activeUserGrowth) || 8.7,
      icon: Users,
      color: '#00E0FF',
    },
    {
      title: 'Retention Rate',
      value: parseFloat(kpis.retentionRate) || 0,
      suffix: '%',
      growth: parseFloat(kpis.retentionGrowth) || 3.2,
      icon: UserCheck,
      color: '#BD00FF',
    },
    {
      title: 'Lifetime Value',
      value: kpis.lifetimeValue || 12450,
      growth: 9.4,
      icon: Heart,
      color: '#FF4081',
      isCurrency: true,
    },
    {
      title: 'Avg Session',
      value: 0,
      icon: Timer,
      color: '#FFD700',
    },
    {
      title: 'Returning Users',
      value: latestData?.returningUsers || 0,
      growth: 11.2,
      icon: Clock,
      color: '#FF6B35',
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
        <h1 className="text-xl font-bold text-white">User Analytics</h1>
        <p className="text-xs text-neutral-500 mt-1">User growth, retention, and engagement metrics</p>
      </motion.div>

      {/* KPI Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((card, i) => (
            <StatCard
              key={card.title}
              {...card}
              delay={i}
              {...(card.title === 'Avg Session' ? {
                value: 0,
                prefix: '',
                suffix: '',
              } : {})}
            />
          ))}
        </div>
      )}

      {/* Avg session duration display override */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-neutral-600 -mt-4 ml-1"
        >
          * Avg Session Duration: <span className="text-neutral-400 font-semibold">{kpis.avgSessionDuration || '8m 24s'}</span> (mock)
        </motion.div>
      )}

      {/* User Growth Chart */}
      {loading ? (
        <SkeletonChart />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden ${
            fullscreen ? 'fixed inset-4 z-50' : ''
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-0">
            <div>
              <h3 className="text-sm font-bold text-white">User Growth Trends</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Monthly comparison of user segments</p>
            </div>
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] transition"
            >
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>

          {/* Chart */}
          <div className={`p-5 ${fullscreen ? 'h-[calc(100%-80px)]' : 'h-[380px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="newUsersLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00FF88" />
                    <stop offset="100%" stopColor="#00E0FF" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#555', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#555', fontSize: 11 }}
                  tickFormatter={(v) => formatNumber(v)}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="New Users"
                  stroke="url(#newUsersLine)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#00FF88', stroke: '#0a0a0a', strokeWidth: 2 }}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Users"
                  stroke="#00E0FF"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#00E0FF', stroke: '#0a0a0a', strokeWidth: 2 }}
                  animationDuration={1500}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="returningUsers"
                  name="Returning Users"
                  stroke="#BD00FF"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#BD00FF', stroke: '#0a0a0a', strokeWidth: 2 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserAnalytics;
