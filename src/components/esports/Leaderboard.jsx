import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Crosshair, Target, Award } from 'lucide-react';

const players = [
  { rank: 1, name: 'PHANTOM_ACE', team: 'NEXUS Elite', kd: 2.84, winRate: 78.5, points: 14820, avatar: 'PA', country: '🇰🇷' },
  { rank: 2, name: 'ShadowReaper', team: 'Void Squad', kd: 2.61, winRate: 74.2, points: 13650, avatar: 'SR', country: '🇺🇸' },
  { rank: 3, name: 'CyberViper_X', team: 'Storm Rising', kd: 2.47, winRate: 71.8, points: 12480, avatar: 'CV', country: '🇩🇪' },
  { rank: 4, name: 'NeonStrike', team: 'Alpha Protocol', kd: 2.33, winRate: 69.3, points: 11200, avatar: 'NS', country: '🇧🇷' },
  { rank: 5, name: 'GhostFrame', team: 'Dark Matter', kd: 2.19, winRate: 67.1, points: 10840, avatar: 'GF', country: '🇯🇵' },
  { rank: 6, name: 'PixelHunter', team: 'Rogue Ops', kd: 2.08, winRate: 65.4, points: 10350, avatar: 'PH', country: '🇫🇷' },
  { rank: 7, name: 'BlitzKrieg', team: 'Iron Forge', kd: 1.97, winRate: 63.8, points: 9870, avatar: 'BK', country: '🇸🇪' },
  { rank: 8, name: 'ZeroLatency', team: 'Quantum Edge', kd: 1.88, winRate: 61.2, points: 9430, avatar: 'ZL', country: '🇮🇳' },
];

const rankStyles = {
  1: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]', gradient: 'from-amber-400/10' },
  2: { icon: Medal, color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20', glow: 'shadow-[0_0_20px_rgba(203,213,225,0.1)]', gradient: 'from-slate-300/10' },
  3: { icon: Award, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.1)]', gradient: 'from-orange-400/10' },
};

const AnimatedNumber = ({ value, decimals = 0, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
};

const Leaderboard = () => (
  <section className="relative py-20 px-4">
    {/* Ambient glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00FF88]/[0.03] rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-5xl mx-auto relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-amber-400 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Season Rankings</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Leaderboard</h2>
        <p className="text-white/30 text-sm mt-2">Top-performing players in the current competitive season.</p>
      </motion.div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden">
        {/* Header row */}
        <div className="hidden sm:grid grid-cols-[60px_1fr_120px_100px_100px_120px] gap-4 px-6 py-4 border-b border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-white/30">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-center">K/D</span>
          <span className="text-center">Win Rate</span>
          <span className="text-center">Points</span>
          <span className="text-right">Trend</span>
        </div>

        {/* Rows */}
        {players.map((p, i) => {
          const rs = rankStyles[p.rank];
          const isTop3 = p.rank <= 3;

          return (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className={`group grid grid-cols-1 sm:grid-cols-[60px_1fr_120px_100px_100px_120px] gap-3 sm:gap-4 items-center px-6 py-4 border-b border-white/[0.04] transition-all duration-300 hover:bg-white/[0.02] ${
                isTop3 ? `bg-gradient-to-r ${rs.gradient} to-transparent ${rs.glow}` : ''
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-2">
                {isTop3 ? (
                  <div className={`w-8 h-8 rounded-lg ${rs.bg} border ${rs.border} flex items-center justify-center`}>
                    <rs.icon size={14} className={rs.color} />
                  </div>
                ) : (
                  <span className="text-sm font-bold text-white/40 w-8 text-center">{p.rank}</span>
                )}
              </div>

              {/* Player */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                  isTop3 ? `${rs.bg} border ${rs.border} ${rs.color}` : 'bg-white/[0.05] border border-white/[0.08] text-white/50'
                }`}>
                  {p.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isTop3 ? 'text-white' : 'text-white/70'}`}>{p.name}</span>
                    <span className="text-xs">{p.country}</span>
                  </div>
                  <span className="text-[11px] text-white/25">{p.team}</span>
                </div>
              </div>

              {/* K/D */}
              <div className="text-center">
                <span className="text-sm font-bold text-[#00E0FF]">
                  <AnimatedNumber value={p.kd} decimals={2} />
                </span>
              </div>

              {/* Win Rate */}
              <div className="text-center">
                <span className="text-sm font-bold text-[#00FF88]">
                  <AnimatedNumber value={p.winRate} decimals={1} suffix="%" />
                </span>
              </div>

              {/* Points */}
              <div className="text-center">
                <span className="text-sm font-bold text-white/80">
                  <AnimatedNumber value={p.points} />
                </span>
              </div>

              {/* Trend */}
              <div className="flex justify-end">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
                  <TrendingUp size={12} />
                  <span className="text-[10px] font-bold">+{Math.floor(Math.random() * 200 + 50)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Leaderboard;
