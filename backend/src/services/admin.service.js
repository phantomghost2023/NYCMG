const { User, Artist, Track, Album, Event, Venue, Report } = require('../models');
const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

class AdminService {
  // Get system statistics
  async getSystemStatistics() {
    try {
      const totalUsers = await User.count();
      const totalArtists = await Artist.count();
      const totalTracks = await Track.count();
      const totalAlbums = await Album.count();
      const totalEvents = await Event.count();
      const totalVenues = await Venue.count();
      
      const recentUsers = await User.count({
        where: {
          createdAt: {
            [Sequelize.Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      });

      return {
        users: {
          total: totalUsers,
          recent: recentUsers
        },
        content: {
          artists: totalArtists,
          tracks: totalTracks,
          albums: totalAlbums
        },
        events: {
          total: totalEvents,
          venues: totalVenues
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch system statistics: ${error.message}`);
    }
  }

  // Get user list with pagination
  async getUserList(filters = {}) {
    try {
      const { page = 1, limit = 20, search, role } = filters;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (search) {
        whereClause[Sequelize.Op.or] = [
          { username: { [Sequelize.Op.iLike]: `%${search}%` } },
          { email: { [Sequelize.Op.iLike]: `%${search}%` } }
        ];
      }

      const users = await User.findAndCountAll({
        where: whereClause,
        include: [{ model: Artist }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        users: users.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: users.count,
          pages: Math.ceil(users.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user list: ${error.message}`);
    }
  }

  // Get artist list with pagination
  async getArtistList(filters = {}) {
    try {
      const { page = 1, limit = 20, search, boroughId } = filters;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (boroughId) whereClause.boroughId = boroughId;

      const include = [{ model: User }];
      if (search) {
        include[0].where = {
          [Sequelize.Op.or]: [
            { username: { [Sequelize.Op.iLike]: `%${search}%` } }
          ]
        };
      }

      const artists = await Artist.findAndCountAll({
        where: whereClause,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        artists: artists.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: artists.count,
          pages: Math.ceil(artists.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch artist list: ${error.message}`);
    }
  }

  // Get content list with pagination
  async getContentList(contentType, filters = {}) {
    try {
      const { page = 1, limit = 20, search } = filters;
      const offset = (page - 1) * limit;

      let model;
      switch (contentType) {
        case 'track':
          model = Track;
          break;
        case 'album':
          model = Album;
          break;
        case 'event':
          model = Event;
          break;
        default:
          throw new Error('Invalid content type');
      }

      const whereClause = {};
      if (search) {
        whereClause.title = { [Sequelize.Op.iLike]: `%${search}%` };
      }

      const include = [];
      if (contentType === 'track') {
        include.push({ model: Artist });
      } else if (contentType === 'album') {
        include.push({ model: Artist });
      } else if (contentType === 'event') {
        include.push({ model: Artist }, { model: Venue });
      }

      const content = await model.findAndCountAll({
        where: whereClause,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        content: content.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: content.count,
          pages: Math.ceil(content.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch content list: ${error.message}`);
    }
  }

  // Get pending reports
  async getPendingReports(filters = {}) {
    try {
      const { page = 1, limit = 20 } = filters;
      const offset = (page - 1) * limit;

      const reports = await Report.findAndCountAll({
        where: { status: 'pending' },
        include: [
          { model: User, as: 'Reporter' }
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
      throw new Error(`Failed to fetch pending reports: ${error.message}`);
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Suspend user
  async suspendUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ suspended: true });
      return user;
    } catch (error) {
      throw new Error(`Failed to suspend user: ${error.message}`);
    }
  }

  // Unsuspend user
  async unsuspendUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await user.update({ suspended: false });
      return user;
    } catch (error) {
      throw new Error(`Failed to unsuspend user: ${error.message}`);
    }
  }

  // Verify artist
  async verifyArtist(artistId) {
    try {
      const artist = await Artist.findByPk(artistId);
      if (!artist) {
        throw new Error('Artist not found');
      }

      await artist.update({ verified: true });
      return artist;
    } catch (error) {
      throw new Error(`Failed to verify artist: ${error.message}`);
    }
  }

  // Get system health
  async getSystemHealth() {
    try {
      // Check database connection
      const dbStatus = await sequelize.authenticate()
        .then(() => 'connected')
        .catch(() => 'disconnected');

      // Get recent error logs (simplified)
      const recentErrors = 0; // In a real implementation, this would query logs

      return {
        database: dbStatus,
        recentErrors,
        uptime: process.uptime()
      };
    } catch (error) {
      throw new Error(`Failed to fetch system health: ${error.message}`);
    }
  }
}

module.exports = new AdminService();