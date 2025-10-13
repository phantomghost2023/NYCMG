import followReducer, {
  followArtist,
  unfollowArtist,
  getFollowingStatus,
  getFollowersCount,
} from '../src/store/followSlice';

describe('followSlice', () => {
  const initialState = {
    following: {},
    followersCount: {},
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(followReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle followArtist pending', () => {
    const action = { type: followArtist.pending.type };
    const state = followReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle followArtist fulfilled', () => {
    const mockPayload = { artistId: 1 };
    const action = { type: followArtist.fulfilled.type, payload: mockPayload };
    const state = followReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.following[1]).toBe(true);
  });

  it('should handle followArtist rejected', () => {
    const action = { type: followArtist.rejected.type, payload: 'Error' };
    const state = followReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle unfollowArtist pending', () => {
    const action = { type: unfollowArtist.pending.type };
    const state = followReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle unfollowArtist fulfilled', () => {
    const action = { type: unfollowArtist.fulfilled.type, payload: 1 };
    const state = followReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.following[1]).toBe(false);
  });

  it('should handle unfollowArtist rejected', () => {
    const action = { type: unfollowArtist.rejected.type, payload: 'Error' };
    const state = followReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle getFollowingStatus fulfilled', () => {
    const mockPayload = { artistId: 1, isFollowing: true };
    const action = { type: getFollowingStatus.fulfilled.type, payload: mockPayload };
    const state = followReducer(initialState, action);
    expect(state.following[1]).toBe(true);
  });

  it('should handle getFollowersCount fulfilled', () => {
    const mockPayload = { artistId: 1, count: 100 };
    const action = { type: getFollowersCount.fulfilled.type, payload: mockPayload };
    const state = followReducer(initialState, action);
    expect(state.followersCount[1]).toBe(100);
  });

  it('should handle clearFollowError', () => {
    const errorState = { ...initialState, error: 'Error' };
    const action = { type: 'follow/clearFollowError' };
    const state = followReducer(errorState, action);
    expect(state.error).toBeNull();
  });
});