const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/', albumController.listAlbums);
router.get('/:id', albumController.getAlbum);

// Protected routes
router.post('/', authenticateToken, albumController.create);
router.put('/:id', authenticateToken, albumController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), albumController.remove);

module.exports = router;