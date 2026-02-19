import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight, Gamepad2, Zap, Monitor, Headphones } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alex Gamer',
    role: 'Pro Esports Player',
    text: 'NEXUS has the best selection of genuine gaming gear. My setup is finally complete and the precision is unmatched.',
    rating: 5,
    icon: Gamepad2,
    color: '#00E0FF',
    platform: 'Overwatch League',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Tech Reviewer',
    text: 'Fast shipping, authentic products, and amazing customer service. The unboxing felt like opening a treasure chest.',
    rating: 5,
    icon: Monitor,
    color: '#BD00FF',
    platform: 'YouTube Tech',
  },
  {
    id: 3,
    name: 'Mike Torres',
    role: 'Streamer',
    text: 'Best prices on the market. Every product is top quality. I recommend NEXUS to my entire chat every single stream.',
    rating: 5,
    icon: Zap,
    color: '#00FF88',
    platform: 'Twitch Partner',
  },
  {
    id: 4,
    name: 'Elena V.',
    role: 'Game Developer',
    text: 'I need reliable hardware for rendering and playtesting. NEXUS delivers consistent quality that I can trust for my work.',
    rating: 5,
    icon: Monitor,
    color: '#00E0FF',
    platform: 'Unity Dev',
  },
  {
    id: 5,
    name: 'Marcus J.',
    role: 'Audio Engineer',
    text: 'The soundstage on the headsets I bought here is incredible. Crisp highs and deep lows. Pure auditory bliss.',
    rating: 5,
    icon: Headphones,
    color: '#BD00FF',
    platform: 'Spotify Verified',
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Casual Competitor',
    text: 'Finally a store that treats casuals like pros. Great guides helped me pick the perfect mechanical keyboard.',
    rating: 5,
    icon: Gamepad2,
    color: '#00FF88',
    platform: 'Steam Top 1%',
  },
];

/* ── Single review card — zero blur, opacity-only hover ── */
const ReviewCard = React.memo(({ t }) => {
  const Icon = t.icon;
  return (
    <div className="h-full p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] relative overflow-hidden group hover:border-white/[0.12] transition-colors duration-500">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${t.color}, transparent 70%)` }}
      />
      <Quote className="absolute top-6 right-6 text-white/[0.03] w-9 h-9 rotate-180" />

      <div className="flex flex-col h-full relative z-10">
        <div className="flex gap-0.5 mb-5">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} size={13} className="fill-yellow-500 text-yellow-500" />
          ))}
        </div>

        <p className="text-white/40 text-[15px] leading-relaxed mb-8 font-medium line-clamp-4">
          &ldquo;{t.text}&rdquo;
        </p>

        <div className="mt-auto pt-5 border-t border-white/[0.04] flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${t.color}15`, border: `1px solid ${t.color}25` }}
          >
            <Icon size={18} style={{ color: t.color }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-white text-sm truncate">{t.name}</h4>
              <CheckCircle2 size={12} style={{ color: t.color }} />
            </div>
            <p className="text-[11px] text-white/25 font-medium uppercase tracking-wider truncate">
              {t.role} · {t.platform}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
ReviewCard.displayName = 'ReviewCard';

/* ── Main section ── */
const TestimonialsSection = () => {
  const TOTAL = testimonials.length;
  const AUTO_DELAY = 4000;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((p) => (p + 1) % TOTAL), AUTO_DELAY);
    return () => clearInterval(id);
  }, [paused, TOTAL]);

  const go = useCallback((d) => setIdx((p) => (p + d + TOTAL) % TOTAL), [TOTAL]);

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-[#00E0FF]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#BD00FF]/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#00E0FF] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Star size={12} className="fill-[#00E0FF]" />
              Community Trust
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Loved by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#BD00FF]">Gamers</span>
            </h2>
          </motion.div>

          <div className="flex gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                onClick={() => go(d)}
                className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:border-white/15 transition-all duration-300"
              >
                {d === -1 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 z-20 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 z-20 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />

          <motion.div
            className="flex"
            animate={{ x: `calc(-${idx} * (100% / 3))` }}
            transition={{ type: 'spring', stiffness: 180, damping: 30 }}
            style={{ willChange: 'transform' }}
          >
            {[...testimonials, ...testimonials.slice(0, 3)].map((t, i) => (
              <div key={`${t.id}-${i}`} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-2">
                <ReviewCard t={t} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === idx % TOTAL ? 'w-8 bg-[#00E0FF]' : 'w-2 bg-white/10 hover:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;