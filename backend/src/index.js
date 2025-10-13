const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const winston = require('winston');
const path = require('path');
const { sequelize } = require('./config/db.config');
const { seedBoroughs } = require('./models/borough.model');
const { seedGenres } = require('./models/genre.model');
const { initWebSocketServer } = require('./services/websocket.service');
const sanitize = require('./middleware/sanitize.middleware');
const securityHeaders = require('./middleware/security.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const { setupAssociations } = require('./models/associations');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(securityHeaders);

// Rate limiting
app.use(generalLimiter);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization middleware
app.use(sanitize);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'NYCMG API Server', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/artists', require('./routes/artists.routes'));
app.use('/api/v1/artist-profile', require('./routes/artistProfile.routes'));
app.use('/api/v1/tracks', require('./routes/tracks.routes'));
app.use('/api/v1/albums', require('./routes/albums.routes'));
app.use('/api/v1/boroughs', require('./routes/boroughs.routes'));
app.use('/api/v1/genres', require('./routes/genres.routes'));
app.use('/api/v1/events', require('./routes/events.routes'));
app.use('/api/v1/track-upload', require('./routes/trackUpload.routes'));
app.use('/api/v1/audio', require('./routes/audioStream.routes'));
app.use('/api/v1/notifications', require('./routes/notifications.routes'));
app.use('/api/v1/follows', require('./routes/follows.routes'));
app.use('/api/v1/comments', require('./routes/comments.routes'));
app.use('/api/v1/likes', require('./routes/likes.routes'));
app.use('/api/v1/shares', require('./routes/shares.routes'));
app.use('/api/v1/cache', require('./routes/cache.routes'));
app.use('/api/v1/db-optimization', require('./routes/dbOptimization.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Set up model associations
setupAssociations();

// Database initialization - only run when not in test environment
if (process.env.NODE_ENV !== 'test') {
  // Database initialization
  const initDatabase = async () => {
    try {
      // Test database connection
      await sequelize.authenticate();
      logger.info('Database connection has been established successfully.');
      
      // Sync models
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized successfully.');
      
      // Seed initial data
      await seedBoroughs();
      await seedGenres();
      logger.info('Initial data seeding completed.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  };

  // Start server
  initDatabase().then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`NYCMG API Server running on port ${PORT}`);
      console.log(`NYCMG API Server running on port ${PORT}`);
    });
    
    // Initialize WebSocket server
    initWebSocketServer(server);
  });
}

module.exports = app;