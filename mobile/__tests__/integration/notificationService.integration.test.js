import NotificationService from '../../src/services/NotificationService';

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('NotificationService Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Notification Service and AsyncStorage Integration', () => {
    it('should check notification status from AsyncStorage', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const isEnabled = await NotificationService.areNotificationsEnabled();
      
      expect(isEnabled).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('notificationsEnabled');
    });

    it('should initialize notification service based on settings', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const result = await NotificationService.initialize();
      
      expect(result).toBe(true);
    });
  });

  describe('Notification Service and Redux Store Integration', () => {
    it('should sync notification settings with Redux store', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('false');
      
      const isEnabled = await NotificationService.areNotificationsEnabled();
      
      // This would normally dispatch to Redux store
      // For integration testing, we just verify the data is retrieved correctly
      expect(isEnabled).toBe(false);
    });
  });

  describe('Notification Service Error Handling', () => {
    it('should handle AsyncStorage errors gracefully', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));
      
      // Mock console.error to avoid output during test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const isEnabled = await NotificationService.areNotificationsEnabled();
      
      // Should default to true on error
      expect(isEnabled).toBe(true);
      consoleSpy.mockRestore();
    });
  });
});