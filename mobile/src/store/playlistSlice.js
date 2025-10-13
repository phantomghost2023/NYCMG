import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';

// Async thunk to create a playlist
export const createPlaylist = createAsyncThunk(
  'playlist/createPlaylist',
  async (playlistData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(playlistData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create playlist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get user playlists
export const getUserPlaylists = createAsyncThunk(
  'playlist/getUserPlaylists',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/playlist/user`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get playlists');
      }

      return data.playlists;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to get a specific playlist
export const getPlaylist = createAsyncThunk(
  'playlist/getPlaylist',
  async (playlistId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/playlist/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get playlist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to update a playlist
export const updatePlaylist = createAsyncThunk(
  'playlist/updatePlaylist',
  async ({ playlistId, playlistData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/playlist/${playlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(playlistData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update playlist');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to delete a playlist
export const deletePlaylist = createAsyncThunk(
  'playlist/deletePlaylist',
  async (playlistId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/playlist/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to delete playlist');
      }

      return playlistId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to add track to playlist
export const addTrackToPlaylist = createAsyncThunk(
  'playlist/addTrackToPlaylist',
  async ({ playlistId, trackId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/playlist/${playlistId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ trackId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to add track to playlist');
      }

      return { playlistId, track: data.track };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to remove track from playlist
export const removeTrackFromPlaylist = createAsyncThunk(
  'playlist/removeTrackFromPlaylist',
  async ({ playlistId, trackId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/playlist/${playlistId}/track/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to remove track from playlist');
      }

      return { playlistId, trackId };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlists: [],
    selectedPlaylist: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPlaylistError: (state) => {
      state.error = null;
    },
    setSelectedPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user playlists
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get playlist
      .addCase(getPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlaylist = action.payload;
      })
      .addCase(getPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update playlist
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.playlists.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
        if (state.selectedPlaylist && state.selectedPlaylist.id === action.payload.id) {
          state.selectedPlaylist = action.payload;
        }
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete playlist
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = state.playlists.filter(p => p.id !== action.payload);
        if (state.selectedPlaylist && state.selectedPlaylist.id === action.payload) {
          state.selectedPlaylist = null;
        }
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add track to playlist
      .addCase(addTrackToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTrackToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const { playlistId, track } = action.payload;
        const playlist = state.playlists.find(p => p.id === playlistId);
        if (playlist) {
          playlist.tracks.push(track);
        }
        if (state.selectedPlaylist && state.selectedPlaylist.id === playlistId) {
          state.selectedPlaylist.tracks.push(track);
        }
      })
      .addCase(addTrackToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove track from playlist
      .addCase(removeTrackFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTrackFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const { playlistId, trackId } = action.payload;
        const playlist = state.playlists.find(p => p.id === playlistId);
        if (playlist) {
          playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
        }
        if (state.selectedPlaylist && state.selectedPlaylist.id === playlistId) {
          state.selectedPlaylist.tracks = state.selectedPlaylist.tracks.filter(t => t.id !== trackId);
        }
      })
      .addCase(removeTrackFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPlaylistError, setSelectedPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;