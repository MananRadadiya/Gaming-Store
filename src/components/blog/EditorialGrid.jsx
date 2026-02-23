import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowUpRight } from 'lucide-react';

const categoryColors = {
  Hardware: { bg: 'bg-[#00FF88]/10', text: 'text-[#00FF88]', border: 'border-[#00FF88]/20' },
  Esports: { bg: 'bg-[#BD00FF]/10', text: 'text-[#BD00FF]', border: 'border-[#BD00FF]/20' },
  Guides: { bg: 'bg-[#00E0FF]/10', text: 'text-[#00E0FF]', border: 'border-[#00E0FF]/20' },
  Industry: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Setup Builds': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  'Performance Tips': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};
const defaultColor = { bg: 'bg-white/10', text: 'text-white/60', border: 'border-white/10' };

const BlogCard = ({ blog, index, featured = false }) => {
  const cat = categoryColors[blog.category] || defaultColor;

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative md:col-span-2 md:row-span-2 rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden cursor-pointer"
      >
        {/* Image */}
        <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/60 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${cat.bg} ${cat.text} ${cat.border} border mb-3`}>
            {blog.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-[#00FF88] transition-colors">
            {blog.title}
          </h2>
          <p className="text-white/35 text-sm leading-relaxed mb-4 max-w-lg line-clamp-2">
            {blog.excerpt}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/25 text-xs">
              <User size={11} />
              <span>{blog.author || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/25 text-xs">
              <Clock size={11} />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-2">
          <ArrowUpRight size={14} className="text-white/60" />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden cursor-pointer transition-shadow hover:shadow-xl hover:shadow-black/20"
    >
      {/* Shine */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] to-transparent" />

        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${cat.bg} ${cat.text} ${cat.border} border`}>
          {blog.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#00FF88] transition-colors">
          {blog.title}
        </h3>
        <p className="text-white/30 text-xs leading-relaxed line-clamp-2 mb-4">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/20 text-[11px]">
              <User size={10} />
              <span>{blog.author || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/20 text-[11px]">
              <Clock size={10} />
              <span>{blog.readTime}</span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <ArrowUpRight size={11} className="text-white/50" />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const EditorialGrid = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#00E0FF] to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00E0FF]">Latest Articles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Editorial</h2>
        </motion.div>

        {/* Grid — first item featured large, rest normal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
          <BlogCard blog={featured} index={0} featured />
          {rest.map((b, i) => (
            <BlogCard key={b.id} blog={b} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialGrid;
