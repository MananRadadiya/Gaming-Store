import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
/* PERF: Removed useMousePosition import — mouse tracking now uses
   motion values directly, eliminating React re-renders on mouse move */

/* ═══════════════════════════════════════════════════════════════════════
   DECORATIVE ELEMENTS — refined, minimal, no product images
   ═════════════════════════════════════════════════════════════════════ */

const NEON_SHAPES = [
  // Soft orbs — ambient atmosphere
  { type: 'orb',  color: '#00FF88', size: 60,  pos: { top: '18%', left: '12%' },   depth: 0.35, opacity: 0.5 },
  { type: 'orb',  color: '#00E0FF', size: 40,  pos: { top: '72%', right: '14%' },  depth: 0.55, opacity: 0.4 },
  { type: 'orb',  color: '#BD00FF', size: 30,  pos: { bottom: '25%', left: '8%' }, depth: 0.25, opacity: 0.35 },
  // Rings — structural, geometric feel
  { type: 'ring', color: '#BD00FF', size: 100, pos: { top: '25%', right: '18%' },  depth: 0.7, opacity: 0.3 },
  { type: 'ring', color: '#00FF88', size: 70,  pos: { bottom: '22%', left: '20%' },depth: 0.45, opacity: 0.25 },
  { type: 'ring', color: '#00E0FF', size: 55,  pos: { top: '60%', right: '8%' },   depth: 0.6, opacity: 0.2 },
  // Glass cards — depth layers
  { type: 'card', color: '#00E0FF', size: 140, pos: { top: '35%', left: '6%' },    depth: 0.2, opacity: 0.15 },
  { type: 'card', color: '#BD00FF', size: 110, pos: { top: '12%', right: '8%' },   depth: 0.55, opacity: 0.12 },
  // Tiny accent dots
  { type: 'dot',  color: '#00FF88', size: 6,   pos: { top: '40%', left: '28%' },   depth: 0.8, opacity: 0.7 },
  { type: 'dot',  color: '#00E0FF', size: 5,   pos: { top: '30%', right: '30%' },  depth: 0.65, opacity: 0.6 },
  { type: 'dot',  color: '#BD00FF', size: 4,   pos: { bottom: '35%', right: '25%'},depth: 0.5, opacity: 0.8 },
  { type: 'dot',  color: '#00FF88', size: 5,   pos: { top: '65%', left: '32%' },   depth: 0.4, opacity: 0.5 },
];

/* ═══════════════════════════════════════════════════════════════════════
   ACCESSIBILITY & RESPONSIVE HOOKS
   ═════════════════════════════════════════════════════════════════════ */

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mql.matches);
    const handler = (e) => setPrefers(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return prefers;
};

const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    /* PERF: debounce resize — no need for rapid resize tracking */
    let timeout;
    const debounced = () => { clearTimeout(timeout); timeout = setTimeout(check, 200); };
    window.addEventListener('resize', debounced);
    return () => { window.removeEventListener('resize', debounced); clearTimeout(timeout); };
  }, []);
  return mobile;
};

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATED PERSPECTIVE GRID (Canvas) — cleaner, subtler
   ═════════════════════════════════════════════════════════════════════ */

const GridFloor = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    /* PERF: Clamp DPR to 2 — background decor doesn't need 3x resolution */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    /* PERF: debounce resize */
    let resizeTimeout;
    const debouncedResize = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(resize, 200); };
    window.addEventListener('resize', debouncedResize);

    let offset = 0;
    /* PERF: Throttle grid animation to ~30fps — subtle animation doesn't need 60fps */
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (now - lastTime < FRAME_INTERVAL) return;
      lastTime = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const gridY = h * 0.58;
      const spacing = 50;
      const vanishX = w / 2;
      const vanishY = h * 0.38;

      ctx.lineWidth = 0.5;

      // Horizontal lines — fade in with depth
      for (let y = gridY; y < h; y += spacing * 0.8) {
        const progress = (y - gridY) / (h - gridY);
        ctx.globalAlpha = progress * 0.15;
        ctx.strokeStyle = 'rgba(0,255,136,0.6)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      /* PERF: Reduced columns from 20 to 10 — halves draw calls, barely visible */
      const cols = 10;
      for (let i = -cols; i <= cols; i++) {
        const baseX = vanishX + i * spacing + (offset % spacing);
        ctx.globalAlpha = 0.04;
        ctx.strokeStyle = 'rgba(0,255,136,0.5)';
        ctx.beginPath();
        ctx.moveTo(vanishX + (baseX - vanishX) * 0.03, vanishY);
        ctx.lineTo(baseX, h);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      offset += 0.12;
    };

    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ width: '100%', height: '100%', opacity: 0.4 }}
    />
  );
});
GridFloor.displayName = 'GridFloor';

