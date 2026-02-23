import React from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/analyticsCalculations';
import { calcFunnelRates } from '../../utils/analyticsCalculations';

const ConversionFunnel = ({ conversionData }) => {
  const stages = calcFunnelRates(conversionData);

  if (!stages.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <h3 className="text-sm font-bold text-white">Conversion Funnel</h3>
        <p className="text-[11px] text-neutral-500 mt-0.5">Visitor journey through purchase stages</p>
      </div>

      {/* Funnel */}
      <div className="px-5 pb-6 space-y-2">
        {stages.map((stage, i) => {
          const widthPercent = 100 - (i * 15);
          const isLast = i === stages.length - 1;

          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.15 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
              style={{ originX: 0.5 }}
            >
              <div
                className="relative mx-auto rounded-xl overflow-hidden group cursor-default"
                style={{ width: `${widthPercent}%` }}
              >
                {/* Background bar */}
                <div
                  className="relative h-14 rounded-xl flex items-center justify-between px-4 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${stage.color}15, ${stage.color}08)`,
                    border: `1px solid ${stage.color}25`,
                    boxShadow: `0 0 0 0 ${stage.color}00`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 25px -5px ${stage.color}40, inset 0 0 20px ${stage.color}08`;
                    e.currentTarget.style.borderColor = `${stage.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 0 ${stage.color}00`;
                    e.currentTarget.style.borderColor = `${stage.color}25`;
                  }}
                >
                  {/* Active stage glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(ellipse at center, ${stage.color}10, transparent 70%)`,
                    }}
                  />

                  <div className="relative flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: stage.color,
                        boxShadow: `0 0 8px ${stage.color}80`,
                      }}
                    />
                    <span className="text-xs font-semibold text-white">{stage.stage}</span>
                  </div>

                  <div className="relative flex items-center gap-3">
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatNumber(stage.value)}
                    </span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                      style={{
                        color: stage.color,
                        background: `${stage.color}15`,
                      }}
                    >
                      {stage.rate}%
                    </span>
                  </div>
                </div>

                {/* Connector arrow */}
                {!isLast && (
                  <div className="flex justify-center -mb-1">
                    <div
                      className="w-0.5 h-2 opacity-30"
                      style={{ background: stage.color }}
                    />
                  </div>
                )}
              </div>

              {/* Drop-off indicator */}
              {i > 0 && (
                <div className="absolute -top-1 right-0 text-[10px] text-neutral-600 font-medium">
                  -{(parseFloat(stages[i - 1].rate) - parseFloat(stage.rate)).toFixed(1)}%
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="px-5 pb-5 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Overall Conversion</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#00FF88]">
              {stages.length > 0 ? stages[stages.length - 1].rate : 0}%
            </span>
            <span className="text-[10px] text-neutral-600">
              ({formatNumber(stages[stages.length - 1]?.value || 0)} / {formatNumber(stages[0]?.value || 0)})
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversionFunnel;
