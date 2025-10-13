const express = require('express');
const router = express.Router();
const { 
  addIndexes,
  optimizePool,
  getStats,
  analyzePlans,
  optimizeQueries
} = require('../controllers/dbOptimization.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

/**
 * Database Optimization Routes
 * Routes for database performance optimization
 */

// All routes require admin authentication
router.use(authenticateToken, authorizeRole('admin'));

// Add database indexes
router.post('/indexes', addIndexes);

// Optimize connection pool
router.post('/pool', optimizePool);

// Get database statistics
router.get('/stats', getStats);

// Analyze query plans
router.get('/analyze', analyzePlans);

// Optimize frequently used queries
router.post('/queries', optimizeQueries);

module.exports = router;