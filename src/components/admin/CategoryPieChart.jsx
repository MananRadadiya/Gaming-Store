import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector,
} from 'recharts';
import { Maximize2, Minimize2 } from 'lucide-react';
import { formatCurrency, calcCategoryShares } from '../../utils/analyticsCalculations';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-[#0d0d0d]/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: data.color }} />
        <p className="text-xs font-bold text-white">{data.category}</p>
      </div>
      <p className="text-sm font-bold text-[#00FF88]">{formatCurrency(data.revenue)}</p>
      <p className="text-[11px] text-neutral-400">{data.share}% of total</p>
    </div>
  );
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 16px ${fill}60)` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius - 2}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.5}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">
        {payload.category}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#888" fontSize={11}>
        {payload.share}%
      </text>
    </g>
  );
};

const CategoryPieChart = ({ salesData = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const enrichedData = calcCategoryShares(salesData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden ${
        fullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <h3 className="text-sm font-bold text-white">Category Performance</h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Revenue share by category</p>
        </div>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/[0.08] transition"
        >
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      <div className={`flex flex-col lg:flex-row items-center ${fullscreen ? 'h-[calc(100%-60px)]' : ''}`}>
        {/* Chart */}
        <div className={`flex-1 ${fullscreen ? 'h-full' : 'h-[300px]'} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={enrichedData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                dataKey="revenue"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {enrichedData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="px-5 pb-5 lg:pb-0 lg:pr-5 w-full lg:w-auto space-y-2 min-w-[180px]">
          {enrichedData.map((item, i) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                activeIndex === i
                  ? 'bg-white/[0.06] border border-white/[0.08]'
                  : 'hover:bg-white/[0.03] border border-transparent'
              }`}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  background: item.color,
                  boxShadow: activeIndex === i ? `0 0 10px ${item.color}60` : 'none',
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{item.category}</p>
                <p className="text-[10px] text-neutral-500">{formatCurrency(item.revenue)}</p>
              </div>
              <span className="text-[11px] font-bold text-neutral-400">{item.share}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryPieChart;
