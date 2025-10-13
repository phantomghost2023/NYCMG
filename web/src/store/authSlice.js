import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'nycmg-shared';
import websocketClient from '../services/websocketClient';
import { addNotification } from './notificationSlice';

// Async thunk to login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Login thunk called with credentials:', credentials);
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full request URL:', `${API_BASE_URL}/auth/login`);
      
      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Fetch response received:', response);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const text = await response.text();
      console.log('Response text:', text);
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed JSON data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return rejectWithValue('Invalid response format');
      }
      
      if (!response.ok) {
        console.log('Login failed with data:', data);
        return rejectWithValue(data.error || 'Login failed');
      }
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      console.error('Network error occurred in login thunk:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Check if it's an abort error (timeout)
      if (error.name === 'AbortError') {
        return rejectWithValue('Request timeout - please try again');
      }
      
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Async thunk to register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Registration failed');
      }
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to fetch user profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch profile');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update profile');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to refresh token');
      }
      
      // Save new token to localStorage
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk to logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Disconnect WebSocket
      websocketClient.disconnect();
      
      return { message: 'Logged out successfully' };
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          // In a real app, you would also fetch the user profile here
          // For now, we'll just set the token
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Connect WebSocket
        websocketClient.connect(action.payload.token, action.payload.user.id);
        websocketClient.onNotification((notification) => {
          // Dispatch notification to Redux store
          // This would typically be done in a component or middleware
          console.log('Received real-time notification:', notification);
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Connect WebSocket
        websocketClient.connect(action.payload.token, action.payload.user.id);
        websocketClient.onNotification((notification) => {
          // Dispatch notification to Redux store
          // This would typically be done in a component or middleware
          console.log('Received real-time notification:', notification);
        });
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Fetch profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setToken, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
