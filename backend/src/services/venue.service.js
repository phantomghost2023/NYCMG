const Venue = require('../models/Venue');
const Borough = require('../models/Borough');
const { Sequelize } = require('sequelize');

class VenueService {
  // Create a new venue
  async createVenue(venueData) {
    try {
      const venue = await Venue.create(venueData);
      return venue;
    } catch (error) {
      throw new Error(`Failed to create venue: ${error.message}`);
    }
  }

  // Get all venues with optional filters
  async getAllVenues(filters = {}) {
    try {
      const { page = 1, limit = 20, boroughId } = filters;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (boroughId) whereClause.boroughId = boroughId;

      const venues = await Venue.findAndCountAll({
        where: whereClause,
        include: [{ model: Borough }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']]
      });

      return {
        venues: venues.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: venues.count,
          pages: Math.ceil(venues.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch venues: ${error.message}`);
    }
  }

  // Get venue by ID
  async getVenueById(id) {
    try {
      const venue = await Venue.findByPk(id, {
        include: [{ model: Borough }]
      });

      if (!venue) {
        throw new Error('Venue not found');
      }

      return venue;
    } catch (error) {
      throw new Error(`Failed to fetch venue: ${error.message}`);
    }
  }

  // Update venue
  async updateVenue(id, updateData) {
    try {
      const venue = await Venue.findByPk(id);
      if (!venue) {
        throw new Error('Venue not found');
      }

      await venue.update(updateData);
      return venue;
    } catch (error) {
      throw new Error(`Failed to update venue: ${error.message}`);
    }
  }

  // Delete venue
  async deleteVenue(id) {
    try {
      const venue = await Venue.findByPk(id);
      if (!venue) {
        throw new Error('Venue not found');
      }

      await venue.destroy();
      return { message: 'Venue deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete venue: ${error.message}`);
    }
  }

  // Get venues by borough
  async getVenuesByBorough(boroughId, filters = {}) {
    try {
      const { page = 1, limit = 20 } = filters;
      const offset = (page - 1) * limit;

      const venues = await Venue.findAndCountAll({
        where: { boroughId },
        include: [{ model: Borough }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']]
      });

      return {
        venues: venues.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: venues.count,
          pages: Math.ceil(venues.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch borough venues: ${error.message}`);
    }
  }

  // Search venues
  async searchVenues(query, filters = {}) {
    try {
      const { page = 1, limit = 20 } = filters;
      const offset = (page - 1) * limit;

      const venues = await Venue.findAndCountAll({
        where: {
          [Sequelize.Op.or]: [
            { name: { [Sequelize.Op.iLike]: `%${query}%` } },
            { address: { [Sequelize.Op.iLike]: `%${query}%` } },
            { description: { [Sequelize.Op.iLike]: `%${query}%` } }
          ]
        },
        include: [{ model: Borough }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['name', 'ASC']]
      });

      return {
        venues: venues.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: venues.count,
          pages: Math.ceil(venues.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to search venues: ${error.message}`);
    }
  }
}

module.exports = new VenueService();