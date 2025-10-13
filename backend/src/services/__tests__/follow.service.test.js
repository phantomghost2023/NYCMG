// Mock the models
jest.mock('../../models', () => {
  const mockFollow = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
    destroy: jest.fn()
  };
  
  return {
    Follow: mockFollow,
    User: {
      findByPk: jest.fn()
    }
  };
});

// Import the actual service functions
const followService = require('../follow.service');
const { Follow, User } = require('../../models');

describe('Follow Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('followUser', () => {
    it('should follow a user successfully', async () => {
      const followerId = 'user1';
      const followingId = 'user2';
      
      // Mock that the user being followed exists
      User.findByPk.mockResolvedValue({ id: followingId, username: 'testuser' });
      
      // Mock that they're not already following
      Follow.findOne.mockResolvedValue(null);
      
      // Mock follow creation
      const mockFollow = { 
        id: '1', 
        follower_id: followerId,
        following_id: followingId
      };
      Follow.create.mockResolvedValue(mockFollow);

      const result = await followService.followUser(followerId, followingId);
      
      expect(User.findByPk).toHaveBeenCalledWith(followingId);
      expect(Follow.findOne).toHaveBeenCalledWith({
        where: {
          follower_id: followerId,
          following_id: followingId
        }
      });
      expect(Follow.create).toHaveBeenCalledWith({
        follower_id: followerId,
        following_id: followingId
      });
      expect(result).toEqual(mockFollow);
    });

    it('should throw error when user tries to follow themselves', async () => {
      const userId = 'user1';
      
      await expect(followService.followUser(userId, userId)).rejects.toThrow('You cannot follow yourself');
    });

    it('should throw error when user being followed does not exist', async () => {
      const followerId = 'user1';
      const followingId = 'nonexistent';
      
      User.findByPk.mockResolvedValue(null);
      
      await expect(followService.followUser(followerId, followingId)).rejects.toThrow('User not found');
    });

    it('should throw error when already following the user', async () => {
      const followerId = 'user1';
      const followingId = 'user2';
      
      User.findByPk.mockResolvedValue({ id: followingId, username: 'testuser' });
      
      // Mock that they're already following
      const existingFollow = { id: '1', follower_id: followerId, following_id: followingId };
      Follow.findOne.mockResolvedValue(existingFollow);
      
      await expect(followService.followUser(followerId, followingId)).rejects.toThrow('Already following this user');
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user successfully', async () => {
      const followerId = 'user1';
      const followingId = 'user2';
      
      // Mock that they're following
      const mockFollow = { 
        id: '1', 
        follower_id: followerId,
        following_id: followingId,
        destroy: jest.fn().mockResolvedValue()
      };
      Follow.findOne.mockResolvedValue(mockFollow);

      const result = await followService.unfollowUser(followerId, followingId);
      
      expect(Follow.findOne).toHaveBeenCalledWith({
        where: {
          follower_id: followerId,
          following_id: followingId
        }
      });
      expect(mockFollow.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Successfully unfollowed user' });
    });

    it('should throw error when not following the user', async () => {
      const followerId = 'user1';
      const followingId = 'user2';
      
      // Mock that they're not following
      Follow.findOne.mockResolvedValue(null);
      
      await expect(followService.unfollowUser(followerId, followingId)).rejects.toThrow('Not following this user');
    });
  });

  describe('getFollowers', () => {
    it('should fetch followers for a user', async () => {
      const userId = 'user1';
      
      const mockResult = {
        rows: [
          { 
            id: '1', 
            follower_id: 'user2', 
            follower: { id: 'user2', username: 'follower1', email: 'follower1@example.com' } 
          }
        ],
        count: 1
      };
      
      Follow.findAndCountAll.mockResolvedValue(mockResult);

      const result = await followService.getFollowers(userId);
      
      expect(Follow.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { following_id: userId },
          order: [['created_at', 'DESC']]
        })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getFollowing', () => {
    it('should fetch users that a user is following', async () => {
      const userId = 'user1';
      
      const mockResult = {
        rows: [
          { 
            id: '1', 
            following_id: 'user2', 
            following: { id: 'user2', username: 'following1', email: 'following1@example.com' } 
          }
        ],
        count: 1
      };
      
      Follow.findAndCountAll.mockResolvedValue(mockResult);

      const result = await followService.getFollowing(userId);
      
      expect(Follow.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { follower_id: userId },
          order: [['created_at', 'DESC']]
        })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('isFollowing', () => {
    it('should return true when user is following another user', async () => {
      const followerId = 'user1';
      const followingId = 'user2';
      
      // Mock that they're following
      const mockFollow = { id: '1', follower_id: followerId, following_id: followingId };
      Follow.findOne.mockResolvedValue(mockFollow);

      const result = await followService.isFollowing(followerId, followingId);
      
      expect(Follow.findOne).toHaveBeenCalledWith({
        where: {
          follower_id: followerId,
          following_id: followingId
        }
      });
      expect(result).toBe(true);
    });

    it('should return false when user is not following another user', async () => {
      const followerId = 'user1';
      const followingId = 'user2';
      
      // Mock that they're not following
      Follow.findOne.mockResolvedValue(null);

      const result = await followService.isFollowing(followerId, followingId);
      
      expect(Follow.findOne).toHaveBeenCalledWith({
        where: {
          follower_id: followerId,
          following_id: followingId
        }
      });
      expect(result).toBe(false);
    });
  });
});