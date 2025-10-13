import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to like a track
export const likeTrack = createAsyncThunk(
  'like/likeTrack',
  async (trackId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ trackId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to like track');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to unlike a track
export const unlikeTrack = createAsyncThunk(
  'like/unlikeTrack',
  async (trackId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/like/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to unlike track');
      }

      return trackId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get like status
export const getLikeStatus = createAsyncThunk(
  'like/getLikeStatus',
  async (trackId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/like/status/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get like status');
      }

      return { trackId, isLiked: data.isLiked };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get likes count
export const getLikesCount = createAsyncThunk(
  'like/getLikesCount',
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/like/count/${trackId}`);

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get likes count');
      }

      return { trackId, count: data.count };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const likeSlice = createSlice({
  name: 'like',
  initialState: {
    liked: {}, // Map of trackId to like status
    likesCount: {}, // Map of trackId to likes count
    loading: false,
    error: null,
  },
  reducers: {
    clearLikeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Like track
      .addCase(likeTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.liked[action.payload.trackId] = true;
      })
      .addCase(likeTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unlike track
      .addCase(unlikeTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlikeTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.liked[action.payload] = false;
      })
      .addCase(unlikeTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get like status
      .addCase(getLikeStatus.fulfilled, (state, action) => {
        const { trackId, isLiked } = action.payload;
        state.liked[trackId] = isLiked;
      })
      .addCase(getLikeStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get likes count
      .addCase(getLikesCount.fulfilled, (state, action) => {
        const { trackId, count } = action.payload;
        state.likesCount[trackId] = count;
      })
      .addCase(getLikesCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearLikeError } = likeSlice.actions;
export default likeSlice.reducer;