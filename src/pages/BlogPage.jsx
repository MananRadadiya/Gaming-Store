import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../components';
import { blogsAPI } from '../services/api';
import { Clock, User, ArrowRight } from 'lucide-react';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await blogsAPI.getAll();
        setBlogs(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="bg-nexus-darker min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Gaming News & Reviews
          </h1>
          <p className="text-white/60 text-lg">
            Stay updated with the latest gaming trends and hardware reviews
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-nexus-gray/30 rounded-xl animate-pulse h-96" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-2xl overflow-hidden border border-nexus-accent/10 hover:border-nexus-accent/40 transition h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-nexus-accent text-nexus-dark px-3 py-1 rounded-lg text-xs font-bold">
                    {blog.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-nexus-accent transition">
                    {blog.title}
                  </h2>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2 flex-1">
                    {blog.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-white/50 mb-4 pt-4 border-t border-nexus-accent/10">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>{blog.author || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-white/60 text-sm">{new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>

                  {/* Read More */}
                  <motion.a
                    whileHover={{ gap: 8 }}
                    href="#"
                    className="inline-flex items-center gap-2 text-nexus-accent hover:text-nexus-cyan transition font-bold mt-4 text-sm"
                  >
                    Read Article <ArrowRight size={16} />
                  </motion.a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
