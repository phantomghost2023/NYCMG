// Mock the models
jest.mock('../../models', () => {
  const mockArtist = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn()
  };
  
  return {
    Artist: mockArtist,
    User: {
      findByPk: jest.fn()
    }
  };
});

// Mock the cache service
jest.mock('../cache.service', () => {
  return {
    getCachedArtist: jest.fn(),
    setCachedArtist: jest.fn(),
    clearArtistCache: jest.fn(),
    getCachedArtistsList: jest.fn(),
    setCachedArtistsList: jest.fn(),
    clearArtistsListCache: jest.fn()
  };
});

// Import the actual service functions
const artistService = require('../artist.service');
const { Artist, User } = require('../../models');
const { 
  getCachedArtist, 
  setCachedArtist, 
  clearArtistCache,
  getCachedArtistsList,
  setCachedArtistsList,
  clearArtistsListCache
} = require('../cache.service');

describe('Artist Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllArtists', () => {
    it('should return cached artists when available', async () => {
      const cachedArtists = {
        artists: [{ id: 1, artist_name: 'Cached Artist' }],
        totalCount: 1,
        limit: 20,
        offset: 0
      };
      
      const cacheKey = 'artists_list_20_0_created_at_DESC';
      const cachedData = {
        [cacheKey]: cachedArtists
      };
      getCachedArtistsList.mockReturnValue(cachedData);

      const result = await artistService.getAllArtists();
      
      expect(getCachedArtistsList).toHaveBeenCalled();
      expect(result).toEqual(cachedArtists);
    });

    it('should sort artists by specified field and order', async () => {
      getCachedArtistsList.mockReturnValue(null);
      
      const options = {
        sortBy: 'artist_name',
        sortOrder: 'ASC',
        limit: 10,
        offset: 0
      };

      const mockResult = {
        rows: [],
        count: 0
      };

      Artist.findAndCountAll.mockResolvedValue(mockResult);

      await artistService.getAllArtists(options);
      
      expect(Artist.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['artist_name', 'ASC']]
        })
      );
    });
  });

  describe('getArtistById', () => {
    it('should return cached artist when available', async () => {
      const artistId = '1';
      const cachedArtist = { id: artistId, artist_name: 'Cached Artist' };
      
      getCachedArtist.mockReturnValue(cachedArtist);

      const result = await artistService.getArtistById(artistId);
      
      expect(getCachedArtist).toHaveBeenCalledWith(artistId);
      expect(result).toEqual(cachedArtist);
    });

    it('should fetch artist from database when not cached', async () => {
      getCachedArtist.mockReturnValue(null);
      
      const artistId = '1';
      const mockArtist = { id: artistId, artist_name: 'Database Artist' };
      
      Artist.findByPk.mockResolvedValue(mockArtist);

      const result = await artistService.getArtistById(artistId);
      
      expect(Artist.findByPk).toHaveBeenCalledWith(artistId, expect.any(Object));
      expect(setCachedArtist).toHaveBeenCalledWith(artistId, mockArtist);
      expect(result).toEqual(mockArtist);
    });

    it('should throw error when artist is not found', async () => {
      getCachedArtist.mockReturnValue(null);
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(artistService.getArtistById('nonexistent')).rejects.toThrow('Artist not found');
    });
  });

  describe('createArtist', () => {
    it('should create a new artist successfully', async () => {
      const userId = 'user1';
      const artistData = {
        artist_name: 'New Artist'
      };
      
      // Mock user exists
      const mockUser = { id: userId, username: 'testuser' };
      User.findByPk.mockResolvedValue(mockUser);
      
      // Mock that user is not already an artist
      Artist.findOne.mockResolvedValue(null);
      
      // Mock artist creation
      const mockCreatedArtist = { 
        id: '1', 
        user_id: userId,
        ...artistData,
        verified_nyc: false,
        profile_picture_url: null
      };
      Artist.create.mockResolvedValue(mockCreatedArtist);

      const result = await artistService.createArtist(userId, artistData);
      
      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(Artist.findOne).toHaveBeenCalledWith({ where: { user_id: userId } });
      expect(Artist.create).toHaveBeenCalledWith({
        user_id: userId,
        artist_name: artistData.artist_name,
        verified_nyc: false,
        profile_picture_url: null
      });
      expect(clearArtistsListCache).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedArtist);
    });

    it('should throw error when user is not found', async () => {
      const userId = 'nonexistent';
      const artistData = { artist_name: 'New Artist' };
      
      User.findByPk.mockResolvedValue(null);
      
      await expect(artistService.createArtist(userId, artistData)).rejects.toThrow('User not found');
    });

    it('should throw error when user is already registered as an artist', async () => {
      const userId = 'user1';
      const artistData = { artist_name: 'New Artist' };
      
      // Mock user exists
      const mockUser = { id: userId, username: 'testuser' };
      User.findByPk.mockResolvedValue(mockUser);
      
      // Mock that user is already an artist
      const existingArtist = { id: '1', user_id: userId };
      Artist.findOne.mockResolvedValue(existingArtist);
      
      await expect(artistService.createArtist(userId, artistData)).rejects.toThrow('User is already registered as an artist');
    });
  });

  describe('updateArtist', () => {
    it('should update an artist successfully', async () => {
      const artistId = '1';
      const updateData = { artist_name: 'Updated Artist' };
      
      // Mock artist exists
      const mockArtist = { 
        id: artistId, 
        artist_name: 'Original Artist',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            artist_name: updateData.artist_name || this.artist_name
          });
        })
      };
      Artist.findByPk.mockResolvedValue(mockArtist);

      const result = await artistService.updateArtist(artistId, updateData);
      
      expect(Artist.findByPk).toHaveBeenCalledWith(artistId);
      expect(mockArtist.update).toHaveBeenCalledWith(updateData);
      expect(clearArtistCache).toHaveBeenCalledWith(artistId);
      expect(clearArtistsListCache).toHaveBeenCalled();
      expect(result).toEqual({ id: artistId, artist_name: 'Updated Artist' });
    });

    it('should throw error when artist is not found', async () => {
      const artistId = 'nonexistent';
      const updateData = { artist_name: 'Updated Artist' };
      
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(artistService.updateArtist(artistId, updateData)).rejects.toThrow('Artist not found');
    });

    it('should only update allowed fields', async () => {
      const artistId = '1';
      const updateData = { 
        artist_name: 'Updated Artist',
        invalid_field: 'should be ignored'
      };
      
      // Mock artist exists
      const mockArtist = { 
        id: artistId, 
        artist_name: 'Original Artist',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            artist_name: updateData.artist_name || this.artist_name
          });
        })
      };
      Artist.findByPk.mockResolvedValue(mockArtist);

      await artistService.updateArtist(artistId, updateData);
      
      // Verify that only allowed fields are passed to update
      expect(mockArtist.update).toHaveBeenCalledWith({
        artist_name: 'Updated Artist'
      });
    });
  });

  describe('deleteArtist', () => {
    it('should delete an artist successfully', async () => {
      const artistId = '1';
      
      // Mock artist exists
      const mockArtist = { 
        id: artistId, 
        artist_name: 'Test Artist',
        destroy: jest.fn().mockResolvedValue()
      };
      Artist.findByPk.mockResolvedValue(mockArtist);

      const result = await artistService.deleteArtist(artistId);
      
      expect(Artist.findByPk).toHaveBeenCalledWith(artistId);
      expect(mockArtist.destroy).toHaveBeenCalled();
      expect(clearArtistCache).toHaveBeenCalledWith(artistId);
      expect(clearArtistsListCache).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Artist deleted successfully' });
    });

    it('should throw error when artist is not found', async () => {
      const artistId = 'nonexistent';
      
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(artistService.deleteArtist(artistId)).rejects.toThrow('Artist not found');
    });
  });
});