const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

// User registration validation schema
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// User profile update validation schema
const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  phone: Joi.string().optional()
});

// Artist creation validation schema
const createArtistSchema = Joi.object({
  artist_name: Joi.string().min(1).max(100).required(),
  verified_nyc: Joi.boolean().optional()
});

// Artist update validation schema
const updateArtistSchema = Joi.object({
  artist_name: Joi.string().min(1).max(100).optional(),
  verified_nyc: Joi.boolean().optional()
});

// Track creation validation schema
const createTrackSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  release_date: Joi.date().iso().optional(),
  is_explicit: Joi.boolean().optional(),
  genreIds: Joi.array().items(Joi.string().uuid()).optional()
});

// Track update validation schema
const updateTrackSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  release_date: Joi.date().iso().optional(),
  is_explicit: Joi.boolean().optional(),
  genreIds: Joi.array().items(Joi.string().uuid()).optional()
});

// Album creation validation schema
const createAlbumSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  release_date: Joi.date().iso().optional(),
  cover_art_url: Joi.string().uri().optional(),
  is_explicit: Joi.boolean().optional()
});

// Album update validation schema
const updateAlbumSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  release_date: Joi.date().iso().optional(),
  cover_art_url: Joi.string().uri().optional(),
  is_explicit: Joi.boolean().optional()
});

// Comment creation validation schema
const createCommentSchema = Joi.object({
  track_id: Joi.string().uuid().optional(),
  artist_id: Joi.string().uuid().optional(),
  album_id: Joi.string().uuid().optional(),
  parent_id: Joi.string().uuid().optional(),
  content: Joi.string().min(1).max(1000).required()
});

// Comment update validation schema
const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});

// Follow validation schema
const followSchema = Joi.object({
  followingId: Joi.string().uuid().required()
});

// Like validation schema
const likeSchema = Joi.object({
  track_id: Joi.string().uuid().optional(),
  artist_id: Joi.string().uuid().optional(),
  album_id: Joi.string().uuid().optional(),
  comment_id: Joi.string().uuid().optional()
}).xor('track_id', 'artist_id', 'album_id', 'comment_id');

// Share validation schema
const shareSchema = Joi.object({
  track_id: Joi.string().uuid().optional(),
  artist_id: Joi.string().uuid().optional(),
  album_id: Joi.string().uuid().optional(),
  platform: Joi.string().valid('facebook', 'twitter', 'instagram', 'tiktok', 'other').optional()
}).xor('track_id', 'artist_id', 'album_id');

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateUserSchema,
  createArtistSchema,
  updateArtistSchema,
  createTrackSchema,
  updateTrackSchema,
  createAlbumSchema,
  updateAlbumSchema,
  createCommentSchema,
  updateCommentSchema,
  followSchema,
  likeSchema,
  shareSchema
};