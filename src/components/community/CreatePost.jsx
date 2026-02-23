import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Send, Hash, X, Sparkles } from 'lucide-react';
import { addPost } from '../../store/communitySlice';
import { addNotification } from '../../store/notificationSlice';
import { toast } from 'react-toastify';

const GAME_TAGS = ['Valorant', 'Counter-Strike 2', 'League of Legends'];
const MAX_CHARS = 500;

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [gameTag, setGameTag] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const charCount = content.length;
  const canPost = content.trim().length > 0 && charCount <= MAX_CHARS;

  const handleSubmit = () => {
    if (!canPost) return;
    const newPost = {
      id: `post_${Date.now()}`,
      playerId: user?.id?.toString() ?? 'p1',
      content: content.trim(),
      image: imageUrl,
      gameTag,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: new Date().toISOString(),
    };
    dispatch(addPost(newPost));
    dispatch(
      addNotification({
        id: `n_${Date.now()}`,
        type: 'achievement',
        message: 'Your post is live! 🎉',
        avatar: '',
        read: false,
        timestamp: new Date().toISOString(),
      })
    );
    toast(
      <div className="flex items-center gap-3 py-1">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00FF88] to-[#00E0FF]" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white font-semibold text-[13px] leading-tight">Post Published</span>
          <span className="text-neutral-400 text-[11px] mt-0.5 leading-tight">Your post is now live!</span>
        </div>
      </div>,
      { icon: false, autoClose: 3000 }
    );
    setContent('');
    setGameTag('');
    setImageUrl('');
    setShowImageInput(false);
    setExpanded(false);
  };

  return (
    <motion.div
      layout
      className="relative rounded-2xl border border-white/[0.06] overflow-hidden"
      style={{ background: 'rgba(15,15,20,0.8)', backdropFilter: 'blur(20px)' }}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <motion.div
            className="flex-1 cursor-text"
            onClick={() => setExpanded(true)}
          >
            {!expanded ? (
              <div className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-500 text-sm hover:border-cyan-500/20 transition-colors">
                What's on your mind, gamer?
              </div>
            ) : null}
          </motion.div>
        </div>

        {/* Expanded editor */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your gaming moment..."
                rows={4}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 resize-none focus:outline-none focus:border-cyan-500/30 transition-colors"
              />

              {/* Char counter */}
              <div className="flex justify-end mt-1 mb-3">
                <span
                  className={`text-xs font-mono ${
                    charCount > MAX_CHARS
                      ? 'text-red-400'
                      : charCount > MAX_CHARS * 0.8
                      ? 'text-amber-400'
                      : 'text-neutral-600'
                  }`}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>

              {/* Image URL input */}
              <AnimatePresence>
                {showImageInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/30"
                      />
                      <button
                        onClick={() => {
                          setShowImageInput(false);
                          setImageUrl('');
                        }}
                        className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {GAME_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setGameTag(gameTag === tag ? '' : tag)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                      gameTag === tag
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-white/[0.03] border-white/[0.06] text-neutral-500 hover:text-neutral-300 hover:border-white/10'
                    }`}
                  >
                    <Hash size={12} />
                    {tag}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-500 hover:text-cyan-400 hover:bg-white/[0.04] transition-all text-sm"
                >
                  <ImagePlus size={18} />
                  <span className="hidden sm:inline">Image</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setExpanded(false);
                      setContent('');
                      setGameTag('');
                      setImageUrl('');
                    }}
                    className="px-4 py-2 rounded-lg text-neutral-500 hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canPost}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      canPost
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(0,224,255,0.3)] hover:shadow-[0_0_30px_rgba(0,224,255,0.5)]'
                        : 'bg-white/[0.06] text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    <Send size={14} />
                    Post
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

export default CreatePost;
