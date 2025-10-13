const eventService = require('../services/event.service');
const venueService = require('../services/venue.service');
const { validationResult } = require('express-validator');

class EventController {
  // Create a new event
  async createEvent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const event = await eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all events
  async getAllEvents(req, res) {
    try {
      const events = await eventService.getAllEvents(req.query);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get event by ID
  async getEventById(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id);
      res.json(event);
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Update event
  async updateEvent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const event = await eventService.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Delete event
  async deleteEvent(req, res) {
    try {
      const result = await eventService.deleteEvent(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Get events by artist
  async getEventsByArtist(req, res) {
    try {
      const events = await eventService.getEventsByArtist(req.params.artistId, req.query);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get upcoming events
  async getUpcomingEvents(req, res) {
    try {
      const events = await eventService.getUpcomingEvents(req.query);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EventController();