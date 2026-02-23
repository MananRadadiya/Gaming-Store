import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Radio, Filter } from 'lucide-react';
import TournamentCard from './TournamentCardNew';

/* ── Skeleton loader ── */
const CardSkeleton = () => (
  <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse overflow-hidden">
    <div className="h-44 bg-white/[0.03]" />
    <div className="p-5 space-y-4">
      <div className="h-3 w-20 bg-white/[0.05] rounded" />
      <div className="h-5 w-3/4 bg-white/[0.05] rounded" />
      <div className="h-4 w-1/2 bg-white/[0.05] rounded" />
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-white/[0.03] rounded-lg" />
        ))}
      </div>
      <div className="h-10 bg-white/[0.04] rounded-xl" />
    </div>
  </div>
);

const LiveTournaments = () => {
  const { tournaments, loading } = useSelector((s) => s.esports);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} id="tournaments" className="relative py-24 px-4">
      {/* Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00E0FF]/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#00FF88] to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF88] flex items-center gap-2">
                <Radio size={12} className="animate-pulse" />
                Live & Upcoming
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Tournaments</h2>
            <p className="text-white/30 text-sm mt-2 max-w-lg">
              Compete for massive prize pools across the world's biggest titles.
            </p>
          </div>

          {/* Filter tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Valorant', 'CS2', 'LoL'].map((tag) => (
              <button
                key={tag}
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/[0.08] text-white/40 hover:text-white hover:border-[#00FF88]/30 hover:bg-[#00FF88]/[0.05] transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t, i) => (
              <TournamentCard key={t.id} tournament={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveTournaments;
