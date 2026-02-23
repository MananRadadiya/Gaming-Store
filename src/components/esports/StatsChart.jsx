import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-[#0d1117]/95 border border-white/[0.08] px-4 py-3 shadow-xl backdrop-blur-md">
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  );
};

/* ── K/D Trend Line ── */
export const KDTrendChart = ({ data = [] }) => {
  const chartData = data.map((v, i) => ({ match: `M${i + 1}`, kd: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md p-5"
    >
      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">K/D Trend</h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="kdGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E0FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00E0FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="match" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="kd" stroke="#00E0FF" strokeWidth={2} fill="url(#kdGradient)" name="K/D" dot={{ r: 3, fill: '#00E0FF', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#00E0FF', stroke: '#0B0F14', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

/* ── Win Rate Bar Chart ── */
export const WinRateChart = ({ data = [] }) => {
  const chartData = data.map((v, i) => ({ season: `S${i + 1}`, winRate: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md p-5"
    >
      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Win Rate History</h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF88" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#00FF88" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="season" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="winRate" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Win %" maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

/* ── Combined export ── */
const StatsChart = ({ kdHistory, winRateHistory }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <KDTrendChart data={kdHistory} />
    <WinRateChart data={winRateHistory} />
  </div>
);

export default StatsChart;
