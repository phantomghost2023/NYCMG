const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

class TicketService {
  // Purchase a ticket
  async purchaseTicket(ticketData) {
    try {
      // Check if event exists and has available capacity
      const event = await Event.findByPk(ticketData.eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Check if user exists
      const user = await User.findByPk(ticketData.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create the ticket
      const ticket = await Ticket.create({
        ...ticketData,
        price: event.ticketPrice,
        status: 'purchased'
      });

      // Generate QR code (simplified)
      const qrCode = `NYCMG-TICKET-${ticket.id}-${Date.now()}`;
      await ticket.update({ qrCode });

      return ticket;
    } catch (error) {
      throw new Error(`Failed to purchase ticket: ${error.message}`);
    }
  }

  // Get all tickets for a user
  async getTicketsByUser(userId, filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      const whereClause = { userId };
      if (status) whereClause.status = status;

      const tickets = await Ticket.findAndCountAll({
        where: whereClause,
        include: [{ model: Event }, { model: User }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['purchaseDate', 'DESC']]
      });

      return {
        tickets: tickets.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: tickets.count,
          pages: Math.ceil(tickets.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user tickets: ${error.message}`);
    }
  }

  // Get ticket by ID
  async getTicketById(id) {
    try {
      const ticket = await Ticket.findByPk(id, {
        include: [{ model: Event }, { model: User }]
      });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return ticket;
    } catch (error) {
      throw new Error(`Failed to fetch ticket: ${error.message}`);
    }
  }

  // Update ticket status (e.g., used, refunded)
  async updateTicketStatus(id, status) {
    try {
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      await ticket.update({ status });
      return ticket;
    } catch (error) {
      throw new Error(`Failed to update ticket status: ${error.message}`);
    }
  }

  // Get tickets for an event
  async getTicketsByEvent(eventId, filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      const whereClause = { eventId };
      if (status) whereClause.status = status;

      const tickets = await Ticket.findAndCountAll({
        where: whereClause,
        include: [{ model: Event }, { model: User }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['purchaseDate', 'DESC']]
      });

      return {
        tickets: tickets.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: tickets.count,
          pages: Math.ceil(tickets.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch event tickets: ${error.message}`);
    }
  }

  // Cancel a ticket
  async cancelTicket(id) {
    try {
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      if (ticket.status !== 'purchased') {
        throw new Error('Ticket cannot be cancelled');
      }

      await ticket.update({ status: 'cancelled' });
      return ticket;
    } catch (error) {
      throw new Error(`Failed to cancel ticket: ${error.message}`);
    }
  }
}

module.exports = new TicketService();