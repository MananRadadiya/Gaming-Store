import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// ---------- Async Thunks ----------

/** Login: verify email+password against JSON Server */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data: users } = await axios.get(
        `${API_URL}/users?email=${email}&password=${password}`
      );

      if (users.length === 0) {
        return rejectWithValue('Invalid email or password');
      }

      const user = users[0];

      // Simulate a JWT token
      const token = btoa(
        JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 })
      );

      // Never store raw password in Redux / localStorage
      const { password: _, ...safeUser } = user;

      return { user: safeUser, token };
    } catch (err) {
      return rejectWithValue('Server error — make sure JSON Server is running on port 3001');
    }
  }
);

/** Fetch all users (admin only) */
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/users`);
      // Strip passwords before storing
      return data.map(({ password, ...rest }) => rest);
    } catch (err) {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

// ---------- Persisted state ----------

const persistedUser = JSON.parse(localStorage.getItem('nexus_user'));
const persistedToken = localStorage.getItem('nexus_token');

const initialState = {
  user: persistedUser || null,
  token: persistedToken || null,
  isAuthenticated: !!persistedToken,
  loading: false,
  error: null,
  users: [],       // admin: list of all users
  usersLoading: false,
};

// ---------- Slice ----------

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('nexus_user');
      localStorage.removeItem('nexus_token');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- loginUser ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('nexus_user', JSON.stringify(action.payload.user));
        localStorage.setItem('nexus_token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- fetchUsers ---
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.usersLoading = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
