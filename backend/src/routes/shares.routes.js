const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Share an entity
router.post('/', authenticateToken, shareController.share);

// Get shares count for an entity
router.get('/:entityType/:entityId', shareController.getShares);

// Get current user's shares
router.get('/', authenticateToken, shareController.listUserShares);

module.exports = router;