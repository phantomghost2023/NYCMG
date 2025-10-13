const express = require('express');
const subscriptionController = require('../controllers/subscription.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const createSubscriptionValidation = [
  body('planType').notEmpty().isIn(['basic', 'premium', 'artist'])
    .withMessage('Plan type must be one of: basic, premium, artist'),
  body('autoRenew').optional().isBoolean().withMessage('Auto renew must be a boolean')
];

const updateSubscriptionValidation = [
  body('autoRenew').optional().isBoolean().withMessage('Auto renew must be a boolean')
];

// Subscription routes (protected)
router.post('/', authMiddleware, createSubscriptionValidation, subscriptionController.createSubscription);
router.get('/', authMiddleware, subscriptionController.getSubscriptionsByUser);
router.get('/:id', authMiddleware, subscriptionController.getSubscriptionById);
router.put('/:id', authMiddleware, updateSubscriptionValidation, subscriptionController.updateSubscription);
router.put('/:id/cancel', authMiddleware, subscriptionController.cancelSubscription);
router.get('/:id/active', authMiddleware, subscriptionController.isSubscriptionActive);
router.put('/:id/renew', authMiddleware, subscriptionController.renewSubscription);

module.exports = router;