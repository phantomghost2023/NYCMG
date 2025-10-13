const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Use SQLite for development, PostgreSQL for production
const isTest = process.env.NODE_ENV === 'test';
const isDevelopment = process.env.NODE_ENV === 'development';

console.log('Environment:', process.env.NODE_ENV);
console.log('isTest:', isTest);
console.log('isDevelopment:', isDevelopment);

if (isTest) {
  // Test database configuration using in-memory SQLite
  console.log('Using in-memory SQLite for testing');
  var sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else if (isDevelopment) {
  // Development database configuration using SQLite file
  console.log('Using SQLite file for development');
  var sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
      evict: 1000
    },
    retry: {
      max: 3
    }
  });
} else {
  // Production database configuration with PostgreSQL
  console.log('Using PostgreSQL for production');
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_DIALECT:', process.env.DB_DIALECT);
  
  var sequelize = new Sequelize(
    process.env.DB_NAME || 'nycmg_dev',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: process.env.DB_DIALECT || 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000,
        evict: 1000
      },
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          rejectUnauthorized: false
        } : false
      }
    }
  );
}

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