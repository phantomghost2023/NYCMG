const express = require('express');
const router = express.Router();
const aiErrorChatController = require('../controllers/aiErrorChat.controller');
const { authenticateToken, authorizeRole } = require('../../middleware/auth.middleware');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Apply rate limiting to all routes
router.use(generalLimiter);

// Public routes (no authentication required)
router.get('/health', aiErrorChatController.healthCheck.bind(aiErrorChatController));

// Protected routes (authentication required)
router.use(authenticateToken);

// Chat with AI about errors
router.post('/chat', aiErrorChatController.chatWithAI.bind(aiErrorChatController));

// Get error analysis
router.get('/analyze/:errorId', aiErrorChatController.analyzeError.bind(aiErrorChatController));

// Get error statistics
router.get('/stats', aiErrorChatController.getErrorStats.bind(aiErrorChatController));

// Get error trends
router.get('/trends', aiErrorChatController.getErrorTrends.bind(aiErrorChatController));

// Get recent errors
router.get('/recent', aiErrorChatController.getRecentErrors.bind(aiErrorChatController));

// Get error details
router.get('/error/:errorId', aiErrorChatController.getErrorDetails.bind(aiErrorChatController));

// Apply suggested fix
router.post('/fix', aiErrorChatController.applyFix.bind(aiErrorChatController));

// Get prevention suggestions
router.get('/prevention', aiErrorChatController.getPreventionSuggestions.bind(aiErrorChatController));

// Admin-only routes
router.use(authorizeRole('admin', 'super_admin'));

// Get comprehensive error dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await aiErrorChatController.getErrorStats(req, res);
    const trends = await aiErrorChatController.getErrorTrends(req, res);
    const recentErrors = await aiErrorChatController.getRecentErrors(req, res);
    
    res.json({
      statistics: stats,
      trends: trends,
      recentErrors: recentErrors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Dashboard failed',
      message: 'Unable to retrieve dashboard data'
    });
  }
});

// Get error patterns and insights
router.get('/insights', async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    // Get error patterns
    const patterns = await getErrorPatterns(timeframe);
    
    // Get insights from AI
    const insights = await getAIInsights(patterns);
    
    res.json({
      patterns: patterns,
      insights: insights,
      timeframe: timeframe,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Insights failed',
      message: 'Unable to retrieve error insights'
    });
  }
});

// Export error data
router.get('/export', async (req, res) => {
  try {
    const { format = 'json', timeframe = '30d' } = req.query;
    
    const errors = await getErrorsForExport(timeframe);
    
    if (format === 'csv') {
      const csv = convertToCSV(errors);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=errors.csv');
      res.send(csv);
    } else {
      res.json({
        errors: errors,
        format: format,
        timeframe: timeframe,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Export failed',
      message: 'Unable to export error data'
    });
  }
});

// Helper functions
async function getErrorPatterns(timeframe) {
  // Implementation to get error patterns
  return {
    timeframe: timeframe,
    patterns: [],
    topErrors: [],
    trends: []
  };
}

async function getAIInsights(patterns) {
  // Implementation to get AI insights
  return {
    insights: [],
    recommendations: [],
    predictions: []
  };
}

async function getErrorsForExport(timeframe) {
  // Implementation to get errors for export
  return [];
}

function convertToCSV(errors) {
  // Implementation to convert errors to CSV
  return 'error_id,severity,message,timestamp\n';
}

module.exports = router;
