import React from 'react';
import { motion } from 'framer-motion';
import { Hero, ProductGrid, Footer, WhyChooseNexus, StatsSection, TestimonialsSection, CategoriesSection, FlashSaleSection } from '../components';

const HomePage = () => {
  return (
    <div className="bg-nexus-darker min-h-screen text-white">
      <Hero />
      
      
      <CategoriesSection />
      <StatsSection />
      <WhyChooseNexus />
      <TestimonialsSection />
      <FlashSaleSection />

      {/* Featured Products */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-nexus-accent/10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent"
        >
          Featured Products
        </motion.h2>
        <ProductGrid />
      </section> */}

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-nexus-accent/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Setup?</h2>
          <p className="text-white/60 mb-8">Browse our complete collection of gaming hardware and accessories</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/store"
              className="px-8 py-3 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-xl hover:shadow-lg transition"
            >
              Shop All Products
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/blog"
              className="px-8 py-3 border-2 border-nexus-accent text-nexus-accent font-bold rounded-xl hover:bg-nexus-accent/10 transition"
            >
              Read Gaming Tips
            </motion.a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
