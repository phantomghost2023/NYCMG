const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Follow a user
router.post('/', authenticateToken, followController.follow);

// Unfollow a user
router.delete('/:followingId', authenticateToken, followController.unfollow);

// Get followers for a user
router.get('/:userId/followers', followController.listFollowers);

// Get following for a user
router.get('/:userId/following', followController.listFollowing);

// Check if current user is following another user
router.get('/following/:followingId', authenticateToken, followController.checkFollowing);

module.exports = router;