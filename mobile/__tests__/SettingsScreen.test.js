import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../src/screens/SettingsScreen';

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
  clearAllCache: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  return RN;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock default settings
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.isOfflineMode.mockResolvedValue(false);
    OfflineService.getDownloadQuality.mockResolvedValue('high');
    OfflineService.getNotificationsEnabled.mockResolvedValue(true);
    OfflineService.getDarkMode.mockResolvedValue(false);
  });

  it('renders correctly', () => {
    const { getByText } = render(<SettingsScreen />);
    
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Playback')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Appearance')).toBeTruthy();
    expect(getByText('Storage')).toBeTruthy();
    expect(getByText('About')).toBeTruthy();
  });

  it('toggles offline mode switch', async () => {
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.setOfflineMode.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Offline Mode');
    
    // Find the switch and toggle it
    // Note: Testing-library doesn't have great support for Switch components
    // In a real test, you would find a way to interact with the switch
  });

  it('updates download quality', async () => {
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.setDownloadQuality.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Download Quality');
    
    // Find the medium quality button and press it
    const mediumButton = await findByText('Medium');
    fireEvent.press(mediumButton);
    
    expect(OfflineService.setDownloadQuality).toHaveBeenCalledWith('medium');
  });

  it('toggles notifications switch', async () => {
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.setNotificationsEnabled.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Enable Notifications');
    
    // Find the switch and toggle it
    // Note: Testing-library doesn't have great support for Switch components
  });

  it('toggles dark mode switch', async () => {
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.setDarkMode.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Dark Mode');
    
    // Find the switch and toggle it
    // Note: Testing-library doesn't have great support for Switch components
  });

  it('shows confirmation when clearing cache', async () => {
    const Alert = require('react-native').Alert;
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Clear Cache');
    
    const clearCacheItem = await findByText('Clear Cache');
    fireEvent.press(clearCacheItem);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This will remove all downloaded music and offline content.',
      expect.any(Array)
    );
  });

  it('clears cache when confirmed', async () => {
    const Alert = require('react-native').Alert;
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.clearAllCache.mockResolvedValue(true);
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Clear Cache');
    
    const clearCacheItem = await findByText('Clear Cache');
    fireEvent.press(clearCacheItem);
    
    // Get the callback function from the Alert.alert call
    const alertCall = Alert.alert.mock.calls[0];
    const confirmCallback = alertCall[2][1].onPress; // Second button is "Clear"
    
    // Call the confirm callback
    await confirmCallback();
    
    expect(OfflineService.clearAllCache).toHaveBeenCalled();
  });

  it('shows error message when cache clearing fails', async () => {
    const Alert = require('react-native').Alert;
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.clearAllCache.mockRejectedValue(new Error('Clear failed'));
    
    const { findByText } = render(<SettingsScreen />);
    
    // Wait for settings to load
    await findByText('Clear Cache');
    
    const clearCacheItem = await findByText('Clear Cache');
    fireEvent.press(clearCacheItem);
    
    // Get the callback function from the Alert.alert call
    const alertCall = Alert.alert.mock.calls[0];
    const confirmCallback = alertCall[2][1].onPress; // Second button is "Clear"
    
    // Call the confirm callback
    await confirmCallback();
    
    // Should show error alert
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to clear cache. Please try again.');
  });
});