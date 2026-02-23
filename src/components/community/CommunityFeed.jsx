import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import PostCard from './PostCard';

const CommunityFeed = () => {
  const { posts, players, loading } = useSelector((s) => s.community);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] p-5 animate-pulse"
            style={{ background: 'rgba(15,15,20,0.8)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-white/[0.06]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 bg-white/[0.06] rounded-full" />
                <div className="h-2 w-16 bg-white/[0.04] rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.05] rounded-full" />
              <div className="h-3 w-3/4 bg-white/[0.04] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-neutral-600 text-sm">No posts yet. Be the first to share!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, i) => (
        <PostCard key={post.id} post={post} players={players} index={i} />
      ))}
    </div>
  );
};

export default CommunityFeed;
