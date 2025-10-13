const { listNotifications, markAsRead, markAllAsRead, remove } = require('../notification.controller');
const { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} = require('../../services/notification.service');

// Mock the notification service functions
jest.mock('../../services/notification.service');

describe('Notification Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock request and response objects
    req = {
      query: {},
      params: {},
      body: {},
      user: { userId: 'currentUserId' }
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('listNotifications', () => {
    it('should return a list of notifications with default options', async () => {
      const mockResult = {
        rows: [{ id: 1, message: 'Test Notification' }],
        count: 1,
        limit: 20,
        offset: 0
      };

      getUserNotifications.mockResolvedValue(mockResult);

      await listNotifications(req, res);

      expect(getUserNotifications).toHaveBeenCalledWith('currentUserId', {
        limit: 20,
        offset: 0,
        includeRead: false
      });
      
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 1, message: 'Test Notification' }],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 1,
          limit: 20,
          offset: 0
        }
      });
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database error';
      getUserNotifications.mockRejectedValue(new Error(errorMessage));

      await listNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const notificationId = '1';
      req.params.id = notificationId;
      
      const mockNotification = { id: notificationId, is_read: true };
      markNotificationAsRead.mockResolvedValue(mockNotification);

      await markAsRead(req, res);

      expect(markNotificationAsRead).toHaveBeenCalledWith(notificationId);
      expect(res.json).toHaveBeenCalledWith(mockNotification);
    });

    it('should return 404 when notification is not found', async () => {
      const notificationId = 'nonexistent';
      req.params.id = notificationId;
      
      markNotificationAsRead.mockRejectedValue(new Error('Notification not found'));

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Notification not found' });
    });

    it('should handle service errors', async () => {
      const notificationId = '1';
      req.params.id = notificationId;
      
      const errorMessage = 'Database error';
      markNotificationAsRead.mockRejectedValue(new Error(errorMessage));

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockResult = { updatedCount: 5 };
      markAllNotificationsAsRead.mockResolvedValue(mockResult);

      await markAllAsRead(req, res);

      expect(markAllNotificationsAsRead).toHaveBeenCalledWith('currentUserId');
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database error';
      markAllNotificationsAsRead.mockRejectedValue(new Error(errorMessage));

      await markAllAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('remove', () => {
    it('should delete a notification', async () => {
      const notificationId = '1';
      req.params.id = notificationId;
      
      const mockResult = { message: 'Notification deleted successfully' };
      deleteNotification.mockResolvedValue(mockResult);

      await remove(req, res);

      expect(deleteNotification).toHaveBeenCalledWith(notificationId);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 when notification is not found', async () => {
      const notificationId = 'nonexistent';
      req.params.id = notificationId;
      
      deleteNotification.mockRejectedValue(new Error('Notification not found'));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Notification not found' });
    });

    it('should handle service errors', async () => {
      const notificationId = '1';
      req.params.id = notificationId;
      
      const errorMessage = 'Database error';
      deleteNotification.mockRejectedValue(new Error(errorMessage));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});