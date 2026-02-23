import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// ─── Async Thunks ───

export const fetchCommunityPosts = createAsyncThunk(
  'community/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/communityPosts?_sort=timestamp&_order=desc`);
      return data;
    } catch (err) {
      return rejectWithValue('Failed to fetch posts');
    }
  }
);

export const fetchCommunityPlayers = createAsyncThunk(
  'community/fetchPlayers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/communityPlayers`);
      return data;
    } catch (err) {
      return rejectWithValue('Failed to fetch players');
    }
  }
);

// ─── Initial State ───

const initialState = {
  posts: [],
  players: [],
  currentPlayer: null,
  following: ['p2', 'p4'], // mock default follows
  loading: false,
  error: null,
};

// ─── Slice ───

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    addPost(state, action) {
      state.posts.unshift(action.payload);
    },

    likePost(state, action) {
      const { postId, playerId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;
      if (post.likedBy.includes(playerId)) {
        post.likedBy = post.likedBy.filter((id) => id !== playerId);
        post.likes -= 1;
      } else {
        post.likedBy.push(playerId);
        post.likes += 1;
      }
    },

    addComment(state, action) {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },

    followPlayer(state, action) {
      const playerId = action.payload;
      if (state.following.includes(playerId)) {
        state.following = state.following.filter((id) => id !== playerId);
        const player = state.players.find((p) => p.id === playerId);
        if (player) player.followers = Math.max(0, player.followers - 1);
      } else {
        state.following.push(playerId);
        const player = state.players.find((p) => p.id === playerId);
        if (player) player.followers += 1;
      }
    },

    setCurrentPlayer(state, action) {
      state.currentPlayer = action.payload;
    },

    clearCurrentPlayer(state) {
      state.currentPlayer = null;
    },

    unlockAchievement(state, action) {
      const { playerId, achievementId } = action.payload;
      const player = state.players.find((p) => p.id === playerId);
      if (player && !player.achievements.includes(achievementId)) {
        player.achievements.push(achievementId);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCommunityPlayers.fulfilled, (state, action) => {
        state.players = action.payload;
      });
  },
});

export const {
  addPost,
  likePost,
  addComment,
  followPlayer,
  setCurrentPlayer,
  clearCurrentPlayer,
  unlockAchievement,
} = communitySlice.actions;

export default communitySlice.reducer;
