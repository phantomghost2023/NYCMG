const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { body, query } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const recordMetricValidation = [
  body('entityType').notEmpty().isIn(['track', 'artist', 'album', 'user'])
    .withMessage('Entity type must be one of: track, artist, album, user'),
  body('entityId').isInt().withMessage('Entity ID must be an integer'),
  body('metricType').notEmpty().withMessage('Metric type is required'),
  body('value').isFloat().withMessage('Value must be a number'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date')
];

const dateQueryValidation = [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
];

// Analytics routes
router.post('/', recordMetricValidation, analyticsController.recordMetric);
router.get('/:entityType/:entityId', dateQueryValidation, analyticsController.getEntityAnalytics);
router.get('/:entityType/:entityId/aggregated', dateQueryValidation, analyticsController.getAggregatedAnalytics);
router.get('/:entityType/:entityId/daily', dateQueryValidation, analyticsController.getDailyAnalytics);
router.get('/top/:entityType/:metricType', analyticsController.getTopEntities);
router.post('/track/:trackId/play', analyticsController.recordPlayCount);
router.post('/track/:trackId/like', analyticsController.recordLikeCount);

module.exports = router;