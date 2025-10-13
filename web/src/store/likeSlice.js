import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to like an entity
export const likeEntity = createAsyncThunk(
  'likes/likeEntity',
  async (likeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(likeData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to like entity');
      }
      
      return { ...likeData, id: data.id };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to unlike an entity
export const unlikeEntity = createAsyncThunk(
  'likes/unlikeEntity',
  async (likeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/likes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(likeData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to unlike entity');
      }
      
      return likeData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get likes count for an entity
export const fetchLikesCount = createAsyncThunk(
  'likes/fetchLikesCount',
  async ({ entityType, entityId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/likes/${entityType}/${entityId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch likes count');
      }

      return { entityType, entityId, count: data.count };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to check if entity is liked
export const checkLikeStatus = createAsyncThunk(
  'likes/checkLikeStatus',
  async (likeData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/likes/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(likeData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to check like status');
      }
      
      return { ...likeData, liked: data.liked };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    likes: {}, // Map of entityKey to like status
    likesCount: {}, // Map of entityKey to likes count
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Like entity
      .addCase(likeEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeEntity.fulfilled, (state, action) => {
        state.loading = false;
        // Create entity key
        const entityKey = getEntityKey(action.payload);
        state.likes[entityKey] = true;
        // Increment likes count
        state.likesCount[entityKey] = (state.likesCount[entityKey] || 0) + 1;
      })
      .addCase(likeEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unlike entity
      .addCase(unlikeEntity.fulfilled, (state, action) => {
        // Create entity key
        const entityKey = getEntityKey(action.payload);
        state.likes[entityKey] = false;
        // Decrement likes count
        state.likesCount[entityKey] = Math.max(0, (state.likesCount[entityKey] || 0) - 1);
      })
      // Fetch likes count
      .addCase(fetchLikesCount.fulfilled, (state, action) => {
        const { entityType, entityId, count } = action.payload;
        const entityKey = `${entityType}:${entityId}`;
        state.likesCount[entityKey] = count;
      })
      // Check like status
      .addCase(checkLikeStatus.fulfilled, (state, action) => {
        const { liked, ...entityData } = action.payload;
        const entityKey = getEntityKey(entityData);
        state.likes[entityKey] = liked;
      });
  },
});

// Helper function to create entity key
const getEntityKey = (entityData) => {
  if (entityData.track_id) return `track:${entityData.track_id}`;
  if (entityData.artist_id) return `artist:${entityData.artist_id}`;
  if (entityData.album_id) return `album:${entityData.album_id}`;
  if (entityData.comment_id) return `comment:${entityData.comment_id}`;
  return '';
};

export const { clearError } = likeSlice.actions;
export default likeSlice.reducer;