const express = require('express');
const eventController = require('../controllers/event.controller');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const createEventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('endDate').isISO8601().withMessage('End date must be a valid ISO date'),
  body('venueId').isInt().withMessage('Venue ID must be an integer'),
  body('artistId').isInt().withMessage('Artist ID must be an integer'),
  body('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price must be a positive number'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a positive integer')
];

const updateEventValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  body('venueId').optional().isInt().withMessage('Venue ID must be an integer'),
  body('artistId').optional().isInt().withMessage('Artist ID must be an integer'),
  body('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price must be a positive number'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a positive integer')
];

// Event routes
router.post('/', createEventValidation, eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', updateEventValidation, eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/artist/:artistId', eventController.getEventsByArtist);
router.get('/upcoming', eventController.getUpcomingEvents);

module.exports = router;