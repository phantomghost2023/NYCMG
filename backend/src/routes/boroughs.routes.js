const express = require('express');
const router = express.Router();
const boroughController = require('../controllers/borough.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/', boroughController.listBoroughs);
router.get('/:id', boroughController.getBorough);

// Protected routes (admin only)
router.post('/', authenticateToken, authorizeRole('admin'), boroughController.create);
router.put('/:id', authenticateToken, authorizeRole('admin'), boroughController.update);
router.delete('/:id', authenticateToken, authorizeRole('admin'), boroughController.remove);

module.exports = router;