import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Timer, Gamepad2, Crosshair, Swords, ArrowRight } from 'lucide-react';

/* ── helpers ── */
const gameIcons = { Valorant: Crosshair, 'Counter-Strike 2': Crosshair, 'Apex Legends': Gamepad2, 'League of Legends': Swords };
const gameAccents = {
  Valorant: { border: 'border-red-500/20', glow: 'shadow-red-500/10', badge: 'bg-red-500/10 text-red-400', dot: 'bg-red-500' },
  'Counter-Strike 2': { border: 'border-orange-500/20', glow: 'shadow-orange-500/10', badge: 'bg-orange-500/10 text-orange-400', dot: 'bg-orange-500' },
  'Apex Legends': { border: 'border-[#00E0FF]/20', glow: 'shadow-[#00E0FF]/10', badge: 'bg-[#00E0FF]/10 text-[#00E0FF]', dot: 'bg-[#00E0FF]' },
  'League of Legends': { border: 'border-[#BD00FF]/20', glow: 'shadow-[#BD00FF]/10', badge: 'bg-[#BD00FF]/10 text-[#BD00FF]', dot: 'bg-[#BD00FF]' },
};
const defaultAccent = { border: 'border-[#00FF88]/20', glow: 'shadow-[#00FF88]/10', badge: 'bg-[#00FF88]/10 text-[#00FF88]', dot: 'bg-[#00FF88]' };

const fallbackTournaments = [
  { id: 1, title: 'NEXUS Championship Series 2026', game: 'Valorant', prizePool: '₹42,00,000', date: 'March 15-20, 2026', status: 'Upcoming', teams: 16, totalSlots: 16, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600' },
  { id: 2, title: 'Global Apex Legends Tournament', game: 'Apex Legends', prizePool: '₹1,68,00,000', date: 'April 1-7, 2026', status: 'Registration Open', teams: 32, totalSlots: 40, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600' },
  { id: 3, title: 'Counter-Strike 2 Major Finals', game: 'Counter-Strike 2', prizePool: '₹1,05,00,000', date: 'May 10-18, 2026', status: 'Announced', teams: 18, totalSlots: 24, image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600' },
  { id: 4, title: 'League of Legends Invitational', game: 'League of Legends', prizePool: '₹84,00,000', date: 'June 5-12, 2026', status: 'Upcoming', teams: 8, totalSlots: 12, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' },
  { id: 5, title: 'Valorant Rising Stars Cup', game: 'Valorant', prizePool: '₹21,00,000', date: 'March 28-30, 2026', status: 'Registration Open', teams: 50, totalSlots: 64, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600' },
  { id: 6, title: 'CS2 Asian Open Qualifier', game: 'Counter-Strike 2', prizePool: '₹8,40,000', date: 'April 15-17, 2026', status: 'Announced', teams: 100, totalSlots: 128, image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600' },
];

/* ── countdown hook ── */
const useCountdown = (targetDateStr) => {
  const target = useMemo(() => {
    const parts = targetDateStr?.match(/(\w+)\s+(\d+)/);
    if (!parts) return Date.now() + 86400000 * 14;
    const months = { January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11 };
    return new Date(2026, months[parts[1]] ?? 2, parseInt(parts[2])).getTime();
  }, [targetDateStr]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
};

/* ── single card ── */
const TournamentCard = ({ t, index }) => {
  const accent = gameAccents[t.game] || defaultAccent;
  const Icon = gameIcons[t.game] || Gamepad2;
  const cd = useCountdown(t.date);
  const slotsLeft = (t.totalSlots || t.teams + 8) - t.teams;
  const slotsPercent = ((t.teams) / (t.totalSlots || t.teams + 8)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-2xl border ${accent.border} bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden transition-shadow duration-500 hover:shadow-xl hover:${accent.glow}`}
    >
      {/* Shine sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={t.image}
          alt={t.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/60 to-transparent" />

        {/* Status badge */}
        <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} animate-pulse`} />
          {t.status}
        </div>

        {/* Game icon */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <Icon size={14} className="text-white/70" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1">{t.game}</p>
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{t.title}</h3>
        </div>

        {/* Prize + slots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-[#00FF88]" />
            <span className="text-sm font-bold text-[#00FF88]">{t.prizePool}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-white/40" />
            <span className="text-xs text-white/40">{slotsLeft} slots left</span>
          </div>
        </div>

        {/* Slot progress */}
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#00E0FF]"
            initial={{ width: 0 }}
            whileInView={{ width: `${slotsPercent}%` }}
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

        {/* Register */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,136,0.15)' }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#00FF88]/10 to-[#00E0FF]/10 border border-[#00FF88]/20 text-[#00FF88] hover:from-[#00FF88]/20 hover:to-[#00E0FF]/20 transition-all"
        >
          Register Now
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ── grid section ── */
const TournamentGrid = ({ tournaments = [], loading }) => {
  const data = tournaments.length > 0 ? tournaments : fallbackTournaments;

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#00FF88] to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF88]">Live & Upcoming</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Tournaments</h2>
          <p className="text-white/30 text-sm mt-2 max-w-lg">
            Register for upcoming competitions and prove your skills on the NEXUS stage.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse h-[480px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((t, i) => (
              <TournamentCard key={t.id} t={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TournamentGrid;
