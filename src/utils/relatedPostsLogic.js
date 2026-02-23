/**
 * Related Posts Algorithm
 * Scores posts by tag overlap, category match, and recency.
 * Returns the top N related posts excluding the current one.
 */

export const getRelatedPosts = (currentPost, allPosts, count = 3) => {
  if (!currentPost || !allPosts || allPosts.length === 0) return [];

  const currentTags = new Set((currentPost.tags || []).map((t) => t.toLowerCase()));
  const currentCategory = (currentPost.category || '').toLowerCase();

  const scored = allPosts
    .filter((p) => p.id !== currentPost.id)
    .map((post) => {
      let score = 0;

      // Tag overlap — 3 points per matching tag
      const postTags = (post.tags || []).map((t) => t.toLowerCase());
      postTags.forEach((tag) => {
        if (currentTags.has(tag)) score += 3;
      });

      // Category match — 5 points
      if ((post.category || '').toLowerCase() === currentCategory) {
        score += 5;
      }

      // Same author bonus — 2 points
      if (post.authorId === currentPost.authorId) {
        score += 2;
      }

      // Recency bonus — up to 2 points for posts from last 30 days
      const daysDiff = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 7) score += 2;
      else if (daysDiff <= 30) score += 1;

      // Popularity bonus — fractional
      score += Math.min((post.likes || 0) / 500, 1);

      return { ...post, _relevanceScore: score };
    })
    .filter((p) => p._relevanceScore > 0)
    .sort((a, b) => b._relevanceScore - a._relevanceScore)
    .slice(0, count);

  return scored;
};

/**
 * Calculate estimated reading time from markdown content
 */
export const calculateReadingTime = (content) => {
  if (!content) return '1 min';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 225));
  return `${minutes} min`;
};

/**
 * Extract all unique tags from posts
 */
export const extractAllTags = (posts) => {
  const tagSet = new Set();
  posts.forEach((p) => {
    (p.tags || []).forEach((t) => tagSet.add(t));
  });
  return Array.from(tagSet).sort();
};
