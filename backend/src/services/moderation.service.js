const Report = require('../models/Report');
const User = require('../models/User');

class ModerationService {
  // Create a new report
  async createReport(reportData) {
    try {
      // Check if reporter exists
      const reporter = await User.findByPk(reportData.reporterId);
      if (!reporter) {
        throw new Error('Reporter not found');
      }

      const report = await Report.create(reportData);
      return report;
    } catch (error) {
      throw new Error(`Failed to create report: ${error.message}`);
    }
  }

  // Get all reports with optional filters
  async getAllReports(filters = {}) {
    try {
      const { page = 1, limit = 20, status, targetType } = filters;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (status) whereClause.status = status;
      if (targetType) whereClause.targetType = targetType;

      const reports = await Report.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'Reporter' },
          { model: User, as: 'Resolver' }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        reports: reports.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reports.count,
          pages: Math.ceil(reports.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }
  }

  // Get report by ID
  async getReportById(id) {
    try {
      const report = await Report.findByPk(id, {
        include: [
          { model: User, as: 'Reporter' },
          { model: User, as: 'Resolver' }
        ]
      });

      if (!report) {
        throw new Error('Report not found');
      }

      return report;
    } catch (error) {
      throw new Error(`Failed to fetch report: ${error.message}`);
    }
  }

  // Update report status
  async updateReportStatus(id, status, resolvedBy = null) {
    try {
      const report = await Report.findByPk(id);
      if (!report) {
        throw new Error('Report not found');
      }

      const updateData = { status };
      if (resolvedBy) {
        updateData.resolvedBy = resolvedBy;
        updateData.resolvedAt = new Date();
      }

      await report.update(updateData);
      return report;
    } catch (error) {
      throw new Error(`Failed to update report status: ${error.message}`);
    }
  }

  // Resolve report
  async resolveReport(id, resolution, resolvedBy) {
    try {
      const report = await Report.findByPk(id);
      if (!report) {
        throw new Error('Report not found');
      }

      await report.update({
        status: 'resolved',
        resolution,
        resolvedBy,
        resolvedAt: new Date()
      });

      return report;
    } catch (error) {
      throw new Error(`Failed to resolve report: ${error.message}`);
    }
  }

  // Dismiss report
  async dismissReport(id, resolvedBy) {
    try {
      const report = await Report.findByPk(id);
      if (!report) {
        throw new Error('Report not found');
      }

      await report.update({
        status: 'dismissed',
        resolvedBy,
        resolvedAt: new Date()
      });

      return report;
    } catch (error) {
      throw new Error(`Failed to dismiss report: ${error.message}`);
    }
  }

  // Get reports by user
  async getReportsByUser(userId, filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      const whereClause = { reporterId: userId };
      if (status) whereClause.status = status;

      const reports = await Report.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'Reporter' },
          { model: User, as: 'Resolver' }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        reports: reports.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reports.count,
          pages: Math.ceil(reports.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user reports: ${error.message}`);
    }
  }

  // Get reports for a target
  async getReportsForTarget(targetType, targetId, filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      const whereClause = { targetType, targetId };
      if (status) whereClause.status = status;

      const reports = await Report.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'Reporter' },
          { model: User, as: 'Resolver' }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        reports: reports.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reports.count,
          pages: Math.ceil(reports.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch target reports: ${error.message}`);
    }
  }

  // Get moderation statistics
  async getModerationStatistics() {
    try {
      const totalReports = await Report.count();
      const pendingReports = await Report.count({ where: { status: 'pending' } });
      const resolvedReports = await Report.count({ where: { status: 'resolved' } });
      const dismissedReports = await Report.count({ where: { status: 'dismissed' } });

      return {
        totalReports,
        pendingReports,
        resolvedReports,
        dismissedReports
      };
    } catch (error) {
      throw new Error(`Failed to fetch moderation statistics: ${error.message}`);
    }
  }
}

module.exports = new ModerationService();