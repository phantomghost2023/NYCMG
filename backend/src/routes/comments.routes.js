const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Create a comment
router.post('/', authenticateToken, commentController.create);

// Get comments for an entity
router.get('/:entityType/:entityId', commentController.list);

// Update a comment
router.put('/:id', authenticateToken, commentController.update);

// Delete a comment
router.delete('/:id', authenticateToken, commentController.remove);

module.exports = router;