const Analytics = require('../models/Analytics');
const { Sequelize } = require('sequelize');

class AnalyticsService {
  // Record a metric
  async recordMetric(metricData) {
    try {
      const metric = await Analytics.create(metricData);
      return metric;
    } catch (error) {
      throw new Error(`Failed to record metric: ${error.message}`);
    }
  }

  // Get analytics for an entity
  async getEntityAnalytics(entityType, entityId, filters = {}) {
    try {
      const { startDate, endDate, metricType } = filters;

      const whereClause = {
        entityType,
        entityId
      };

      if (metricType) whereClause.metricType = metricType;
      if (startDate || endDate) {
        whereClause.date = {};
        if (startDate) whereClause.date[Sequelize.Op.gte] = startDate;
        if (endDate) whereClause.date[Sequelize.Op.lte] = endDate;
      }

      const metrics = await Analytics.findAll({
        where: whereClause,
        order: [['date', 'ASC']]
      });

      return metrics;
    } catch (error) {
      throw new Error(`Failed to fetch entity analytics: ${error.message}`);
    }
  }

  // Get aggregated analytics
  async getAggregatedAnalytics(entityType, entityId, filters = {}) {
    try {
      const { startDate, endDate, metricType } = filters;

      const whereClause = {
        entityType,
        entityId
      };

      if (metricType) whereClause.metricType = metricType;
      if (startDate || endDate) {
        whereClause.date = {};
        if (startDate) whereClause.date[Sequelize.Op.gte] = startDate;
        if (endDate) whereClause.date[Sequelize.Op.lte] = endDate;
      }

      const metrics = await Analytics.findAll({
        where: whereClause,
        attributes: [
          'metricType',
          [Sequelize.fn('SUM', Sequelize.col('value')), 'total'],
          [Sequelize.fn('AVG', Sequelize.col('value')), 'average'],
          [Sequelize.fn('MAX', Sequelize.col('value')), 'max'],
          [Sequelize.fn('MIN', Sequelize.col('value')), 'min']
        ],
        group: ['metricType']
      });

      return metrics;
    } catch (error) {
      throw new Error(`Failed to fetch aggregated analytics: ${error.message}`);
    }
  }

  // Get daily analytics
  async getDailyAnalytics(entityType, entityId, filters = {}) {
    try {
      const { startDate, endDate, metricType } = filters;

      const whereClause = {
        entityType,
        entityId
      };

      if (metricType) whereClause.metricType = metricType;
      if (startDate || endDate) {
        whereClause.date = {};
        if (startDate) whereClause.date[Sequelize.Op.gte] = startDate;
        if (endDate) whereClause.date[Sequelize.Op.lte] = endDate;
      }

      const metrics = await Analytics.findAll({
        where: whereClause,
        attributes: [
          'date',
          'metricType',
          [Sequelize.fn('SUM', Sequelize.col('value')), 'total']
        ],
        group: ['date', 'metricType'],
        order: [['date', 'ASC']]
      });

      return metrics;
    } catch (error) {
      throw new Error(`Failed to fetch daily analytics: ${error.message}`);
    }
  }

  // Get top performing entities
  async getTopEntities(entityType, metricType, filters = {}) {
    try {
      const { limit = 10, startDate, endDate } = filters;

      const whereClause = {
        entityType,
        metricType
      };

      if (startDate || endDate) {
        whereClause.date = {};
        if (startDate) whereClause.date[Sequelize.Op.gte] = startDate;
        if (endDate) whereClause.date[Sequelize.Op.lte] = endDate;
      }

      const metrics = await Analytics.findAll({
        where: whereClause,
        attributes: [
          'entityId',
          [Sequelize.fn('SUM', Sequelize.col('value')), 'total']
        ],
        group: ['entityId'],
        order: [[Sequelize.fn('SUM', Sequelize.col('value')), 'DESC']],
        limit: parseInt(limit)
      });

      return metrics;
    } catch (error) {
      throw new Error(`Failed to fetch top entities: ${error.message}`);
    }
  }

  // Record play count
  async recordPlayCount(trackId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [metric, created] = await Analytics.findOrCreate({
        where: {
          entityType: 'track',
          entityId: trackId,
          metricType: 'play_count',
          date: today
        },
        defaults: {
          entityType: 'track',
          entityId: trackId,
          metricType: 'play_count',
          value: 1,
          date: today
        }
      });

      if (!created) {
        await metric.increment('value', { by: 1 });
      }

      return metric;
    } catch (error) {
      throw new Error(`Failed to record play count: ${error.message}`);
    }
  }

  // Record like count
  async recordLikeCount(trackId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [metric, created] = await Analytics.findOrCreate({
        where: {
          entityType: 'track',
          entityId: trackId,
          metricType: 'like_count',
          date: today
        },
        defaults: {
          entityType: 'track',
          entityId: trackId,
          metricType: 'like_count',
          value: 1,
          date: today
        }
      });

      if (!created) {
        await metric.increment('value', { by: 1 });
      }

      return metric;
    } catch (error) {
      throw new Error(`Failed to record like count: ${error.message}`);
    }
  }
}

module.exports = new AnalyticsService();