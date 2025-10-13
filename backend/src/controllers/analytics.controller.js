const analyticsService = require('../services/analytics.service');
const { validationResult } = require('express-validator');

class AnalyticsController {
  // Record a metric
  async recordMetric(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const metric = await analyticsService.recordMetric(req.body);
      res.status(201).json(metric);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get analytics for an entity
  async getEntityAnalytics(req, res) {
    try {
      const { entityType, entityId } = req.params;
      const analytics = await analyticsService.getEntityAnalytics(entityType, entityId, req.query);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get aggregated analytics
  async getAggregatedAnalytics(req, res) {
    try {
      const { entityType, entityId } = req.params;
      const analytics = await analyticsService.getAggregatedAnalytics(entityType, entityId, req.query);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get daily analytics
  async getDailyAnalytics(req, res) {
    try {
      const { entityType, entityId } = req.params;
      const analytics = await analyticsService.getDailyAnalytics(entityType, entityId, req.query);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get top performing entities
  async getTopEntities(req, res) {
    try {
      const { entityType, metricType } = req.params;
      const entities = await analyticsService.getTopEntities(entityType, metricType, req.query);
      res.json(entities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Record play count
  async recordPlayCount(req, res) {
    try {
      const { trackId } = req.params;
      const metric = await analyticsService.recordPlayCount(trackId);
      res.status(201).json(metric);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Record like count
  async recordLikeCount(req, res) {
    try {
      const { trackId } = req.params;
      const metric = await analyticsService.recordLikeCount(trackId);
      res.status(201).json(metric);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AnalyticsController();