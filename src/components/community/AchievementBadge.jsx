import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AchievementBadge = ({ achievement, index = 0, showTooltip = true }) => {
  const [hovered, setHovered] = useState(false);

  if (!achievement) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.15 }}
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center text-lg cursor-pointer`}
        style={{
          boxShadow: hovered
            ? `0 0 24px ${achievement.glowColor}, 0 0 48px ${achievement.glowColor}`
            : `0 0 12px ${achievement.glowColor}`,
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {achievement.icon}
      </motion.div>

      {/* Tooltip */}
      {showTooltip && hovered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl whitespace-nowrap z-50"
        >
          <p className="text-white text-xs font-bold">{achievement.name}</p>
          <p className="text-neutral-500 text-[10px] mt-0.5">{achievement.description}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0a0a0a] border-r border-b border-white/10 rotate-45 -mt-1" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AchievementBadge;
