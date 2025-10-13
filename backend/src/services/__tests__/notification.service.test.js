// Mock the models index file
jest.mock('../../models', () => {
  return {
    Notification: {
      create: jest.fn(),
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    }
  };
});

// Mock the associations to prevent errors
jest.mock('../../models/associations', () => {
  return {
    setupAssociations: jest.fn()
  };
});

const notificationService = require('../notification.service');
const { Notification } = require('../../models');

describe('Notification Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const notificationData = {
        user_id: 'user123',
        type: 'track_upload',
        title: 'New Track Uploaded',
        message: 'A new track has been uploaded',
        related_id: 'track123',
        related_type: 'track'
      };

      const mockNotification = {
        id: 'notification123',
        ...notificationData,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Mock the Notification.create method
      Notification.create.mockResolvedValue(mockNotification);

      const notification = await notificationService.createNotification(notificationData);
      
      expect(Notification.create).toHaveBeenCalledWith(notificationData);
      expect(notification).toEqual(mockNotification);
    });

    it('should throw an error if notification creation fails', async () => {
      const notificationData = {
        user_id: 'user123',
        type: 'track_upload',
        title: 'New Track Uploaded',
        message: 'A new track has been uploaded'
      };

      // Mock the Notification.create method to throw an error
      Notification.create.mockRejectedValue(new Error('Database error'));

      await expect(notificationService.createNotification(notificationData)).rejects.toThrow('Failed to create notification: Database error');
    });
  });

  describe('getUserNotifications', () => {
    it('should fetch user notifications', async () => {
      const userId = 'user123';
      const mockResult = {
        rows: [
          { id: 'notification1', user_id: userId, title: 'Notification 1' },
          { id: 'notification2', user_id: userId, title: 'Notification 2' }
        ],
        count: 2
      };

      // Mock the Notification.findAndCountAll method
      Notification.findAndCountAll.mockResolvedValue(mockResult);

      const result = await notificationService.getUserNotifications(userId);
      
      expect(Notification.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: userId, is_read: false },
          limit: 20,
          offset: 0,
          order: [['created_at', 'DESC']]
        })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark a notification as read', async () => {
      const notificationId = 'notification123';
      const mockNotification = {
        id: notificationId,
        is_read: false,
        update: jest.fn().mockResolvedValue(true)
      };

      // Mock the Notification.findByPk method
      Notification.findByPk.mockResolvedValue(mockNotification);

      const updatedNotification = await notificationService.markNotificationAsRead(notificationId);
      
      expect(Notification.findByPk).toHaveBeenCalledWith(notificationId);
      expect(mockNotification.update).toHaveBeenCalledWith({ is_read: true });
      expect(updatedNotification).toEqual(mockNotification);
    });

    it('should throw an error if notification is not found', async () => {
      const notificationId = 'nonexistent123';

      // Mock the Notification.findByPk method to return null
      Notification.findByPk.mockResolvedValue(null);

      await expect(notificationService.markNotificationAsRead(notificationId)).rejects.toThrow('Failed to mark notification as read: Notification not found');
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all user notifications as read', async () => {
      const userId = 'user456';
      const mockUpdatedCount = [2]; // Sequelize update returns an array with the number of affected rows

      // Mock the Notification.update method
      Notification.update.mockResolvedValue(mockUpdatedCount);

      const result = await notificationService.markAllNotificationsAsRead(userId);
      
      expect(Notification.update).toHaveBeenCalledWith(
        { is_read: true },
        { where: { user_id: userId, is_read: false } }
      );
      expect(result).toEqual({ updatedCount: 2 });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const notificationId = 'notification123';
      const mockNotification = {
        id: notificationId,
        destroy: jest.fn().mockResolvedValue(true)
      };

      // Mock the Notification.findByPk method
      Notification.findByPk.mockResolvedValue(mockNotification);

      const result = await notificationService.deleteNotification(notificationId);
      
      expect(Notification.findByPk).toHaveBeenCalledWith(notificationId);
      expect(mockNotification.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Notification deleted successfully' });
    });

    it('should throw an error if notification is not found', async () => {
      const notificationId = 'nonexistent123';

      // Mock the Notification.findByPk method to return null
      Notification.findByPk.mockResolvedValue(null);

      await expect(notificationService.deleteNotification(notificationId)).rejects.toThrow('Failed to delete notification: Notification not found');
    });
  });
});