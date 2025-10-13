const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Comment = sequelize.define('Comment', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 1000]
    }
  },
  parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    }
  }
}, {
  tableName: 'comments',
  timestamps: true,
  underscored: true
});

module.exports = Comment;