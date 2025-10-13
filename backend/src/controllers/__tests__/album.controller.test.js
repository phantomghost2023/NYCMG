// Mock the album service
jest.mock('../../services/album.service');

// Mock the auth middleware
jest.mock('../../middleware/auth.middleware', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // Add a mock user to the request
    req.user = { userId: 'user123', artistId: 'artist123' };
    next();
  }),
  authorizeRole: jest.fn(() => (req, res, next) => next())
}));

// Mock the validation middleware
jest.mock('../../middleware/validation.middleware', () => ({
  createAlbumSchema: {},
  updateAlbumSchema: {},
  validate: jest.fn(() => (req, res, next) => next())
}));

// Mock the associations to prevent errors
jest.mock('../../models/associations', () => ({
  setupAssociations: jest.fn()
}));

const request = require('supertest');
const app = require('../../index');
const { 
  getAllAlbums, 
  getAlbumById, 
  createAlbum, 
  updateAlbum, 
  deleteAlbum 
} = require('../../services/album.service');

describe('Album Controller', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/v1/albums', () => {
    it('should return a list of albums', async () => {
      const mockAlbums = {
        albums: [
          { id: '1', title: 'Album 1', artist_id: 'artist1' },
          { id: '2', title: 'Album 2', artist_id: 'artist2' }
        ],
        totalCount: 2,
        limit: 20,
        offset: 0
      };

      // Mock the service function
      getAllAlbums.mockResolvedValue(mockAlbums);

      const response = await request(app)
        .get('/api/v1/albums')
        .expect(200);

      expect(response.body).toEqual(mockAlbums);
      expect(getAllAlbums).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });
    });

    it('should handle service errors', async () => {
      // Mock the service function to throw an error
      getAllAlbums.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/v1/albums')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /api/v1/albums/:id', () => {
    it('should return an album by ID', async () => {
      const mockAlbum = {
        id: '1',
        title: 'Test Album',
        artist_id: 'artist1'
      };

      // Mock the service function
      getAlbumById.mockResolvedValue(mockAlbum);

      const response = await request(app)
        .get('/api/v1/albums/1')
        .expect(200);

      expect(response.body).toEqual(mockAlbum);
      expect(getAlbumById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if album is not found', async () => {
      // Mock the service function to throw an error
      getAlbumById.mockRejectedValue(new Error('Album not found'));

      const response = await request(app)
        .get('/api/v1/albums/nonexistent')
        .expect(404);

      expect(response.body).toEqual({ error: 'Album not found' });
    });

    it('should handle other service errors', async () => {
      // Mock the service function to throw an error
      getAlbumById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/v1/albums/1')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('POST /api/v1/albums', () => {
    it('should create a new album with artist ID from user', async () => {
      const albumData = {
        title: 'New Album',
        description: 'A new album'
      };

      const mockAlbum = {
        id: '1',
        ...albumData,
        artist_id: 'artist123'
      };

      // Mock the service function
      createAlbum.mockResolvedValue(mockAlbum);

      const response = await request(app)
        .post('/api/v1/albums')
        .send(albumData)
        .expect(201);

      expect(response.body).toEqual(mockAlbum);
      expect(createAlbum).toHaveBeenCalledWith('artist123', albumData);
    });

    it('should create a new album with artist ID from request body', async () => {
      const albumData = {
        title: 'New Album',
        artist_id: 'artist456',
        description: 'A new album'
      };

      const mockAlbum = {
        id: '1',
        ...albumData
      };

      // Mock the service function
      createAlbum.mockResolvedValue(mockAlbum);

      const response = await request(app)
        .post('/api/v1/albums')
        .send(albumData)
        .expect(201);

      expect(response.body).toEqual(mockAlbum);
      expect(createAlbum).toHaveBeenCalledWith('artist456', albumData);
    });

    it('should return 400 if artist ID is missing', async () => {
      // Mock the authenticateToken middleware to not set artistId
      require('../../middleware/auth.middleware').authenticateToken.mockImplementation((req, res, next) => {
        req.user = { userId: 'user123' }; // No artistId
        next();
      });

      const albumData = {
        title: 'New Album',
        description: 'A new album'
      };

      const response = await request(app)
        .post('/api/v1/albums')
        .send(albumData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Artist ID is required' });
    });

    it('should return 404 if artist is not found', async () => {
      const albumData = {
        title: 'New Album',
        artist_id: 'nonexistent',
        description: 'A new album'
      };

      // Mock the service function to throw an error
      createAlbum.mockRejectedValue(new Error('Artist not found'));

      const response = await request(app)
        .post('/api/v1/albums')
        .send(albumData)
        .expect(404);

      expect(response.body).toEqual({ error: 'Artist not found' });
    });

    it('should handle other service errors', async () => {
      const albumData = {
        title: 'New Album',
        artist_id: 'artist1',
        description: 'A new album'
      };

      // Mock the service function to throw an error
      createAlbum.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/v1/albums')
        .send(albumData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('PUT /api/v1/albums/:id', () => {
    it('should update an album', async () => {
      const updateData = {
        title: 'Updated Album',
        description: 'An updated album'
      };

      const mockAlbum = {
        id: '1',
        title: 'Updated Album',
        artist_id: 'artist1',
        description: 'An updated album'
      };

      // Mock the service function
      updateAlbum.mockResolvedValue(mockAlbum);

      const response = await request(app)
        .put('/api/v1/albums/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockAlbum);
      expect(updateAlbum).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 404 if album is not found', async () => {
      const updateData = {
        title: 'Updated Album',
        description: 'An updated album'
      };

      // Mock the service function to throw an error
      updateAlbum.mockRejectedValue(new Error('Album not found'));

      const response = await request(app)
        .put('/api/v1/albums/nonexistent')
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({ error: 'Album not found' });
    });

    it('should handle other service errors', async () => {
      const updateData = {
        title: 'Updated Album',
        description: 'An updated album'
      };

      // Mock the service function to throw an error
      updateAlbum.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/v1/albums/1')
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('DELETE /api/v1/albums/:id', () => {
    it('should delete an album', async () => {
      const mockResult = { message: 'Album deleted successfully' };

      // Mock the service function
      deleteAlbum.mockResolvedValue(mockResult);

      const response = await request(app)
        .delete('/api/v1/albums/1')
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(deleteAlbum).toHaveBeenCalledWith('1');
    });

    it('should return 404 if album is not found', async () => {
      // Mock the service function to throw an error
      deleteAlbum.mockRejectedValue(new Error('Album not found'));

      const response = await request(app)
        .delete('/api/v1/albums/nonexistent')
        .expect(404);

      expect(response.body).toEqual({ error: 'Album not found' });
    });

    it('should handle other service errors', async () => {
      // Mock the service function to throw an error
      deleteAlbum.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/v1/albums/1')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });
});