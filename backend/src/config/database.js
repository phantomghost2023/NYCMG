const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const dbConfig = require('./db.config');

dotenv.config();

const sequelize = dbConfig.sequelize;

module.exports = sequelize;
