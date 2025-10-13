const User = require('./user.model');
const Borough = require('./borough.model');
const Genre = require('./genre.model');
const Artist = require('./artist.model');
const Album = require('./album.model');
const Track = require('./track.model');
const Follow = require('./follow.model');
const Comment = require('./comment.model');
const Like = require('./like.model');
const Share = require('./share.model');
const Notification = require('./notification.model');

// Export models without setting up associations here
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
  Notification
};