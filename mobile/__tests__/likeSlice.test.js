import likeReducer, {
  likeTrack,
  unlikeTrack,
  getLikeStatus,
  getLikesCount,
} from '../src/store/likeSlice';

describe('likeSlice', () => {
  const initialState = {
    liked: {},
    likesCount: {},
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(likeReducer(undefined, { type: 'unknown' })).
    toEqual(initialState);
  });

  it('should handle likeTrack pending', () => {
    const action = { type: likeTrack.pending.type };
    const state = likeReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle likeTrack fulfilled', () => {
    const mockPayload = { trackId: 1 };
    const action = { type: likeTrack.fulfilled.type, payload: mockPayload };
    const state = likeReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.liked[1]).toBe(true);
  });

  it('should handle likeTrack rejected', () => {
    const action = { type: likeTrack.rejected.type, payload: 'Error' };
    const state = likeReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle unlikeTrack pending', () => {
    const action = { type: unlikeTrack.pending.type };
    const state = likeReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle unlikeTrack fulfilled', () => {
    const action = { type: unlikeTrack.fulfilled.type, payload: 1 };
    const state = likeReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.liked[1]).toBe(false);
  });

  it('should handle unlikeTrack rejected', () => {
    const action = { type: unlikeTrack.rejected.type, payload: 'Error' };
    const state = likeReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle getLikeStatus fulfilled', () => {
    const mockPayload = { trackId: 1, isLiked: true };
    const action = { type: getLikeStatus.fulfilled.type, payload: mockPayload };
    const state = likeReducer(initialState, action);
    expect(state.liked[1]).toBe(true);
  });

  it('should handle getLikesCount fulfilled', () => {
    const mockPayload = { trackId: 1, count: 50 };
    const action = { type: getLikesCount.fulfilled.type, payload: mockPayload };
    const state = likeReducer(initialState, action);
    expect(state.likesCount[1]).toBe(50);
  });

  it('should handle clearLikeError', () => {
    const errorState = { ...initialState, error: 'Error' };
    const action = { type: 'like/clearLikeError' };
    const state = likeReducer(errorState, action);
    expect(state.error).toBeNull();
  });
});