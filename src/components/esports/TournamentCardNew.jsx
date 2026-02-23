import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Crosshair, Swords, Gamepad2, ArrowRight } from 'lucide-react';
import { getCountdown } from '../../utils/tournamentCountdown';

/* ── Game theming ── */
const gameConfig = {
  Valorant: {
    icon: Crosshair,
    border: 'border-red-500/20',
    glow: '0 0 30px rgba(239,68,68,0.12)',
    badge: 'bg-red-500/10 text-red-400',
    dot: 'bg-red-500',
    accent: '#EF4444',
  },
  'Counter-Strike 2': {
    icon: Crosshair,
    border: 'border-orange-500/20',
    glow: '0 0 30px rgba(249,115,22,0.12)',
    badge: 'bg-orange-500/10 text-orange-400',
    dot: 'bg-orange-500',
    accent: '#F97316',
  },
  'League of Legends': {
    icon: Swords,
    border: 'border-[#BD00FF]/20',
    glow: '0 0 30px rgba(189,0,255,0.12)',
    badge: 'bg-[#BD00FF]/10 text-[#BD00FF]',
    dot: 'bg-[#BD00FF]',
    accent: '#BD00FF',
  },
};
const defaultConfig = {
  icon: Gamepad2,
  border: 'border-[#00FF88]/20',
  glow: '0 0 30px rgba(0,255,136,0.12)',
  badge: 'bg-[#00FF88]/10 text-[#00FF88]',
  dot: 'bg-[#00FF88]',
  accent: '#00FF88',
};

/* ── Status labels ── */
const statusLabels = {
  live: { text: 'LIVE NOW', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  upcoming: { text: 'UPCOMING', cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' },
  registration: { text: 'REGISTER', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
};

const TournamentCard = ({ tournament, index = 0 }) => {
  const cfg = gameConfig[tournament.game] || defaultConfig;
  const Icon = cfg.icon;
  const status = statusLabels[tournament.status] || statusLabels.upcoming;
  const slotsLeft = tournament.totalSlots - tournament.filledSlots;
  const fillPercent = (tournament.filledSlots / tournament.totalSlots) * 100;

  /* real-time countdown */
  const [cd, setCd] = useState(() => getCountdown(tournament.startDate));
  useEffect(() => {
    const id = setInterval(() => setCd(getCountdown(tournament.startDate)), 1000);
    return () => clearInterval(id);
  }, [tournament.startDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className={`group relative rounded-2xl border ${cfg.border} bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden transition-shadow duration-500`}
      style={{ '--card-glow': cfg.glow }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = cfg.glow)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Shine sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={tournament.image}
          alt={tournament.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/60 to-transparent" />

        {/* Status */}
        <div className="absolute top-4 left-4">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.cls}`}>
            {tournament.status === 'live' && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-red-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-red-400" />
              </span>
            )}
            {tournament.status !== 'live' && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />}
            {status.text}
          </div>
        </div>

        {/* Game icon */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <Icon size={14} className="text-white/70" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Game + title */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">{tournament.game} • {tournament.region}</p>
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{tournament.title}</h3>
        </div>

        {/* Prize + slots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-[#00FF88]" />
            <span className="text-sm font-bold text-[#00FF88]">₹{(tournament.prizePool / 100000).toFixed(1)}L</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-white/40" />
            <span className="text-xs text-white/40">{slotsLeft} slots left</span>
          </div>
        </div>

        {/* Slot progress bar */}
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#00E0FF]"
            initial={{ width: 0 }}
            whileInView={{ width: `${fillPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { v: cd.days, l: 'Days' },
            { v: cd.hours, l: 'Hrs' },
            { v: cd.mins, l: 'Min' },
            { v: cd.secs, l: 'Sec' },
          ].map((u) => (
            <div key={u.l} className="text-center py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <div className="text-sm font-bold text-white tabular-nums">{String(u.v).padStart(2, '0')}</div>
              <div className="text-[9px] text-white/30 uppercase tracking-wider">{u.l}</div>
            </div>
          ))}
        </div>

        {/* Register CTA */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${cfg.accent}30` }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#00FF88]/10 to-[#00E0FF]/10 border border-[#00FF88]/20 text-[#00FF88] hover:from-[#00FF88]/20 hover:to-[#00E0FF]/20 transition-all duration-300"
        >
          {tournament.status === 'live' ? 'Watch Live' : 'Register Now'}
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TournamentCard;
