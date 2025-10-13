const { 
  followUser, 
  unfollowUser, 
  getFollowers, 
  getFollowing,
  isFollowing
} = require('../services/follow.service');
const { authenticateToken } = require('../middleware/auth.middleware');
const { followSchema, validate } = require('../middleware/validation.middleware');

const follow = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.userId;
    
    const follow = await followUser(followerId, followingId);
    res.status(201).json(follow);
  } catch (error) {
    if (error.message === 'You cannot follow yourself' || 
        error.message === 'User not found' || 
        error.message === 'Already following this user') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user.userId;
    
    const result = await unfollowUser(followerId, followingId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Not following this user') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const listFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };
    
    const result = await getFollowers(userId, options);
    
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

const listFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };
    
    const result = await getFollowing(userId, options);
    
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

const checkFollowing = async (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user.userId;
    
    const following = await isFollowing(followerId, followingId);
    res.json({ following });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  follow: [validate(followSchema), follow],
  unfollow,
  listFollowers,
  listFollowing,
  checkFollowing
};