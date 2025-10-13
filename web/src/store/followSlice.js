import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to follow a user
export const followUser = createAsyncThunk(
  'follows/followUser',
  async (followingId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/follows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ followingId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to follow user');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to unfollow a user
export const unfollowUser = createAsyncThunk(
  'follows/unfollowUser',
  async (followingId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/follows/${followingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to unfollow user');
      }
      
      return followingId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get followers
export const fetchFollowers = createAsyncThunk(
  'follows/fetchFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/follows/${userId}/followers`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch followers');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get following
export const fetchFollowing = createAsyncThunk(
  'follows/fetchFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/follows/${userId}/following`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch following');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to check if following a user
export const checkFollowing = createAsyncThunk(
  'follows/checkFollowing',
  async (followingId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/follows/following/${followingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to check following status');
      }

      return { followingId, following: data.following };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const followSlice = createSlice({
  name: 'follows',
  initialState: {
    followers: [],
    following: [],
    followingStatus: {}, // Map of userId to following status
    loading: false,
    error: null,
    followersCount: 0,
    followingCount: 0
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFollowingStatus: (state, action) => {
      const { followingId, following } = action.payload;
      state.followingStatus[followingId] = following;
    }
  },
  extraReducers: (builder) => {
    builder
      // Follow user
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update following status
        state.followingStatus[action.payload.following_id] = true;
        // Increment following count
        state.followingCount += 1;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const followingId = action.payload;
        // Update following status
        state.followingStatus[followingId] = false;
        // Decrement following count
        state.followingCount = Math.max(0, state.followingCount - 1);
      })
      // Fetch followers
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload.data;
        state.followersCount = action.payload.pagination.totalCount;
      })
      // Fetch following
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload.data;
        state.followingCount = action.payload.pagination.totalCount;
      })
      // Check following
      .addCase(checkFollowing.fulfilled, (state, action) => {
        const { followingId, following } = action.payload;
        state.followingStatus[followingId] = following;
      });
  },
});

export const { clearError, setFollowingStatus } = followSlice.actions;
export default followSlice.reducer;