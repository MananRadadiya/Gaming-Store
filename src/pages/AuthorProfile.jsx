import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  FileText,
  Heart,
  Twitter,
  Youtube,
  Twitch,
} from 'lucide-react';
import { Footer } from '../components';
import BlogCard from '../components/blog/BlogCard';
import {
  fetchPosts,
  fetchAuthors,
  selectAllPosts,
  selectAuthors,
  selectLikes,
} from '../store/blogSlice';

// Animated counter
const AnimatedStat = ({ value, label }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = Number(value) || 0;
          const duration = 1200;
          const step = Math.max(1, Math.floor(end / (duration / 16)));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setDisplay(end);
              clearInterval(timer);
            } else {
              setDisplay(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#00FF88] to-[#00E0FF] bg-clip-text text-transparent tabular-nums">
        {display.toLocaleString()}
      </p>
      <p className="text-[11px] text-white/25 uppercase tracking-wider font-bold mt-1">{label}</p>
    </div>
  );
};

const socialIcons = {
  twitter: { icon: Twitter, color: 'hover:text-sky-400', label: 'Twitter' },
  youtube: { icon: Youtube, color: 'hover:text-red-400', label: 'YouTube' },
  twitch: { icon: Twitch, color: 'hover:text-purple-400', label: 'Twitch' },
  linkedin: { icon: ExternalLink, color: 'hover:text-blue-400', label: 'LinkedIn' },
};

const AuthorProfile = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const authors = useSelector(selectAuthors);
  const likes = useSelector(selectLikes);

  useEffect(() => {
    if (posts.length === 0) dispatch(fetchPosts());
    if (authors.length === 0) dispatch(fetchAuthors());
  }, [dispatch, posts.length, authors.length]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [authorId]);

  const author = authors.find((a) => a.id === authorId);
  const authorPosts = posts.filter((p) => p.authorId === authorId);
  const totalLikes = authorPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

  if (!author) {
    return (
      <div className="bg-[#0B0F14] min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/[0.04]" />
              <div className="space-y-3 flex-1">
                <div className="h-6 w-48 rounded bg-white/[0.04]" />
                <div className="h-4 w-32 rounded bg-white/[0.03]" />
                <div className="h-3 w-full max-w-md rounded bg-white/[0.03]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-white/[0.03]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1220] to-[#0B0F14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,255,136,0.06),transparent)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-xs mb-8"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </motion.button>

          {/* Author card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00FF88] to-[#00E0FF] opacity-20 group-hover:opacity-40 blur-md transition-opacity" />
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/[0.08] object-cover"
                />
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                  {author.name}
                </h1>
                <p className="text-sm font-medium text-[#00FF88]/70 mb-3">{author.role}</p>
                <p className="text-sm text-white/35 leading-relaxed mb-4 max-w-xl">
                  {author.bio}
                </p>

                {/* Social links */}
                <div className="flex items-center gap-3">
                  {Object.entries(author.social || {}).map(([platform, handle]) => {
                    const social = socialIcons[platform];
                    if (!social) return null;
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={platform}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        href={`https://${platform}.com/${handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/20 ${social.color} transition-all hover:border-white/[0.12]`}
                        title={social.label}
                      >
                        <Icon size={14} />
                      </motion.a>
                    );
                  })}

                  <div className="ml-2 flex items-center gap-1.5 text-[10px] text-white/15">
                    <Calendar size={10} />
                    Joined {new Date(author.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.04]"
            >
              <AnimatedStat value={authorPosts.length} label="Articles" />
              <AnimatedStat value={totalLikes} label="Total Likes" />
              <AnimatedStat
                value={authorPosts.length > 0 ? Math.round(totalLikes / authorPosts.length) : 0}
                label="Avg. Likes"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-gradient-to-r from-[#00E0FF] to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00E0FF]">
              Published
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText size={20} className="text-white/10" />
            Articles by {author.name}
          </h2>
        </motion.div>

        {authorPosts.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="text-white/[0.06] mx-auto mb-3" />
            <p className="text-sm text-white/20">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {authorPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AuthorProfile;
