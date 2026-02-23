import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setProgress(Math.round(v * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #00FF88, #00E0FF, #BD00FF)',
        }}
      />
      {/* Glow effect */}
      <motion.div
        className="absolute top-0 h-[6px] origin-left blur-sm opacity-60"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #00FF88, #00E0FF, #BD00FF)',
          width: '100%',
        }}
      />
    </div>
  );
};

export default ReadingProgressBar;
