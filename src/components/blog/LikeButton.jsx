import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toggleLike, selectIsLiked } from '../../store/blogSlice';

const LikeButton = ({ postId, initialCount = 0, size = 'md' }) => {
  const dispatch = useDispatch();
  const isLiked = useSelector(selectIsLiked(postId));
  const [animating, setAnimating] = useState(false);

  const likeCount = initialCount + (isLiked ? 1 : 0);

  const handleClick = () => {
    dispatch(toggleLike(postId));
    if (!isLiked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }
  };

  const sizes = {
    sm: { btn: 'px-3 py-1.5 gap-1.5', icon: 14, text: 'text-xs' },
    md: { btn: 'px-4 py-2 gap-2', icon: 16, text: 'text-sm' },
    lg: { btn: 'px-5 py-2.5 gap-2.5', icon: 20, text: 'text-base' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={`relative flex items-center ${s.btn} rounded-xl border transition-all duration-300 cursor-pointer group ${
        isLiked
          ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
          : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.10] hover:bg-white/[0.04]'
      }`}
    >
      <div className="relative">
        <motion.div
          animate={animating ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Heart
            size={s.icon}
            className={`transition-all ${isLiked ? 'fill-red-400 text-red-400' : 'group-hover:text-red-400/50'}`}
          />
        </motion.div>

        {/* Burst particles */}
        <AnimatePresence>
          {animating && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 18,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 18,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-red-400"
                  style={{ marginLeft: -2, marginTop: -2 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.span
        key={likeCount}
        initial={{ y: isLiked ? -8 : 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${s.text} font-bold tabular-nums`}
      >
        {likeCount}
      </motion.span>
    </motion.button>
  );
};

export default LikeButton;
