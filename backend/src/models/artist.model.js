const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Artist = sequelize.define('Artist', {
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
  artist_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verified_nyc: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  profile_picture_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'artists',
  timestamps: true,
  underscored: true
});

module.exports = Artist;