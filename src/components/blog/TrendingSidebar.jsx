import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const TrendingSidebar = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  const trending = blogs.slice(0, 5);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="hidden lg:block sticky top-28"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={14} className="text-[#00FF88]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trending Now</h3>
        </div>

        {/* List */}
        <div className="space-y-1">
          {trending.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative flex gap-4 py-3 px-3 -mx-3 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-all"
            >
              {/* Neon left border */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 group-hover:h-8 rounded-full bg-gradient-to-b from-[#00FF88] to-[#00E0FF] transition-all duration-300" />

              {/* Number */}
              <span className="flex-shrink-0 text-2xl font-black text-white/[0.06] group-hover:text-[#00FF88]/20 tabular-nums transition-colors w-8">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white/60 group-hover:text-white leading-snug line-clamp-2 transition-colors mb-1">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-white/20">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                <ArrowUpRight size={12} className="text-[#00FF88]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter mini */}
        <div className="mt-6 pt-6 border-t border-white/[0.05]">
          <p className="text-[11px] font-medium text-white/40 mb-3">Get weekly updates straight to your inbox.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-white/20 outline-none focus:border-[#00FF88]/30 transition"
            />
            <button className="px-3 py-2 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-[10px] font-bold uppercase hover:bg-[#00FF88]/20 transition">
              Go
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default TrendingSidebar;
