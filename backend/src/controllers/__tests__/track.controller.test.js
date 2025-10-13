const { listTracks, getTrack, create, update, remove } = require('../track.controller');
const { 
  getAllTracks, 
  getTrackById, 
  createTrack, 
  updateTrack, 
  deleteTrack 
} = require('../../services/track.service');

// Mock the track service functions
jest.mock('../../services/track.service');

describe('Track Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock request and response objects
    req = {
      query: {},
      params: {},
      body: {},
      user: {}
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('listTracks', () => {
    it('should return a list of tracks with default options', async () => {
      const mockResult = {
        tracks: [{ id: 1, title: 'Test Track' }],
        totalCount: 1,
        limit: 20,
        offset: 0
      };

      getAllTracks.mockResolvedValue(mockResult);

      await listTracks(req, res);

      expect(getAllTracks).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        sortBy: 'created_at',
        sortOrder: 'DESC',
        boroughIds: null,
        genreIds: null,
        search: undefined,
        artistId: undefined,
        isExplicit: undefined
      });
      
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 1, title: 'Test Track' }],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 1,
          limit: 20,
          offset: 0
        }
      });
    });

    it('should handle boroughIds and genreIds as arrays', async () => {
      req.query = {
        boroughIds: ['borough1', 'borough2'],
        genreIds: ['genre1', 'genre2']
      };

      const mockResult = {
        tracks: [],
        totalCount: 0,
        limit: 20,
        offset: 0
      };

      getAllTracks.mockResolvedValue(mockResult);

      await listTracks(req, res);

      expect(getAllTracks).toHaveBeenCalledWith(
        expect.objectContaining({
          boroughIds: ['borough1', 'borough2'],
          genreIds: ['genre1', 'genre2']
        })
      );
    });

    it('should handle boroughIds and genreIds as JSON strings', async () => {
      req.query = {
        boroughIds: '["borough1", "borough2"]',
        genreIds: '["genre1", "genre2"]'
      };

      const mockResult = {
        tracks: [],
        totalCount: 0,
        limit: 20,
        offset: 0
      };

      getAllTracks.mockResolvedValue(mockResult);

      await listTracks(req, res);

      expect(getAllTracks).toHaveBeenCalledWith(
        expect.objectContaining({
          boroughIds: ['borough1', 'borough2'],
          genreIds: ['genre1', 'genre2']
        })
      );
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database error';
      getAllTracks.mockRejectedValue(new Error(errorMessage));

      await listTracks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getTrack', () => {
    it('should return a track by ID', async () => {
      const trackId = '1';
      req.params.id = trackId;
      
      const mockTrack = { id: trackId, title: 'Test Track' };
      getTrackById.mockResolvedValue(mockTrack);

      await getTrack(req, res);

      expect(getTrackById).toHaveBeenCalledWith(trackId);
      expect(res.json).toHaveBeenCalledWith(mockTrack);
    });

    it('should return 404 when track is not found', async () => {
      const trackId = 'nonexistent';
      req.params.id = trackId;
      
      getTrackById.mockRejectedValue(new Error('Track not found'));

      await getTrack(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Track not found' });
    });

    it('should handle service errors', async () => {
      const trackId = '1';
      req.params.id = trackId;
      
      const errorMessage = 'Database error';
      getTrackById.mockRejectedValue(new Error(errorMessage));

      await getTrack(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('create', () => {
    it('should create a new track', async () => {
      req.body = {
        title: 'New Track',
        artist_id: 'artist1'
      };
      
      const mockTrack = { id: '1', title: 'New Track', artist_id: 'artist1' };
      createTrack.mockResolvedValue(mockTrack);

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(createTrack).toHaveBeenCalledWith('artist1', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTrack);
    });

    it('should return 400 when artist ID is missing', async () => {
      req.body = {
        title: 'New Track'
      };

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Artist ID is required' });
    });

    it('should handle artist not found error', async () => {
      req.body = {
        title: 'New Track',
        artist_id: 'nonexistent'
      };
      
      createTrack.mockRejectedValue(new Error('Artist not found'));

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Artist not found' });
    });

    it('should handle service errors', async () => {
      req.body = {
        title: 'New Track',
        artist_id: 'artist1'
      };
      
      const errorMessage = 'Validation error';
      createTrack.mockRejectedValue(new Error(errorMessage));

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('update', () => {
    it('should update a track', async () => {
      const trackId = '1';
      req.params.id = trackId;
      req.body = {
        title: 'Updated Track'
      };
      
      const mockTrack = { id: trackId, title: 'Updated Track' };
      updateTrack.mockResolvedValue(mockTrack);

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(updateTrack).toHaveBeenCalledWith(trackId, req.body);
      expect(res.json).toHaveBeenCalledWith(mockTrack);
    });

    it('should return 404 when track is not found', async () => {
      const trackId = 'nonexistent';
      req.params.id = trackId;
      req.body = {
        title: 'Updated Track'
      };
      
      updateTrack.mockRejectedValue(new Error('Track not found'));

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Track not found' });
    });

    it('should handle service errors', async () => {
      const trackId = '1';
      req.params.id = trackId;
      req.body = {
        title: 'Updated Track'
      };
      
      const errorMessage = 'Validation error';
      updateTrack.mockRejectedValue(new Error(errorMessage));

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('remove', () => {
    it('should delete a track', async () => {
      const trackId = '1';
      req.params.id = trackId;
      
      const mockResult = { message: 'Track deleted successfully' };
      deleteTrack.mockResolvedValue(mockResult);

      await remove(req, res);

      expect(deleteTrack).toHaveBeenCalledWith(trackId);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 when track is not found', async () => {
      const trackId = 'nonexistent';
      req.params.id = trackId;
      
      deleteTrack.mockRejectedValue(new Error('Track not found'));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Track not found' });
    });

    it('should handle service errors', async () => {
      const trackId = '1';
      req.params.id = trackId;
      
      const errorMessage = 'Database error';
      deleteTrack.mockRejectedValue(new Error(errorMessage));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});