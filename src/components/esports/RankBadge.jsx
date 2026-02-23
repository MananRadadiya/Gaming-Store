import React from 'react';
import { motion } from 'framer-motion';
import { getRankTier, getRankProgress, getNextTier } from '../../utils/rankingLogic';

const RankBadge = ({ points, size = 'md', showProgress = false }) => {
  const tier = getRankTier(points);
  const progress = getRankProgress(points);
  const next = getNextTier(points);

  const sizes = {
    sm: { badge: 'w-8 h-8 text-[10px]', label: 'text-[9px]' },
    md: { badge: 'w-12 h-12 text-xs', label: 'text-[10px]' },
    lg: { badge: 'w-16 h-16 text-sm', label: 'text-xs' },
    xl: { badge: 'w-24 h-24 text-lg', label: 'text-sm' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Badge */}
      <motion.div
        className={`relative ${s.badge} rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center font-black text-white shadow-lg`}
        style={{ boxShadow: `0 0 20px ${tier.glow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}
        animate={
          tier.pulse
            ? { boxShadow: [`0 0 20px ${tier.glow}`, `0 0 40px ${tier.glow}`, `0 0 20px ${tier.glow}`] }
            : {}
        }
        transition={tier.pulse ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {/* Inner icon / letter */}
        <span className="drop-shadow-md">{tier.name.charAt(0)}</span>

        {/* Animated ring for top tiers */}
        {tier.pulse && (
          <motion.div
            className="absolute inset-[-3px] rounded-xl border-2"
            style={{ borderColor: tier.color }}
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      {/* Label */}
      <span
        className={`${s.label} font-bold uppercase tracking-widest`}
        style={{ color: tier.color }}
      >
        {tier.name}
      </span>

      {/* Progress bar toward next tier */}
      {showProgress && next && (
        <div className="w-full max-w-[120px] mt-1">
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${tier.color}, ${next.color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[9px] text-white/30 text-center mt-1">
            {Math.round(progress * 100)}% → {next.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default RankBadge;
