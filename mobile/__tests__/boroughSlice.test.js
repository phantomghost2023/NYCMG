import boroughReducer, {
  fetchBoroughs,
  clearError
} from '../src/store/boroughSlice';

// Mock fetch
global.fetch = jest.fn();

describe('boroughSlice', () => {
  const initialState = {
    boroughs: [],
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(boroughReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const state = {
      ...initialState,
      error: 'Some error message'
    };
    
    const newState = boroughReducer(state, clearError());
    expect(newState.error).toBeNull();
  });

  describe('fetchBoroughs', () => {
    it('should handle fetchBoroughs pending', () => {
      const state = boroughReducer(initialState, fetchBoroughs.pending());
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchBoroughs fulfilled', () => {
      const boroughsData = [
        { id: '1', name: 'Manhattan', description: 'The heart of NYC' },
        { id: '2', name: 'Brooklyn', description: 'The borough of hipsters' }
      ];
      
      const state = boroughReducer(initialState, fetchBoroughs.fulfilled(boroughsData));
      expect(state.loading).toBe(false);
      expect(state.boroughs).toEqual(boroughsData);
    });

    it('should handle fetchBoroughs rejected', () => {
      const errorMessage = 'Failed to fetch boroughs';
      const state = boroughReducer(initialState, fetchBoroughs.rejected(null, null, null, errorMessage));
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});