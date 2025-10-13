const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const purchaseTicketValidation = [
  body('eventId').isInt().withMessage('Event ID must be an integer'),
  body('ticketType').optional().notEmpty().withMessage('Ticket type cannot be empty')
];

const updateTicketStatusValidation = [
  body('status').notEmpty().isIn(['purchased', 'used', 'refunded', 'cancelled'])
    .withMessage('Status must be one of: purchased, used, refunded, cancelled')
];

// Ticket routes (protected)
router.post('/', authMiddleware, purchaseTicketValidation, ticketController.purchaseTicket);
router.get('/', authMiddleware, ticketController.getTicketsByUser);
router.get('/:id', authMiddleware, ticketController.getTicketById);
router.put('/:id/status', authMiddleware, updateTicketStatusValidation, ticketController.updateTicketStatus);
router.get('/event/:eventId', authMiddleware, ticketController.getTicketsByEvent);
router.put('/:id/cancel', authMiddleware, ticketController.cancelTicket);

module.exports = router;