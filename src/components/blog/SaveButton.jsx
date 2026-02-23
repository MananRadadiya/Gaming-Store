import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { toggleSave, selectIsSaved } from '../../store/blogSlice';

const SaveButton = ({ postId, size = 'md', showLabel = false }) => {
  const dispatch = useDispatch();
  const isSaved = useSelector(selectIsSaved(postId));

  const sizes = {
    sm: { btn: 'p-1.5', icon: 14 },
    md: { btn: 'p-2', icon: 16 },
    lg: { btn: 'p-2.5', icon: 20 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      onClick={() => dispatch(toggleSave(postId))}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      className={`relative flex items-center gap-2 ${
        showLabel ? 'px-4 py-2' : s.btn
      } rounded-xl border transition-all duration-300 cursor-pointer group ${
        isSaved
          ? 'bg-[#00E0FF]/10 border-[#00E0FF]/20 text-[#00E0FF] shadow-[0_0_15px_rgba(0,224,255,0.1)]'
          : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.10] hover:bg-white/[0.04]'
      }`}
      title={isSaved ? 'Remove from reading list' : 'Save to reading list'}
    >
      <motion.div
        animate={isSaved ? { rotateY: [0, 180, 360] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Bookmark
          size={s.icon}
          className={`transition-all ${isSaved ? 'fill-[#00E0FF] text-[#00E0FF]' : 'group-hover:text-[#00E0FF]/50'}`}
        />
      </motion.div>
      {showLabel && (
        <span className="text-xs font-bold">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </motion.button>
  );
};

export default SaveButton;
