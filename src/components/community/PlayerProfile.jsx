import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserPlus,
  UserCheck,
  Trophy,
  Crosshair,
  Swords,
  TrendingUp,
  Gamepad2,
} from 'lucide-react';
import { followPlayer, clearCurrentPlayer } from '../../store/communitySlice';
import { addNotification } from '../../store/notificationSlice';
import AchievementBadge from './AchievementBadge';
import { getUnlockedAchievements, getProgressToNextRank, getNextRank, getRankForXp } from '../../utils/achievementLogic';

const RANK_COLORS = {
  Iron: '#8B8B8B',
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#00E0FF',
  Diamond: '#B9F2FF',
  Ascendant: '#00FF88',
  Immortal: '#BD00FF',
  Radiant: '#FFD700',
};

const StatCounter = ({ icon: Icon, label, value, color = 'text-cyan-400' }) => (
  <div className="text-center">
    <div className={`flex items-center justify-center gap-1.5 ${color} mb-1`}>
      <Icon size={14} />
      <motion.span
        className="text-lg font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </motion.span>
    </div>
    <span className="text-neutral-600 text-[10px] uppercase tracking-wider font-medium">{label}</span>
  </div>
);

const PlayerProfile = () => {
  const dispatch = useDispatch();
  const { currentPlayer, following, posts, players } = useSelector((s) => s.community);
  const { user } = useSelector((s) => s.auth);
  const isFollowing = currentPlayer ? following.includes(currentPlayer.id) : false;

  const handleFollow = () => {
    if (!currentPlayer) return;
    dispatch(followPlayer(currentPlayer.id));
    if (!isFollowing) {
      dispatch(
        addNotification({
          id: `n_${Date.now()}`,
          type: 'follower',
          message: `You are now following ${currentPlayer.username}`,
          avatar: currentPlayer.avatar,
          read: false,
          timestamp: new Date().toISOString(),
        })
      );
    }
  };

  const handleClose = () => dispatch(clearCurrentPlayer());

  if (!currentPlayer) return null;

  const achievements = getUnlockedAchievements(currentPlayer.achievements);
  const progress = getProgressToNextRank(currentPlayer.xp);
  const nextRank = getNextRank(currentPlayer.xp);
  const currentRankInfo = getRankForXp(currentPlayer.xp);
  const playerPosts = posts.filter((p) => p.playerId === currentPlayer.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08]"
          style={{ background: 'rgba(11,15,20,0.98)', backdropFilter: 'blur(30px)' }}
        >
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.06] hover:bg-white/10 text-neutral-400 hover:text-white transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Header gradient */}
          <div
            className="h-32 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${RANK_COLORS[currentPlayer.rank]}20, transparent 70%)`,
            }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
          </div>

          <div className="px-8 pb-8 -mt-12">
            {/* Avatar + Name */}
            <div className="flex items-end gap-5 mb-6">
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                src={currentPlayer.avatar}
                alt={currentPlayer.username}
                className="w-24 h-24 rounded-2xl border-4 border-[#0B0F14] shadow-2xl"
              />
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-white">{currentPlayer.username}</h2>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                    style={{
                      color: RANK_COLORS[currentPlayer.rank],
                      borderColor: `${RANK_COLORS[currentPlayer.rank]}40`,
                      backgroundColor: `${RANK_COLORS[currentPlayer.rank]}15`,
                    }}
                  >
                    {currentPlayer.rank}
                  </span>
                  <span className="text-neutral-600 text-xs">Lv. {currentPlayer.level}</span>
                </div>
                <p className="text-neutral-500 text-sm mt-1">{currentPlayer.bio}</p>
              </div>
            </div>

            {/* Follow + Stats */}
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={handleFollow}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isFollowing
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-transparent hover:border-red-500/30 hover:text-red-400'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(0,224,255,0.3)] hover:shadow-[0_0_30px_rgba(0,224,255,0.5)]'
                }`}
              >
                {isFollowing ? <UserCheck size={15} /> : <UserPlus size={15} />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-neutral-400">
                  <strong className="text-white">{currentPlayer.followers?.toLocaleString()}</strong> followers
                </span>
                <span className="text-neutral-400">
                  <strong className="text-white">{currentPlayer.following?.toLocaleString()}</strong> following
                </span>
              </div>
            </div>

            {/* XP Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-400">XP Progress</span>
                <span className="text-xs text-neutral-600">
                  {currentPlayer.xp?.toLocaleString()} XP
                  {nextRank && ` → ${nextRank.rank}`}
                </span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${currentRankInfo.color}, ${nextRank?.color ?? currentRankInfo.color})`,
                    boxShadow: `0 0 12px ${currentRankInfo.color}50`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] font-bold" style={{ color: currentRankInfo.color }}>{currentRankInfo.rank}</span>
                {nextRank && <span className="text-[10px] font-bold" style={{ color: nextRank.color }}>{nextRank.rank}</span>}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-4 gap-4 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-6"
            >
              <StatCounter icon={Trophy} label="Wins" value={currentPlayer.stats?.wins} color="text-[#00FF88]" />
              <StatCounter icon={Swords} label="Losses" value={currentPlayer.stats?.losses} color="text-red-400" />
              <StatCounter icon={Crosshair} label="Headshots" value={currentPlayer.stats?.headshots} color="text-cyan-400" />
              <StatCounter icon={TrendingUp} label="K/D" value={currentPlayer.stats?.kd} color="text-purple-400" />
            </motion.div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Trophy size={14} className="text-amber-400" />
                  Achievements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((ach, i) => (
                    <AchievementBadge key={ach.id} achievement={ach} index={i} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Posts */}
            {playerPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Gamepad2 size={14} className="text-cyan-400" />
                  Recent Posts
                </h3>
                <div className="space-y-2">
                  {playerPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3"
                    >
                      <p className="text-neutral-300 text-xs line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-neutral-600 text-[10px]">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments?.length ?? 0}</span>
                        {post.gameTag && <span className="text-cyan-600">#{post.gameTag}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlayerProfile;
