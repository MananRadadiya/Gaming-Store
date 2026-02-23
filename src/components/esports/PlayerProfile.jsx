import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { X, Gamepad2, Target, Crosshair, Trophy, TrendingUp } from 'lucide-react';
import { clearSelectedPlayer } from '../../store/esportsSlice';
import RankBadge from './RankBadge';
import StatsChart from './StatsChart';
import MatchHistory from './MatchHistory';

/* ── Backdrop ── */
const Backdrop = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
  />
);

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, color = 'text-white' }) => (
  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
    <Icon size={16} className={`mx-auto mb-2 ${color}`} />
    <div className={`text-lg font-black ${color}`}>{value}</div>
    <div className="text-[9px] text-white/30 uppercase tracking-wider mt-1">{label}</div>
  </div>
);

const PlayerProfile = () => {
  const dispatch = useDispatch();
  const player = useSelector((s) => s.esports.selectedPlayer);

  return (
    <AnimatePresence>
      {player && (
        <>
          <Backdrop onClick={() => dispatch(clearSelectedPlayer())} />

          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0B0F14] border-l border-white/[0.06] z-[101] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => dispatch(clearSelectedPlayer())}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all z-10"
            >
              <X size={18} />
            </button>

            {/* Header area */}
            <div className="relative px-8 pt-10 pb-8">
              {/* Background glow */}
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#00FF88]/[0.04] to-transparent pointer-events-none" />
              <div className="absolute top-10 right-20 w-40 h-40 bg-[#BD00FF]/[0.06] rounded-full blur-[80px] pointer-events-none" />

              <div className="relative flex items-start gap-6">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FF88] to-[#00E0FF] flex items-center justify-center text-2xl font-black text-[#050505] shadow-lg shadow-[#00FF88]/20 flex-shrink-0"
                >
                  {player.avatar}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-black text-white truncate">{player.name}</h2>
                      <span className="text-lg">{player.country}</span>
                    </div>
                    <p className="text-sm text-white/30">{player.team}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Gamepad2 size={12} className="text-[#BD00FF]" />
                      <span className="text-xs text-[#BD00FF] font-medium">{player.favoriteGame}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Rank badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <RankBadge points={player.points} size="lg" showProgress />
                </motion.div>
              </div>
            </div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="px-8 mb-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Crosshair} label="K/D Ratio" value={player.kd.toFixed(2)} color="text-[#00E0FF]" />
                <StatCard icon={Trophy} label="Win Rate" value={`${player.winRate}%`} color="text-[#00FF88]" />
                <StatCard icon={Target} label="Total Matches" value={player.totalMatches} color="text-[#BD00FF]" />
                <StatCard icon={TrendingUp} label="Points" value={player.points.toLocaleString('en-IN')} color="text-amber-400" />
              </div>
            </motion.div>

            {/* Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="px-8 mb-6"
            >
              <StatsChart kdHistory={player.kdHistory} winRateHistory={player.winRateHistory} />
            </motion.div>

            {/* Match history */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="px-8 pb-10"
            >
              <MatchHistory matches={player.matches} />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlayerProfile;
