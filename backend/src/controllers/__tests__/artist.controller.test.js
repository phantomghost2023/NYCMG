// Mock the artist service
jest.mock('../../services/artist.service');

// Mock the auth middleware
jest.mock('../../middleware/auth.middleware', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // Add a mock user to the request
    req.user = { userId: 'user123' };
    next();
  }),
  authorizeRole: jest.fn(() => (req, res, next) => next())
}));

// Mock the validation middleware
jest.mock('../../middleware/validation.middleware', () => ({
  createArtistSchema: {},
  updateArtistSchema: {},
  validate: jest.fn(() => (req, res, next) => next())
}));

// Mock the associations to prevent errors
jest.mock('../../models/associations', () => ({
  setupAssociations: jest.fn()
}));

const request = require('supertest');
const app = require('../../index');
const { 
  getAllArtists, 
  getArtistById, 
  createArtist, 
  updateArtist, 
  deleteArtist 
} = require('../../services/artist.service');

describe('Artist Controller', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/v1/artists', () => {
    it('should return a list of artists', async () => {
      const mockArtists = {
        artists: [
          { id: '1', artist_name: 'Artist 1', user_id: 'user1' },
          { id: '2', artist_name: 'Artist 2', user_id: 'user2' }
        ],
        totalCount: 2,
        limit: 20,
        offset: 0
      };

      // Mock the service function
      getAllArtists.mockResolvedValue(mockArtists);

      const response = await request(app)
        .get('/api/v1/artists')
        .expect(200);

      expect(response.body).toEqual(mockArtists);
      expect(getAllArtists).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });
    });

    it('should handle service errors', async () => {
      // Mock the service function to throw an error
      getAllArtists.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/v1/artists')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /api/v1/artists/:id', () => {
    it('should return an artist by ID', async () => {
      const mockArtist = {
        id: '1',
        artist_name: 'Test Artist',
        user_id: 'user1'
      };

      // Mock the service function
      getArtistById.mockResolvedValue(mockArtist);

      const response = await request(app)
        .get('/api/v1/artists/1')
        .expect(200);

      expect(response.body).toEqual(mockArtist);
      expect(getArtistById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if artist is not found', async () => {
      // Mock the service function to throw an error
      getArtistById.mockRejectedValue(new Error('Artist not found'));

      const response = await request(app)
        .get('/api/v1/artists/nonexistent')
        .expect(404);

      expect(response.body).toEqual({ error: 'Artist not found' });
    });

    it('should handle other service errors', async () => {
      // Mock the service function to throw an error
      getArtistById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/v1/artists/1')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('POST /api/v1/artists', () => {
    it('should create a new artist', async () => {
      const artistData = {
        artist_name: 'New Artist',
        verified_nyc: true
      };

      const mockArtist = {
        id: '1',
        ...artistData,
        user_id: 'user123'
      };

      // Mock the service function
      createArtist.mockResolvedValue(mockArtist);

      const response = await request(app)
        .post('/api/v1/artists')
        .send(artistData)
        .expect(201);

      expect(response.body).toEqual(mockArtist);
      expect(createArtist).toHaveBeenCalledWith('user123', artistData);
    });

    it('should return 409 if user is already registered as an artist', async () => {
      const artistData = {
        artist_name: 'New Artist',
        verified_nyc: true
      };

      // Mock the service function to throw an error
      createArtist.mockRejectedValue(new Error('User is already registered as an artist'));

      const response = await request(app)
        .post('/api/v1/artists')
        .send(artistData)
        .expect(409);

      expect(response.body).toEqual({ error: 'User is already registered as an artist' });
    });

    it('should handle other service errors', async () => {
      const artistData = {
        artist_name: 'New Artist',
        verified_nyc: true
      };

      // Mock the service function to throw an error
      createArtist.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/v1/artists')
        .send(artistData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('PUT /api/v1/artists/:id', () => {
    it('should update an artist', async () => {
      const updateData = {
        artist_name: 'Updated Artist',
        verified_nyc: true
      };

      const mockArtist = {
        id: '1',
        artist_name: 'Updated Artist',
        user_id: 'user1',
        verified_nyc: true
      };

      // Mock the service function
      updateArtist.mockResolvedValue(mockArtist);

      const response = await request(app)
        .put('/api/v1/artists/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockArtist);
      expect(updateArtist).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 404 if artist is not found', async () => {
      const updateData = {
        artist_name: 'Updated Artist',
        verified_nyc: true
      };

      // Mock the service function to throw an error
      updateArtist.mockRejectedValue(new Error('Artist not found'));

      const response = await request(app)
        .put('/api/v1/artists/nonexistent')
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({ error: 'Artist not found' });
    });

    it('should handle other service errors', async () => {
      const updateData = {
        artist_name: 'Updated Artist',
        verified_nyc: true
      };

      // Mock the service function to throw an error
      updateArtist.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/v1/artists/1')
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('DELETE /api/v1/artists/:id', () => {
    it('should delete an artist', async () => {
      const mockResult = { message: 'Artist deleted successfully' };

      // Mock the service function
      deleteArtist.mockResolvedValue(mockResult);

      const response = await request(app)
        .delete('/api/v1/artists/1')
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(deleteArtist).toHaveBeenCalledWith('1');
    });

    it('should return 404 if artist is not found', async () => {
      // Mock the service function to throw an error
      deleteArtist.mockRejectedValue(new Error('Artist not found'));

      const response = await request(app)
        .delete('/api/v1/artists/nonexistent')
        .expect(404);

      expect(response.body).toEqual({ error: 'Artist not found' });
    });

    it('should handle other service errors', async () => {
      // Mock the service function to throw an error
      deleteArtist.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/v1/artists/1')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });
});