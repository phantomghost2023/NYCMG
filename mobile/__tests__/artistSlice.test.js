import artistReducer, {
  fetchArtists,
  fetchArtist,
  clearError,
  clearSelectedArtist
} from '../src/store/artistSlice';

// Mock fetch
global.fetch = jest.fn();

describe('artistSlice', () => {
  const initialState = {
    artists: [],
    selectedArtist: null,
    loading: false,
    error: null,
    totalCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(artistReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const state = {
      ...initialState,
      error: 'Some error message'
    };
    
    const newState = artistReducer(state, clearError());
    expect(newState.error).toBeNull();
  });

  it('should handle clearSelectedArtist', () => {
    const state = {
      ...initialState,
      selectedArtist: { id: '1', name: 'Test Artist' }
    };
    
    const newState = artistReducer(state, clearSelectedArtist());
    expect(newState.selectedArtist).toBeNull();
  });

  describe('fetchArtists', () => {
    it('should handle fetchArtists pending', () => {
      const state = {
        ...initialState,
        loading: false,
        error: 'Previous error'
      };
      
      const newState = artistReducer(state, { type: fetchArtists.pending.type });
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchArtists fulfilled', () => {
      const mockPayload = {
        artists: [
          { id: '1', name: 'Artist 1' },
          { id: '2', name: 'Artist 2' }
        ],
        totalCount: 2
      };
      
      const state = {
        ...initialState,
        loading: true
      };
      
      const newState = artistReducer(state, {
        type: fetchArtists.fulfilled.type,
        payload: mockPayload
      });
      
      expect(newState.loading).toBe(false);
      expect(newState.artists).toEqual(mockPayload.artists);
      expect(newState.totalCount).toBe(mockPayload.totalCount);
    });

    it('should handle fetchArtists rejected', () => {
      const errorMessage = 'Failed to fetch artists';
      const state = {
        ...initialState,
        loading: true
      };
      
      const newState = artistReducer(state, {
        type: fetchArtists.rejected.type,
        payload: errorMessage
      });
      
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchArtist', () => {
    it('should handle fetchArtist pending', () => {
      const state = {
        ...initialState,
        loading: false,
        error: 'Previous error'
      };
      
      const newState = artistReducer(state, { type: fetchArtist.pending.type });
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchArtist fulfilled', () => {
      const mockArtist = { id: '1', name: 'Test Artist' };
      const state = {
        ...initialState,
        loading: true
      };
      
      const newState = artistReducer(state, {
        type: fetchArtist.fulfilled.type,
        payload: mockArtist
      });
      
      expect(newState.loading).toBe(false);
      expect(newState.selectedArtist).toEqual(mockArtist);
    });

    it('should handle fetchArtist rejected', () => {
      const errorMessage = 'Failed to fetch artist';
      const state = {
        ...initialState,
        loading: true
      };
      
      const newState = artistReducer(state, {
        type: fetchArtist.rejected.type,
        payload: errorMessage
      });
      
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});