// Mock the models
jest.mock('../../models', () => {
  const mockAlbum = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };
  
  return {
    Album: mockAlbum,
    Artist: {
      findByPk: jest.fn()
    },
    Track: {}
  };
});

// Mock the cache service
jest.mock('../cache.service', () => {
  return {
    getCachedAlbum: jest.fn(),
    setCachedAlbum: jest.fn(),
    clearAlbumCache: jest.fn(),
    getCachedAlbumsList: jest.fn(),
    setCachedAlbumsList: jest.fn(),
    clearAlbumsListCache: jest.fn()
  };
});

// Import the actual service functions
const albumService = require('../album.service');
const { Album, Artist } = require('../../models');
const { 
  getCachedAlbum, 
  setCachedAlbum, 
  clearAlbumCache,
  getCachedAlbumsList,
  setCachedAlbumsList,
  clearAlbumsListCache
} = require('../cache.service');

describe('Album Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllAlbums', () => {
    it('should return cached albums when available', async () => {
      const cachedAlbums = {
        albums: [{ id: 1, title: 'Cached Album' }],
        totalCount: 1,
        limit: 20,
        offset: 0
      };
      
      const cacheKey = 'albums_list_20_0_created_at_DESC_';
      const cachedData = {
        [cacheKey]: cachedAlbums
      };
      getCachedAlbumsList.mockReturnValue(cachedData);

      const result = await albumService.getAllAlbums();
      
      expect(getCachedAlbumsList).toHaveBeenCalled();
      expect(result).toEqual(cachedAlbums);
    });

    it('should filter albums by artist ID', async () => {
      getCachedAlbumsList.mockReturnValue(null);
      
      const options = {
        artistId: 'artist1',
        limit: 10,
        offset: 0
      };

      const mockResult = {
        rows: [],
        count: 0
      };

      Album.findAndCountAll.mockResolvedValue(mockResult);

      await albumService.getAllAlbums(options);
      
      expect(Album.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            artist_id: 'artist1'
          })
        })
      );
    });

    it('should sort albums by specified field and order', async () => {
      getCachedAlbumsList.mockReturnValue(null);
      
      const options = {
        sortBy: 'title',
        sortOrder: 'ASC',
        limit: 10,
        offset: 0
      };

      const mockResult = {
        rows: [],
        count: 0
      };

      Album.findAndCountAll.mockResolvedValue(mockResult);

      await albumService.getAllAlbums(options);
      
      expect(Album.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['title', 'ASC']]
        })
      );
    });
  });

  describe('getAlbumById', () => {
    it('should return cached album when available', async () => {
      const albumId = '1';
      const cachedAlbum = { id: albumId, title: 'Cached Album' };
      
      getCachedAlbum.mockReturnValue(cachedAlbum);

      const result = await albumService.getAlbumById(albumId);
      
      expect(getCachedAlbum).toHaveBeenCalledWith(albumId);
      expect(result).toEqual(cachedAlbum);
    });

    it('should fetch album from database when not cached', async () => {
      getCachedAlbum.mockReturnValue(null);
      
      const albumId = '1';
      const mockAlbum = { id: albumId, title: 'Database Album' };
      
      Album.findByPk.mockResolvedValue(mockAlbum);

      const result = await albumService.getAlbumById(albumId);
      
      expect(Album.findByPk).toHaveBeenCalledWith(albumId, expect.any(Object));
      expect(setCachedAlbum).toHaveBeenCalledWith(albumId, mockAlbum);
      expect(result).toEqual(mockAlbum);
    });

    it('should throw error when album is not found', async () => {
      getCachedAlbum.mockReturnValue(null);
      Album.findByPk.mockResolvedValue(null);
      
      await expect(albumService.getAlbumById('nonexistent')).rejects.toThrow('Album not found');
    });
  });

  describe('createAlbum', () => {
    it('should create a new album successfully', async () => {
      const artistId = 'artist1';
      const albumData = {
        title: 'New Album',
        description: 'Test album',
        release_date: '2023-01-01'
      };
      
      // Mock artist exists
      const mockArtist = { id: artistId, artist_name: 'Test Artist' };
      Artist.findByPk.mockResolvedValue(mockArtist);
      
      // Mock album creation
      const mockCreatedAlbum = { 
        id: '1', 
        ...albumData, 
        artist_id: artistId
      };
      Album.create.mockResolvedValue(mockCreatedAlbum);
      
      // Mock Album.findByPk to return an album for getAlbumById call
      const mockAlbumForGetById = { 
        id: '1', 
        ...albumData, 
        artist_id: artistId,
        artist: mockArtist
      };
      Album.findByPk.mockResolvedValue(mockAlbumForGetById);

      const result = await albumService.createAlbum(artistId, albumData);
      
      expect(Artist.findByPk).toHaveBeenCalledWith(artistId);
      expect(Album.create).toHaveBeenCalledWith({
        artist_id: artistId,
        title: albumData.title,
        description: albumData.description,
        release_date: albumData.release_date,
        is_explicit: false,
        status: 'active'
      });
      expect(clearAlbumsListCache).toHaveBeenCalled();
      expect(result).toEqual(mockAlbumForGetById);
    });

    it('should throw error when artist is not found', async () => {
      const artistId = 'nonexistent';
      const albumData = { title: 'New Album' };
      
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(albumService.createAlbum(artistId, albumData)).rejects.toThrow('Artist not found');
    });
  });

  describe('updateAlbum', () => {
    it('should update an album successfully', async () => {
      const albumId = '1';
      const updateData = { title: 'Updated Album' };
      
      // Mock album exists
      const mockAlbum = { 
        id: albumId, 
        title: 'Original Album',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            title: updateData.title || this.title
          });
        })
      };
      Album.findByPk.mockResolvedValueOnce(mockAlbum);
      
      // Mock Album.findByPk to return updated album for getAlbumById call
      const mockAlbumForGetById = { id: albumId, title: 'Updated Album' };
      Album.findByPk.mockResolvedValueOnce(mockAlbumForGetById);

      const result = await albumService.updateAlbum(albumId, updateData);
      
      expect(Album.findByPk).toHaveBeenCalledWith(albumId);
      expect(mockAlbum.update).toHaveBeenCalledWith(updateData);
      expect(clearAlbumCache).toHaveBeenCalledWith(albumId);
      expect(clearAlbumsListCache).toHaveBeenCalled();
      expect(result).toEqual(mockAlbumForGetById);
    });

    it('should throw error when album is not found', async () => {
      const albumId = 'nonexistent';
      const updateData = { title: 'Updated Album' };
      
      Album.findByPk.mockResolvedValue(null);
      
      await expect(albumService.updateAlbum(albumId, updateData)).rejects.toThrow('Album not found');
    });
  });

  describe('deleteAlbum', () => {
    it('should delete an album successfully (soft delete)', async () => {
      const albumId = '1';
      
      // Mock album exists
      const mockAlbum = { 
        id: albumId, 
        title: 'Test Album',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            title: updateData.title || this.title,
            status: updateData.status || this.status
          });
        })
      };
      Album.findByPk.mockResolvedValue(mockAlbum);

      const result = await albumService.deleteAlbum(albumId);
      
      expect(Album.findByPk).toHaveBeenCalledWith(albumId);
      expect(mockAlbum.update).toHaveBeenCalledWith({ status: 'deleted' });
      expect(clearAlbumCache).toHaveBeenCalledWith(albumId);
      expect(clearAlbumsListCache).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Album deleted successfully' });
    });

    it('should throw error when album is not found', async () => {
      const albumId = 'nonexistent';
      
      Album.findByPk.mockResolvedValue(null);
      
      await expect(albumService.deleteAlbum(albumId)).rejects.toThrow('Album not found');
    });
  });
});