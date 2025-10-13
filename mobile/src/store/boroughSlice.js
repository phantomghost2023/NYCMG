import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to fetch boroughs
export const fetchBoroughs = createAsyncThunk(
  'boroughs/fetchBoroughs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/boroughs`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch boroughs');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const boroughSlice = createSlice({
  name: 'boroughs',
  initialState: {
    boroughs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoroughs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoroughs.fulfilled, (state, action) => {
        state.loading = false;
        state.boroughs = action.payload;
      })
      .addCase(fetchBoroughs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = boroughSlice.actions;
export default boroughSlice.reducer;