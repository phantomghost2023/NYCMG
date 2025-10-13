const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const createPaymentValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('currency').optional().notEmpty().withMessage('Currency cannot be empty'),
  body('paymentMethod').optional().notEmpty().withMessage('Payment method cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty')
];

const updatePaymentStatusValidation = [
  body('status').notEmpty().isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Status must be one of: pending, completed, failed, refunded')
];

// Payment routes (protected)
router.post('/', authMiddleware, createPaymentValidation, paymentController.createPayment);
router.get('/', authMiddleware, paymentController.getPaymentsByUser);
router.get('/:id', authMiddleware, paymentController.getPaymentById);
router.put('/:id/status', authMiddleware, updatePaymentStatusValidation, paymentController.updatePaymentStatus);
router.put('/:id/process', authMiddleware, paymentController.processPayment);
router.put('/:id/refund', authMiddleware, paymentController.refundPayment);
router.get('/statistics', authMiddleware, paymentController.getPaymentStatistics);

module.exports = router;