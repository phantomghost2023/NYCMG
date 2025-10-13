// Mock the models
jest.mock('../../models', () => {
  const mockGenre = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };
  
  return {
    Genre: mockGenre
  };
});

// Mock the cache service
jest.mock('../cache.service', () => {
  return {
    getCachedGenres: jest.fn(),
    setCachedGenres: jest.fn(),
    clearGenresCache: jest.fn()
  };
});

// Import the actual service functions
const genreService = require('../genre.service');
const { Genre } = require('../../models');
const { 
  getCachedGenres, 
  setCachedGenres, 
  clearGenresCache 
} = require('../cache.service');

describe('Genre Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllGenres', () => {
    it('should return cached genres when available', async () => {
      const cachedGenres = [
        { id: 1, name: 'Hip Hop', description: 'Urban music genre' },
        { id: 2, name: 'Jazz', description: 'Classic American music' }
      ];
      
      getCachedGenres.mockReturnValue(cachedGenres);

      const result = await genreService.getAllGenres();
      
      expect(getCachedGenres).toHaveBeenCalled();
      expect(result).toEqual(cachedGenres);
    });

    it('should fetch genres from database when not cached', async () => {
      getCachedGenres.mockReturnValue(null);
      
      const mockGenres = [
        { id: 1, name: 'Hip Hop', description: 'Urban music genre' },
        { id: 2, name: 'Jazz', description: 'Classic American music' }
      ];
      
      Genre.findAll.mockResolvedValue(mockGenres);

      const result = await genreService.getAllGenres();
      
      expect(Genre.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: ['id', 'name', 'description', 'created_at', 'updated_at'],
          order: [['name', 'ASC']]
        })
      );
      expect(setCachedGenres).toHaveBeenCalledWith(mockGenres);
      expect(result).toEqual(mockGenres);
    });
  });

  describe('getGenreById', () => {
    it('should fetch genre by ID from database', async () => {
      const genreId = '1';
      const mockGenre = { id: genreId, name: 'Hip Hop', description: 'Urban music genre' };
      
      Genre.findByPk.mockResolvedValue(mockGenre);

      const result = await genreService.getGenreById(genreId);
      
      expect(Genre.findByPk).toHaveBeenCalledWith(
        genreId,
        expect.objectContaining({
          attributes: ['id', 'name', 'description', 'created_at', 'updated_at']
        })
      );
      expect(result).toEqual(mockGenre);
    });

    it('should throw error when genre is not found', async () => {
      const genreId = 'nonexistent';
      
      Genre.findByPk.mockResolvedValue(null);
      
      await expect(genreService.getGenreById(genreId)).rejects.toThrow('Genre not found');
    });
  });

  describe('createGenre', () => {
    it('should create a new genre successfully', async () => {
      const genreData = {
        name: 'Rock',
        description: 'Classic rock music'
      };
      
      const mockCreatedGenre = { 
        id: '3', 
        ...genreData,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      Genre.create.mockResolvedValue(mockCreatedGenre);

      const result = await genreService.createGenre(genreData);
      
      expect(Genre.create).toHaveBeenCalledWith(genreData);
      expect(clearGenresCache).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedGenre);
    });
  });

  describe('updateGenre', () => {
    it('should update a genre successfully', async () => {
      const genreId = '1';
      const updateData = { name: 'Updated Hip Hop' };
      
      // Mock genre exists
      const mockGenre = { 
        id: genreId, 
        name: 'Hip Hop',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            name: updateData.name || this.name
          });
        })
      };
      Genre.findByPk.mockResolvedValue(mockGenre);

      const result = await genreService.updateGenre(genreId, updateData);
      
      expect(Genre.findByPk).toHaveBeenCalledWith(genreId);
      expect(mockGenre.update).toHaveBeenCalledWith(updateData);
      expect(clearGenresCache).toHaveBeenCalled();
      expect(result).toEqual({ id: genreId, name: 'Updated Hip Hop' });
    });

    it('should throw error when genre is not found', async () => {
      const genreId = 'nonexistent';
      const updateData = { name: 'Updated Genre' };
      
      Genre.findByPk.mockResolvedValue(null);
      
      await expect(genreService.updateGenre(genreId, updateData)).rejects.toThrow('Genre not found');
    });
  });

  describe('deleteGenre', () => {
    it('should delete a genre successfully', async () => {
      const genreId = '1';
      
      // Mock genre exists
      const mockGenre = { 
        id: genreId, 
        name: 'Hip Hop',
        destroy: jest.fn().mockResolvedValue()
      };
      Genre.findByPk.mockResolvedValue(mockGenre);

      const result = await genreService.deleteGenre(genreId);
      
      expect(Genre.findByPk).toHaveBeenCalledWith(genreId);
      expect(mockGenre.destroy).toHaveBeenCalled();
      expect(clearGenresCache).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Genre deleted successfully' });
    });

    it('should throw error when genre is not found', async () => {
      const genreId = 'nonexistent';
      
      Genre.findByPk.mockResolvedValue(null);
      
      await expect(genreService.deleteGenre(genreId)).rejects.toThrow('Genre not found');
    });
  });
});