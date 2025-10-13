import commentReducer, {
  addComment,
  getComments,
  deleteComment,
} from '../src/store/commentSlice';

describe('commentSlice', () => {
  const initialState = {
    comments: {},
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(commentReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addComment pending', () => {
    const action = { type: addComment.pending.type };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle addComment fulfilled', () => {
    const mockPayload = { trackId: 1, comment: { id: 1, content: 'Test comment' } };
    const action = { type: addComment.fulfilled.type, payload: mockPayload };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.comments[1]).toEqual([{ id: 1, content: 'Test comment' }]);
  });

  it('should handle addComment rejected', () => {
    const action = { type: addComment.rejected.type, payload: 'Error' };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle getComments pending', () => {
    const action = { type: getComments.pending.type };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getComments fulfilled', () => {
    const mockPayload = { trackId: 1, comments: [{ id: 1, content: 'Test comment' }] };
    const action = { type: getComments.fulfilled.type, payload: mockPayload };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.comments[1]).toEqual([{ id: 1, content: 'Test comment' }]);
  });

  it('should handle getComments rejected', () => {
    const action = { type: getComments.rejected.type, payload: 'Error' };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle deleteComment pending', () => {
    const action = { type: deleteComment.pending.type };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle deleteComment fulfilled', () => {
    const commentsState = {
      ...initialState,
      comments: {
        1: [
          { id: 1, content: 'Test comment 1' },
          { id: 2, content: 'Test comment 2' },
        ],
      },
    };
    
    const action = { type: deleteComment.fulfilled.type, payload: 1 };
    const state = commentReducer(commentsState, action);
    expect(state.loading).toBe(false);
    expect(state.comments[1]).toEqual([{ id: 2, content: 'Test comment 2' }]);
  });

  it('should handle deleteComment rejected', () => {
    const action = { type: deleteComment.rejected.type, payload: 'Error' };
    const state = commentReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle clearCommentError', () => {
    const errorState = { ...initialState, error: 'Error' };
    const action = { type: 'comment/clearCommentError' };
    const state = commentReducer(errorState, action);
    expect(state.error).toBeNull();
  });
});