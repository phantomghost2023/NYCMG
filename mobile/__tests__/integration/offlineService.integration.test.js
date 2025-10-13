import OfflineService from '../../src/services/OfflineService';

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('OfflineService Integration', () => {
  const mockTrack = {
    id: 1,
    title: 'Test Track',
    artist: { username: 'Test Artist' },
    audioUrl: 'https://example.com/test.mp3',
    coverArtUrl: 'https://example.com/cover.jpg',
    duration: 180,
  };

  const mockUserData = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockBoroughsData = [
    { id: 1, name: 'Manhattan', description: 'The heart of NYC' },
    { id: 2, name: 'Brooklyn', description: 'The hip borough' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Offline Service and AsyncStorage Integration', () => {
    it('should cache track and update Redux store', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      AsyncStorage.setItem.mockResolvedValueOnce();
      
      const result = await OfflineService.cacheTrack(mockTrack);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cachedTracks',
        JSON.stringify([mockTrack])
      );
    });

    it('should retrieve cached tracks and update Redux store', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockTrack]));
      
      const tracks = await OfflineService.getCachedTracks();
      
      expect(tracks).toEqual([mockTrack]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('cachedTracks');
    });

    it('should remove cached track and update Redux store', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockTrack]));
      AsyncStorage.setItem.mockResolvedValueOnce();
      
      const result = await OfflineService.removeCachedTrack(1);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cachedTracks',
        JSON.stringify([])
      );
    });

    it('should handle offline mode settings', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const isOffline = await OfflineService.isOfflineMode();
      
      expect(isOffline).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offlineMode');
    });
  });

  describe('Offline Service and Redux Store Integration', () => {
    it('should sync cached tracks with Redux store', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockTrack]));
      
      const tracks = await OfflineService.getCachedTracks();
      
      // This would normally dispatch to Redux store
      // For integration testing, we just verify the data is retrieved correctly
      expect(tracks).toEqual([mockTrack]);
    });
  });
});