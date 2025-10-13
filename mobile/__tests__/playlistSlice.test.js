import playlistReducer, {
  createPlaylist,
  getUserPlaylists,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from '../src/store/playlistSlice';

describe('playlistSlice', () => {
  const initialState = {
    playlists: [],
    selectedPlaylist: null,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(playlistReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle createPlaylist pending', () => {
    const action = { type: createPlaylist.pending.type };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createPlaylist fulfilled', () => {
    const mockPayload = { id: 1, name: 'Test Playlist' };
    const action = { type: createPlaylist.fulfilled.type, payload: mockPayload };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.playlists).toEqual([{ id: 1, name: 'Test Playlist' }]);
  });

  it('should handle createPlaylist rejected', () => {
    const action = { type: createPlaylist.rejected.type, payload: 'Error' };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle getUserPlaylists pending', () => {
    const action = { type: getUserPlaylists.pending.type };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getUserPlaylists fulfilled', () => {
    const mockPayload = [{ id: 1, name: 'Test Playlist' }];
    const action = { type: getUserPlaylists.fulfilled.type, payload: mockPayload };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.playlists).toEqual([{ id: 1, name: 'Test Playlist' }]);
  });

  it('should handle getUserPlaylists rejected', () => {
    const action = { type: getUserPlaylists.rejected.type, payload: 'Error' };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle getPlaylist pending', () => {
    const action = { type: getPlaylist.pending.type };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getPlaylist fulfilled', () => {
    const mockPayload = { id: 1, name: 'Test Playlist' };
    const action = { type: getPlaylist.fulfilled.type, payload: mockPayload };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.selectedPlaylist).toEqual({ id: 1, name: 'Test Playlist' });
  });

  it('should handle getPlaylist rejected', () => {
    const action = { type: getPlaylist.rejected.type, payload: 'Error' };
    const state = playlistReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle updatePlaylist fulfilled', () => {
    const stateWithPlaylists = {
      ...initialState,
      playlists: [{ id: 1, name: 'Old Name' }],
      selectedPlaylist: { id: 1, name: 'Old Name' },
    };
    
    const mockPayload = { id: 1, name: 'New Name' };
    const action = { type: updatePlaylist.fulfilled.type, payload: mockPayload };
    const state = playlistReducer(stateWithPlaylists, action);
    expect(state.playlists[0].name).toBe('New Name');
    expect(state.selectedPlaylist.name).toBe('New Name');
  });

  it('should handle deletePlaylist fulfilled', () => {
    const stateWithPlaylists = {
      ...initialState,
      playlists: [{ id: 1, name: 'Test Playlist' }],
      selectedPlaylist: { id: 1, name: 'Test Playlist' },
    };
    
    const action = { type: deletePlaylist.fulfilled.type, payload: 1 };
    const state = playlistReducer(stateWithPlaylists, action);
    expect(state.playlists).toEqual([]);
    expect(state.selectedPlaylist).toBeNull();
  });

  it('should handle addTrackToPlaylist fulfilled', () => {
    const stateWithPlaylists = {
      ...initialState,
      playlists: [{ id: 1, name: 'Test Playlist', tracks: [] }],
      selectedPlaylist: { id: 1, name: 'Test Playlist', tracks: [] },
    };
    
    const mockPayload = { playlistId: 1, track: { id: 1, title: 'Test Track' } };
    const action = { type: addTrackToPlaylist.fulfilled.type, payload: mockPayload };
    const state = playlistReducer(stateWithPlaylists, action);
    expect(state.playlists[0].tracks).toEqual([{ id: 1, title: 'Test Track' }]);
    expect(state.selectedPlaylist.tracks).toEqual([{ id: 1, title: 'Test Track' }]);
  });

  it('should handle removeTrackFromPlaylist fulfilled', () => {
    const stateWithPlaylists = {
      ...initialState,
      playlists: [{ id: 1, name: 'Test Playlist', tracks: [{ id: 1, title: 'Test Track' }] }],
      selectedPlaylist: { id: 1, name: 'Test Playlist', tracks: [{ id: 1, title: 'Test Track' }] },
    };
    
    const mockPayload = { playlistId: 1, trackId: 1 };
    const action = { type: removeTrackFromPlaylist.fulfilled.type, payload: mockPayload };
    const state = playlistReducer(stateWithPlaylists, action);
    expect(state.playlists[0].tracks).toEqual([]);
    expect(state.selectedPlaylist.tracks).toEqual([]);
  });

  it('should handle clearPlaylistError', () => {
    const errorState = { ...initialState, error: 'Error' };
    const action = { type: 'playlist/clearPlaylistError' };
    const state = playlistReducer(errorState, action);
    expect(state.error).toBeNull();
  });

  it('should handle setSelectedPlaylist', () => {
    const mockPlaylist = { id: 1, name: 'Test Playlist' };
    const action = { type: 'playlist/setSelectedPlaylist', payload: mockPlaylist };
    const state = playlistReducer(initialState, action);
    expect(state.selectedPlaylist).toEqual(mockPlaylist);
  });
});