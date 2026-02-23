import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Gamepad2 } from 'lucide-react';
import { followPlayer, setCurrentPlayer } from '../../store/communitySlice';
import { addNotification } from '../../store/notificationSlice';

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

const PlayerCard = ({ player, index = 0, compact = false }) => {
  const dispatch = useDispatch();
  const following = useSelector((s) => s.community.following);
  const { user } = useSelector((s) => s.auth);
  const isFollowing = following.includes(player.id);

  const handleFollow = (e) => {
    e.stopPropagation();
    dispatch(followPlayer(player.id));
    if (!isFollowing) {
      dispatch(
        addNotification({
          id: `n_${Date.now()}`,
          type: 'follower',
          message: `${user?.name ?? 'Someone'} started following ${player.username}`,
          avatar: user?.avatar ?? '',
          read: false,
          timestamp: new Date().toISOString(),
        })
      );
    }
  };

  const handleClick = () => {
    dispatch(setCurrentPlayer(player));
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={handleClick}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group"
      >
        <img
          src={player.avatar}
          alt={player.username}
          className="w-9 h-9 rounded-full border border-white/10 group-hover:border-cyan-500/30 transition-colors"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white truncate">{player.username}</span>
            <span
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: RANK_COLORS[player.rank] }}
            >
              {player.rank}
            </span>
          </div>
          <div className="flex items-center gap-1 text-neutral-600 text-[10px]">
            <Gamepad2 size={10} />
            {player.mainGame}
          </div>
        </div>
        <button
          onClick={handleFollow}
          className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
            isFollowing
              ? 'text-cyan-400 bg-cyan-500/10'
              : 'text-neutral-600 hover:text-cyan-400 hover:bg-white/[0.04]'
          }`}
        >
          {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={handleClick}
      className="group relative rounded-2xl border border-white/[0.06] hover:border-cyan-500/20 p-5 cursor-pointer transition-all duration-500 overflow-hidden"
      style={{ background: 'rgba(15,15,20,0.8)', backdropFilter: 'blur(20px)' }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,224,255,0.03)' }} />

      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={player.avatar}
            alt={player.username}
            className="w-14 h-14 rounded-full border-2 border-white/10 group-hover:border-cyan-500/30 transition-colors"
          />
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0B0F14] flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: RANK_COLORS[player.rank], color: '#000' }}
          >
            {player.level}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{player.username}</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border"
              style={{
                color: RANK_COLORS[player.rank],
                borderColor: `${RANK_COLORS[player.rank]}40`,
                backgroundColor: `${RANK_COLORS[player.rank]}10`,
              }}
            >
              {player.rank}
            </span>
          </div>
          <p className="text-neutral-500 text-xs mt-1 truncate">{player.bio}</p>
          <div className="flex items-center gap-4 mt-2 text-[11px] text-neutral-600">
            <span><strong className="text-neutral-400">{player.followers?.toLocaleString()}</strong> followers</span>
            <span><strong className="text-neutral-400">{player.stats?.wins}</strong> wins</span>
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex-shrink-0 ${
            isFollowing
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,224,255,0.15)]'
          }`}
        >
          {isFollowing ? <UserCheck size={13} /> : <UserPlus size={13} />}
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
