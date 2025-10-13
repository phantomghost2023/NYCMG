const { Follow, User } = require('../models');

const followUser = async (followerId, followingId) => {
  try {
    // Check if user is trying to follow themselves
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }
    
    // Check if the user being followed exists
    const userToFollow = await User.findByPk(followingId);
    if (!userToFollow) {
      throw new Error('User not found');
    }
    
    // Check if already following
    const existingFollow = await Follow.findOne({
      where: {
        follower_id: followerId,
        following_id: followingId
      }
    });
    
    if (existingFollow) {
      throw new Error('Already following this user');
    }
    
    // Create follow relationship
    const follow = await Follow.create({
      follower_id: followerId,
      following_id: followingId
    });
    
    return follow;
  } catch (error) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
};

const unfollowUser = async (followerId, followingId) => {
  try {
    // Check if following relationship exists
    const follow = await Follow.findOne({
      where: {
        follower_id: followerId,
        following_id: followingId
      }
    });
    
    if (!follow) {
      throw new Error('Not following this user');
    }
    
    // Delete follow relationship
    await follow.destroy();
    
    return { message: 'Successfully unfollowed user' };
  } catch (error) {
    throw new Error(`Failed to unfollow user: ${error.message}`);
  }
};

const getFollowers = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0 } = options;
    
    const followers = await Follow.findAndCountAll({
      where: {
        following_id: userId
      },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'username', 'email']
      }],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return followers;
  } catch (error) {
    throw new Error(`Failed to fetch followers: ${error.message}`);
  }
};

const getFollowing = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0 } = options;
    
    const following = await Follow.findAndCountAll({
      where: {
        follower_id: userId
      },
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'username', 'email']
      }],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return following;
  } catch (error) {
    throw new Error(`Failed to fetch following: ${error.message}`);
  }
};

const isFollowing = async (followerId, followingId) => {
  try {
    const follow = await Follow.findOne({
      where: {
        follower_id: followerId,
        following_id: followingId
      }
    });
    
    return !!follow;
  } catch (error) {
    throw new Error(`Failed to check follow status: ${error.message}`);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing
};