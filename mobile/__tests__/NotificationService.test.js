import NotificationService from '../src/services/NotificationService';

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  describe('initialize', () => {
    it('should initialize notification service when notifications are enabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const result = await NotificationService.initialize();
      
      expect(result).toBe(true);
    });

    it('should not initialize notification service when notifications are disabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('false');
      
      const result = await NotificationService.initialize();
      
      expect(result).toBe(false);
    });

    it('should handle initialize error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Initialize failed'));
      
      const result = await NotificationService.initialize();
      
      expect(result).toBe(false);
    });
  });

  describe('areNotificationsEnabled', () => {
    it('should return true when notifications are enabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const result = await NotificationService.areNotificationsEnabled();
      
      expect(result).toBe(true);
    });

    it('should return false when notifications are disabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('false');
      
      const result = await NotificationService.areNotificationsEnabled();
      
      expect(result).toBe(false);
    });

    it('should return true when notifications setting is not found (default)', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const result = await NotificationService.areNotificationsEnabled();
      
      expect(result).toBe(true);
    });

    it('should handle are notifications enabled error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Check failed'));
      
      const result = await NotificationService.areNotificationsEnabled();
      
      expect(result).toBe(true); // default to true
    });
  });

  describe('requestPermissions', () => {
    it('should request notification permissions successfully', async () => {
      const result = await NotificationService.requestPermissions();
      
      expect(result).toBe(true);
    });

    it('should handle request permissions error', async () => {
      // Mock console.error to avoid output during test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await NotificationService.requestPermissions();
      
      expect(result).toBe(true);
      consoleSpy.mockRestore();
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule notification when notifications are enabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const result = await NotificationService.scheduleNotification(
        'Test Title',
        'Test Body',
        new Date()
      );
      
      expect(result).toBe(true);
    });

    it('should not schedule notification when notifications are disabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('false');
      
      const result = await NotificationService.scheduleNotification(
        'Test Title',
        'Test Body',
        new Date()
      );
      
      expect(result).toBe(false);
    });

    it('should handle schedule notification error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Schedule failed'));
      
      const result = await NotificationService.scheduleNotification(
        'Test Title',
        'Test Body',
        new Date()
      );
      
      expect(result).toBe(false);
    });
  });

  describe('showNotification', () => {
    it('should show notification when notifications are enabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('true');
      
      const result = await NotificationService.showNotification(
        'Test Title',
        'Test Body'
      );
      
      expect(result).toBe(true);
    });

    it('should not show notification when notifications are disabled', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValueOnce('false');
      
      const result = await NotificationService.showNotification(
        'Test Title',
        'Test Body'
      );
      
      expect(result).toBe(false);
    });

    it('should handle show notification error', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Show failed'));
      
      const result = await NotificationService.showNotification(
        'Test Title',
        'Test Body'
      );
      
      expect(result).toBe(false);
    });
  });

  describe('handlePushNotification', () => {
    it('should handle push notification successfully', async () => {
      const mockNotification = { title: 'Test', body: 'Test body' };
      
      const result = await NotificationService.handlePushNotification(mockNotification);
      
      expect(result).toBe(true);
    });

    it('should handle push notification error', async () => {
      const mockNotification = { title: 'Test', body: 'Test body' };
      // Mock console.error to avoid output during test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await NotificationService.handlePushNotification(mockNotification);
      
      expect(result).toBe(true);
      consoleSpy.mockRestore();
    });
  });

  describe('handleNotificationTap', () => {
    it('should handle notification tap successfully', async () => {
      const mockNotification = { title: 'Test', body: 'Test body' };
      
      const result = await NotificationService.handleNotificationTap(mockNotification);
      
      expect(result).toBe(true);
    });

    it('should handle notification tap error', async () => {
      const mockNotification = { title: 'Test', body: 'Test body' };
      // Mock console.error to avoid output during test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await NotificationService.handleNotificationTap(mockNotification);
      
      expect(result).toBe(true);
      consoleSpy.mockRestore();
    });
  });

  describe('handleBackgroundNotificationTap', () => {
    it('should handle background notification tap successfully', async () => {
      const mockNotification = { title: 'Test', body: 'Test body' };
      
      const result = await NotificationService.handleBackgroundNotificationTap(mockNotification);
      
      expect(result).toBe(true);
    });

    it('should handle background notification tap error', async () => {
      const mockNotification = { title: 'Test', body: 'Test body' };
      // Mock console.error to avoid output during test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await NotificationService.handleBackgroundNotificationTap(mockNotification);
      
      expect(result).toBe(true);
      consoleSpy.mockRestore();
    });
  });
});