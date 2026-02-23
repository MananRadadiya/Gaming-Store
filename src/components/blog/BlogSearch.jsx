import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { setSearchQuery, selectSearchQuery, selectAllPosts } from '../../store/blogSlice';
import { useNavigate } from 'react-router-dom';

const BlogSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useSelector(selectSearchQuery);
  const posts = useSelector(selectAllPosts);
  const [localQuery, setLocalQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [localQuery, dispatch]);

  useEffect(() => {
    if (!localQuery.trim() || !isFocused) {
      setSuggestions([]);
      return;
    }
    const q = localQuery.toLowerCase();
    const matches = posts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5);
    setSuggestions(matches);
  }, [localQuery, posts, isFocused]);

  const handleClear = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
    inputRef.current?.focus();
  };

  const handleSelect = (post) => {
    setIsFocused(false);
    setSuggestions([]);
    navigate(`/blog/${post.slug || post.id}`);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-300 ${
          isFocused
            ? 'border-[#00FF88]/40 bg-white/[0.04] shadow-[0_0_20px_rgba(0,255,136,0.08)]'
            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10]'
        }`}
      >
        <Search
          size={16}
          className={`ml-4 flex-shrink-0 transition-colors ${
            isFocused ? 'text-[#00FF88]' : 'text-white/20'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search articles, tags, authors..."
          className="flex-1 px-3 py-3 bg-transparent text-sm text-white placeholder-white/20 outline-none"
        />
        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="mr-3 p-1 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {suggestions.length > 0 && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/[0.08] bg-[#0d1117]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {suggestions.map((post, idx) => (
              <motion.button
                key={post.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => handleSelect(post)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors group"
              >
                <img
                  src={post.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/[0.06]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                    {post.title}
                  </p>
                  <p className="text-[11px] text-white/25">
                    {post.author} · {post.category}
                  </p>
                </div>
                <ArrowUpRight
                  size={12}
                  className="text-white/10 group-hover:text-[#00FF88] transition-colors flex-shrink-0"
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogSearch;
