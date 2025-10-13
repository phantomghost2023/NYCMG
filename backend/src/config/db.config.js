const { Sequelize } = require('sequelize');

// Database configuration with optimized connection pooling
const sequelize = new Sequelize(
  process.env.DB_NAME || 'nycmg_dev',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 20,      // Increased from default 5
      min: 5,       // Increased from default 0
      acquire: 30000,
      idle: 10000,
      evict: 1000   // Add eviction check every second
    },
    // Add performance optimizations
    benchmark: false, // Disable benchmarking in production
    retry: {
      max: 3 // Retry failed queries up to 3 times
    },
    // Add query optimizations
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    }
  }
);

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
};