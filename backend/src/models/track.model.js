const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Track = sequelize.define('Track', {
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
  album_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'albums',
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
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds'
  },
  release_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  audio_url: {
    type: DataTypes.TEXT,
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
  tableName: 'tracks',
  timestamps: true,
  underscored: true
});

module.exports = Track;