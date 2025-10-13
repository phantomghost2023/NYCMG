const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/', genreController.listGenres);
router.get('/:id', genreController.getGenre);

// Protected routes (admin only)
router.post('/', authenticateToken, authorizeRole('admin'), genreController.create);
router.put('/:id', authenticateToken, authorizeRole('admin'), genreController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), genreController.remove);

module.exports = router;