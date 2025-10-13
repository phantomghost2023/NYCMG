const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Artist = require('../models/Artist');
const { Sequelize } = require('sequelize');

class EventService {
  // Create a new event
  async createEvent(eventData) {
    try {
      const event = await Event.create(eventData);
      return event;
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  // Get all events with optional filters
  async getAllEvents(filters = {}) {
    try {
      const { page = 1, limit = 20, status, boroughId } = filters;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (status) whereClause.status = status;

      const include = [
        { model: Venue, where: boroughId ? { boroughId } : {} },
        { model: Artist }
      ];

      const events = await Event.findAndCountAll({
        where: whereClause,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['startDate', 'ASC']]
      });

      return {
        events: events.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: events.count,
          pages: Math.ceil(events.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  // Get event by ID
  async getEventById(id) {
    try {
      const event = await Event.findByPk(id, {
        include: [
          { model: Venue },
          { model: Artist }
        ]
      });

      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }

  // Update event
  async updateEvent(id, updateData) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new Error('Event not found');
      }

      await event.update(updateData);
      return event;
    } catch (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  // Delete event
  async deleteEvent(id) {
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        throw new Error('Event not found');
      }

      await event.destroy();
      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  // Get events by artist
  async getEventsByArtist(artistId, filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      const whereClause = { artistId };
      if (status) whereClause.status = status;

      const events = await Event.findAndCountAll({
        where: whereClause,
        include: [{ model: Venue }, { model: Artist }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['startDate', 'ASC']]
      });

      return {
        events: events.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: events.count,
          pages: Math.ceil(events.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch artist events: ${error.message}`);
    }
  }

  // Get upcoming events
  async getUpcomingEvents(filters = {}) {
    try {
      const { page = 1, limit = 20, boroughId } = filters;
      const offset = (page - 1) * limit;

      const whereClause = {
        startDate: {
          [Sequelize.Op.gte]: new Date()
        },
        status: 'upcoming'
      };

      const include = [
        { model: Venue, where: boroughId ? { boroughId } : {} },
        { model: Artist }
      ];

      const events = await Event.findAndCountAll({
        where: whereClause,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['startDate', 'ASC']]
      });

      return {
        events: events.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: events.count,
          pages: Math.ceil(events.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch upcoming events: ${error.message}`);
    }
  }
}

module.exports = new EventService();