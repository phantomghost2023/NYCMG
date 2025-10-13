import authReducer, {
  login,
  register,
  logout,
  loadUserFromStorage,
  clearError
} from '../src/store/authSlice';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const state = {
      ...initialState,
      error: 'Some error message'
    };
    
    const newState = authReducer(state, clearError());
    expect(newState.error).toBeNull();
  });

  describe('login', () => {
    it('should handle login pending', () => {
      const state = authReducer(initialState, login.pending());
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle login fulfilled', () => {
      const userData = {
        user: { id: '1', username: 'testuser' },
        token: 'test-token'
      };
      
      const state = authReducer(initialState, login.fulfilled(userData));
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData.user);
      expect(state.token).toBe(userData.token);
    });

    it('should handle login rejected', () => {
      const errorMessage = 'Invalid credentials';
      const state = authReducer(initialState, login.rejected(null, null, null, errorMessage));
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('register', () => {
    it('should handle register pending', () => {
      const state = authReducer(initialState, register.pending());
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle register fulfilled', () => {
      const userData = {
        user: { id: '1', username: 'testuser' },
        token: 'test-token'
      };
      
      const state = authReducer(initialState, register.fulfilled(userData));
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData.user);
      expect(state.token).toBe(userData.token);
    });

    it('should handle register rejected', () => {
      const errorMessage = 'Email already exists';
      const state = authReducer(initialState, register.rejected(null, null, null, errorMessage));
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logout', () => {
    it('should handle logout fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: { id: '1', username: 'testuser' },
        token: 'test-token',
        isAuthenticated: true
      };
      
      const state = authReducer(stateWithUser, logout.fulfilled());
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle logout rejected', () => {
      const errorMessage = 'Logout failed';
      const state = authReducer(initialState, logout.rejected(null, null, null, errorMessage));
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('loadUserFromStorage', () => {
    it('should handle loadUserFromStorage fulfilled with user data', () => {
      const userData = {
        user: { id: '1', username: 'testuser' },
        token: 'test-token'
      };
      
      const state = authReducer(initialState, loadUserFromStorage.fulfilled(userData));
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData.user);
      expect(state.token).toBe(userData.token);
    });

    it('should handle loadUserFromStorage fulfilled without user data', () => {
      const state = authReducer(initialState, loadUserFromStorage.fulfilled(null));
      expect(state).toEqual(initialState);
    });

    it('should handle loadUserFromStorage rejected', () => {
      const errorMessage = 'Failed to load user data';
      const state = authReducer(initialState, loadUserFromStorage.rejected(null, null, null, errorMessage));
      expect(state.error).toBe(errorMessage);
    });
  });
});