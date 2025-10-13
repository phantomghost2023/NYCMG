import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to add a comment
export const addComment = createAsyncThunk(
  'comment/addComment',
  async ({ trackId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ trackId, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to add comment');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get comments for a track
export const getComments = createAsyncThunk(
  'comment/getComments',
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comment/${trackId}`);

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get comments');
      }

      return { trackId, comments: data.comments };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to delete comment');
      }

      return commentId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    comments: {}, // Map of trackId to comments array
    loading: false,
    error: null,
  },
  reducers: {
    clearCommentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const { trackId, comment } = action.payload;
        if (!state.comments[trackId]) {
          state.comments[trackId] = [];
        }
        state.comments[trackId].unshift(comment); // Add to beginning
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        const { trackId, comments } = action.payload;
        state.comments[trackId] = comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        const commentId = action.payload;
        // Remove comment from all tracks
        for (const trackId in state.comments) {
          state.comments[trackId] = state.comments[trackId].filter(
            comment => comment.id !== commentId
          );
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;