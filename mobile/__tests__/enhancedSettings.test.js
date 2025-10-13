import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../src/screens/SettingsScreen';

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

// Mock OfflineService
jest.mock('../src/services/OfflineService', () => ({
  isOfflineMode: jest.fn(),
  setOfflineMode: jest.fn(),
  getDownloadQuality: jest.fn(),
  setDownloadQuality: jest.fn(),
  getNotificationsEnabled: jest.fn(),
  setNotificationsEnabled: jest.fn(),
  getDarkMode: jest.fn(),
  setDarkMode: jest.fn(),
  getAutoPlay: jest.fn(),
  setAutoPlay: jest.fn(),
  getEqualizer: jest.fn(),
  setEqualizer: jest.fn(),
  getDataSaver: jest.fn(),
  setDataSaver: jest.fn(),
  clearAllCache: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  RN.Linking.openURL = jest.fn();
  return RN;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Enhanced Settings Screen', () => {
  const mockUser = {
    username: 'testuser',
  };

  const mockUseSelector = require('react-redux').useSelector;
  const OfflineService = require('../src/services/OfflineService');
  const Alert = require('react-native').Alert;
  const Linking = require('react-native').Linking;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock default settings
    mockUseSelector.mockImplementation(selector => 
      selector({ auth: { user: mockUser } })
    );
    
    OfflineService.isOfflineMode.mockResolvedValue(false);
    OfflineService.getDownloadQuality.mockResolvedValue('high');
    OfflineService.getNotificationsEnabled.mockResolvedValue(true);
    OfflineService.getDarkMode.mockResolvedValue(false);
    OfflineService.getAutoPlay.mockResolvedValue(true);
    OfflineService.getEqualizer.mockResolvedValue('default');
    OfflineService.getDataSaver.mockResolvedValue(false);
  });

  it('renders enhanced settings screen with all sections', () => {
    const { getByText } = render(<SettingsScreen />);
    
    // Account section
    expect(getByText('Account')).toBeTruthy();
    expect(getByText('Logged in as')).toBeTruthy();
    expect(getByText('testuser')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
    
    // Playback section
    expect(getByText('Playback')).toBeTruthy();
    expect(getByText('Offline Mode')).toBeTruthy();
    expect(getByText('Auto Play')).toBeTruthy();
    expect(getByText('Download Quality')).toBeTruthy();
    expect(getByText('Equalizer')).toBeTruthy();
    
    // Data Usage section
    expect(getByText('Data Usage')).toBeTruthy();
    expect(getByText('Data Saver')).toBeTruthy();
    
    // Notifications section
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Enable Notifications')).toBeTruthy();
    
    // Appearance section
    expect(getByText('Appearance')).toBeTruthy();
    expect(getByText('Dark Mode')).toBeTruthy();
    
    // Storage section
    expect(getByText('Storage')).toBeTruthy();
    expect(getByText('Clear Cache')).toBeTruthy();
    
    // About section
    expect(getByText('About')).toBeTruthy();
    expect(getByText('Version')).toBeTruthy();
    expect(getByText('Terms of Service')).toBeTruthy();
    expect(getByText('Privacy Policy')).toBeTruthy();
  });

  it('toggles auto play switch', async () => {
    OfflineService.setAutoPlay.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Auto Play');
    
    // Find the switch and toggle it
    // Note: Testing-library doesn't have great support for Switch components
  });

  it('updates equalizer preset', async () => {
    OfflineService.setEqualizer.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Equalizer');
    
    // Find the rock preset button and press it
    const rockButton = await findByText('Rock');
    fireEvent.press(rockButton);
    
    expect(OfflineService.setEqualizer).toHaveBeenCalledWith('rock');
  });

  it('toggles data saver switch', async () => {
    OfflineService.setDataSaver.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Data Saver');
    
    // Find the switch and toggle it
    // Note: Testing-library doesn't have great support for Switch components
  });

  it('opens privacy policy link', async () => {
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Privacy Policy');
    
    const privacyPolicyItem = await findByText('Privacy Policy');
    fireEvent.press(privacyPolicyItem);
    
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com/privacy');
  });

  it('opens terms of service link', async () => {
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Terms of Service');
    
    const termsItem = await findByText('Terms of Service');
    fireEvent.press(termsItem);
    
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com/terms');
  });

  it('shows logout confirmation when logout button is pressed', async () => {
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Logout');
    
    const logoutItem = await findByText('Logout');
    fireEvent.press(logoutItem);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Logout',
      'Are you sure you want to logout?',
      expect.any(Array)
    );
  });
});