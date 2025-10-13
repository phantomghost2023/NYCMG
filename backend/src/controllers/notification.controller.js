const { 
  createNotification, 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} = require('../services/notification.service');
const { authenticateToken } = require('../middleware/auth.middleware');

const listNotifications = async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      includeRead: req.query.includeRead === 'true'
    };
    
    const result = await getUserNotifications(req.user.userId, options);
    
    res.json({
      data: result.rows,
      pagination: {
        currentPage: Math.floor(result.offset / result.limit) + 1,
        totalPages: Math.ceil(result.count / result.limit),
        totalCount: result.count,
        limit: result.limit,
        offset: result.offset
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await markNotificationAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const result = await markAllNotificationsAsRead(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteNotification(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listNotifications,
  markAsRead,
  markAllAsRead,
  remove
};