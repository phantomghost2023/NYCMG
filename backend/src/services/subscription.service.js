const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { Sequelize } = require('sequelize');

class SubscriptionService {
  // Create a new subscription
  async createSubscription(subscriptionData) {
    try {
      // Check if user exists
      const user = await User.findByPk(subscriptionData.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Set end date based on plan type (simplified)
      const startDate = new Date();
      let endDate = new Date(startDate);

      switch (subscriptionData.planType) {
        case 'basic':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'premium':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'artist':
          endDate.setMonth(endDate.getMonth() + 12);
          break;
        default:
          throw new Error('Invalid plan type');
      }

      const subscription = await Subscription.create({
        ...subscriptionData,
        startDate,
        endDate,
        status: 'active'
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  // Get all subscriptions for a user
  async getSubscriptionsByUser(userId, filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;

      const whereClause = { userId };
      if (status) whereClause.status = status;

      const subscriptions = await Subscription.findAndCountAll({
        where: whereClause,
        include: [{ model: User }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['startDate', 'DESC']]
      });

      return {
        subscriptions: subscriptions.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: subscriptions.count,
          pages: Math.ceil(subscriptions.count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user subscriptions: ${error.message}`);
    }
  }

  // Get subscription by ID
  async getSubscriptionById(id) {
    try {
      const subscription = await Subscription.findByPk(id, {
        include: [{ model: User }]
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      return subscription;
    } catch (error) {
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }
  }

  // Update subscription
  async updateSubscription(id, updateData) {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      await subscription.update(updateData);
      return subscription;
    } catch (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }
  }

  // Cancel subscription
  async cancelSubscription(id) {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      if (subscription.status !== 'active') {
        throw new Error('Subscription is not active');
      }

      await subscription.update({ status: 'cancelled' });
      return subscription;
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  // Check if subscription is active
  async isSubscriptionActive(userId) {
    try {
      const subscription = await Subscription.findOne({
        where: {
          userId,
          status: 'active',
          endDate: {
            [Sequelize.Op.gte]: new Date()
          }
        }
      });

      return !!subscription;
    } catch (error) {
      throw new Error(`Failed to check subscription status: ${error.message}`);
    }
  }

  // Renew subscription
  async renewSubscription(id) {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      if (!subscription.autoRenew) {
        throw new Error('Auto-renew is disabled for this subscription');
      }

      const newEndDate = new Date(subscription.endDate);
      switch (subscription.planType) {
        case 'basic':
          newEndDate.setMonth(newEndDate.getMonth() + 1);
          break;
        case 'premium':
          newEndDate.setMonth(newEndDate.getMonth() + 3);
          break;
        case 'artist':
          newEndDate.setMonth(newEndDate.getMonth() + 12);
          break;
        default:
          throw new Error('Invalid plan type');
      }

      await subscription.update({ endDate: newEndDate });
      return subscription;
    } catch (error) {
      throw new Error(`Failed to renew subscription: ${error.message}`);
    }
  }
}

module.exports = new SubscriptionService();