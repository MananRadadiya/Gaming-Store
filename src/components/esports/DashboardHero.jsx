import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swords, Zap, Users, Radio } from 'lucide-react';

/* ── Particles ── */
const Particles = ({ count = 60 }) => {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        dur: Math.random() * 10 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.35 + 0.05,
        color: ['#00FF88', '#00E0FF', '#BD00FF'][i % 3],
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [0, -20, 0], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* ── Animated Counter ── */
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span className="tabular-nums">{value.toLocaleString('en-IN')}</span>;
};

/* ── Stagger containers ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const DashboardHero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Backgrounds */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] via-[#0d1220] to-[#0F172A]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,136,0.07),transparent)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(189,0,255,0.05),transparent)]" />

    {/* Grid */}
    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />

    {/* Glow pulse */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Decorative lines */}
    <div className="absolute top-[18%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent" />
    <div className="absolute bottom-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#BD00FF]/15 to-transparent" />

    <Particles />

    {/* Content */}
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative z-10 text-center px-4 max-w-5xl mx-auto"
    >
      {/* Badge */}
      <motion.div variants={fadeUp} className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
          <Swords size={14} className="text-[#00FF88]" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
            NEXUS Esports Arena
          </span>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={fadeUp}
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-6"
      >
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] drop-shadow-[0_0_40px_rgba(0,255,136,0.3)]">
          ENTER THE
        </span>
        <span className="block text-white/90">ARENA</span>
      </motion.h1>

      {/* Sub */}
      <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/35 max-w-xl mx-auto mb-10 font-light tracking-wide">
        Compete. Dominate. Ascend.
      </motion.p>

      {/* Live player counter */}
      <motion.div variants={fadeUp} className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/[0.04] backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-[#00FF88] opacity-75" />
            <span className="relative rounded-full h-2.5 w-2.5 bg-[#00FF88]" />
          </span>
          <span className="text-sm font-bold text-[#00FF88]">
            <AnimatedCounter target={12847} /> players online
          </span>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(0,255,136,0.3)' }}
          whileTap={{ scale: 0.96 }}
          className="group relative px-10 py-4 rounded-xl font-bold text-sm tracking-wider bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] overflow-hidden"
        >
          {/* Animated pulse ring */}
          <motion.span
            className="absolute inset-0 rounded-xl border-2 border-[#00FF88]"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Zap size={16} />
            Join Tournament
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, borderColor: 'rgba(0,224,255,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="px-10 py-4 rounded-xl font-bold text-sm tracking-wider border border-white/10 text-white/70 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-sm transition-all"
        >
          View Leaderboard
        </motion.button>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={fadeUp} className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {[
          { icon: Users, value: 52400, label: 'Active Players', suffix: '+' },
          { icon: Swords, value: 1240, label: 'Daily Matches', suffix: '' },
          { icon: Radio, value: 18, label: 'Live Tournaments', suffix: '' },
          { icon: Zap, value: 21000000, label: 'Prize Pool (₹)', suffix: '' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm"
          >
            <stat.icon size={18} className="mx-auto mb-2 text-[#00E0FF]" />
            <div className="text-2xl font-black text-white">
              <AnimatedCounter target={stat.value} duration={2500} />
              {stat.suffix}
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>

    {/* Scroll indicator */}
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#00FF88]"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  </section>
);

export default DashboardHero;
