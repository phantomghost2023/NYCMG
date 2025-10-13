const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Like an entity
router.post('/', authenticateToken, likeController.like);

// Unlike an entity
router.delete('/', authenticateToken, likeController.unlike);

// Get likes count for an entity
router.get('/:entityType/:entityId', likeController.getLikes);

// Get current user's likes
router.get('/', authenticateToken, likeController.listUserLikes);

// Check if current user has liked an entity
router.post('/check', authenticateToken, likeController.checkLike);

module.exports = router;