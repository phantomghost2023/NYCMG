const { 
  addDatabaseIndexes,
  optimizeConnectionPool,
  getDatabaseStats,
  analyzeQueryPlans,
  optimizeFrequentlyUsedQueries
} = require('../services/dbOptimization.service');

/**
 * Database Optimization Controller
 * Provides endpoints for database performance optimization
 */

/**
 * Add database indexes
 */
const addIndexes = async (req, res) => {
  try {
    const result = await addDatabaseIndexes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Optimize connection pool settings
 */
const optimizePool = async (req, res) => {
  try {
    const result = optimizeConnectionPool();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get database statistics
 */
const getStats = async (req, res) => {
  try {
    const stats = await getDatabaseStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Analyze query plans
 */
const analyzePlans = async (req, res) => {
  try {
    const plans = await analyzeQueryPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Optimize frequently used queries
 */
const optimizeQueries = async (req, res) => {
  try {
    const result = await optimizeFrequentlyUsedQueries();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addIndexes,
  optimizePool,
  getStats,
  analyzePlans,
  optimizeQueries
};