/* ═══════════════════════════════════════════════════════════════════════
   PARTICLE FIELD (Canvas) — sparser, warmer glow
   ═════════════════════════════════════════════════════════════════════ */

const ParticleField = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    /* PERF: Clamp DPR */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    let resizeTimeout;
    const debouncedResize = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(resize, 200); };
    window.addEventListener('resize', debouncedResize);

    /* PERF: Reduced particle count from 45 to 25 */
    const count = Math.min(25, Math.floor(window.innerWidth / 50));
    const hues = [156, 190, 280];

    /* PERF: Pre-render particle glow sprites to offscreen canvases.
       Before: createRadialGradient called count*60 times/sec (expensive)
       After: 3 pre-baked sprite images, drawn via drawImage (GPU-accelerated) */
    const spriteSize = 24;
    const sprites = hues.map(hue => {
      const off = document.createElement('canvas');
      off.width = spriteSize;
      off.height = spriteSize;
      const offCtx = off.getContext('2d');
      const half = spriteSize / 2;
      const grad = offCtx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, `hsla(${hue}, 100%, 65%, 0.5)`);
      grad.addColorStop(0.3, `hsla(${hue}, 100%, 80%, 0.3)`);
      grad.addColorStop(1, `hsla(${hue}, 100%, 65%, 0)`);
      offCtx.fillStyle = grad;
      offCtx.fillRect(0, 0, spriteSize, spriteSize);
      return off;
    });

    const particles = Array.from({ length: count }, () => {
      const hueIdx = Math.floor(Math.random() * 3);
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.35 + 0.1,
        hueIdx,
      };
    });

    /* PERF: Throttle to ~30fps */
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      if (now - lastTime < FRAME_INTERVAL) return;
      lastTime = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        /* PERF: Use pre-rendered sprite instead of per-frame gradient creation */
        const drawSize = p.r * 6;
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(sprites[p.hueIdx], p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize);
      });

      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
});
ParticleField.displayName = 'ParticleField';

/* ═══════════════════════════════════════════════════════════════════════
   RIPPLE BURST — click glow effect
   ═════════════════════════════════════════════════════════════════════ */

