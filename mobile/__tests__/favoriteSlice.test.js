import favoriteReducer, {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isFavorite,
} from '../src/store/favoriteSlice';

describe('favoriteSlice', () => {
  const initialState = {
    favorites: [],
    favoriteStatus: {},
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(favoriteReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addFavorite pending', () => {
    const action = { type: addFavorite.pending.type };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle addFavorite fulfilled', () => {
    const mockPayload = { track: { id: 1, title: 'Test Track' } };
    const action = { type: addFavorite.fulfilled.type, payload: mockPayload };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.favorites).toEqual([{ id: 1, title: 'Test Track' }]);
    expect(state.favoriteStatus[1]).toBe(true);
  });

  it('should handle addFavorite rejected', () => {
    const action = { type: addFavorite.rejected.type, payload: 'Error' };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle removeFavorite pending', () => {
    const action = { type: removeFavorite.pending.type };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle removeFavorite fulfilled', () => {
    const stateWithFavorites = {
      ...initialState,
      favorites: [{ id: 1, title: 'Test Track' }],
      favoriteStatus: { 1: true },
    };
    
    const action = { type: removeFavorite.fulfilled.type, payload: 1 };
    const state = favoriteReducer(stateWithFavorites, action);
    expect(state.loading).toBe(false);
    expect(state.favorites).toEqual([]);
    expect(state.favoriteStatus[1]).toBe(false);
  });

  it('should handle removeFavorite rejected', () => {
    const action = { type: removeFavorite.rejected.type, payload: 'Error' };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle getUserFavorites pending', () => {
    const action = { type: getUserFavorites.pending.type };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getUserFavorites fulfilled', () => {
    const mockPayload = [{ id: 1, title: 'Test Track' }];
    const action = { type: getUserFavorites.fulfilled.type, payload: mockPayload };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.favorites).toEqual([{ id: 1, title: 'Test Track' }]);
    expect(state.favoriteStatus[1]).toBe(true);
  });

  it('should handle getUserFavorites rejected', () => {
    const action = { type: getUserFavorites.rejected.type, payload: 'Error' };
    const state = favoriteReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle isFavorite fulfilled', () => {
    const mockPayload = { trackId: 1, isFavorite: true };
    const action = { type: isFavorite.fulfilled.type, payload: mockPayload };
    const state = favoriteReducer(initialState, action);
    expect(state.favoriteStatus[1]).toBe(true);
  });

  it('should handle isFavorite rejected', () => {
    const action = { type: isFavorite.rejected.type, payload: 'Error' };
    const state = favoriteReducer(initialState, action);
    expect(state.error).toBe('Error');
  });

  it('should handle clearFavoriteError', () => {
    const errorState = { ...initialState, error: 'Error' };
    const action = { type: 'favorite/clearFavoriteError' };
    const state = favoriteReducer(errorState, action);
    expect(state.error).toBeNull();
  });
});