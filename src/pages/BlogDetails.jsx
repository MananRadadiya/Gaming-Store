import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  ArrowUp,
} from 'lucide-react';
import { Footer } from '../components';
import ReadingProgressBar from '../components/blog/ReadingProgressBar';
import LikeButton from '../components/blog/LikeButton';
import SaveButton from '../components/blog/SaveButton';
import BlogComments from '../components/blog/BlogComments';
import RelatedPosts from '../components/blog/RelatedPosts';
import { markdownComponents } from '../utils/markdownConfig.jsx';
import {
  fetchPosts,
  selectAllPosts,
  selectBlogLoading,
} from '../store/blogSlice';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectBlogLoading);
  const [post, setPost] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  useEffect(() => {
    if (posts.length > 0) {
      const found = posts.find(
        (p) => p.slug === slug || String(p.id) === slug
      );
      setPost(found || null);
    }
  }, [posts, slug]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Category badge colors
  const catColors = {
    Hardware: 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20',
    Esports: 'bg-[#BD00FF]/10 text-[#BD00FF] border-[#BD00FF]/20',
    Guides: 'bg-[#00E0FF]/10 text-[#00E0FF] border-[#00E0FF]/20',
    Industry: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  // Loading skeleton
  if (loading || !post) {
    return (
      <div className="bg-[#0B0F14] min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-24 rounded bg-white/[0.04]" />
            <div className="h-8 w-3/4 rounded bg-white/[0.04]" />
            <div className="h-64 rounded-2xl bg-white/[0.03]" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-3 rounded bg-white/[0.03]" style={{ width: `${90 - i * 5}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const catClass = catColors[post.category] || 'bg-white/10 text-white/60 border-white/10';

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white">
      <ReadingProgressBar />

      {/* Hero image */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/60 to-[#0B0F14]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14]/30 to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/blog')}
          className="absolute top-24 left-4 sm:left-8 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/[0.08] text-white/50 hover:text-white hover:bg-black/50 transition-all backdrop-blur-md text-xs"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </motion.button>
      </div>

      {/* Content */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category + tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${catClass}`}>
                {post.category}
              </span>
              {(post.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/[0.03] text-white/20 border border-white/[0.04]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-white/[0.06]">
              {/* Author */}
              <Link
                to={`/author/${post.authorId}`}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00E0FF] flex items-center justify-center text-xs font-bold text-[#050505]">
                  {(post.author || 'A').charAt(0)}
                </div>
                <span className="text-sm font-medium group-hover:text-[#00FF88] transition-colors">
                  {post.author}
                </span>
              </Link>

              <div className="flex items-center gap-1.5 text-white/25 text-xs">
                <Calendar size={12} />
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-white/25 text-xs">
                <Clock size={12} />
                <span>{post.readTime} read</span>
              </div>

              <div className="flex-1" />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <LikeButton postId={post.id} initialCount={post.likes || 0} />
                <SaveButton postId={post.id} showLabel />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/50 hover:border-white/[0.10] transition-all text-xs"
                >
                  {copied ? <Check size={14} className="text-[#00FF88]" /> : <Share2 size={14} />}
                  {copied ? 'Copied!' : 'Share'}
                </motion.button>
              </div>
            </div>

            {/* Markdown content */}
            <article className="prose-nexus max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {post.content || '*No content available.*'}
              </ReactMarkdown>
            </article>

            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <LikeButton postId={post.id} initialCount={post.likes || 0} size="lg" />
                <SaveButton postId={post.id} size="lg" showLabel />
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/50 transition-all text-sm"
              >
                {copied ? <Check size={14} className="text-[#00FF88]" /> : <Share2 size={14} />}
                {copied ? 'Link copied!' : 'Copy link'}
              </motion.button>
            </div>

            {/* Comments */}
            <BlogComments postId={post.id} />

            {/* Related posts */}
            <RelatedPosts currentPost={post} allPosts={posts} />
          </motion.div>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl bg-[#0d1117]/90 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-[#00FF88] hover:border-[#00FF88]/20 transition-all shadow-xl shadow-black/30 backdrop-blur-md"
        >
          <ArrowUp size={16} />
        </motion.button>
      )}
    </div>
  );
};

export default BlogDetails;
