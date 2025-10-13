const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Borough = sequelize.define('Borough', {
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
  },
  banner_url: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'boroughs',
  timestamps: true,
  underscored: true
});

// Seed initial borough data
const seedBoroughs = async () => {
  const boroughs = [
    { name: 'Manhattan', description: 'The heart of NYC' },
    { name: 'Brooklyn', description: 'Diverse and vibrant' },
    { name: 'Queens', description: 'International sounds and cultures' },
    { name: 'The Bronx', description: 'Birthplace of hip-hop' },
    { name: 'Staten Island', description: 'Emerging music scene' }
  ];

  for (const boroughData of boroughs) {
    const [borough, created] = await Borough.findOrCreate({
      where: { name: boroughData.name },
      defaults: boroughData
    });

    if (created) {
      console.log(`Created borough: ${borough.name}`);
    }
  }
};

module.exports = { Borough, seedBoroughs };