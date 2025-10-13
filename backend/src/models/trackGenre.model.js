const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Track = require('./track.model');
const Genre = require('./genre.model');

const TrackGenre = sequelize.define('TrackGenre', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
}, {
  tableName: 'track_genres',
  timestamps: true,
  underscored: true
});

// Define associations
Track.belongsToMany(Genre, {
  through: TrackGenre,
  foreignKey: 'track_id',
  otherKey: 'genre_id'
});

Genre.belongsToMany(Track, {
  through: TrackGenre,
  foreignKey: 'genre_id',
  otherKey: 'track_id'
});

module.exports = TrackGenre;