const RippleBurst = ({ x, y, onDone }) => (
  <motion.div
    className="fixed pointer-events-none z-[100]"
    style={{ left: x, top: y, translateX: '-50%', translateY: '-50%' }}
    initial={{ width: 0, height: 0, opacity: 0.7 }}
    animate={{ width: 250, height: 250, opacity: 0 }}
    transition={{ duration: 0.55, ease: 'easeOut' }}
    onAnimationComplete={onDone}
  >
    <div className="w-full h-full rounded-full border border-[#00FF88]/60 shadow-[0_0_60px_rgba(0,255,136,0.3)]" />
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════
   FLOATING ITEM — reusable anti-gravity wrapper
   ═════════════════════════════════════════════════════════════════════ */

/* PERF: FloatingItem now accepts mouseX/mouseY as motion values.
   Uses useTransform chains to derive position — zero React re-renders on mouse move */
const FloatingItem = React.memo(({
  children,
  depth = 0.5,
  mouseXMotion,
  mouseYMotion,
  reducedMotion = false,
  isMobile = false,
  className = '',
  style = {},
  idleAmplitude = 12,
  idleSpeed = 3000,
  index = 0,
}) => {
  const factor = reducedMotion ? 0 : (isMobile ? depth * 12 : depth * 35);

  /* PERF: Derive transforms from motion values via useTransform.
     When mouseXMotion changes, sx updates internally in Framer Motion
     without triggering React reconciliation */
  const rawX = useTransform(mouseXMotion, v => -v * factor);
  const rawY = useTransform(mouseYMotion, v => -v * factor);
  const rotXRaw = useTransform(mouseYMotion, v => v * depth * 5);
  const rotYRaw = useTransform(mouseXMotion, v => -v * depth * 5);

  const springConfig = { stiffness: 50, damping: 22, mass: 1.4 };
  const sx = useSpring(rawX, springConfig);
  const sy = useSpring(rawY, springConfig);
  const srx = useSpring(rotXRaw, { stiffness: 30, damping: 20 });
  const sry = useSpring(rotYRaw, { stiffness: 30, damping: 20 });

  // Idle sine-wave float
  const idleY = useMotionValue(0);
  const idleSpring = useSpring(idleY, { stiffness: 18, damping: 12 });

  useEffect(() => {
    if (reducedMotion) return;
    let raf;
    const phase = index * 1400;
    /* PERF: Throttle idle float to ~30fps */
    let lastTime = 0;
    const INTERVAL = 1000 / 30;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - lastTime < INTERVAL) return;
      lastTime = now;
      const t = (Date.now() + phase) / idleSpeed;
      idleY.set(Math.sin(t * Math.PI * 2) * idleAmplitude);
      raf = requestAnimationFrame(tick);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, idleAmplitude, idleSpeed, index, idleY]);

  const combinedY = useTransform([sy, idleSpring], ([a, b]) => a + b);

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        ...style,
        x: sx,
        y: combinedY,
        rotateX: srx,
        rotateY: sry,
        perspective: 800,
      }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.div>
  );
});
FloatingItem.displayName = 'FloatingItem';

/* ═══════════════════════════════════════════════════════════════════════
   SHAPE RENDERERS — cleaner, more refined
   ═════════════════════════════════════════════════════════════════════ */

const NeonOrb = ({ color, size, opacity = 0.5 }) => (
  <div
    className="rounded-full"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}44 0%, ${color}11 40%, transparent 70%)`,
      boxShadow: `0 0 ${size}px ${color}22`,
      opacity,
    }}
  />
);

const NeonRing = ({ color, size, opacity = 0.3 }) => (
  <div
    className="rounded-full"
    style={{
      width: size,
      height: size,
      border: `1.5px solid ${color}40`,
      boxShadow: `0 0 25px ${color}15, inset 0 0 25px ${color}08`,
      opacity,
    }}
  />
);

/* PERF: Removed backdrop-blur from decorative GlassCard — saves GPU compositing layer */
const GlassCard = ({ color, size, opacity = 0.15 }) => (
  <div
    className="rounded-xl"
    style={{
      width: size,
      height: size * 0.55,
      background: `linear-gradient(135deg, ${color}0A 0%, ${color}04 100%)`,
      border: `1px solid ${color}15`,
      opacity,
    }}
  />
);

const NeonDot = ({ color, size, opacity = 0.7 }) => (
  <div
    className="rounded-full"
    style={{
      width: size,
      height: size,
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}88, 0 0 ${size * 6}px ${color}44`,
      opacity,
    }}
  />
);

/* PERF: Memoize ShapeRenderer to prevent re-creation */
const ShapeRenderer = React.memo(({ type, color, size, opacity }) => {
  switch (type) {
    case 'orb':  return <NeonOrb color={color} size={size} opacity={opacity} />;
    case 'ring': return <NeonRing color={color} size={size} opacity={opacity} />;
    case 'card': return <GlassCard color={color} size={size} opacity={opacity} />;
    case 'dot':  return <NeonDot color={color} size={size} opacity={opacity} />;
    default:     return null;
  }
});
ShapeRenderer.displayName = 'ShapeRenderer';

/* ═══════════════════════════════════════════════════════════════════════
   HORIZONTAL SCAN LINE — subtle cyberpunk accent
   ═════════════════════════════════════════════════════════════════════ */

const ScanLine = React.memo(() => (
  <motion.div
    className="absolute left-0 w-full h-[1px] pointer-events-none z-[5]"
    style={{
      background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.12) 20%, rgba(0,255,136,0.25) 50%, rgba(0,255,136,0.12) 80%, transparent 100%)',
      boxShadow: '0 0 8px rgba(0,255,136,0.15)',
    }}
    initial={{ top: '-2%' }}
    animate={{ top: '102%' }}
    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
  />
));
ScanLine.displayName = 'ScanLine';

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT: HeroAntiGravity
   ═════════════════════════════════════════════════════════════════════ */

