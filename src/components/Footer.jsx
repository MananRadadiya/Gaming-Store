import React from 'react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    'Products': ['Mice', 'Keyboards', 'Headsets', 'Monitors', 'Graphics Cards'],
    'Support': ['Contact Us', 'FAQ', 'Shipping Info', 'Returns', 'Warranty'],
    'Company': ['About', 'Blog', 'Careers', 'Press', 'Sustainability'],
  };

  return (
    <footer className="bg-nexus-darker border-t border-nexus-accent/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-nexus-accent to-nexus-cyan rounded-lg" />
              <span className="font-bold text-xl bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
                NEXUS
              </span>
            </div>
            <p className="text-white/60 text-sm">
              Elite gaming hardware for champions. Experience the future of gaming.
            </p>
          </motion.div>

          {/* Sections */}
          {Object.entries(footerSections).map(([title, items], idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="font-bold text-white mb-4">{title}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/60 hover:text-nexus-accent transition text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-nexus-accent/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <p>&copy; {currentYear} NEXUS Gaming. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-nexus-accent transition">Privacy</a>
            <a href="#" className="hover:text-nexus-accent transition">Terms</a>
            <a href="#" className="hover:text-nexus-accent transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
