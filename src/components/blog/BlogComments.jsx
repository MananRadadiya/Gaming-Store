import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Trash2, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { addComment, addReply, deleteComment, likeComment, selectComments } from '../../store/blogSlice';
import CommentForm from './CommentForm';

const CURRENT_USER = 'NexusUser';
const CURRENT_USER_ID = 'current-user';

const CommentItem = ({ comment, postId, isReply = false }) => {
  const dispatch = useDispatch();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isOwn = comment.user === CURRENT_USER;
  const isLikedByUser = (comment.likedBy || []).includes(CURRENT_USER_ID);

  const handleReply = (content) => {
    dispatch(addReply({
      postId,
      commentId: comment.id,
      reply: { user: CURRENT_USER, content },
    }));
    setShowReplyForm(false);
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className={`${isReply ? 'ml-8 sm:ml-12' : ''}`}
    >
      <div className={`flex gap-3 py-4 ${!isReply ? 'border-b border-white/[0.04]' : ''}`}>
        <img
          src={comment.avatar}
          alt={comment.user}
          className="w-8 h-8 rounded-full border border-white/[0.08] flex-shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-white/70">{comment.user}</span>
            {isOwn && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20">
                You
              </span>
            )}
            <span className="text-[10px] text-white/15">{timeAgo(comment.timestamp)}</span>
          </div>

          <p className="text-sm text-white/45 leading-relaxed mb-2">
            {comment.content}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(likeComment({ postId, commentId: comment.id, userId: CURRENT_USER_ID }))}
              className={`flex items-center gap-1 text-[11px] transition-colors ${
                isLikedByUser ? 'text-red-400' : 'text-white/15 hover:text-white/40'
              }`}
            >
              <Heart size={11} className={isLikedByUser ? 'fill-red-400' : ''} />
              {(comment.likes || 0) > 0 && <span>{comment.likes}</span>}
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-[11px] text-white/15 hover:text-white/40 transition-colors"
              >
                <Reply size={11} />
                Reply
              </button>
            )}

            {isOwn && (
              <button
                onClick={() => dispatch(deleteComment({ postId, commentId: comment.id }))}
                className="flex items-center gap-1 text-[11px] text-white/10 hover:text-red-400 transition-colors"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>

          {/* Reply form */}
          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <CommentForm
                  onSubmit={handleReply}
                  placeholder="Write a reply..."
                  compact
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nested replies */}
      {!isReply && comment.replies?.length > 0 && (
        <div className="border-l border-white/[0.04] ml-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const BlogComments = ({ postId }) => {
  const dispatch = useDispatch();
  const allComments = useSelector(selectComments);
  const comments = allComments[String(postId)] || [];
  const [expanded, setExpanded] = useState(true);

  const handleNewComment = (content) => {
    dispatch(addComment({
      postId,
      comment: { user: CURRENT_USER, content },
    }));
  };

  return (
    <section className="mt-12 pt-8 border-t border-white/[0.06]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 mb-6 group"
      >
        <MessageCircle size={18} className="text-[#00E0FF]" />
        <h3 className="text-lg font-bold text-white">
          Comments ({comments.length})
        </h3>
        {expanded ? (
          <ChevronUp size={14} className="text-white/20" />
        ) : (
          <ChevronDown size={14} className="text-white/20" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Comment form */}
            <div className="mb-6">
              <CommentForm
                onSubmit={handleNewComment}
                placeholder="Share your thoughts..."
              />
            </div>

            {/* Comments list */}
            {comments.length === 0 ? (
              <div className="py-8 text-center">
                <MessageCircle size={28} className="text-white/[0.06] mx-auto mb-3" />
                <p className="text-sm text-white/20">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div>
                <AnimatePresence>
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={postId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogComments;
