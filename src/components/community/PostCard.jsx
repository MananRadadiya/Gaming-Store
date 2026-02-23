import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  ChevronDown,
  ChevronUp,
  Hash,
} from 'lucide-react';
import { likePost, addComment } from '../../store/communitySlice';
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

const PostCard = ({ post, players, index = 0 }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const currentUserId = user?.id?.toString() ?? 'p1';

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [justLiked, setJustLiked] = useState(false);

  const author = players.find((p) => p.id === post.playerId);
  const isLiked = post.likedBy?.includes(currentUserId);

  const handleLike = () => {
    dispatch(likePost({ postId: post.id, playerId: currentUserId }));
    if (!isLiked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 600);
      if (post.playerId !== currentUserId) {
        dispatch(
          addNotification({
            id: `n_${Date.now()}`,
            type: 'like',
            message: `${user?.name ?? 'Someone'} liked your post`,
            avatar: user?.avatar ?? '',
            read: false,
            timestamp: new Date().toISOString(),
          })
        );
      }
    }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const comment = {
      id: `c_${Date.now()}`,
      playerId: currentUserId,
      content: commentText.trim(),
      timestamp: new Date().toISOString(),
    };
    dispatch(addComment({ postId: post.id, comment }));
    if (post.playerId !== currentUserId) {
      dispatch(
        addNotification({
          id: `n_${Date.now()}`,
          type: 'comment',
          message: `${user?.name ?? 'Someone'} commented on your post`,
          avatar: user?.avatar ?? '',
          read: false,
          timestamp: new Date().toISOString(),
        })
      );
    }
    setCommentText('');
  };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      className="group relative rounded-2xl border border-white/[0.06] hover:border-cyan-500/20 transition-all duration-500 overflow-hidden"
      style={{ background: 'rgba(15,15,20,0.8)', backdropFilter: 'blur(20px)' }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,224,255,0.03)' }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <img
            src={author?.avatar}
            alt={author?.username}
            className="w-11 h-11 rounded-full border-2 border-white/10 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">{author?.username ?? 'Unknown'}</span>
              {author?.rank && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    color: RANK_COLORS[author.rank] ?? '#fff',
                    borderColor: `${RANK_COLORS[author.rank] ?? '#fff'}40`,
                    backgroundColor: `${RANK_COLORS[author.rank] ?? '#fff'}10`,
                  }}
                >
                  {author.rank}
                </span>
              )}
            </div>
            <span className="text-neutral-600 text-xs">{timeAgo(post.timestamp)}</span>
          </div>
          {post.gameTag && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-neutral-500 text-[11px] font-medium flex-shrink-0">
              <Hash size={10} />
              {post.gameTag}
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-neutral-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Optional image */}
        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden border border-white/[0.06]">
            <img src={post.image} alt="" className="w-full h-auto object-cover max-h-96" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-3 border-t border-white/[0.04]">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isLiked
                ? 'text-rose-400 bg-rose-500/10'
                : 'text-neutral-500 hover:text-rose-400 hover:bg-white/[0.04]'
            }`}
          >
            <motion.div
              animate={justLiked ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.div>
            <span>{post.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:text-cyan-400 hover:bg-white/[0.04] transition-all duration-200"
          >
            <MessageCircle size={16} />
            <span>{post.comments?.length ?? 0}</span>
            {post.comments?.length > 0 && (
              showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />
            )}
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-500 hover:text-[#00FF88] hover:bg-white/[0.04] transition-all duration-200 ml-auto">
            <Share2 size={16} />
          </button>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/[0.04] space-y-3">
                {post.comments?.map((c, i) => {
                  const commentAuthor = players.find((p) => p.id === c.playerId);
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5"
                    >
                      <img
                        src={commentAuthor?.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-white/[0.03] rounded-xl px-3 py-2">
                          <span className="text-xs font-semibold text-white">
                            {commentAuthor?.username ?? 'Unknown'}
                          </span>
                          <p className="text-neutral-400 text-xs mt-0.5">{c.content}</p>
                        </div>
                        <span className="text-neutral-700 text-[10px] ml-3">{timeAgo(c.timestamp)}</span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add comment */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Write a comment..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/20 transition-colors"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className={`p-2 rounded-lg transition-all ${
                      commentText.trim()
                        ? 'text-cyan-400 hover:bg-cyan-500/10'
                        : 'text-neutral-700 cursor-not-allowed'
                    }`}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PostCard;
