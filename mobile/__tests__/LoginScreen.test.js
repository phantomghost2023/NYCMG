import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginScreen from '../src/screens/LoginScreen';

const mockStore = configureStore([]);

describe('LoginScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders without crashing', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    expect(getByText('NYCMG')).toBeTruthy();
    expect(getByText('Login to your account')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account?")).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('allows entering email and password', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('dispatches login action when login button is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    // Enter email and password
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    // Press login button
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);
    
    // Check that dispatch was called with login action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('auth/login'),
        payload: {
          email: 'test@example.com',
          password: 'password123'
        }
      })
    );
  });

  it('shows alert when email is missing', () => {
    // Mock Alert.alert
    Alert.alert = jest.fn();
    
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    // Enter only password
    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(passwordInput, 'password123');
    
    // Press login button
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);
    
    // Check that alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
  });

  it('shows alert when password is missing', () => {
    // Mock Alert.alert
    Alert.alert = jest.fn();
    
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    // Enter only email
    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'test@example.com');
    
    // Press login button
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);
    
    // Check that alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
  });

  it('navigates to Home screen when user is authenticated', () => {
    const authenticatedStore = mockStore({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: true
      }
    });
    
    const navigation = { navigate: jest.fn() };
    render(
      <Provider store={authenticatedStore}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that navigation was called to Home screen
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('navigates to Register screen when register link is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    // Press register link
    const registerLink = getByText('Register');
    fireEvent.press(registerLink);
    
    // Check that navigation was called to Register screen
    expect(navigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('shows loading indicator when loading', () => {
    const loadingStore = mockStore({
      auth: {
        loading: true,
        error: null,
        isAuthenticated: false
      }
    });
    
    const navigation = { navigate: jest.fn() };
    const { getByTestId, queryByText } = render(
      <Provider store={loadingStore}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that loading indicator is displayed
    expect(getByTestId('activity-indicator')).toBeTruthy();
    
    // Check that login text is not displayed
    expect(queryByText('Login')).toBeNull();
  });

  it('shows alert when there is an error', () => {
    // Mock Alert.alert
    Alert.alert = jest.fn();
    
    const errorStore = mockStore({
      auth: {
        loading: false,
        error: 'Invalid credentials',
        isAuthenticated: false
      }
    });
    
    errorStore.dispatch = jest.fn();
    
    const navigation = { navigate: jest.fn() };
    render(
      <Provider store={errorStore}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that alert was called with error message
    expect(Alert.alert).toHaveBeenCalledWith('Login Error', 'Invalid credentials');
    
    // Check that clearError was dispatched
    expect(errorStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('auth/clearError')
      })
    );
  });
});