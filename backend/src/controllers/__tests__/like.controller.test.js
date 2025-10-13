const { like, unlike, getLikes, listUserLikes, checkLike } = require('../like.controller');
const { 
  createLike, 
  removeLike, 
  getLikesCount, 
  getUserLikes,
  isLiked
} = require('../../services/like.service');

// Mock the like service functions
jest.mock('../../services/like.service');

describe('Like Controller', () => {
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

  describe('like', () => {
    it('should like an entity successfully', async () => {
      req.body = {
        track_id: 'trackToLikeId'
      };
      
      const mockResult = { id: '1', track_id: 'trackToLikeId' };
      createLike.mockResolvedValue(mockResult);

      // Since like is an array with middleware, we need to call the actual function
      const likeFunction = Array.isArray(like) ? like[1] : like;
      await likeFunction(req, res);

      expect(createLike).toHaveBeenCalledWith('currentUserId', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      req.body = {
        track_id: 'trackToLikeId'
      };
      
      const errorMessage = 'Database error';
      createLike.mockRejectedValue(new Error(errorMessage));

      // Since like is an array with middleware, we need to call the actual function
      const likeFunction = Array.isArray(like) ? like[1] : like;
      await likeFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('unlike', () => {
    it('should unlike an entity successfully', async () => {
      req.body = {
        track_id: 'trackToUnlikeId'
      };
      
      const mockResult = { message: 'Successfully unliked entity' };
      removeLike.mockResolvedValue(mockResult);

      // Since unlike is an array with middleware, we need to call the actual function
      const unlikeFunction = Array.isArray(unlike) ? unlike[1] : unlike;
      await unlikeFunction(req, res);

      expect(removeLike).toHaveBeenCalledWith('currentUserId', req.body);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      req.body = {
        track_id: 'trackToUnlikeId'
      };
      
      const errorMessage = 'Database error';
      removeLike.mockRejectedValue(new Error(errorMessage));

      // Since unlike is an array with middleware, we need to call the actual function
      const unlikeFunction = Array.isArray(unlike) ? unlike[1] : unlike;
      await unlikeFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getLikes', () => {
    it('should return likes count for an entity', async () => {
      req.params = {
        entityType: 'track',
        entityId: 'testTrackId'
      };
      
      const mockLikes = { count: 5 };
      getLikesCount.mockResolvedValue(mockLikes);

      await getLikes(req, res);

      expect(getLikesCount).toHaveBeenCalledWith('track', 'testTrackId');
      expect(res.json).toHaveBeenCalledWith(mockLikes);
    });

    it('should return 400 for invalid entity type', async () => {
      req.params = {
        entityType: 'invalid',
        entityId: 'testEntityId'
      };

      await getLikes(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid entity type' });
    });

    it('should handle service errors', async () => {
      req.params = {
        entityType: 'track',
        entityId: 'testTrackId'
      };
      
      const errorMessage = 'Database error';
      getLikesCount.mockRejectedValue(new Error(errorMessage));

      await getLikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('listUserLikes', () => {
    it('should return user likes', async () => {
      req.query = { limit: '10', offset: '0' };
      
      const mockLikes = {
        rows: [
          { id: 'like1', track_id: 'track1' },
          { id: 'like2', track_id: 'track2' }
        ],
        count: 2,
        limit: 10,
        offset: 0
      };
      
      getUserLikes.mockResolvedValue(mockLikes);

      await listUserLikes(req, res);

      expect(getUserLikes).toHaveBeenCalledWith('currentUserId', { limit: 10, offset: 0 });
      expect(res.json).toHaveBeenCalledWith({
        data: mockLikes.rows,
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
      req.query = { limit: '10', offset: '0' };
      
      const errorMessage = 'Database error';
      getUserLikes.mockRejectedValue(new Error(errorMessage));

      await listUserLikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});