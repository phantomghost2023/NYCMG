const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import all models
const User = require('../models/User');
const Artist = require('../models/Artist');
const Borough = require('../models/Borough');
const Genre = require('../models/Genre');
const Album = require('../models/Album');
const Track = require('../models/Track');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Follow = require('../models/Follow');
const Share = require('../models/Share');
const Notification = require('../models/Notification');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Ticket = require('../models/Ticket');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Analytics = require('../models/Analytics');
const Report = require('../models/Report');

// Set up associations
User.hasOne(Artist, { foreignKey: 'userId' });
Artist.belongsTo(User, { foreignKey: 'userId' });

Artist.hasMany(Track, { foreignKey: 'artistId' });
Track.belongsTo(Artist, { foreignKey: 'artistId' });

Artist.hasMany(Album, { foreignKey: 'artistId' });
Album.belongsTo(Artist, { foreignKey: 'artistId' });

Album.hasMany(Track, { foreignKey: 'albumId' });
Track.belongsTo(Album, { foreignKey: 'albumId' });

Genre.belongsToMany(Track, { through: 'TrackGenres', foreignKey: 'genreId' });
Track.belongsToMany(Genre, { through: 'TrackGenres', foreignKey: 'trackId' });

Borough.hasMany(Artist, { foreignKey: 'boroughId' });
Artist.belongsTo(Borough, { foreignKey: 'boroughId' });

Borough.hasMany(Track, { foreignKey: 'boroughId' });
Track.belongsTo(Borough, { foreignKey: 'boroughId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Track.hasMany(Comment, { foreignKey: 'trackId' });
Comment.belongsTo(Track, { foreignKey: 'trackId' });

User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId' });

Track.hasMany(Like, { foreignKey: 'trackId' });
Like.belongsTo(Track, { foreignKey: 'trackId' });

User.hasMany(Follow, { foreignKey: 'followerId' });
User.hasMany(Follow, { foreignKey: 'followingId' });
Follow.belongsTo(User, { as: 'Follower', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'Following', foreignKey: 'followingId' });

User.hasMany(Share, { foreignKey: 'userId' });
Share.belongsTo(User, { foreignKey: 'userId' });

Track.hasMany(Share, { foreignKey: 'trackId' });
Share.belongsTo(Track, { foreignKey: 'trackId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// New associations for events and venues
Venue.belongsTo(Borough, { foreignKey: 'boroughId' });
Borough.hasMany(Venue, { foreignKey: 'boroughId' });

Event.belongsTo(Venue, { foreignKey: 'venueId' });
Venue.hasMany(Event, { foreignKey: 'venueId' });

Event.belongsTo(Artist, { foreignKey: 'artistId' });
Artist.hasMany(Event, { foreignKey: 'artistId' });

// Ticket associations
Ticket.belongsTo(Event, { foreignKey: 'eventId' });
Event.hasMany(Ticket, { foreignKey: 'eventId' });

Ticket.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Ticket, { foreignKey: 'userId' });

// Subscription associations
Subscription.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Subscription, { foreignKey: 'userId' });

// Payment associations
Payment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Payment, { foreignKey: 'userId' });

// Report associations
Report.belongsTo(User, { as: 'Reporter', foreignKey: 'reporterId' });
User.hasMany(Report, { foreignKey: 'reporterId' });

Report.belongsTo(User, { as: 'Resolver', foreignKey: 'resolvedBy' });
User.hasMany(Report, { foreignKey: 'resolvedBy' });

module.exports = sequelize;