import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Footer } from '../components';
import HeroAntiGravity from '../components/HeroAntiGravity';

/* ── PERF: Lazy-load all below-the-fold sections ──
   These components are not visible on initial viewport.
   Dynamic imports split them into separate chunks so the
   browser only downloads them when needed, drastically
   reducing initial JS parse/eval time. */
const CategoriesSection = lazy(() => import('../components/CategoriesSection'));
const FeaturedShowcase = lazy(() => import('../components/FeaturedShowcase'));
const StatsSection = lazy(() => import('../components/StatsSection'));
const VisualHighlight = lazy(() => import('../components/VisualHighlight'));
const WhyChooseNexus = lazy(() => import('../components/WhyChooseNexus'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const BuiltForChampions = lazy(() => import('../components/BuiltForChampions'));
const FlashSaleSection = lazy(() => import('../components/FlashSaleSection'));
const Newsletter = lazy(() => import('../components/Newsletter'));

/* PERF: Lightweight suspense fallback — no layout shift, matches bg */
const SectionFallback = () => (
  <div className="w-full py-24 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-[#00FF88]/30 border-t-[#00FF88] rounded-full animate-spin" />
  </div>
);

const HomePage = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-white">
      {/* ── Hero — loaded eagerly (above the fold) ── */}
      <HeroAntiGravity />

      {/* ── All below-fold sections wrapped in Suspense ── */}
      <Suspense fallback={<SectionFallback />}>
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FeaturedShowcase />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <VisualHighlight />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <WhyChooseNexus />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <BuiltForChampions />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FlashSaleSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Newsletter />
      </Suspense>

      {/* ── Final CTA ── */}
      <section className="relative py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-[#00FF88]/[0.05] via-transparent to-transparent rounded-full blur-[80px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-5">
              Ready to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00E0FF]">
                Level Up?
              </span>
            </h2>
            <p className="text-white/30 text-lg max-w-md mx-auto mb-10">
              Browse our complete collection of pro-grade gaming hardware and accessories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/store">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] font-bold text-sm uppercase tracking-wider inline-flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,136,0.25)] transition-shadow duration-300"
                >
                  Shop All Products
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/blog">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl border border-white/[0.08] text-white/50 font-bold text-sm uppercase tracking-wider inline-flex items-center gap-2 hover:text-white hover:border-white/20 transition-all duration-300"
                >
                  <BookOpen size={16} />
                  Read Gaming Tips
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
};

export default HomePage;
