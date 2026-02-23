import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, User, ArrowUpRight, Heart, TrendingUp } from 'lucide-react';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';

const categoryColors = {
  Hardware: { bg: 'bg-[#00FF88]/10', text: 'text-[#00FF88]', border: 'border-[#00FF88]/20', glow: 'rgba(0,255,136,0.08)' },
  Esports: { bg: 'bg-[#BD00FF]/10', text: 'text-[#BD00FF]', border: 'border-[#BD00FF]/20', glow: 'rgba(189,0,255,0.08)' },
  Guides: { bg: 'bg-[#00E0FF]/10', text: 'text-[#00E0FF]', border: 'border-[#00E0FF]/20', glow: 'rgba(0,224,255,0.08)' },
  Industry: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'rgba(245,158,11,0.08)' },
  'Setup Builds': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', glow: 'rgba(236,72,153,0.08)' },
  'Performance Tips': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'rgba(16,185,129,0.08)' },
};
const defaultColor = { bg: 'bg-white/10', text: 'text-white/60', border: 'border-white/10', glow: 'rgba(255,255,255,0.05)' };

const BlogCard = ({ post, index = 0, featured = false }) => {
  const navigate = useNavigate();
  const cat = categoryColors[post.category] || defaultColor;

  const handleClick = () => {
    navigate(`/blog/${post.slug || post.id}`);
  };

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative md:col-span-2 md:row-span-2 rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative h-64 md:h-full min-h-[320px] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/60 to-transparent" />
        </div>

        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
            <TrendingUp size={10} className="text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Trending</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span
            className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${cat.bg} ${cat.text} ${cat.border} border mb-3`}
          >
            {post.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-[#00FF88] transition-colors">
            {post.title}
          </h2>
          <p className="text-white/35 text-sm leading-relaxed mb-4 max-w-lg line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/25 text-xs">
              <User size={11} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/25 text-xs">
              <Clock size={11} />
              <span>{post.readTime}</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <LikeButton postId={post.id} initialCount={post.likes || 0} size="sm" />
              <SaveButton postId={post.id} size="sm" />
            </div>
          </div>
        </div>

        <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
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
      onClick={handleClick}
    >
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] to-transparent" />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${cat.bg} ${cat.text} ${cat.border} border`}
        >
          {post.category}
        </span>
        {post.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
            <TrendingUp size={9} className="text-amber-400" />
            <span className="text-[9px] font-bold text-amber-400">HOT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#00FF88] transition-colors">
          {post.title}
        </h3>
        <p className="text-white/30 text-xs leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-white/[0.03] text-white/20 border border-white/[0.04]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/20 text-[11px]">
              <User size={10} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/20 text-[11px]">
              <Clock size={10} />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <LikeButton postId={post.id} initialCount={post.likes || 0} size="sm" />
            <SaveButton postId={post.id} size="sm" />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
