const { Notification } = require('../models');

const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

const getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0, includeRead = false } = options;
    
    const whereClause = {
      user_id: userId
    };
    
    // Filter out read notifications if not explicitly included
    if (!includeRead) {
      whereClause.is_read = false;
    }
    
    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return notifications;
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    await notification.update({ is_read: true });
    return notification;
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

const markAllNotificationsAsRead = async (userId) => {
  try {
    const [updatedCount] = await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );
    
    return { updatedCount };
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    await notification.destroy();
    return { message: 'Notification deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};