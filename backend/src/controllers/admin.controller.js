const adminService = require('../services/admin.service');
const { validationResult } = require('express-validator');

class AdminController {
  // Get system statistics
  async getSystemStatistics(req, res) {
    try {
      const statistics = await adminService.getSystemStatistics();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get user list
  async getUserList(req, res) {
    try {
      const users = await adminService.getUserList(req.query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get artist list
  async getArtistList(req, res) {
    try {
      const artists = await adminService.getArtistList(req.query);
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get content list
  async getContentList(req, res) {
    try {
      const { contentType } = req.params;
      const content = await adminService.getContentList(contentType, req.query);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get pending reports
  async getPendingReports(req, res) {
    try {
      const reports = await adminService.getPendingReports(req.query);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const result = await adminService.deleteUser(req.params.userId);
      res.json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Suspend user
  async suspendUser(req, res) {
    try {
      const user = await adminService.suspendUser(req.params.userId);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Unsuspend user
  async unsuspendUser(req, res) {
    try {
      const user = await adminService.unsuspendUser(req.params.userId);
      res.json(user);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Verify artist
  async verifyArtist(req, res) {
    try {
      const artist = await adminService.verifyArtist(req.params.artistId);
      res.json(artist);
    } catch (error) {
      if (error.message === 'Artist not found') {
        return res.status(404).json({ error: 'Artist not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Get system health
  async getSystemHealth(req, res) {
    try {
      const health = await adminService.getSystemHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdminController();