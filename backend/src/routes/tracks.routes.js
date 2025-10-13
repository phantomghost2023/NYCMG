const express = require('express');
const router = express.Router();
const trackController = require('../controllers/track.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/', trackController.listTracks);
router.get('/:id', trackController.getTrack);

// Protected routes
router.post('/', authenticateToken, trackController.create);
router.put('/:id', authenticateToken, trackController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), trackController.remove);

module.exports = router;