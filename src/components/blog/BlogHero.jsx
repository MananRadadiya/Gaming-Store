import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogHero = ({ post }) => {
  const navigate = useNavigate();
  if (!post) return null;

  return (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/70 to-[#0B0F14]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Category badge */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 mb-4"
          >
            {post.category} • Featured
          </motion.span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4 tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 mb-6">
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <User size={12} />
              <span>{post.author || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <Clock size={12} />
              <span>{post.readTime}</span>
            </div>
            <span className="text-white/20 text-xs">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,255,136,0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/blog/${post.slug || post.id}`)}
            className="group px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] flex items-center gap-2"
          >
            Read Article
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogHero;
