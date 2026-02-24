import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useInView,
} from "framer-motion";

/* =====================================
   Animated Counter (ERROR-FREE VERSION)
===================================== */

const AnimatedCounter = ({ value, suffix = "", decimals = 0 }) => {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplay(Number(latest).toFixed(decimals));
      },
    });

    return controls.stop;
  }, [isInView, value, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

/* =====================================
   Animation Variants
===================================== */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

/* =====================================
   Stats Section
===================================== */

const StatsSection = () => {
  const stats = [
    {
      value: 50,
      suffix: "K+",
      label: "Happy Gamers",
      glow: "shadow-emerald-500/20",
      textGradient: "from-emerald-400 to-green-100",
    },
    {
      value: 1000,
      suffix: "+",
      label: "Premium Products",
      glow: "shadow-cyan-500/20",
      textGradient: "from-cyan-400 to-blue-100",
    },
    {
      value: 99.8,
      suffix: "%",
      label: "Satisfaction Rate",
      glow: "shadow-violet-500/20",
      textGradient: "from-violet-400 to-fuchsia-100",
      decimals: 1,
    },
    {
      value: 24,
      suffix: "/7",
      label: "Pro Support",
      glow: "shadow-emerald-500/20",
      textGradient: "from-emerald-400 to-green-100",
    },
  ];

  return (
    <section className="relative w-full py-24 overflow-hidden bg-neutral-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map(
            ({ value, suffix, label, glow, textGradient, decimals }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`
                  group relative p-8 rounded-3xl
                  bg-neutral-900/50
                  border border-white/5 hover:border-white/10
                  transition-all duration-300
                  flex flex-col items-center justify-center text-center
                  hover:shadow-2xl ${glow}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                <h3
                  className={`text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br ${textGradient} bg-clip-text text-transparent tracking-tighter`}
                >
                  <AnimatedCounter
                    value={value}
                    suffix={suffix}
                    decimals={decimals || 0}
                  />
                </h3>

                <p className="text-neutral-400 text-xs md:text-sm font-medium uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                  {label}
                </p>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* PERF: React.memo — pure component with static stat data */
export default React.memo(StatsSection);
