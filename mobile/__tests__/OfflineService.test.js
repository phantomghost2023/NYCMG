import OfflineService from '../src/services/OfflineService';

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('OfflineService', () => {
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
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  describe('cacheTrack', () => {
    it('should cache a track successfully', async () => {
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

    it('should update existing track in cache', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockTrack]));
      AsyncStorage.setItem.mockResolvedValueOnce();
      
      const updatedTrack = { ...mockTrack, title: 'Updated Track' };
      const result = await OfflineService.cacheTrack(updatedTrack);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cachedTracks',
        JSON.stringify([updatedTrack])
      );
    });

    it('should handle cache track error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Cache failed'));
      
      const result = await OfflineService.cacheTrack(mockTrack);
      
      expect(result).toBe(false);
    });
  });

  describe('getCachedTracks', () => {
    it('should get cached tracks', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockTrack]));
      
      const tracks = await OfflineService.getCachedTracks();
      
      expect(tracks).toEqual([mockTrack]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('cachedTracks');
    });

    it('should return empty array when no cached tracks', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const tracks = await OfflineService.getCachedTracks();
      
      expect(tracks).toEqual([]);
    });

    it('should handle get cached tracks error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Get failed'));
      
      const tracks = await OfflineService.getCachedTracks();
      
      expect(tracks).toEqual([]);
    });
  });

  describe('removeCachedTrack', () => {
    it('should remove cached track', async () => {
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

    it('should handle remove cached track error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Remove failed'));
      
      const result = await OfflineService.removeCachedTrack(1);
      
      expect(result).toBe(false);
    });
  });

  describe('isTrackCached', () => {
    it('should return true when track is cached', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockTrack]));
      
      const result = await OfflineService.isTrackCached(1);
      
      expect(result).toBe(true);
    });

    it('should return false when track is not cached', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockTrack]));
      
      const result = await OfflineService.isTrackCached(2);
      
      expect(result).toBe(false);
    });

    it('should handle is track cached error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Check failed'));
      
      const result = await OfflineService.isTrackCached(1);
      
      expect(result).toBe(false);
    });
  });

  describe('cacheUserData', () => {
    it('should cache user data successfully', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockResolvedValueOnce();
      
      const result = await OfflineService.cacheUserData(mockUserData);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockUserData)
      );
    });

    it('should handle cache user data error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Cache failed'));
      
      const result = await OfflineService.cacheUserData(mockUserData);
      
      expect(result).toBe(false);
    });
  });

  describe('getCachedUserData', () => {
    it('should get cached user data', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUserData));
      
      const userData = await OfflineService.getCachedUserData();
      
      expect(userData).toEqual(mockUserData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userData');
    });

    it('should return null when no cached user data', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const userData = await OfflineService.getCachedUserData();
      
      expect(userData).toBeNull();
    });

    it('should handle get cached user data error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Get failed'));
      
      const userData = await OfflineService.getCachedUserData();
      
      expect(userData).toBeNull();
    });
  });

  describe('cacheBoroughsData', () => {
    it('should cache boroughs data successfully', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockResolvedValueOnce();
      
      const result = await OfflineService.cacheBoroughsData(mockBoroughsData);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'boroughsData',
        JSON.stringify(mockBoroughsData)
      );
    });

    it('should handle cache boroughs data error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Cache failed'));
      
      const result = await OfflineService.cacheBoroughsData(mockBoroughsData);
      
      expect(result).toBe(false);
    });
  });

  describe('getCachedBoroughsData', () => {
    it('should get cached boroughs data', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockBoroughsData));
      
      const boroughsData = await OfflineService.getCachedBoroughsData();
      
      expect(boroughsData).toEqual(mockBoroughsData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('boroughsData');
    });

    it('should return null when no cached boroughs data', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const boroughsData = await OfflineService.getCachedBoroughsData();
      
      expect(boroughsData).toBeNull();
    });

    it('should handle get cached boroughs data error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Get failed'));
      
      const boroughsData = await OfflineService.getCachedBoroughsData();
      
      expect(boroughsData).toBeNull();
    });
  });

  describe('clearAllCache', () => {
    it('should clear all cache successfully', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.removeItem.mockResolvedValue();
      
      const result = await OfflineService.clearAllCache();
      
      expect(result).toBe(true);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cachedTracks');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userData');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('boroughsData');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('artistsData');
    });

    it('should handle clear all cache error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.removeItem.mockRejectedValueOnce(new Error('Clear failed'));
      
      const result = await OfflineService.clearAllCache();
      
      expect(result).toBe(false);
    });
  });

  describe('isOfflineMode', () => {
    it('should return true when offline mode is enabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const result = await OfflineService.isOfflineMode();
      
      expect(result).toBe(true);
    });

    it('should return false when offline mode is disabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('false');
      
      const result = await OfflineService.isOfflineMode();
      
      expect(result).toBe(false);
    });

    it('should return false when offline mode setting is not found', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const result = await OfflineService.isOfflineMode();
      
      expect(result).toBe(false);
    });

    it('should handle is offline mode error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Check failed'));
      
      const result = await OfflineService.isOfflineMode();
      
      expect(result).toBe(false);
    });
  });

  describe('setOfflineMode', () => {
    it('should set offline mode to true', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockResolvedValueOnce();
      
      const result = await OfflineService.setOfflineMode(true);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineMode', 'true');
    });

    it('should set offline mode to false', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockResolvedValueOnce();
      
      const result = await OfflineService.setOfflineMode(false);
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offlineMode', 'false');
    });

    it('should handle set offline mode error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Set failed'));
      
      const result = await OfflineService.setOfflineMode(true);
      
      expect(result).toBe(false);
    });
  });
});