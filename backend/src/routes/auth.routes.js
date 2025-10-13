const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

// Public routes
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authenticateToken, authController.refreshToken);

// Development route - ONLY for development environment
if (process.env.NODE_ENV === 'development') {
  router.post('/dev-token', async (req, res) => {
    try {
      // Import services directly
      const { User } = require('../models');
      const jwt = require('jsonwebtoken');
      
      // Create or find test user
      let user = await User.findOne({ where: { email: 'devtest@example.com' } });
      
      if (!user) {
        // Create test user
        const bcrypt = require('bcryptjs');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('DevPass123!', saltRounds);
        
        user = await User.create({
          email: 'devtest@example.com',
          username: 'devtest',
          password_hash: hashedPassword,
          role: 'artist'
        });
        
        console.log('Created dev test user');
      }
      
      // Create or find admin user
      let adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
      
      if (!adminUser) {
        // Create admin user
        const bcrypt = require('bcryptjs');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('AdminPass123!', saltRounds);
        
        adminUser = await User.create({
          email: 'admin@example.com',
          username: 'admin',
          password_hash: hashedPassword,
          role: 'admin'
        });
        
        console.log('Created dev admin user');
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;