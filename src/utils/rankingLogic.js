/**
 * Rank tiers based on accumulated points.
 * Each tier has a name, min-points threshold, and neon color scheme.
 */
const RANK_TIERS = [
  { name: 'Immortal',  min: 14000, color: '#FF4655', glow: 'rgba(255,70,85,0.5)',  gradient: 'from-red-500 to-pink-500',   pulse: true  },
  { name: 'Diamond',   min: 12000, color: '#00E0FF', glow: 'rgba(0,224,255,0.5)',   gradient: 'from-cyan-400 to-blue-500',  pulse: true  },
  { name: 'Platinum',  min: 10000, color: '#00FF88', glow: 'rgba(0,255,136,0.45)',   gradient: 'from-emerald-400 to-teal-500', pulse: false },
  { name: 'Gold',      min: 8000,  color: '#FFD700', glow: 'rgba(255,215,0,0.45)',   gradient: 'from-amber-400 to-yellow-500', pulse: false },
  { name: 'Silver',    min: 5000,  color: '#C0C0C0', glow: 'rgba(192,192,192,0.35)', gradient: 'from-slate-300 to-slate-400',  pulse: false },
  { name: 'Bronze',    min: 0,     color: '#CD7F32', glow: 'rgba(205,127,50,0.3)',   gradient: 'from-orange-400 to-amber-600', pulse: false },
];

/**
 * Return the rank tier object for a given point total.
 */
export const getRankTier = (points) => {
  for (const tier of RANK_TIERS) {
    if (points >= tier.min) return tier;
  }
  return RANK_TIERS[RANK_TIERS.length - 1];
};

/**
 * Return the next tier above the current rank (or null if already top).
 */
export const getNextTier = (points) => {
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (points >= RANK_TIERS[i].min) {
      return i === 0 ? null : RANK_TIERS[i - 1];
    }
  }
  return RANK_TIERS[RANK_TIERS.length - 2];
};

/**
 * Progress fraction (0–1) toward the next tier.
 */
export const getRankProgress = (points) => {
  const current = getRankTier(points);
  const next = getNextTier(points);
  if (!next) return 1; // already top tier
  const range = next.min - current.min;
  return Math.min((points - current.min) / range, 1);
};

export { RANK_TIERS };
