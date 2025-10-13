const User = require('./user.model');
const { Borough } = require('./borough.model');
const { Genre } = require('./genre.model');
const Artist = require('./artist.model');
const Album = require('./album.model');
const Track = require('./track.model');
const Follow = require('./follow.model');
const Comment = require('./comment.model');
const Like = require('./like.model');
const Share = require('./share.model');
const Notification = require('./notification.model');
const Event = require('./Event');
const Venue = require('./Venue');
const Ticket = require('./Ticket');
const Subscription = require('./Subscription');
const Payment = require('./Payment');
const Analytics = require('./Analytics');
const Report = require('./Report');

// Export models
module.exports = {
  User,
  Borough,
  Genre,
  Artist,
  Album,
  Track,
  Follow,
  Comment,
  Like,
  Share,
  Notification,
  Event,
  Venue,
  Ticket,
  Subscription,
  Payment,
  Analytics,
  Report
};