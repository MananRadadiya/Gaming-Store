import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Trophy, Crown, Medal, Award, TrendingUp, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { selectPlayer } from '../../store/esportsSlice';
import RankBadge from './RankBadge';

/* ── Animated number ── */
const AnimatedNumber = ({ value, decimals = 0, suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const dur = 1200;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-IN')}{suffix}
    </span>
  );
};

/* ── Rank decorations for top 3 ── */
const rankDecor = {
  1: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'shadow-[0_0_25px_rgba(251,191,36,0.15)]', grad: 'from-amber-400/10' },
  2: { icon: Medal, color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20', glow: 'shadow-[0_0_20px_rgba(203,213,225,0.1)]', grad: 'from-slate-300/10' },
  3: { icon: Award, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', glow: 'shadow-[0_0_20px_rgba(251,146,60,0.1)]', grad: 'from-orange-400/10' },
};

const GlobalLeaderboard = () => {
  const dispatch = useDispatch();
  const { leaderboard } = useSelector((s) => s.esports);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('points');
  const [sortDir, setSortDir] = useState('desc');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sorted = [...leaderboard]
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />;
  };

  return (
    <section ref={sectionRef} id="leaderboard" className="relative py-24 px-4">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-amber-400 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Season Rankings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Global Leaderboard</h2>
            <p className="text-white/30 text-sm mt-2">Top-performing players across all competitive titles.</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search player or team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00FF88]/30 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </motion.div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden">
          {/* Header row (sticky) */}
          <div className="hidden sm:grid grid-cols-[60px_1fr_80px_100px_100px_100px_80px] gap-4 px-6 py-4 border-b border-white/[0.06] bg-[#0a0c10]/95 backdrop-blur-md sticky top-0 z-10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Rank</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Player</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 text-center">Tier</span>
            <button onClick={() => toggleSort('kd')} className="text-[10px] font-semibold uppercase tracking-wider text-white/30 text-center flex items-center justify-center gap-1 hover:text-white/50 transition-colors">
              K/D <SortIcon col="kd" />
            </button>
            <button onClick={() => toggleSort('winRate')} className="text-[10px] font-semibold uppercase tracking-wider text-white/30 text-center flex items-center justify-center gap-1 hover:text-white/50 transition-colors">
              Win Rate <SortIcon col="winRate" />
            </button>
            <button onClick={() => toggleSort('points')} className="text-[10px] font-semibold uppercase tracking-wider text-white/30 text-center flex items-center justify-center gap-1 hover:text-white/50 transition-colors">
              Points <SortIcon col="points" />
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 text-right">Trend</span>
          </div>

          {/* Rows */}
          {sorted.length === 0 && (
            <div className="px-6 py-12 text-center text-white/30 text-sm">No players found.</div>
          )}

          {sorted.map((p, i) => {
            const originalRank = leaderboard.findIndex((lp) => lp.id === p.id) + 1;
            const isTop3 = originalRank <= 3;
            const rs = rankDecor[originalRank];

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                onClick={() => dispatch(selectPlayer(p.id))}
                className={`group grid grid-cols-1 sm:grid-cols-[60px_1fr_80px_100px_100px_100px_80px] gap-3 sm:gap-4 items-center px-6 py-4 border-b border-white/[0.04] cursor-pointer transition-all duration-300 hover:bg-white/[0.03] ${
                  isTop3 ? `bg-gradient-to-r ${rs.grad} to-transparent ${rs.glow}` : ''
                }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-2">
                  {isTop3 ? (
                    <div className={`w-8 h-8 rounded-lg ${rs.bg} border ${rs.border} flex items-center justify-center`}>
                      <rs.icon size={14} className={rs.color} />
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-white/40 w-8 text-center">{originalRank}</span>
                  )}
                </div>

                {/* Player info */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                    isTop3 ? `${rs.bg} border ${rs.border} ${rs.color}` : 'bg-white/[0.05] border border-white/[0.08] text-white/50'
                  }`}>
                    {p.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isTop3 ? 'text-white' : 'text-white/70'} group-hover:text-white transition-colors`}>
                        {p.name}
                      </span>
                      <span className="text-xs">{p.country}</span>
                    </div>
                    <span className="text-[11px] text-white/25">{p.team}</span>
                  </div>
                </div>

                {/* Rank badge */}
                <div className="flex justify-center">
                  <RankBadge points={p.points} size="sm" />
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
                    <span className="text-[10px] font-bold">+{Math.floor(p.points * 0.015)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalLeaderboard;
