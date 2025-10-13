const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/', artistController.listArtists);
router.get('/:id', artistController.getArtist);

// Protected routes
router.post('/', authenticateToken, artistController.create);
router.put('/:id', authenticateToken, artistController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), artistController.remove);

module.exports = router;