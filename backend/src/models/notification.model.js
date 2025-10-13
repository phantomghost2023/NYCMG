const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Notification = sequelize.define('Notification', {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['track_upload', 'new_follower', 'comment', 'like', 'mention', 'system']]
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  related_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  related_type: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['track', 'artist', 'album', 'comment', 'user']]
    }
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true
});

module.exports = Notification;