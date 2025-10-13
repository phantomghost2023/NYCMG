const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { query } = require('express-validator');

const router = express.Router();

// Validation middleware
const paginationQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

const searchQueryValidation = [
  query('search').optional().notEmpty().withMessage('Search query cannot be empty')
];

// Admin routes (protected - admin only)
router.get('/statistics', authMiddleware, adminController.getSystemStatistics);
router.get('/users', authMiddleware, paginationQueryValidation, searchQueryValidation, adminController.getUserList);
router.get('/artists', authMiddleware, paginationQueryValidation, searchQueryValidation, adminController.getArtistList);
router.get('/content/:contentType', authMiddleware, paginationQueryValidation, searchQueryValidation, adminController.getContentList);
router.get('/reports/pending', authMiddleware, paginationQueryValidation, adminController.getPendingReports);
router.delete('/users/:userId', authMiddleware, adminController.deleteUser);
router.put('/users/:userId/suspend', authMiddleware, adminController.suspendUser);
router.put('/users/:userId/unsuspend', authMiddleware, adminController.unsuspendUser);
router.put('/artists/:artistId/verify', authMiddleware, adminController.verifyArtist);
router.get('/health', authMiddleware, adminController.getSystemHealth);

module.exports = router;