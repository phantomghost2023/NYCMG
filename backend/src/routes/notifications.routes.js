const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Get user notifications
router.get('/', authenticateToken, notificationController.listNotifications);

// Mark a notification as read
router.put('/:id/read', authenticateToken, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', authenticateToken, notificationController.remove);

module.exports = router;