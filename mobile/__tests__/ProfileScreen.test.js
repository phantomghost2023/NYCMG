import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../src/screens/ProfileScreen';

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  return RN;
});

describe('ProfileScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(selector => 
      selector({ auth: { user: mockUser } })
    );
  });

  it('renders correctly with user data', () => {
    const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
    
    expect(getByText('testuser')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
  });

  it('navigates to settings when settings menu item is pressed', () => {
    const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
    
    const settingsItem = getByText('Settings');
    fireEvent.press(settingsItem);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MainTabs', { screen: 'Settings' });
  });

  it('shows logout confirmation when logout button is pressed', () => {
    const Alert = require('react-native').Alert;
    const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
    
    const logoutButton = getByText('Logout');
    fireEvent.press(logoutButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Logout',
      'Are you sure you want to logout?',
      expect.any(Array)
    );
  });

  it('dispatches logout action when confirmed', () => {
    const Alert = require('react-native').Alert;
    const { useDispatch } = require('react-redux');
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    
    const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
    
    const logoutButton = getByText('Logout');
    fireEvent.press(logoutButton);
    
    // Get the callback function from the Alert.alert call
    const alertCall = Alert.alert.mock.calls[0];
    const confirmCallback = alertCall[2][1].onPress; // Second button is "Logout"
    
    // Call the confirm callback
    confirmCallback();
    
    // Should dispatch logout action
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: expect.stringContaining('logout') }));
  });

  it('renders user stats correctly', () => {
    const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
    
    // These values are hardcoded in the component
    expect(getByText('12')).toBeTruthy(); // tracks
    expect(getByText('342')).toBeTruthy(); // followers
    expect(getByText('89')).toBeTruthy(); // following
  });

  it('renders menu items correctly', () => {
    const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
    
    expect(getByText('Your Tracks')).toBeTruthy();
    expect(getByText('Liked Tracks')).toBeTruthy();
    expect(getByText('Playlists')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
  });
});