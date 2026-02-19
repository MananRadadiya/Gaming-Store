import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Shield, Cpu, Wifi } from 'lucide-react';

const specs = [
  { icon: Zap, label: 'Ultra-Low Latency', value: '<1ms', color: '#00FF88' },
  { icon: Shield, label: 'Tournament Grade', value: 'Pro-Cert', color: '#00E0FF' },
  { icon: Cpu, label: 'Next-Gen Sensors', value: '8K DPI', color: '#BD00FF' },
  { icon: Wifi, label: 'Tri-Mode Connect', value: 'Wireless', color: '#00FF88' },
];

const VisualHighlight = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#00FF88]/[0.06] via-transparent to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#BD00FF]/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Grid lines BG */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Visual / Product */}
          <motion.div style={{ y: y1, scale, opacity }} className="relative flex justify-center">
            {/* Outer glow ring */}
            <div className="absolute inset-0 m-auto w-[360px] h-[360px] rounded-full border border-[#00FF88]/10" />
            <div className="absolute inset-0 m-auto w-[420px] h-[420px] rounded-full border border-[#00FF88]/[0.04]" />

            {/* Central product image / placeholder visual */}
            <motion.div
              style={{ rotate }}
              className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] shadow-2xl"
            >
              {/* Abstract product visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Glowing orb */}
                  <div className="w-40 h-40 rounded-full bg-gradient-to-b from-[#00FF88]/20 to-[#00E0FF]/10 blur-md" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#00FF88]/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu size={48} className="text-[#00FF88]/60" strokeWidth={1} />
                  </div>
                </div>
              </div>

              {/* Floating decorative particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#00FF88]/40"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                />
              ))}
            </motion.div>

            {/* Floating spec badges */}
            <motion.div
              style={{ y: y2 }}
              className="absolute -right-4 top-12 px-4 py-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#00FF88]" />
                <span className="text-[11px] font-bold text-white/80">Ultra-Responsive</span>
              </div>
            </motion.div>

            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], [30, -50]) }}
              className="absolute -left-4 bottom-20 px-4 py-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#00E0FF]" />
                <span className="text-[11px] font-bold text-white/80">Pro-Grade</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Text & Specs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00E0FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Next-Gen Performance
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Engineered for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF]">
                Victory
              </span>
            </h2>

            <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-md mb-10">
              Every component is precision-crafted for competitive gaming. Feel the difference that
              tournament-grade peripherals make in your gameplay.
            </p>

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-4">
              {specs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                >
                  <spec.icon size={18} style={{ color: spec.color }} className="mb-2" />
                  <div className="text-lg font-black text-white">{spec.value}</div>
                  <div className="text-[11px] text-white/30 font-medium uppercase tracking-wider mt-1">{spec.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisualHighlight;
