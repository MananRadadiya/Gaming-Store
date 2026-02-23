/**
 * ═══════════════════════════════════════════════════════════════
 * TypingIndicator — Animated "bot is typing" indicator
 * ═══════════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';

const dotVariants = {
  initial: { y: 0, opacity: 0.4 },
  animate: { y: -4, opacity: 1 },
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    className="flex justify-start mb-3"
  >
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
      <div className="flex items-center gap-1.5">
        {/* Pulsing neon dots */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.15,
            }}
            className="w-[6px] h-[6px] rounded-full bg-cyan-400"
            style={{
              boxShadow: '0 0 6px rgba(0, 224, 255, 0.6)',
            }}
          />
        ))}
        <span className="text-[10px] text-white/30 ml-1.5 font-medium">
          NEXUS AI is thinking
        </span>
      </div>
    </div>
  </motion.div>
);

export default TypingIndicator;
