const moderationService = require('../services/moderation.service');
const { validationResult } = require('express-validator');

class ModerationController {
  // Create a new report
  async createReport(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const reportData = {
        ...req.body,
        reporterId: req.user.id // Assuming user is authenticated
      };

      const report = await moderationService.createReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all reports
  async getAllReports(req, res) {
    try {
      const reports = await moderationService.getAllReports(req.query);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get report by ID
  async getReportById(req, res) {
    try {
      const report = await moderationService.getReportById(req.params.id);
      res.json(report);
    } catch (error) {
      if (error.message === 'Report not found') {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Update report status
  async updateReportStatus(req, res) {
    try {
      const { status } = req.body;
      const report = await moderationService.updateReportStatus(
        req.params.id, 
        status, 
        req.user.id // Assuming user is authenticated and is a moderator
      );
      res.json(report);
    } catch (error) {
      if (error.message === 'Report not found') {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Resolve report
  async resolveReport(req, res) {
    try {
      const { resolution } = req.body;
      const report = await moderationService.resolveReport(
        req.params.id, 
        resolution, 
        req.user.id // Assuming user is authenticated and is a moderator
      );
      res.json(report);
    } catch (error) {
      if (error.message === 'Report not found') {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Dismiss report
  async dismissReport(req, res) {
    try {
      const report = await moderationService.dismissReport(
        req.params.id, 
        req.user.id // Assuming user is authenticated and is a moderator
      );
      res.json(report);
    } catch (error) {
      if (error.message === 'Report not found') {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Get reports by user
  async getReportsByUser(req, res) {
    try {
      const reports = await moderationService.getReportsByUser(req.user.id, req.query);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get reports for a target
  async getReportsForTarget(req, res) {
    try {
      const { targetType, targetId } = req.params;
      const reports = await moderationService.getReportsForTarget(targetType, targetId, req.query);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get moderation statistics
  async getModerationStatistics(req, res) {
    try {
      const statistics = await moderationService.getModerationStatistics();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ModerationController();