import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to fetch tracks
export const fetchTracks = createAsyncThunk(
  'tracks/fetchTracks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { search, boroughIds, genreIds, artistId, isExplicit, sortBy, sortOrder, limit = 20, offset = 0 } = params;
      let url = `${API_BASE_URL}/tracks?limit=${limit}&offset=${offset}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      if (boroughIds && boroughIds.length > 0) {
        url += `&boroughIds=${encodeURIComponent(JSON.stringify(boroughIds))}`;
      }
      
      if (genreIds && genreIds.length > 0) {
        url += `&genreIds=${encodeURIComponent(JSON.stringify(genreIds))}`;
      }
      
      if (artistId) {
        url += `&artistId=${artistId}`;
      }
      
      if (isExplicit !== undefined) {
        url += `&isExplicit=${isExplicit}`;
      }
      
      if (sortBy) {
        url += `&sortBy=${encodeURIComponent(sortBy)}`;
      }
      
      if (sortOrder) {
        url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch tracks');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to fetch a single track
export const fetchTrack = createAsyncThunk(
  'tracks/fetchTrack',
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracks/${trackId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch track');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const trackSlice = createSlice({
  name: 'tracks',
  initialState: {
    tracks: [],
    selectedTrack: null,
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTrack: (state) => {
      state.selectedTrack = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tracks
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = action.payload.data;
        state.totalCount = action.payload.pagination.totalCount;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single track
      .addCase(fetchTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrack.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrack = action.payload;
      })
      .addCase(fetchTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedTrack } = trackSlice.actions;
export default trackSlice.reducer;