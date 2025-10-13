const express = require('express');
const moderationController = require('../controllers/moderation.controller');
const { body, query } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const createReportValidation = [
  body('targetType').notEmpty().isIn(['track', 'comment', 'artist', 'album'])
    .withMessage('Target type must be one of: track, comment, artist, album'),
  body('targetId').isInt().withMessage('Target ID must be an integer'),
  body('reason').notEmpty().withMessage('Reason is required'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty')
];

const updateReportStatusValidation = [
  body('status').notEmpty().isIn(['pending', 'reviewed', 'resolved', 'dismissed'])
    .withMessage('Status must be one of: pending, reviewed, resolved, dismissed')
];

const resolveReportValidation = [
  body('resolution').notEmpty().withMessage('Resolution is required')
];

// Moderation routes (protected)
router.post('/', authMiddleware, createReportValidation, moderationController.createReport);
router.get('/', authMiddleware, moderationController.getAllReports);
router.get('/:id', authMiddleware, moderationController.getReportById);
router.put('/:id/status', authMiddleware, updateReportStatusValidation, moderationController.updateReportStatus);
router.put('/:id/resolve', authMiddleware, resolveReportValidation, moderationController.resolveReport);
router.put('/:id/dismiss', authMiddleware, moderationController.dismissReport);
router.get('/user', authMiddleware, moderationController.getReportsByUser);
router.get('/:targetType/:targetId', authMiddleware, moderationController.getReportsForTarget);
router.get('/statistics', authMiddleware, moderationController.getModerationStatistics);

module.exports = router;