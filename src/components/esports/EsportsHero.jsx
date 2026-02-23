import React from 'react';
import { motion } from 'framer-motion';
import { Swords, ArrowRight } from 'lucide-react';
import ParticleField from './ParticleField';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const EsportsHero = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    {/* Background layers */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] via-[#0d1220] to-[#0F172A]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,136,0.08),transparent)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(189,0,255,0.06),transparent)]" />

    {/* Grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />

    <ParticleField count={40} />

    {/* Decorative lines */}
    <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent" />
    <div className="absolute bottom-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#BD00FF]/15 to-transparent" />

    {/* Content */}
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 text-center px-4 max-w-5xl mx-auto"
    >
      {/* Badge */}
      <motion.div variants={slideUp} className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
          <Swords size={14} className="text-[#00FF88]" />
          <span className="text-xs font-medium tracking-widest uppercase text-white/50">
            NEXUS Competitive Arena
          </span>
        </div>
      </motion.div>

      {/* Main heading */}
      <motion.h1 variants={slideUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
        <span className="block text-white/90">COMPETE.</span>
        <span className="block bg-gradient-to-r from-[#00E0FF] via-[#BD00FF] to-[#00FF88] bg-clip-text text-transparent">
          DOMINATE.
        </span>
        <span className="block text-white/90">ASCEND.</span>
      </motion.h1>

      {/* Subtext */}
      <motion.p variants={slideUp} className="text-lg sm:text-xl text-white/40 max-w-xl mx-auto mb-10 font-light">
        The battleground for elite NEXUS players. Where legends are forged and
        champions are crowned.
      </motion.p>

      {/* CTAs */}
      <motion.div variants={slideUp} className="flex flex-col sm:flex-row justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,255,136,0.25)' }}
          whileTap={{ scale: 0.97 }}
          className="group relative px-8 py-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Tournaments
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, borderColor: 'rgba(0,255,136,0.4)' }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-4 rounded-xl font-bold text-sm tracking-wide border border-white/10 text-white/80 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-sm transition-all"
        >
          Join the Arena
        </motion.button>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        variants={slideUp}
        className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16"
      >
        {[
          { value: '50K+', label: 'Active Players' },
          { value: '$2.5M', label: 'Prize Pool' },
          { value: '120+', label: 'Tournaments' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-white/90">{stat.value}</div>
            <div className="text-xs text-white/30 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>

    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0F14] to-transparent" />
  </section>
);

export default EsportsHero;
