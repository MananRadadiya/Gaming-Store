import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { Maximize2, Minimize2 } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsCalculations';

const RANGES = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '12m', label: '12 Months' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d0d]/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-xs text-neutral-400 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-neutral-400 capitalize">{entry.name}:</span>
          <span className="text-sm font-bold text-white">
            {entry.name === 'revenue' || entry.name === 'profit'
              ? formatCurrency(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const RevenueChart = ({ revenueData = [], dailyRevenue = [], weeklyRevenue = [] }) => {
  const [range, setRange] = useState('12m');
  const [fullscreen, setFullscreen] = useState(false);
  const [showProfit, setShowProfit] = useState(true);

  const getChartData = () => {
    switch (range) {
      case '7d': return weeklyRevenue;
      case '30d': return dailyRevenue;
      case '12m': return revenueData;
      default: return revenueData;
    }
  };

  const xKey = range === '12m' ? 'month' : 'date';
  const data = getChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden ${
        fullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <h3 className="text-sm font-bold text-white">Revenue Overview</h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Performance trends over time</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Range toggles */}
          <div className="flex bg-white/[0.04] rounded-lg p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                  range === r.key
                    ? 'bg-[#00FF88]/15 text-[#00FF88]'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {range === '12m' && (
            <button
              onClick={() => setShowProfit(!showProfit)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                showProfit
                  ? 'border-[#BD00FF]/30 text-[#BD00FF] bg-[#BD00FF]/10'
                  : 'border-white/10 text-neutral-500 hover:text-white'
              }`}
            >
              Profit
            </button>
          )}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] transition"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className={`p-5 ${fullscreen ? 'h-[calc(100%-80px)]' : 'h-[340px]'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF88" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00FF88" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BD00FF" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#BD00FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00FF88" />
                <stop offset="100%" stopColor="#00E0FF" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#555', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#555', fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v)}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="url(#lineGradient)"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#00FF88', stroke: '#0a0a0a', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            {showProfit && range === '12m' && (
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#BD00FF"
                strokeWidth={2}
                fill="url(#profitGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#BD00FF', stroke: '#0a0a0a', strokeWidth: 2 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RevenueChart;
