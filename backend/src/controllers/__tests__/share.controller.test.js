const { share, getShares, listUserShares } = require('../share.controller');
const { 
  createShare, 
  getSharesCount, 
  getUserShares 
} = require('../../services/share.service');

// Mock the share service functions
jest.mock('../../services/share.service');

describe('Share Controller', () => {
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

  describe('share', () => {
    it('should share an entity successfully', async () => {
      req.body = {
        track_id: 'trackToShareId',
        platform: 'twitter'
      };
      
      const mockResult = { id: '1', track_id: 'trackToShareId', platform: 'twitter' };
      createShare.mockResolvedValue(mockResult);

      // Since share is an array with middleware, we need to call the actual function
      const shareFunction = Array.isArray(share) ? share[1] : share;
      await shareFunction(req, res);

      expect(createShare).toHaveBeenCalledWith('currentUserId', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      req.body = {
        track_id: 'trackToShareId',
        platform: 'twitter'
      };
      
      const errorMessage = 'Database error';
      createShare.mockRejectedValue(new Error(errorMessage));

      // Since share is an array with middleware, we need to call the actual function
      const shareFunction = Array.isArray(share) ? share[1] : share;
      await shareFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getShares', () => {
    it('should return shares count for an entity', async () => {
      req.params = {
        entityType: 'track',
        entityId: 'testTrackId'
      };
      
      const mockShares = { count: 5 };
      getSharesCount.mockResolvedValue(mockShares);

      await getShares(req, res);

      expect(getSharesCount).toHaveBeenCalledWith('track', 'testTrackId');
      expect(res.json).toHaveBeenCalledWith(mockShares);
    });

    it('should return 400 for invalid entity type', async () => {
      req.params = {
        entityType: 'invalid',
        entityId: 'testEntityId'
      };

      await getShares(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid entity type' });
    });

    it('should handle service errors', async () => {
      req.params = {
        entityType: 'track',
        entityId: 'testTrackId'
      };
      
      const errorMessage = 'Database error';
      getSharesCount.mockRejectedValue(new Error(errorMessage));

      await getShares(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('listUserShares', () => {
    it('should return user shares', async () => {
      req.query = { limit: '10', offset: '0' };
      
      const mockShares = {
        rows: [
          { id: 'share1', platform: 'twitter' },
          { id: 'share2', platform: 'facebook' }
        ],
        count: 2,
        limit: 10,
        offset: 0
      };
      
      getUserShares.mockResolvedValue(mockShares);

      await listUserShares(req, res);

      expect(getUserShares).toHaveBeenCalledWith('currentUserId', { limit: 10, offset: 0 });
      expect(res.json).toHaveBeenCalledWith({
        data: mockShares.rows,
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
      getUserShares.mockRejectedValue(new Error(errorMessage));

      await listUserShares(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});