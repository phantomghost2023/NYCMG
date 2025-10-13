const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Like = sequelize.define('Like', {
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
  comment_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    }
  }
}, {
  tableName: 'likes',
  timestamps: true,
  underscored: true,
  // Prevent duplicate likes
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'track_id', 'artist_id', 'album_id', 'comment_id']
    }
  ]
});

module.exports = Like;