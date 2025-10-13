import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to share an entity
export const shareEntity = createAsyncThunk(
  'shares/shareEntity',
  async (shareData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(shareData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to share entity');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get shares count for an entity
export const fetchSharesCount = createAsyncThunk(
  'shares/fetchSharesCount',
  async ({ entityType, entityId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shares/${entityType}/${entityId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch shares count');
      }

      return { entityType, entityId, count: data.count };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const shareSlice = createSlice({
  name: 'shares',
  initialState: {
    sharesCount: {}, // Map of entityKey to shares count
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
      // Share entity
      .addCase(shareEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareEntity.fulfilled, (state) => {
        state.loading = false;
        // We don't need to store the share itself, just update counts when needed
      })
      .addCase(shareEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch shares count
      .addCase(fetchSharesCount.fulfilled, (state, action) => {
        const { entityType, entityId, count } = action.payload;
        const entityKey = `${entityType}:${entityId}`;
        state.sharesCount[entityKey] = count;
      });
  },
});

export const { clearError } = shareSlice.actions;
export default shareSlice.reducer;