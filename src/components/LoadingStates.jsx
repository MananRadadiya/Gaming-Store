import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-nexus-gray/30 rounded-xl h-96"
        />
      ))}
    </div>
  );
};

export const EmptyState = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="flex justify-center mb-4"
      >
        {Icon && <Icon size={48} className="text-nexus-accent/50" />}
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-white/60">{description}</p>
    </motion.div>
  );
};

export const OutOfStock = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-sm"
    >
      <span className="text-white font-bold text-xl">Out of Stock</span>
    </motion.div>
  );
};
