import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { icon: Trophy, value: '50K+', label: 'Pro Gamers Trust Us' },
  { icon: Target, value: '99.9%', label: 'Uptime Guarantee' },
  { icon: Flame, value: '#1', label: 'Rated Gaming Store' },
];

const BuiltForChampions = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* BG effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-radial from-[#BD00FF]/[0.04] via-transparent to-transparent rounded-full" />
        {/* Diagonal accent line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[200px] -right-[200px] w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/20 to-transparent rotate-[35deg]" />
          <div className="absolute -bottom-[200px] -left-[200px] w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#BD00FF]/20 to-transparent rotate-[35deg]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Typography-heavy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD00FF]/10 border border-[#BD00FF]/20 text-[#BD00FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Trophy size={12} />
              Made for Winners
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8">
              BUILT
              <br />
              FOR
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E0FF]">
                CHAMPIONS
              </span>
            </h2>

            <p className="text-white/35 text-lg leading-relaxed max-w-lg mb-10">
              From casual gaming nights to tournament stages—NEXUS equips you
              with gear that's trusted by professionals and loved by enthusiasts worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/store">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider overflow-hidden group"
                >
                  {/* Gradient BG */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FF88] to-[#00E0FF] transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00E0FF] to-[#BD00FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2 text-[#050505]">
                    Shop Pro Gear
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <Link to="/esports">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
                >
                  Explore Esports
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right — Visual stats + abstract */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Large abstract background shape */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[400px] rounded-full border border-white/[0.03]" />
              <div className="absolute w-[300px] h-[300px] rounded-full border border-[#00FF88]/[0.06]" />
              <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#00FF88]/[0.04] to-transparent" />
            </div>

            {/* Stats cards */}
            <div className="relative space-y-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i + 0.3 }}
                  className="group flex items-center gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#00FF88]/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,136,0.06)]"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00FF88]/10 to-transparent border border-[#00FF88]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon size={22} className="text-[#00FF88]" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                    <div className="text-sm text-white/30 font-medium mt-0.5">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* PERF: React.memo — static content, never needs re-render */
export default React.memo(BuiltForChampions);
