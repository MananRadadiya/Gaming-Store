import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
/* PERF: Lazy-load Category3D — 4 Three.js canvases are the heaviest
   components on the page. Only load when CategoriesSection enters viewport */
const Category3D = lazy(() => import('./Three/Category3D'));

/* PERF: Simple spinner fallback for 3D scene loading */
const Scene3DFallback = () => (
  <div className="h-[220px] w-full flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-white/10 border-t-[#00FF88]/50 rounded-full animate-spin" />
  </div>
);

// Exactly 4 items with distinct, balanced neon colors
const featuredCategories = [
  { name: 'Keyboards', model: '/models/keyboard.glb', color: '#00FF88' }, // Neon Green
  { name: 'Headsets', model: '/models/headset.glb', color: '#FF0055' },  // Neon Red/Pink
  { name: 'Monitors', model: '/models/monitor.glb', color: '#BD00FF' },  // Neon Purple
  { name: 'Chairs', model: '/models/chair.glb', color: '#00E0FF' },      // Neon Cyan
];

const CornerBracket = ({ color, position, rotate = 0 }) => (
  <div
    className={`absolute w-2.5 h-2.5 opacity-20 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${position}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <div className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: color }} />
    <div className="absolute top-0 left-0 w-px h-full" style={{ backgroundColor: color }} />
  </div>
);

const CategoriesSection = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-6 py-32 overflow-hidden">
      {/* Dynamic Background Ambiance - Center focused */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-nexus-accent/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <div className="text-center mb-24 relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-block text-nexus-accent text-xs font-bold tracking-[0.5em] uppercase mb-4 px-4 py-1 border border-nexus-accent/20 rounded-full bg-nexus-accent/5"
        >
          Ecosystem
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter"
        >
          SELECT YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-accent via-white to-nexus-cyan">GEAR</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Premium gaming peripherals with next-gen technology
        </motion.p>
      </div>

      {/* Grid: 1 col mobile, 2 col tablet, 4 col widescreen */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
        {featuredCategories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative" // Fixed height for consistency
            onMouseEnter={() => setHoveredCategory(cat.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <a
              href={`/store?category=${cat.name.toLowerCase()}`}
              className="relative flex flex-col h-full rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.01] overflow-hidden transition-all duration-500 group-hover:border-white/10 group-hover:shadow-2xl group-hover:shadow-black/50"
            >
              {/* Animated Glow Background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at center, ${cat.color}15, transparent 70%)`,
                }}
              />

              {/* Top accent bar */}
              <div
                className="h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
              />

              {/* 3D Scene Area — PERF: wrapped in Suspense for lazy loading */}
              <div className="relative w-full h-[260px] flex items-center justify-center overflow-hidden">

                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-0" />
                 <Suspense fallback={<Scene3DFallback />}>
                   <Category3D modelUrl={cat.model} color={cat.color} />
                 </Suspense>
              </div>

              {/* Content Section — PERF: removed backdrop-blur-sm */}
              <div className="px-6 py-8 text-center relative z-10 border-t border-white/5 bg-black/20">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Zap
                    size={14}
                    style={{ color: cat.color }}
                    className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
                  />
                  <h3 className="text-xl font-black tracking-wide text-white/60 group-hover:text-white transition-colors duration-300 uppercase">
                    {cat.name}
                  </h3>
                  <Zap
                    size={14}
                    style={{ color: cat.color }}
                    className="opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>

                {/* Animated colored line */}
                <div
                  className="h-[1px] w-0 mx-auto group-hover:w-16 transition-all duration-500"
                  style={{ background: cat.color }}
                />

                {/* Explore Link */}
                <div className="mt-4 flex items-center justify-center gap-2 text-white/40 group-hover:text-white transition-all duration-500 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="text-[10px] font-bold tracking-[0.2em]">EXPLORE</span>
                  <ArrowRight size={12} />
                </div>
              </div>

              {/* Tech Corner Accents */}
              <CornerBracket color={cat.color} position="top-4 left-4" rotate={0} />
              <CornerBracket color={cat.color} position="top-4 right-4" rotate={90} />
              <CornerBracket color={cat.color} position="bottom-4 left-4" rotate={-90} />
              <CornerBracket color={cat.color} position="bottom-4 right-4" rotate={180} />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;