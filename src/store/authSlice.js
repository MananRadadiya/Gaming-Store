import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDbData } from '../services/api';

// ---------- Async Thunks ----------

/** Login: verify email+password against db.json users */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const db = await getDbData();
      const users = Array.isArray(db.users) ? db.users : [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return rejectWithValue('Invalid email or password');
      }

      // Simulate a JWT token
      const token = btoa(
        JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 })
      );

      // Never store raw password in Redux / localStorage
      const { password: _, ...safeUser } = user;

      return { user: safeUser, token };
    } catch (err) {
      return rejectWithValue('Failed to authenticate. Please try again.');
    }
  }
);

/** Fetch all users (admin only) */
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const db = await getDbData();
      const users = Array.isArray(db.users) ? db.users : [];
      // Strip passwords before storing
      return users.map(({ password, ...rest }) => rest);
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
