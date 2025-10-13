const { getCacheStats, clearAllCaches } = require('../services/cache.service');
const { authorizeRole } = require('../middleware/auth.middleware');

const getCacheStatistics = async (req, res) => {
  try {
    const stats = getCacheStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearAllCache = async (req, res) => {
  try {
    clearAllCaches();
    res.json({ message: 'All caches cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCacheStatistics,
  clearAllCache: [authorizeRole('admin'), clearAllCache]
};