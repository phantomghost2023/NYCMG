const { sequelize } = require('./db.test.config');
const { setupAssociations } = require('../models/associations');

// Import all models
const User = require('../models/user.model');
const { Borough } = require('../models/borough.model');
const { Genre } = require('../models/genre.model');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Track = require('../models/track.model');
const Follow = require('../models/follow.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const Share = require('../models/share.model');
const Notification = require('../models/notification.model');

// Reinitialize models with test database
const initTestModels = () => {
  // Get all models and reinitialize them with test database
  const models = [
    User, Borough, Genre, Artist, Album, Track, Follow, Comment, Like, Share, Notification
  ];
  
  // Set up associations
  setupAssociations();
};

module.exports = {
  sequelize,
  initTestModels
};