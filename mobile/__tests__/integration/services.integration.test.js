import OfflineService from '../../src/services/OfflineService';
import NotificationService from '../../src/services/NotificationService';
import { 
  setupPlayer, 
  addTrack, 
  playTrack 
} from '../../src/services/AudioService';

// Mock dependencies
jest.mock('react-native-track-player', () => ({
  setupPlayer: jest.fn(),
  updateOptions: jest.fn(),
  add: jest.fn(),
  reset: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  skipToNext: jest.fn(),
  skipToPrevious: jest.fn(),
  seekTo: jest.fn(),
  getPosition: jest.fn(),
  getDuration: jest.fn(),
  getCurrentTrack: jest.fn(),
  getTrack: jest.fn(),
  STATE_PAUSED: 'paused',
  STATE_PLAYING: 'playing',
  STATE_STOPPED: 'stopped',
  CAPABILITY_PLAY: 'CAPABILITY_PLAY',
  CAPABILITY_PAUSE: 'CAPABILITY_PAUSE',
  CAPABILITY_SKIP_TO_NEXT: 'CAPABILITY_SKIP_TO_NEXT',
  CAPABILITY_SKIP_TO_PREVIOUS: 'CAPABILITY_SKIP_TO_PREVIOUS',
  CAPABILITY_SEEK_TO: 'CAPABILITY_SEEK_TO',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Mobile Services Integration', () => {
  const mockTrack = {
    id: 1,
    title: 'Test Track',
    artist: { username: 'Test Artist' },
    audioUrl: 'https://example.com/test.mp3',
    coverArtUrl: 'https://example.com/cover.jpg',
    duration: 180,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Cross-Service Integration', () => {
    it('should coordinate offline mode with audio playback', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const TrackPlayer = require('react-native-track-player');
      
      // Set up mocks
      AsyncStorage.getItem.mockResolvedValueOnce('true'); // Offline mode enabled
      TrackPlayer.setupPlayer.mockResolvedValueOnce();
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(1);
      TrackPlayer.getTrack.mockResolvedValueOnce(mockTrack);
      
      // Check if offline mode is enabled
      const isOffline = await OfflineService.isOfflineMode();
      
      // Cache a track for offline playback
      await OfflineService.cacheTrack(mockTrack);
      
      // Set up audio player
      await setupPlayer();
      
      // Play the cached track
      await playTrack(mockTrack);
      
      // Verify all services worked together
      expect(isOffline).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offlineMode');
      expect(TrackPlayer.add).toHaveBeenCalledWith({
        id: '1',
        url: 'https://example.com/test.mp3',
        title: 'Test Track',
        artist: 'Test Artist',
        artwork: 'https://example.com/cover.jpg',
        duration: 180,
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cachedTracks',
        JSON.stringify([mockTrack])
      );
    });

    it('should handle notifications during playback', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const TrackPlayer = require('react-native-track-player');
      
      // Set up mocks
      AsyncStorage.getItem.mockResolvedValueOnce('true'); // Notifications enabled
      TrackPlayer.setupPlayer.mockResolvedValueOnce();
      
      // Check notification settings
      const notificationsEnabled = await NotificationService.areNotificationsEnabled();
      
      // Set up audio player
      await setupPlayer();
      
      // Play a track
      await playTrack(mockTrack);
      
      // Show a notification about the playing track
      if (notificationsEnabled) {
        await NotificationService.showNotification(
          'Now Playing',
          mockTrack.title,
          { trackId: mockTrack.id }
        );
      }
      
      // Verify all services worked together
      expect(notificationsEnabled).toBe(true);
      expect(TrackPlayer.play).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('notificationsEnabled');
    });

    it('should sync user preferences across services', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      
      // Set up mocks for multiple preference settings
      AsyncStorage.setItem.mockResolvedValue();
      
      // Update multiple settings simultaneously
      const promises = [
        OfflineService.setOfflineMode(true),
        OfflineService.setDownloadQuality('high'),
        OfflineService.setNotificationsEnabled(false),
        OfflineService.setDarkMode(true)
      ];
      
      const results = await Promise.all(promises);
      
      // Verify all settings were saved
      expect(results).toEqual([true, true, true, true]);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineMode', 'true');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('downloadQuality', 'high');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('notificationsEnabled', 'false');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });
  });

  describe('Error Handling Across Services', () => {
    it('should gracefully handle errors when one service fails', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const TrackPlayer = require('react-native-track-player');
      
      // Set up mocks with one service failing
      AsyncStorage.getItem.mockResolvedValueOnce('true'); // Offline mode enabled
      TrackPlayer.setupPlayer.mockRejectedValueOnce(new Error('Player setup failed'));
      
      // Mock console.error to avoid output during test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Check if offline mode is enabled
      const isOffline = await OfflineService.isOfflineMode();
      
      // Try to set up audio player (this will fail)
      const setupResult = await setupPlayer();
      
      // Verify that offline mode still worked despite audio player failure
      expect(isOffline).toBe(true);
      expect(setupResult).toBe(false); // AudioService.setupPlayer returns false on error
      
      consoleSpy.mockRestore();
    });
  });
});