const HeroAntiGravity = () => {
  /* PERF: Use motion values for mouse position instead of React state.
     Mouse movement NEVER triggers React re-renders.
     All 12 FloatingItems update via Framer Motion's internal loop,
     completely bypassing React reconciliation. */
  const mouseXMotion = useMotionValue(0);
  const mouseYMotion = useMotionValue(0);
  const rafRef = useRef(null);
  const latestMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      latestMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      latestMouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          mouseXMotion.set(latestMouse.current.x);
          mouseYMotion.set(latestMouse.current.y);
          rafRef.current = null;
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseXMotion, mouseYMotion]);

  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Click ripple state
  const [ripples, setRipples] = useState([]);
  const handleClick = useCallback((e) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
  }, []);
  const removeRipple = useCallback((id) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  /* ── Entrance animation ── */
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 },
    },
  }), []);

  const fadeUp = useMemo(() => ({
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 40, damping: 16, duration: 0.8 },
    },
  }), []);

  return (
    <section
      onClick={handleClick}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center select-none"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 45%, #0d1520 0%, #0B0F14 40%, #060a0e 100%)',
      }}
    >
      {/* ── BACKGROUND ── */}

      {/* Corner glow — very soft, pulled back */}
      <div className="absolute top-[-25%] left-[-15%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-25%] right-[-15%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(189,0,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute top-[-10%] right-[0%] w-[30%] h-[30%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,224,255,0.05) 0%, transparent 70%)' }} />

      {/* Central light — hero focus */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 60%)' }} />

      <GridFloor />
      <ParticleField />
      <ScanLine />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 65% at 50% 48%, transparent 0%, #0B0F14 100%)',
        }}
      />

      {/* ── NEON SHAPES ── */}
      {NEON_SHAPES.map((shape, i) => (
        <FloatingItem
          key={`shape-${i}`}
          depth={shape.depth}
          mouseXMotion={mouseXMotion}
          mouseYMotion={mouseYMotion}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          index={i}
          idleAmplitude={shape.type === 'dot' ? 4 : 6 + i * 1.5}
          idleSpeed={4000 + i * 350}
          className={`pointer-events-none ${isMobile && shape.type === 'card' ? 'hidden' : ''}`}
          style={{ ...shape.pos, zIndex: 1 }}
        >
          <ShapeRenderer type={shape.type} color={shape.color} size={shape.size} opacity={shape.opacity} />
        </FloatingItem>
      ))}

      {/* ── MAIN CONTENT ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
      >
        {/* Badge */}
        <FloatingItem
          depth={0.12}
          mouseXMotion={mouseXMotion}
          mouseYMotion={mouseYMotion}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          index={20}
          idleAmplitude={4}
          idleSpeed={5000}
          className="relative"
          style={{ position: 'relative' }}
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            {/* PERF: removed backdrop-blur-xl from badge */}
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00FF88]/15 bg-[#00FF88]/5 text-[11px] font-semibold tracking-[0.3em] text-[#00FF88] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] shadow-[0_0_6px_rgba(0,255,136,0.8)] animate-pulse" />
              Zero-Gravity Gaming
            </span>
          </motion.div>
        </FloatingItem>

        {/* Headline */}
        <FloatingItem
          depth={0.18}
          mouseXMotion={mouseXMotion}
          mouseYMotion={mouseYMotion}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          index={21}
          idleAmplitude={4}
          idleSpeed={5500}
          className="relative"
          style={{ position: 'relative' }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-black mb-4 tracking-[-0.04em] leading-[0.85] cursor-default"
          >
            <span className="block text-white/90">ENTER THE</span>
            <motion.span
              className="block mt-1 text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(95deg, #00FF88 0%, #00E0FF 45%, #BD00FF 100%)',
                WebkitBackgroundClip: 'text',
                backgroundSize: '200% 100%',
              }}
              animate={reducedMotion ? {} : {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              NEXUS
            </motion.span>
          </motion.h1>

          {/* Glow behind NEXUS text */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] pointer-events-none -z-10"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,255,136,0.08) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
        </FloatingItem>

        {/* Divider line */}
        <FloatingItem
          depth={0.08}
          mouseXMotion={mouseXMotion}
          mouseYMotion={mouseYMotion}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          index={25}
          idleAmplitude={2}
          idleSpeed={6000}
          className="relative"
          style={{ position: 'relative' }}
        >
          <motion.div variants={fadeUp} className="flex justify-center my-6">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/40 to-transparent" />
          </motion.div>
        </FloatingItem>

        {/* Subheading */}
        <FloatingItem
          depth={0.1}
          mouseXMotion={mouseXMotion}
          mouseYMotion={mouseYMotion}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          index={22}
          idleAmplitude={3}
          idleSpeed={5000}
          className="relative"
          style={{ position: 'relative' }}
        >
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base md:text-lg text-white/40 mb-10 max-w-lg mx-auto font-light tracking-wide leading-relaxed"
          >
            Defy gravity. Dominate the game. Experience zero-latency
            hardware forged for the next generation of elite players.
          </motion.p>
        </FloatingItem>

        {/* CTAs */}
        <FloatingItem
          depth={0.08}
          mouseXMotion={mouseXMotion}
          mouseYMotion={mouseYMotion}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          index={23}
          idleAmplitude={2}
          idleSpeed={6000}
          className="relative"
          style={{ position: 'relative' }}
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary CTA */}
            <motion.a
              href="/store"
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,255,136,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-10 py-4 bg-[#00FF88] text-[#0B0F14] font-black text-sm sm:text-base tracking-[0.2em] uppercase overflow-hidden rounded-sm"
              style={{
                clipPath: 'polygon(6% 0, 100% 0, 100% 75%, 94% 100%, 0 100%, 0 25%)',
              }}
            >
              <div className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-600 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
              <span className="relative z-10 flex items-center gap-3">
                SHOP NOW
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </motion.a>

            {/* Secondary CTA — PERF: removed backdrop-blur-xl */}
            <motion.a
              href="/deals"
              whileHover={{
                scale: 1.04,
                borderColor: 'rgba(0,255,136,0.4)',
              }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-10 py-4 bg-white/[0.03] border border-white/10 text-white/70 font-semibold text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-300 hover:text-[#00FF88] hover:bg-white/[0.06]"
            >
              <span className="relative z-10">FLASH DEALS</span>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#00FF88] to-[#00E0FF] group-hover:w-full transition-all duration-500 ease-out" />
            </motion.a>
          </motion.div>
        </FloatingItem>

        {/* Glass stats bar */}
        {/* Glass stats bar — PERF: removed backdrop-blur-md */}
        <FloatingItem
          depth={0.05}
          mouseXMotion={mouseXMotion}
          mouseYMotion={mouseYMotion}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          index={24}
          idleAmplitude={2}
          idleSpeed={7000}
          className="relative"
          style={{ position: 'relative' }}
        >
          <motion.div
            variants={fadeUp}
            className="mt-14 mx-auto max-w-xl"
          >
            <div className="flex items-center justify-center gap-0 rounded-full border border-white/[0.06] bg-white/[0.02] py-3 px-4 sm:px-8">
              {[
                { value: '500K+', label: 'Gamers' },
                { value: '<1ms', label: 'Latency' },
                { value: '4.9\u2605', label: 'Rating' },
                { value: '24/7', label: 'Support' },
              ].map((stat, i, arr) => (
                <React.Fragment key={stat.label}>
                  <div className="flex-1 text-center px-2">
                    <div className="text-sm sm:text-lg font-bold text-white/80 tracking-tight leading-none">
                      {stat.value}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.15em] uppercase mt-1.5">
                      {stat.label}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-[1px] h-8 bg-white/[0.06] shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </FloatingItem>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2.5, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 z-10"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase font-medium">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#00FF88]/0 via-[#00FF88]/30 to-[#00FF88]/0" />
      </motion.div>

      {/* ── CLICK RIPPLES ── */}
      <AnimatePresence>
        {ripples.map((r) => (
          <RippleBurst key={r.id} x={r.x} y={r.y} onDone={() => removeRipple(r.id)} />
        ))}
      </AnimatePresence>
    </section>
  );
};

export default HeroAntiGravity;
