const paymentService = require('../services/payment.service');
const { validationResult } = require('express-validator');

class PaymentController {
  // Create a new payment
  async createPayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const paymentData = {
        ...req.body,
        userId: req.user.id // Assuming user is authenticated
      };

      const payment = await paymentService.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all payments for a user
  async getPaymentsByUser(req, res) {
    try {
      const payments = await paymentService.getPaymentsByUser(req.user.id, req.query);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get payment by ID
  async getPaymentById(req, res) {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);
      res.json(payment);
    } catch (error) {
      if (error.message === 'Payment not found') {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      const { status } = req.body;
      const payment = await paymentService.updatePaymentStatus(req.params.id, status);
      res.json(payment);
    } catch (error) {
      if (error.message === 'Payment not found') {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Process payment
  async processPayment(req, res) {
    try {
      const payment = await paymentService.processPayment(req.params.id);
      res.json(payment);
    } catch (error) {
      if (error.message === 'Payment not found') {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Refund payment
  async refundPayment(req, res) {
    try {
      const payment = await paymentService.refundPayment(req.params.id);
      res.json(payment);
    } catch (error) {
      if (error.message === 'Payment not found') {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Get payment statistics
  async getPaymentStatistics(req, res) {
    try {
      const statistics = await paymentService.getPaymentStatistics(req.user.id);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();