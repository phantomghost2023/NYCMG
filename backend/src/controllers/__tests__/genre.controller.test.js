const { listGenres, getGenre, create, update, remove } = require('../genre.controller');
const { 
  getAllGenres, 
  getGenreById, 
  createGenre, 
  updateGenre, 
  deleteGenre 
} = require('../../services/genre.service');

// Mock the genre service functions
jest.mock('../../services/genre.service');

describe('Genre Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock request and response objects
    req = {
      query: {},
      params: {},
      body: {}
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('listGenres', () => {
    it('should return a list of genres', async () => {
      const mockGenres = [
        { id: 1, name: 'Rock' },
        { id: 2, name: 'Jazz' }
      ];

      getAllGenres.mockResolvedValue(mockGenres);

      await listGenres(req, res);

      expect(getAllGenres).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockGenres);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database error';
      getAllGenres.mockRejectedValue(new Error(errorMessage));

      await listGenres(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getGenre', () => {
    it('should return a genre by ID', async () => {
      const genreId = '1';
      req.params.id = genreId;
      
      const mockGenre = { id: genreId, name: 'Rock' };
      getGenreById.mockResolvedValue(mockGenre);

      await getGenre(req, res);

      expect(getGenreById).toHaveBeenCalledWith(genreId);
      expect(res.json).toHaveBeenCalledWith(mockGenre);
    });

    it('should return 404 when genre is not found', async () => {
      const genreId = 'nonexistent';
      req.params.id = genreId;
      
      getGenreById.mockRejectedValue(new Error('Genre not found'));

      await getGenre(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Genre not found' });
    });

    it('should handle service errors', async () => {
      const genreId = '1';
      req.params.id = genreId;
      
      const errorMessage = 'Database error';
      getGenreById.mockRejectedValue(new Error(errorMessage));

      await getGenre(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('create', () => {
    it('should create a new genre', async () => {
      req.body = {
        name: 'New Genre'
      };
      
      const mockGenre = { id: '1', name: 'New Genre' };
      createGenre.mockResolvedValue(mockGenre);

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(createGenre).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockGenre);
    });

    it('should handle service errors', async () => {
      req.body = {
        name: 'New Genre'
      };
      
      const errorMessage = 'Validation error';
      createGenre.mockRejectedValue(new Error(errorMessage));

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('update', () => {
    it('should update a genre', async () => {
      const genreId = '1';
      req.params.id = genreId;
      req.body = {
        name: 'Updated Genre'
      };
      
      const mockGenre = { id: genreId, name: 'Updated Genre' };
      updateGenre.mockResolvedValue(mockGenre);

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(updateGenre).toHaveBeenCalledWith(genreId, req.body);
      expect(res.json).toHaveBeenCalledWith(mockGenre);
    });

    it('should return 404 when genre is not found', async () => {
      const genreId = 'nonexistent';
      req.params.id = genreId;
      req.body = {
        name: 'Updated Genre'
      };
      
      updateGenre.mockRejectedValue(new Error('Genre not found'));

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Genre not found' });
    });

    it('should handle service errors', async () => {
      const genreId = '1';
      req.params.id = genreId;
      req.body = {
        name: 'Updated Genre'
      };
      
      const errorMessage = 'Validation error';
      updateGenre.mockRejectedValue(new Error(errorMessage));

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('remove', () => {
    it('should delete a genre', async () => {
      const genreId = '1';
      req.params.id = genreId;
      
      const mockResult = { message: 'Genre deleted successfully' };
      deleteGenre.mockResolvedValue(mockResult);

      await remove(req, res);

      expect(deleteGenre).toHaveBeenCalledWith(genreId);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 when genre is not found', async () => {
      const genreId = 'nonexistent';
      req.params.id = genreId;
      
      deleteGenre.mockRejectedValue(new Error('Genre not found'));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Genre not found' });
    });

    it('should handle service errors', async () => {
      const genreId = '1';
      req.params.id = genreId;
      
      const errorMessage = 'Database error';
      deleteGenre.mockRejectedValue(new Error(errorMessage));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});