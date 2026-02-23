import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ArrowUp, BookOpen } from 'lucide-react';
import { Footer } from '../components';
import BlogHero from '../components/blog/BlogHero';
import BlogCard from '../components/blog/BlogCard';
import BlogSearch from '../components/blog/BlogSearch';
import TagFilter from '../components/blog/TagFilter';
import TrendingSidebar from '../components/blog/TrendingSidebar';
import {
  fetchPosts,
  selectFilteredPosts,
  selectAllPosts,
  selectBlogLoading,
  selectSearchQuery,
  selectActiveTags,
  selectSavedPosts,
} from '../store/blogSlice';
import { extractAllTags } from '../utils/relatedPostsLogic';

const BlogPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const filteredPosts = useSelector(selectFilteredPosts);
  const loading = useSelector(selectBlogLoading);
  const searchQuery = useSelector(selectSearchQuery);
  const activeTags = useSelector(selectActiveTags);
  const savedPosts = useSelector(selectSavedPosts);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeView, setActiveView] = useState('all');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allTags = extractAllTags(posts);
  const featured = posts.find((p) => p.featured) || posts[0];
  const isFiltering = searchQuery.trim() || activeTags.length > 0 || activeView === 'saved';

  const displayPosts =
    activeView === 'saved'
      ? filteredPosts.filter((p) => savedPosts.includes(p.id))
      : filteredPosts;

  const gridPosts = isFiltering ? displayPosts : displayPosts.filter((p) => p.id !== featured?.id);

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white">
      {/* Hero — featured post */}
      {!loading && featured && !isFiltering && <BlogHero post={featured} />}

      {/* Search + Filter section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Top bar: search + view toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <BlogSearch />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveView('all')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                  activeView === 'all'
                    ? 'bg-white/[0.06] text-white/70 border-white/[0.10]'
                    : 'bg-transparent text-white/20 border-white/[0.04] hover:text-white/40'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setActiveView('saved')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  activeView === 'saved'
                    ? 'bg-[#00E0FF]/10 text-[#00E0FF] border-[#00E0FF]/20'
                    : 'bg-transparent text-white/20 border-white/[0.04] hover:text-white/40'
                }`}
              >
                <BookOpen size={12} />
                Reading List
                {savedPosts.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-[#00E0FF]/10 text-[#00E0FF]">
                    {savedPosts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tag filter */}
          <TagFilter tags={allTags} />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-white/[0.03]" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-16 rounded bg-white/[0.04]" />
                  <div className="h-4 w-4/5 rounded bg-white/[0.04]" />
                  <div className="h-3 w-full rounded bg-white/[0.03]" />
                  <div className="h-3 w-2/3 rounded bg-white/[0.03]" />
                  <div className="flex justify-between mt-4">
                    <div className="h-3 w-20 rounded bg-white/[0.03]" />
                    <div className="h-3 w-12 rounded bg-white/[0.03]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              {isFiltering && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                  <p className="text-xs text-white/20">
                    {displayPosts.length} {displayPosts.length === 1 ? 'article' : 'articles'} found
                    {searchQuery && (
                      <span>
                        {' '}for "<span className="text-[#00FF88]">{searchQuery}</span>"
                      </span>
                    )}
                    {activeView === 'saved' && <span> in your reading list</span>}
                  </p>
                </motion.div>
              )}

              {displayPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center"
                >
                  <Newspaper size={40} className="text-white/[0.06] mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white/20 mb-2">No articles found</h3>
                  <p className="text-sm text-white/10">
                    {activeView === 'saved'
                      ? 'Your reading list is empty. Save articles to read later!'
                      : 'Try adjusting your search or filters.'}
                  </p>
                </motion.div>
              ) : (
                <div className="py-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${searchQuery}-${activeTags.join(',')}-${activeView}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {gridPosts.map((post, i) => (
                        <BlogCard key={post.id} post={post} index={i} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-[300px] flex-shrink-0 pt-8">
              <div className="sticky top-28">
                <TrendingSidebar blogs={posts} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] via-[#0d1220] to-[#0B0F14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(0,255,136,0.04),transparent)]" />
        <div className="relative max-w-2xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Newspaper size={28} className="text-[#00FF88]/40 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
              Stay in the Loop
            </h2>
            <p className="text-white/30 text-sm mb-8 max-w-md mx-auto">
              Get the latest gaming news, hardware reviews, and esports updates delivered weekly.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/20 outline-none focus:border-[#00FF88]/30 transition"
              />
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#00FF88] to-[#00E0FF] text-[#050505] flex-shrink-0"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl bg-[#0d1117]/90 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/20 transition-all shadow-xl shadow-black/30 backdrop-blur-md"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;
