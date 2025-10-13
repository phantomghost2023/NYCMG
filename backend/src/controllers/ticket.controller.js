const ticketService = require('../services/ticket.service');
const { validationResult } = require('express-validator');

class TicketController {
  // Purchase a ticket
  async purchaseTicket(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const ticketData = {
        ...req.body,
        userId: req.user.id // Assuming user is authenticated
      };

      const ticket = await ticketService.purchaseTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all tickets for a user
  async getTicketsByUser(req, res) {
    try {
      const tickets = await ticketService.getTicketsByUser(req.user.id, req.query);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get ticket by ID
  async getTicketById(req, res) {
    try {
      const ticket = await ticketService.getTicketById(req.params.id);
      res.json(ticket);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Update ticket status
  async updateTicketStatus(req, res) {
    try {
      const { status } = req.body;
      const ticket = await ticketService.updateTicketStatus(req.params.id, status);
      res.json(ticket);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Get tickets for an event
  async getTicketsByEvent(req, res) {
    try {
      const tickets = await ticketService.getTicketsByEvent(req.params.eventId, req.query);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Cancel a ticket
  async cancelTicket(req, res) {
    try {
      const ticket = await ticketService.cancelTicket(req.params.id);
      res.json(ticket);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TicketController();