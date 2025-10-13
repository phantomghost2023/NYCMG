const { Sequelize } = require('sequelize');

// Test database configuration using in-memory SQLite
const testSequelize = new Sequelize('sqlite::memory:', {
  logging: false,
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = {
  sequelize: testSequelize
};