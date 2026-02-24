import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const FlashSaleSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-nexus-accent/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-nexus-accent/30"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-purple/20 via-nexus-cyan/20 to-nexus-accent/20" />
        <div className="relative p-12 md:p-20 text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Flame className="text-nexus-accent" size={40} />
          </motion.div>
          <h3 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Flash Sale - Up to 50% Off
          </h3>
          <p className="text-white/70 mb-8 text-lg">
            Limited time offer on selected gaming gear. Don't miss out on elite hardware at incredible prices!
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/deals"
            className="inline-block px-8 py-4 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-xl hover:shadow-2xl hover:shadow-nexus-accent/50 transition text-lg"
          >
            Explore Flash Deals
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

/* PERF: React.memo — static promotional content */
export default React.memo(FlashSaleSection);
