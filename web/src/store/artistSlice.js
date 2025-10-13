import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to fetch artists
export const fetchArtists = createAsyncThunk(
  'artists/fetchArtists',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { limit = 20, offset = 0 } = params;
      const response = await fetch(`${API_BASE_URL}/artists?limit=${limit}&offset=${offset}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch artists');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to fetch a single artist
export const fetchArtist = createAsyncThunk(
  'artists/fetchArtist',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${artistId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch artist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to update an artist's profile
export const updateArtistProfile = createAsyncThunk(
  'artists/updateArtistProfile',
  async ({ artistId, formData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artist-profile/${artistId}/profile`, {
        method: 'PUT',
        body: formData,
        // Note: Don't set Content-Type header when sending FormData
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update artist profile');
      }

      return data.artist;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const artistSlice = createSlice({
  name: 'artists',
  initialState: {
    artists: [],
    selectedArtist: null,
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedArtist: (state) => {
      state.selectedArtist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch artists
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = action.payload.artists;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single artist
      .addCase(fetchArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArtist = action.payload;
      })
      .addCase(fetchArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update artist profile
      .addCase(updateArtistProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtistProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Update the selected artist if it matches
        if (state.selectedArtist && state.selectedArtist.id === action.payload.id) {
          state.selectedArtist = action.payload;
        }
        // Also update in the artists list
        const index = state.artists.findIndex(artist => artist.id === action.payload.id);
        if (index !== -1) {
          state.artists[index] = action.payload;
        }
      })
      .addCase(updateArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedArtist } = artistSlice.actions;
export default artistSlice.reducer;