const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Admin routes (protected - admin only)
router.get('/statistics', authenticateToken, adminController.getSystemStatistics);
router.get('/users', authenticateToken, adminController.getUserList);
router.get('/artists', authenticateToken, adminController.getArtistList);
router.get('/content/:contentType', authenticateToken, adminController.getContentList);
router.get('/reports/pending', authenticateToken, adminController.getPendingReports);
router.delete('/users/:userId', authenticateToken, adminController.deleteUser);
router.put('/users/:userId/suspend', authenticateToken, adminController.suspendUser);
router.put('/users/:userId/unsuspend', authenticateToken, adminController.unsuspendUser);
router.put('/artists/:artistId/verify', authenticateToken, adminController.verifyArtist);
router.get('/health', authenticateToken, adminController.getSystemHealth);

module.exports = router;