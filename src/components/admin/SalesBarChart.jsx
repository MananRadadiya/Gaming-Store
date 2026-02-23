import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Maximize2, Minimize2 } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsCalculations';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0d0d]/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-xs font-bold text-white mb-1.5">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-400">Sales:</span>
          <span className="text-sm font-bold text-white">{payload[0]?.payload?.sales} units</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-400">Revenue:</span>
          <span className="text-sm font-bold text-[#00FF88]">{formatCurrency(payload[0]?.payload?.revenue)}</span>
        </div>
      </div>
    </div>
  );
};

const SalesBarChart = ({ salesData = [] }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [metric, setMetric] = useState('sales');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden ${
        fullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <h3 className="text-sm font-bold text-white">Sales by Category</h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Category-wise performance breakdown</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/[0.04] rounded-lg p-0.5">
            {['sales', 'revenue'].map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium capitalize transition-all ${
                  metric === m
                    ? 'bg-[#00E0FF]/15 text-[#00E0FF]'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
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
          <BarChart
            data={salesData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(state) => {
              if (state?.activeTooltipIndex !== undefined) {
                setHoveredBar(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <defs>
              {salesData.map((entry, i) => (
                <linearGradient key={i} id={`barGradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={hoveredBar === i ? 1 : 0.8} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={hoveredBar === i ? 0.6 : 0.3} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#555', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#555', fontSize: 11 }}
              tickFormatter={(v) => metric === 'revenue' ? formatCurrency(v) : v}
              width={metric === 'revenue' ? 65 : 40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar
              dataKey={metric}
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {salesData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={`url(#barGradient-${i})`}
                  style={{
                    filter: hoveredBar === i ? `drop-shadow(0 0 12px ${entry.color}60)` : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesBarChart;
