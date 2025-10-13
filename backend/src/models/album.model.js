const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  artist_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'artists',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  release_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cover_art_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_explicit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'deleted'),
    defaultValue: 'active'
  }
}, {
  tableName: 'albums',
  timestamps: true,
  underscored: true
});

module.exports = Album;