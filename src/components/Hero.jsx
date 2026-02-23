import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Sub-Component: Particle Background (Optimized) ---
const HeroBackground = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // High DPI scaling for crisp rendering on retina displays
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5, // Slower, more elegant movement
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear instead of fillRect for transparency

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Seamless wrapping
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '100%', height: '100%' }} />;
});

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  }
};

// --- Main Hero Component ---
// FIX: Added 'export' keyword here so index.js can find it
export const Hero = () => {

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Parallax text
  const y2 = useTransform(scrollY, [0, 500], [0, 100]); // Parallax bg

  return (
    <div className="relative w-full h-screen bg-nexus-dark overflow-hidden flex items-center justify-center">
      
      {/* 1. Background Layer: Deep Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-nexus-accent/20 blur-[120px] rounded-full opacity-40 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-nexus-purple/20 blur-[120px] rounded-full opacity-40" />

      {/* 2. Tech Grid with Fade Mask (The "Premium" Touch) */}
      <motion.div style={{ y: y2 }} className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" 
          style={{ maskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}
        />
      </motion.div>

      <HeroBackground />

      {/* 3. Vignette Overlay for Focus */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-nexus-dark/50 to-nexus-dark pointer-events-none" />

      {/* 4. Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: y1 }}
        className="relative z-10 text-center max-w-5xl mx-auto px-6"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-widest text-nexus-accent uppercase shadow-[0_0_15px_rgba(0,255,136,0.2)]">
            Next Gen Hardware
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.9]"
        >
          <span className="text-white drop-shadow-2xl">ENTER THE</span>
          <br />
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-accent via-white to-nexus-cyan">NEXUS</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light tracking-wide leading-relaxed"
        >
          Forged for the elite. Experience latency-free dominance with the world's most advanced gaming ecosystem.
        </motion.p>

       {/* Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8"
        >
          {/* Primary Action: Cyberpunk Solid */}
          <motion.a
            href="/store"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-nexus-accent text-nexus-dark font-black text-lg tracking-widest uppercase overflow-hidden"
            style={{ 
              clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' // Sci-Fi Cut Corners
            }}
          >
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" />
            
            <span className="relative z-10 flex items-center gap-2">
              SHOP NOW
              {/* Simple Arrow Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </motion.a>

          {/* Secondary Action: Glass/Holographic */}
          <motion.a
            href="/deals"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-white/5 border border-white/20 backdrop-blur-md text-white font-bold text-lg tracking-widest uppercase transition-all duration-300 hover:border-nexus-accent/50 hover:text-nexus-accent"
          >
            <span className="relative z-10">FLASH DEALS</span>
            
            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-nexus-accent group-hover:w-full transition-all duration-300 ease-out" />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* 5. Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-nexus-accent/0 via-nexus-accent/50 to-nexus-accent/0" />
      </motion.div>
    </div>
  );
};

// Also added default export for compatibility
export default Hero;