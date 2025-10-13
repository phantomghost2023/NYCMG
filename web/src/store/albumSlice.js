import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to fetch albums
export const fetchAlbums = createAsyncThunk(
  'albums/fetchAlbums',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { artistId, limit = 20, offset = 0 } = params;
      let url = `${API_BASE_URL}/albums?limit=${limit}&offset=${offset}`;
      
      if (artistId) {
        url += `&artistId=${artistId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch albums');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to fetch a single album
export const fetchAlbum = createAsyncThunk(
  'albums/fetchAlbum',
  async (albumId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/albums/${albumId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch album');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const albumSlice = createSlice({
  name: 'albums',
  initialState: {
    albums: [],
    selectedAlbum: null,
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAlbum: (state) => {
      state.selectedAlbum = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch albums
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.albums;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single album
      .addCase(fetchAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlbum = action.payload;
      })
      .addCase(fetchAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedAlbum } = albumSlice.actions;
export default albumSlice.reducer;