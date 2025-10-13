import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to follow an artist
export const followArtist = createAsyncThunk(
  'follow/followArtist',
  async (artistId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ artistId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to follow artist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to unfollow an artist
export const unfollowArtist = createAsyncThunk(
  'follow/unfollowArtist',
  async (artistId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/follow/${artistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to unfollow artist');
      }

      return artistId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get following status
export const getFollowingStatus = createAsyncThunk(
  'follow/getFollowingStatus',
  async (artistId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/follow/status/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get following status');
      }

      return { artistId, isFollowing: data.isFollowing };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get followers count
export const getFollowersCount = createAsyncThunk(
  'follow/getFollowersCount',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/follow/count/${artistId}`);

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get followers count');
      }

      return { artistId, count: data.count };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    following: {}, // Map of artistId to following status
    followersCount: {}, // Map of artistId to followers count
    loading: false,
    error: null,
  },
  reducers: {
    clearFollowError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow artist
      .addCase(followArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.following[action.payload.artistId] = true;
      })
      .addCase(followArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unfollow artist
      .addCase(unfollowArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.following[action.payload] = false;
      })
      .addCase(unfollowArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get following status
      .addCase(getFollowingStatus.fulfilled, (state, action) => {
        const { artistId, isFollowing } = action.payload;
        state.following[artistId] = isFollowing;
      })
      .addCase(getFollowingStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get followers count
      .addCase(getFollowersCount.fulfilled, (state, action) => {
        const { artistId, count } = action.payload;
        state.followersCount[artistId] = count;
      })
      .addCase(getFollowersCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFollowError } = followSlice.actions;
export default followSlice.reducer;