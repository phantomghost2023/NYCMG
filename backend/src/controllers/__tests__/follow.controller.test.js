const { follow, unfollow, listFollowers, listFollowing, checkFollowing } = require('../follow.controller');
const { 
  followUser, 
  unfollowUser, 
  getFollowers, 
  getFollowing 
} = require('../../services/follow.service');

// Mock the follow service functions
jest.mock('../../services/follow.service');

describe('Follow Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock request and response objects
    req = {
      params: {},
      body: {},
      user: { userId: 'currentUserId' },
      query: {}
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('follow', () => {
    it('should follow a user successfully', async () => {
      req.body = {
        followingId: 'userToFollowId'
      };
      
      const mockResult = { message: 'Successfully followed user' };
      followUser.mockResolvedValue(mockResult);

      // Since follow is an array with middleware, we need to call the actual function
      const followFunction = Array.isArray(follow) ? follow[1] : follow;
      await followFunction(req, res);

      expect(followUser).toHaveBeenCalledWith('currentUserId', 'userToFollowId');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      req.body = {
        followingId: 'userToFollowId'
      };
      
      const errorMessage = 'Database error';
      followUser.mockRejectedValue(new Error(errorMessage));

      // Since follow is an array with middleware, we need to call the actual function
      const followFunction = Array.isArray(follow) ? follow[1] : follow;
      await followFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('unfollow', () => {
    it('should unfollow a user successfully', async () => {
      const followingId = 'userToUnfollowId';
      req.params = { followingId };
      
      const mockResult = { message: 'Successfully unfollowed user' };
      unfollowUser.mockResolvedValue(mockResult);

      await unfollow(req, res);

      expect(unfollowUser).toHaveBeenCalledWith('currentUserId', followingId);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      const followingId = 'userToUnfollowId';
      req.params = { followingId };
      
      const errorMessage = 'Database error';
      unfollowUser.mockRejectedValue(new Error(errorMessage));

      await unfollow(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('listFollowers', () => {
    it('should return user followers', async () => {
      const userId = 'testUserId';
      req.params = { userId };
      req.query = { limit: '10', offset: '0' };
      
      const mockFollowers = {
        rows: [
          { id: 'follower1', username: 'follower1' },
          { id: 'follower2', username: 'follower2' }
        ],
        count: 2,
        limit: 10,
        offset: 0
      };
      
      getFollowers.mockResolvedValue(mockFollowers);

      await listFollowers(req, res);

      expect(getFollowers).toHaveBeenCalledWith(userId, { limit: 10, offset: 0 });
      expect(res.json).toHaveBeenCalledWith({
        data: mockFollowers.rows,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 2,
          limit: 10,
          offset: 0
        }
      });
    });

    it('should handle service errors', async () => {
      const userId = 'testUserId';
      req.params = { userId };
      
      const errorMessage = 'Database error';
      getFollowers.mockRejectedValue(new Error(errorMessage));

      await listFollowers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('listFollowing', () => {
    it('should return users that the user is following', async () => {
      const userId = 'testUserId';
      req.params = { userId };
      req.query = { limit: '10', offset: '0' };
      
      const mockFollowing = {
        rows: [
          { id: 'following1', username: 'following1' },
          { id: 'following2', username: 'following2' }
        ],
        count: 2,
        limit: 10,
        offset: 0
      };
      
      getFollowing.mockResolvedValue(mockFollowing);

      await listFollowing(req, res);

      expect(getFollowing).toHaveBeenCalledWith(userId, { limit: 10, offset: 0 });
      expect(res.json).toHaveBeenCalledWith({
        data: mockFollowing.rows,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 2,
          limit: 10,
          offset: 0
        }
      });
    });

    it('should handle service errors', async () => {
      const userId = 'testUserId';
      req.params = { userId };
      
      const errorMessage = 'Database error';
      getFollowing.mockRejectedValue(new Error(errorMessage));

      await listFollowing(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});