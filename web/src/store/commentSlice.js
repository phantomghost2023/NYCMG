import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to create a comment
export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(commentData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create comment');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to fetch comments for an entity
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ entityType, entityId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${entityType}/${entityId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch comments');
      }

      return { entityType, entityId, data };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to update a comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update comment');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete comment');
      }
      
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: {}, // Map of entityId to comments array
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
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        // Add comment to the appropriate entity's comments array
        const entityId = action.payload.track_id || action.payload.artist_id || action.payload.album_id;
        if (entityId) {
          if (!state.comments[entityId]) {
            state.comments[entityId] = [];
          }
          state.comments[entityId].unshift(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { entityId, data } = action.payload;
        state.comments[entityId] = data.data;
      })
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        // Update comment in all relevant entity comment arrays
        for (const entityId in state.comments) {
          const index = state.comments[entityId].findIndex(c => c.id === action.payload.id);
          if (index !== -1) {
            state.comments[entityId][index] = action.payload;
          }
        }
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        // Remove comment from all entity comment arrays
        for (const entityId in state.comments) {
          state.comments[entityId] = state.comments[entityId].filter(c => c.id !== commentId);
        }
      });
  },
});

export const { clearError } = commentSlice.actions;
export default commentSlice.reducer;