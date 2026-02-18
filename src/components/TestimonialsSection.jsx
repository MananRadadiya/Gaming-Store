import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Alex Gamer',
      role: 'Pro Esports Player',
      text: 'NEXUS has the best selection of genuine gaming gear. My setup is flawless!',
      rating: 5,
      image: '👨‍💻'
    },
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      text: 'Fast shipping, authentic products, and amazing customer service. 10/10 would recommend!',
      rating: 5,
      image: '👩‍💼'
    },
    {
      name: 'Mike Torres',
      role: 'Gaming Enthusiast',
      text: 'Best prices on the market. Every product is top quality. NEXUS for life!',
      rating: 5,
      image: '👨‍🎨'
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-nexus-accent/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
          Loved by Gamers Worldwide
        </h2>
        <p className="text-white/60">Join thousands of satisfied customers who trust NEXUS</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map(({ name, role, text, rating, image }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-b from-nexus-gray/40 to-nexus-dark/40 rounded-2xl border border-nexus-accent/20 p-8 hover:border-nexus-accent/50 transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{image}</div>
              <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-white/60 text-sm">{role}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-4">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-nexus-accent text-nexus-accent" />
              ))}
            </div>
            <p className="text-white/70 leading-relaxed">"{text}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
