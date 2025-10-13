const Genre = require('./src/models/genre.model');
const Track = require('./src/models/track.model');

console.log('Genre model:', Genre);
console.log('Genre prototype:', Object.getPrototypeOf(Genre));
console.log('Is Genre a Sequelize model?', Genre.prototype && Genre.prototype.constructor && Genre.prototype.constructor.name);

console.log('Track model:', Track);
console.log('Track prototype:', Object.getPrototypeOf(Track));
console.log('Is Track a Sequelize model?', Track.prototype && Track.prototype.constructor && Track.prototype.constructor.name);