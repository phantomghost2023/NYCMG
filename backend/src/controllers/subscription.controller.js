const subscriptionService = require('../services/subscription.service');
const { validationResult } = require('express-validator');

class SubscriptionController {
  // Create a new subscription
  async createSubscription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const subscriptionData = {
        ...req.body,
        userId: req.user.id // Assuming user is authenticated
      };

      const subscription = await subscriptionService.createSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all subscriptions for a user
  async getSubscriptionsByUser(req, res) {
    try {
      const subscriptions = await subscriptionService.getSubscriptionsByUser(req.user.id, req.query);
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get subscription by ID
  async getSubscriptionById(req, res) {
    try {
      const subscription = await subscriptionService.getSubscriptionById(req.params.id);
      res.json(subscription);
    } catch (error) {
      if (error.message === 'Subscription not found') {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Update subscription
  async updateSubscription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
      res.json(subscription);
    } catch (error) {
      if (error.message === 'Subscription not found') {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Cancel subscription
  async cancelSubscription(req, res) {
    try {
      const subscription = await subscriptionService.cancelSubscription(req.params.id);
      res.json(subscription);
    } catch (error) {
      if (error.message === 'Subscription not found') {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Check if subscription is active
  async isSubscriptionActive(req, res) {
    try {
      const isActive = await subscriptionService.isSubscriptionActive(req.user.id);
      res.json({ active: isActive });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Renew subscription
  async renewSubscription(req, res) {
    try {
      const subscription = await subscriptionService.renewSubscription(req.params.id);
      res.json(subscription);
    } catch (error) {
      if (error.message === 'Subscription not found') {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SubscriptionController();