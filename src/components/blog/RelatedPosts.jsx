import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getRelatedPosts } from '../../utils/relatedPostsLogic';

const categoryColors = {
  Hardware: { bg: 'bg-[#00FF88]/10', text: 'text-[#00FF88]', border: 'border-[#00FF88]/20' },
  Esports: { bg: 'bg-[#BD00FF]/10', text: 'text-[#BD00FF]', border: 'border-[#BD00FF]/20' },
  Guides: { bg: 'bg-[#00E0FF]/10', text: 'text-[#00E0FF]', border: 'border-[#00E0FF]/20' },
  Industry: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
};
const defaultColor = { bg: 'bg-white/10', text: 'text-white/60', border: 'border-white/10' };

const RelatedPosts = ({ currentPost, allPosts }) => {
  const navigate = useNavigate();
  const related = getRelatedPosts(currentPost, allPosts, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-8 bg-gradient-to-r from-[#BD00FF] to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BD00FF]">
            Related
          </span>
        </div>
        <h3 className="text-2xl font-black text-white mb-8">You Might Also Like</h3>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {related.map((post, idx) => {
          const cat = categoryColors[post.category] || defaultColor;
          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
              className="group relative rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md overflow-hidden cursor-pointer transition-shadow hover:shadow-xl hover:shadow-black/20"
            >
              {/* Sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />

              <div className="relative h-40 overflow-hidden">
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
              </div>

              <div className="p-5">
                <h4 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-[#00FF88] transition-colors">
                  {post.title}
                </h4>
                <p className="text-white/25 text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/15 text-[11px]">{post.readTime}</span>
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <ArrowUpRight size={10} className="text-white/50" />
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedPosts;
