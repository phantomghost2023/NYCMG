const Payment = require('../models/Payment');
const User = require('../models/User');

class PaymentService {
  // Create a new payment
  async createPayment(paymentData) {
    try {
      // Check if user exists
      const user = await User.findByPk(paymentData.userId);
      if (!user) {
        throw new Error('User not found');
      }

      const payment = await Payment.create({
        ...paymentData,
        status: 'pending'
      });

      return payment;
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  // Get all payments for a user
  async getPaymentsByUser(userId, filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      const whereClause = { userId };
      if (status) whereClause.status = status;

      const payments = await Payment.findAndCountAll({
        where: whereClause,
        include: [{ model: User }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        payments: payments.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: payments.count,
          pages: Math.ceil(payments.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user payments: ${error.message}`);
    }
  }

  // Get payment by ID
  async getPaymentById(id) {
    try {
      const payment = await Payment.findByPk(id, {
        include: [{ model: User }]
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      return payment;
    } catch (error) {
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  }

  // Update payment status
  async updatePaymentStatus(id, status) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      await payment.update({ status });
      return payment;
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  // Process payment (simplified)
  async processPayment(id) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'pending') {
        throw new Error('Payment is not in pending status');
      }

      // Simulate payment processing
      // In a real application, this would integrate with a payment gateway
      await payment.update({ status: 'completed' });
      return payment;
    } catch (error) {
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }

  // Refund payment
  async refundPayment(id) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'completed') {
        throw new Error('Only completed payments can be refunded');
      }

      await payment.update({ status: 'refunded' });
      return payment;
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error.message}`);
    }
  }

  // Get payment statistics
  async getPaymentStatistics(userId) {
    try {
      const totalPayments = await Payment.count({
        where: { userId }
      });

      const completedPayments = await Payment.count({
        where: { userId, status: 'completed' }
      });

      const totalAmount = await Payment.sum('amount', {
        where: { userId, status: 'completed' }
      });

      return {
        totalPayments,
        completedPayments,
        totalAmount: totalAmount || 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch payment statistics: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();