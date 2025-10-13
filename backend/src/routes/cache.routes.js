const express = require('express');
const router = express.Router();
const cacheController = require('../controllers/cache.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Get cache statistics
router.get('/stats', authenticateToken, cacheController.getCacheStatistics);

// Clear all caches (admin only)
router.delete('/clear', authenticateToken, cacheController.clearAllCache);

module.exports = router;