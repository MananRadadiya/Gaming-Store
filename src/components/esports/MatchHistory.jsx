import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Clock, MapPin, Trophy, X } from 'lucide-react';

const MatchHistory = ({ matches = [] }) => {
  if (!matches.length) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md p-8 text-center">
        <Swords size={24} className="mx-auto mb-3 text-white/20" />
        <p className="text-sm text-white/30">No match history available.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Match History</h4>
      </div>

      {/* Header */}
      <div className="hidden sm:grid grid-cols-[1fr_100px_80px_90px_110px] gap-4 px-6 py-3 border-b border-white/[0.04] text-[10px] font-semibold uppercase tracking-wider text-white/25">
        <span>Opponent</span>
        <span className="text-center">Result</span>
        <span className="text-center">K/D</span>
        <span className="text-center">Duration</span>
        <span className="text-right">Map</span>
      </div>

      {/* Rows */}
      {matches.map((m, i) => {
        const isWin = m.result === 'win';
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={`grid grid-cols-1 sm:grid-cols-[1fr_100px_80px_90px_110px] gap-3 sm:gap-4 items-center px-6 py-3.5 border-b border-white/[0.03] transition-all duration-300 hover:bg-white/[0.02] ${
              isWin
                ? 'border-l-2 border-l-emerald-500/40'
                : 'border-l-2 border-l-red-500/30'
            }`}
            style={{
              boxShadow: isWin
                ? 'inset 4px 0 20px rgba(16,185,129,0.04)'
                : 'inset 4px 0 20px rgba(239,68,68,0.03)',
            }}
          >
            {/* Opponent */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <Swords size={12} className="text-white/40" />
              </div>
              <span className="text-sm font-semibold text-white/70">{m.opponent}</span>
            </div>

            {/* Result */}
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isWin
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}
              >
                {isWin ? <Trophy size={10} /> : <X size={10} />}
                {isWin ? 'Victory' : 'Defeat'}
              </span>
            </div>

            {/* K/D */}
            <div className="text-center">
              <span className={`text-sm font-bold ${isWin ? 'text-[#00E0FF]' : 'text-white/50'}`}>
                {m.kd.toFixed(1)}
              </span>
            </div>

            {/* Duration */}
            <div className="text-center flex items-center justify-center gap-1.5 text-white/40">
              <Clock size={11} />
              <span className="text-xs font-medium">{m.duration}</span>
            </div>

            {/* Map */}
            <div className="text-right flex items-center justify-end gap-1.5 text-white/35">
              <MapPin size={11} />
              <span className="text-xs font-medium">{m.map}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default MatchHistory;
