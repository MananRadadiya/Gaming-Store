import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import {
  Hero,
  Footer,
  WhyChooseNexus,
  StatsSection,
  TestimonialsSection,
  CategoriesSection,
  FlashSaleSection,
  FeaturedShowcase,
  VisualHighlight,
  BuiltForChampions,
  Newsletter,
  HeroAntiGravity,
} from '../components';

const HomePage = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-white">
      {/* ── Hero ── */}
      <HeroAntiGravity />

      {/* ── Categories ── */}
      <CategoriesSection />

      {/* ── Featured Product Showcase (horizontal scroll) ── */}
      <FeaturedShowcase />

      {/* ── Stats / Social Proof ── */}
      <StatsSection />

      {/* ── Visual Highlight (parallax split section) ── */}
      <VisualHighlight />

      {/* ── Why Choose NEXUS ── */}
      <WhyChooseNexus />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Built For Champions ── */}
      <BuiltForChampions />

      {/* ── Flash Sale CTA ── */}
      <FlashSaleSection />

      {/* ── Newsletter ── */}
      <Newsletter />

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
