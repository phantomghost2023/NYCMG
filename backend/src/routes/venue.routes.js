const express = require('express');
const venueController = require('../controllers/venue.controller');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const createVenueValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('boroughId').isInt().withMessage('Borough ID must be an integer'),
  body('latitude').optional().isFloat().withMessage('Latitude must be a float'),
  body('longitude').optional().isFloat().withMessage('Longitude must be a float'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a positive integer'),
  body('contactEmail').optional().isEmail().withMessage('Contact email must be valid'),
  body('contactPhone').optional().notEmpty().withMessage('Contact phone cannot be empty'),
  body('website').optional().isURL().withMessage('Website must be a valid URL')
];

const updateVenueValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('boroughId').optional().isInt().withMessage('Borough ID must be an integer'),
  body('latitude').optional().isFloat().withMessage('Latitude must be a float'),
  body('longitude').optional().isFloat().withMessage('Longitude must be a float'),
  body('capacity').optional().isInt({ min: 0 }).withMessage('Capacity must be a positive integer'),
  body('contactEmail').optional().isEmail().withMessage('Contact email must be valid'),
  body('contactPhone').optional().notEmpty().withMessage('Contact phone cannot be empty'),
  body('website').optional().isURL().withMessage('Website must be a valid URL')
];

// Venue routes
router.post('/', createVenueValidation, venueController.createVenue);
router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);
router.put('/:id', updateVenueValidation, venueController.updateVenue);
router.delete('/:id', venueController.deleteVenue);
router.get('/borough/:boroughId', venueController.getVenuesByBorough);
router.get('/search', venueController.searchVenues);

module.exports = router;