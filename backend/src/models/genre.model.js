const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Genre = sequelize.define('Genre', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'genres',
  timestamps: true,
  underscored: true
});

// Seed initial genre data
const seedGenres = async () => {
  const genres = [
    { name: 'Hip-Hop', description: 'NYC hip-hop culture' },
    { name: 'Indie Rock', description: 'Independent rock music' },
    { name: 'Lo-Fi', description: 'Lo-fi hip-hop and chill beats' },
    { name: 'Jazz', description: 'Jazz music tradition' },
    { name: 'Punk', description: 'Punk rock and alternative' },
    { name: 'Afrobeat', description: 'African-inspired rhythms' },
    { name: 'Experimental', description: 'Experimental and avant-garde' },
    { name: 'Electronic', description: 'Electronic music production' },
    { name: 'Pop', description: 'Popular music' },
    { name: 'R&B', description: 'Rhythm and blues' },
    { name: 'Folk', description: 'Folk and acoustic music' },
    { name: 'Classical', description: 'Classical music tradition' }
  ];

  for (const genreData of genres) {
    const [genre, created] = await Genre.findOrCreate({
      where: { name: genreData.name },
      defaults: genreData
    });

    if (created) {
      console.log(`Created genre: ${genre.name}`);
    }
  }
};

module.exports = { Genre, seedGenres };