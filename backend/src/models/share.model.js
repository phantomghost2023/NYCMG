const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Share = sequelize.define('Share', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  track_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tracks',
      key: 'id'
    }
  },
  artist_id: {
    type: DataTypes.UUID,
    allowNull: true,
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
  platform: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['facebook', 'twitter', 'instagram', 'tiktok', 'other']]
    }
  },
  share_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  }
}, {
  tableName: 'shares',
  timestamps: true,
  underscored: true
});

module.exports = Share;