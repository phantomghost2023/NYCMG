import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to add track to favorites
export const addFavorite = createAsyncThunk(
  'favorite/addFavorite',
  async (trackId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ trackId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to add to favorites');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to remove track from favorites
export const removeFavorite = createAsyncThunk(
  'favorite/removeFavorite',
  async (trackId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/favorite/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to remove from favorites');
      }

      return trackId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get user favorites
export const getUserFavorites = createAsyncThunk(
  'favorite/getUserFavorites',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/favorite`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get favorites');
      }

      return data.favorites;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to check if track is favorite
export const isFavorite = createAsyncThunk(
  'favorite/isFavorite',
  async (trackId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/favorite/status/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to check favorite status');
      }

      return { trackId, isFavorite: data.isFavorite };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    favorites: [],
    favoriteStatus: {}, // Map of trackId to favorite status
    loading: false,
    error: null,
  },
  reducers: {
    clearFavoriteError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add favorite
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites.push(action.payload.track);
        state.favoriteStatus[action.payload.track.id] = true;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove favorite
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = state.favorites.filter(f => f.id !== action.payload);
        state.favoriteStatus[action.payload] = false;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user favorites
      .addCase(getUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        // Update favorite status map
        action.payload.forEach(track => {
          state.favoriteStatus[track.id] = true;
        });
      })
      .addCase(getUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check favorite status
      .addCase(isFavorite.fulfilled, (state, action) => {
        const { trackId, isFavorite } = action.payload;
        state.favoriteStatus[trackId] = isFavorite;
      })
      .addCase(isFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFavoriteError } = favoriteSlice.actions;
export default favoriteSlice.reducer;