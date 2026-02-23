import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api';

// ── Async thunks ──────────────────────────────────────────
export const fetchPosts = createAsyncThunk('blog/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/blogs');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchAuthors = createAsyncThunk('blog/fetchAuthors', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get('/authors');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// ── Helpers ───────────────────────────────────────────────
const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
};

// ── Initial state ─────────────────────────────────────────
const initialState = {
  posts: [],
  authors: [],
  filteredPosts: [],
  selectedPost: null,
  likes: loadFromStorage('nexus_blog_likes', {}),        // { [postId]: true }
  savedPosts: loadFromStorage('nexus_blog_saved', []),    // [postId, ...]
  comments: loadFromStorage('nexus_blog_comments', {}),   // { [postId]: [...] }
  searchQuery: '',
  activeTags: [],
  loading: false,
  error: null,
};

// ── Filter logic ──────────────────────────────────────────
const applyFilters = (state) => {
  let result = [...state.posts];

  // Search
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (p.category || '').toLowerCase().includes(q)
    );
  }

  // Tags
  if (state.activeTags.length > 0) {
    result = result.filter((p) =>
      state.activeTags.some((tag) => (p.tags || []).includes(tag) || p.category === tag)
    );
  }

  state.filteredPosts = result;
};

// ── Slice ─────────────────────────────────────────────────
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      applyFilters(state);
    },

    setActiveTags(state, action) {
      state.activeTags = action.payload;
      applyFilters(state);
    },

    toggleTag(state, action) {
      const tag = action.payload;
      if (state.activeTags.includes(tag)) {
        state.activeTags = state.activeTags.filter((t) => t !== tag);
      } else {
        state.activeTags = [...state.activeTags, tag];
      }
      applyFilters(state);
    },

    clearFilters(state) {
      state.searchQuery = '';
      state.activeTags = [];
      applyFilters(state);
    },

    setSelectedPost(state, action) {
      state.selectedPost = action.payload;
    },

    toggleLike(state, action) {
      const postId = action.payload;
      const key = String(postId);
      if (state.likes[key]) {
        delete state.likes[key];
      } else {
        state.likes[key] = true;
      }
      saveToStorage('nexus_blog_likes', state.likes);
    },

    toggleSave(state, action) {
      const postId = action.payload;
      if (state.savedPosts.includes(postId)) {
        state.savedPosts = state.savedPosts.filter((id) => id !== postId);
      } else {
        state.savedPosts = [...state.savedPosts, postId];
      }
      saveToStorage('nexus_blog_saved', state.savedPosts);
    },

    addComment(state, action) {
      const { postId, comment } = action.payload;
      const key = String(postId);
      if (!state.comments[key]) state.comments[key] = [];
      state.comments[key].unshift({
        id: Date.now().toString(),
        user: comment.user || 'Anonymous',
        avatar: comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user || 'A')}&background=00FF88&color=000&bold=true&size=64`,
        content: comment.content,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        replies: [],
      });
      saveToStorage('nexus_blog_comments', state.comments);
    },

    addReply(state, action) {
      const { postId, commentId, reply } = action.payload;
      const key = String(postId);
      const comments = state.comments[key] || [];
      const comment = comments.find((c) => c.id === commentId);
      if (comment) {
        comment.replies.push({
          id: Date.now().toString(),
          user: reply.user || 'Anonymous',
          avatar: reply.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user || 'A')}&background=00E0FF&color=000&bold=true&size=64`,
          content: reply.content,
          timestamp: new Date().toISOString(),
          likes: 0,
          likedBy: [],
        });
      }
      saveToStorage('nexus_blog_comments', state.comments);
    },

    deleteComment(state, action) {
      const { postId, commentId } = action.payload;
      const key = String(postId);
      if (state.comments[key]) {
        state.comments[key] = state.comments[key].filter((c) => c.id !== commentId);
        // Also remove from replies
        state.comments[key].forEach((c) => {
          c.replies = c.replies.filter((r) => r.id !== commentId);
        });
        saveToStorage('nexus_blog_comments', state.comments);
      }
    },

    likeComment(state, action) {
      const { postId, commentId, userId } = action.payload;
      const key = String(postId);
      const comments = state.comments[key] || [];
      const findAndToggle = (list) => {
        const item = list.find((c) => c.id === commentId);
        if (item) {
          if (item.likedBy?.includes(userId)) {
            item.likedBy = item.likedBy.filter((id) => id !== userId);
            item.likes = Math.max(0, (item.likes || 0) - 1);
          } else {
            item.likedBy = [...(item.likedBy || []), userId];
            item.likes = (item.likes || 0) + 1;
          }
          return true;
        }
        return false;
      };
      if (!findAndToggle(comments)) {
        comments.forEach((c) => findAndToggle(c.replies || []));
      }
      saveToStorage('nexus_blog_comments', state.comments);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        applyFilters(state);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.authors = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setActiveTags,
  toggleTag,
  clearFilters,
  setSelectedPost,
  toggleLike,
  toggleSave,
  addComment,
  addReply,
  deleteComment,
  likeComment,
} = blogSlice.actions;

// ── Selectors ─────────────────────────────────────────────
export const selectAllPosts = (state) => state.blog.posts;
export const selectFilteredPosts = (state) => state.blog.filteredPosts;
export const selectSelectedPost = (state) => state.blog.selectedPost;
export const selectBlogLoading = (state) => state.blog.loading;
export const selectSearchQuery = (state) => state.blog.searchQuery;
export const selectActiveTags = (state) => state.blog.activeTags;
export const selectLikes = (state) => state.blog.likes;
export const selectSavedPosts = (state) => state.blog.savedPosts;
export const selectComments = (state) => state.blog.comments;
export const selectAuthors = (state) => state.blog.authors;
export const selectIsLiked = (postId) => (state) => !!state.blog.likes[String(postId)];
export const selectIsSaved = (postId) => (state) => state.blog.savedPosts.includes(postId);

export default blogSlice.reducer;
