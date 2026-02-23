import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleTag, selectActiveTags } from '../../store/blogSlice';

const ALL_TAGS = [
  'Hardware',
  'Esports',
  'Performance',
  'Setup Builds',
  'Competitive Tips',
  'GPU',
  'NVIDIA',
  'Valorant',
  'CS2',
];

const TagFilter = ({ tags = ALL_TAGS }) => {
  const dispatch = useDispatch();
  const activeTags = useSelector(selectActiveTags);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <motion.button
            key={tag}
            onClick={() => dispatch(toggleTag(tag))}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            layout
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
              isActive
                ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30 shadow-[0_0_12px_rgba(0,255,136,0.12)]'
                : 'bg-white/[0.02] text-white/30 border-white/[0.06] hover:text-white/50 hover:bg-white/[0.04] hover:border-white/[0.10]'
            }`}
          >
            {tag}
          </motion.button>
        );
      })}

      {activeTags.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => activeTags.forEach((t) => dispatch(toggleTag(t)))}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/25 hover:text-white/50 border border-white/[0.04] hover:border-white/[0.08] transition-all"
        >
          Clear all
        </motion.button>
      )}
    </div>
  );
};

export default TagFilter;
