// This file contains model associations that can be imported separately from model definitions
// to avoid circular dependencies and initialization issues during testing

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

// Flag to track if associations have been set up
let associationsSetUp = false;

const setupAssociations = () => {
  // Prevent duplicate associations
  if (associationsSetUp) {
    return;
  }

  // User associations
  User.hasMany(Artist, { foreignKey: 'user_id', as: 'artists' });
  User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
  User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
  User.hasMany(Share, { foreignKey: 'user_id', as: 'shares' });

  // Artist associations
  Artist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Artist.hasMany(Track, { foreignKey: 'artist_id', as: 'tracks' });
  Artist.hasMany(Album, { foreignKey: 'artist_id', as: 'albums' });
  Artist.hasMany(Comment, { foreignKey: 'artist_id', as: 'comments' });
  Artist.hasMany(Like, { foreignKey: 'artist_id', as: 'likes' });
  Artist.hasMany(Share, { foreignKey: 'artist_id', as: 'shares' });

  // Album associations
  Album.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });
  Album.hasMany(Track, { foreignKey: 'album_id', as: 'tracks' });
  Album.hasMany(Comment, { foreignKey: 'album_id', as: 'comments' });
  Album.hasMany(Like, { foreignKey: 'album_id', as: 'likes' });
  Album.hasMany(Share, { foreignKey: 'album_id', as: 'shares' });

  // Track associations
  Track.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });
  Track.belongsTo(Album, { foreignKey: 'album_id', as: 'album' });
  Track.belongsToMany(Genre, { 
    through: 'track_genres', 
    foreignKey: 'track_id', 
    otherKey: 'genre_id', 
    as: 'genres' 
  });
  Track.hasMany(Comment, { foreignKey: 'track_id', as: 'comments' });
  Track.hasMany(Like, { foreignKey: 'track_id', as: 'likes' });
  Track.hasMany(Share, { foreignKey: 'track_id', as: 'shares' });

  // Genre associations
  Genre.belongsToMany(Track, { 
    through: 'track_genres', 
    foreignKey: 'genre_id', 
    otherKey: 'track_id', 
    as: 'tracks' 
  });

  // Borough associations
  Borough.hasMany(Track, { foreignKey: 'borough_id', as: 'tracks' });

  // Follow associations
  Follow.belongsTo(User, { foreignKey: 'follower_id', as: 'follower' });
  Follow.belongsTo(User, { foreignKey: 'following_id', as: 'following' });

  // Comment associations
  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Comment.belongsTo(Track, { foreignKey: 'track_id', as: 'track' });
  Comment.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });
  Comment.belongsTo(Album, { foreignKey: 'album_id', as: 'album' });
  Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });
  Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });
  Comment.hasMany(Like, { foreignKey: 'comment_id', as: 'likes' });

  // Like associations
  Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Like.belongsTo(Track, { foreignKey: 'track_id', as: 'track' });
  Like.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });
  Like.belongsTo(Album, { foreignKey: 'album_id', as: 'album' });
  Like.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });

  // Share associations
  Share.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Share.belongsTo(Track, { foreignKey: 'track_id', as: 'track' });
  Share.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });
  Share.belongsTo(Album, { foreignKey: 'album_id', as: 'album' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Mark associations as set up
  associationsSetUp = true;
};

module.exports = { setupAssociations };