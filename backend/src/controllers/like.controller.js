const { 
  createLike, 
  removeLike, 
  getLikesCount, 
  getUserLikes,
  isLiked
} = require('../services/like.service');
const { authenticateToken } = require('../middleware/auth.middleware');
const { likeSchema, validate } = require('../middleware/validation.middleware');

const like = async (req, res) => {
  try {
    const userId = req.user.userId;
    const likeData = req.body;
    
    const like = await createLike(userId, likeData);
    res.status(201).json(like);
  } catch (error) {
    if (error.message === 'Must like exactly one entity (track, artist, album, or comment)' ||
        error.message === 'Track not found' ||
        error.message === 'Artist not found' ||
        error.message === 'Album not found' ||
        error.message === 'Comment not found' ||
        error.message === 'Already liked this entity') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const unlike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const likeData = req.body;
    
    const result = await removeLike(userId, likeData);
    res.json(result);
  } catch (error) {
    if (error.message === 'Like not found') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate entity type
    const validEntityTypes = ['track', 'artist', 'album', 'comment'];
    if (!validEntityTypes.includes(entityType)) {
      return res.status(400).json({ error: 'Invalid entity type' });
    }
    
    const result = await getLikesCount(entityType, entityId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listUserLikes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };
    
    const result = await getUserLikes(userId, options);
    
    res.json({
      data: result.rows,
      pagination: {
        currentPage: Math.floor(result.offset / result.limit) + 1,
        totalPages: Math.ceil(result.count / result.limit),
        totalCount: result.count,
        limit: result.limit,
        offset: result.offset
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkLike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const likeData = req.body;
    
    const liked = await isLiked(userId, likeData);
    res.json({ liked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  like: [validate(likeSchema), like],
  unlike: [validate(likeSchema), unlike],
  getLikes,
  listUserLikes,
  checkLike: [validate(likeSchema), checkLike]
};