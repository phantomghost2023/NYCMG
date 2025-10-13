import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RegisterScreen from '../src/screens/RegisterScreen';

const mockStore = configureStore([]);

describe('RegisterScreen', () => {
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
    
    // Mock Alert.alert
    Alert.alert = jest.fn();
  });

  it('renders without crashing', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    expect(getByText('NYCMG')).toBeTruthy();
    expect(getByText('Create an account')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Choose a username')).toBeTruthy();
    expect(getByPlaceholderText('Create a password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm your password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
    expect(getByText('Already have an account?')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('allows entering all registration fields', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    const emailInput = getByPlaceholderText('Enter your email');
    const usernameInput = getByPlaceholderText('Choose a username');
    const passwordInput = getByPlaceholderText('Create a password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    expect(emailInput.props.value).toBe('test@example.com');
    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
    expect(confirmPasswordInput.props.value).toBe('password123');
  });

  it('dispatches register action when register button is pressed with valid data', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Enter valid registration data
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Choose a username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    
    // Press register button
    const registerButton = getByText('Register');
    fireEvent.press(registerButton);
    
    // Check that dispatch was called with register action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('auth/register'),
        payload: {
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123'
        }
      })
    );
  });

  it('shows alert when fields are missing', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Press register button without filling any fields
    const registerButton = getByText('Register');
    fireEvent.press(registerButton);
    
    // Check that alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
  });

  it('shows alert when passwords do not match', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Enter data with mismatched passwords
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Choose a username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password456');
    
    // Press register button
    const registerButton = getByText('Register');
    fireEvent.press(registerButton);
    
    // Check that alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match');
  });

  it('shows alert when password is too short', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Enter data with short password
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Choose a username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Create a password'), '123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), '123');
    
    // Press register button
    const registerButton = getByText('Register');
    fireEvent.press(registerButton);
    
    // Check that alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Password must be at least 6 characters');
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
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that navigation was called to Home screen
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('navigates to Login screen when login link is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Press login link
    const loginLink = getByText('Login');
    fireEvent.press(loginLink);
    
    // Check that navigation was called to Login screen
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
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
    const { queryByText } = render(
      <Provider store={loadingStore}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that loading indicator is displayed
    expect(queryByText('Register')).toBeNull();
  });

  it('shows alert when there is an error', () => {
    const errorStore = mockStore({
      auth: {
        loading: false,
        error: 'Email already exists',
        isAuthenticated: false
      }
    });
    
    errorStore.dispatch = jest.fn();
    
    const navigation = { navigate: jest.fn() };
    render(
      <Provider store={errorStore}>
        <RegisterScreen navigation={navigation} />
      </Provider>
    );
    
    // Check that alert was called with error message
    expect(Alert.alert).toHaveBeenCalledWith('Registration Error', 'Email already exists');
    
    // Check that clearError was dispatched
    expect(errorStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('auth/clearError')
      })
    );
  });
});