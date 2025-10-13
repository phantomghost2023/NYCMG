const venueService = require('../services/venue.service');
const { validationResult } = require('express-validator');

class VenueController {
  // Create a new venue
  async createVenue(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const venue = await venueService.createVenue(req.body);
      res.status(201).json(venue);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all venues
  async getAllVenues(req, res) {
    try {
      const venues = await venueService.getAllVenues(req.query);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get venue by ID
  async getVenueById(req, res) {
    try {
      const venue = await venueService.getVenueById(req.params.id);
      res.json(venue);
    } catch (error) {
      if (error.message === 'Venue not found') {
        return res.status(404).json({ error: 'Venue not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Update venue
  async updateVenue(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const venue = await venueService.updateVenue(req.params.id, req.body);
      res.json(venue);
    } catch (error) {
      if (error.message === 'Venue not found') {
        return res.status(404).json({ error: 'Venue not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Delete venue
  async deleteVenue(req, res) {
    try {
      const result = await venueService.deleteVenue(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.message === 'Venue not found') {
        return res.status(404).json({ error: 'Venue not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Get venues by borough
  async getVenuesByBorough(req, res) {
    try {
      const venues = await venueService.getVenuesByBorough(req.params.boroughId, req.query);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Search venues
  async searchVenues(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const venues = await venueService.searchVenues(query, req.query);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VenueController();