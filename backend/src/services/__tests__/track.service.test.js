// Mock the models
jest.mock('../../models', () => {
  const mockTrack = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };
  
  return {
    Track: mockTrack,
    Artist: {
      findByPk: jest.fn()
    },
    Album: {},
    Genre: {
      findByPk: jest.fn()
    },
    Op: {
      in: Symbol('in'),
      iLike: Symbol('iLike')
    }
  };
});

// Mock the cache service
jest.mock('../cache.service', () => {
  return {
    getCachedTrack: jest.fn(),
    setCachedTrack: jest.fn(),
    clearTrackCache: jest.fn(),
    getCachedTracksList: jest.fn(),
    setCachedTracksList: jest.fn(),
    clearTracksListCache: jest.fn()
  };
});

// Import the actual service functions
const trackService = require('../track.service');
const { Track, Artist, Genre } = require('../../models');
const { 
  getCachedTrack, 
  setCachedTrack, 
  clearTrackCache,
  getCachedTracksList,
  setCachedTracksList,
  clearTracksListCache
} = require('../cache.service');

describe('Track Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllTracks', () => {
    it('should return cached tracks when available', async () => {
      const cachedTracks = {
        tracks: [{ id: 1, title: 'Cached Track' }],
        totalCount: 1,
        limit: 20,
        offset: 0
      };
      
      const cacheKey = 'tracks_list_20_0_created_at_DESC_____';
      const cachedData = {
        [cacheKey]: cachedTracks
      };
      getCachedTracksList.mockReturnValue(cachedData);

      const result = await trackService.getAllTracks();
      
      expect(getCachedTracksList).toHaveBeenCalled();
      expect(result).toEqual(cachedTracks);
    });

    it('should filter tracks by multiple borough IDs', async () => {
      getCachedTracksList.mockReturnValue(null);
      
      const options = {
        boroughIds: ['borough1', 'borough2'],
        limit: 10,
        offset: 0
      };

      const mockResult = {
        rows: [],
        count: 0
      };

      Track.findAndCountAll.mockResolvedValue(mockResult);

      await trackService.getAllTracks(options);
      
      expect(Track.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            borough_id: { [require('sequelize').Op.in]: ['borough1', 'borough2'] }
          })
        })
      );
    });

    it('should filter tracks by multiple genre IDs', async () => {
      getCachedTracksList.mockReturnValue(null);
      
      const options = {
        genreIds: ['genre1', 'genre2'],
        limit: 10,
        offset: 0
      };

      const mockResult = {
        rows: [],
        count: 0
      };

      Track.findAndCountAll.mockResolvedValue(mockResult);

      await trackService.getAllTracks(options);
      
      expect(Track.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              where: { id: { [require('sequelize').Op.in]: ['genre1', 'genre2'] } }
            })
          ])
        })
      );
    });

    it('should filter tracks by explicit content', async () => {
      getCachedTracksList.mockReturnValue(null);
      
      const options = {
        isExplicit: true,
        limit: 10,
        offset: 0
      };

      const mockResult = {
        rows: [],
        count: 0
      };

      Track.findAndCountAll.mockResolvedValue(mockResult);

      await trackService.getAllTracks(options);
      
      expect(Track.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            is_explicit: true
          })
        })
      );
    });

    it('should sort tracks by specified field and order', async () => {
      getCachedTracksList.mockReturnValue(null);
      
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

      Track.findAndCountAll.mockResolvedValue(mockResult);

      await trackService.getAllTracks(options);
      
      expect(Track.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['title', 'ASC']]
        })
      );
    });
  });

  describe('getTrackById', () => {
    it('should return cached track when available', async () => {
      const trackId = '1';
      const cachedTrack = { id: trackId, title: 'Cached Track' };
      
      getCachedTrack.mockReturnValue(cachedTrack);

      const result = await trackService.getTrackById(trackId);
      
      expect(getCachedTrack).toHaveBeenCalledWith(trackId);
      expect(result).toEqual(cachedTrack);
    });

    it('should fetch track from database when not cached', async () => {
      getCachedTrack.mockReturnValue(null);
      
      const trackId = '1';
      const mockTrack = { id: trackId, title: 'Database Track' };
      
      Track.findByPk.mockResolvedValue(mockTrack);

      const result = await trackService.getTrackById(trackId);
      
      expect(Track.findByPk).toHaveBeenCalledWith(trackId, expect.any(Object));
      expect(setCachedTrack).toHaveBeenCalledWith(trackId, mockTrack);
      expect(result).toEqual(mockTrack);
    });

    it('should throw error when track is not found', async () => {
      getCachedTrack.mockReturnValue(null);
      Track.findByPk.mockResolvedValue(null);
      
      await expect(trackService.getTrackById('nonexistent')).rejects.toThrow('Track not found');
    });
  });

  describe('createTrack', () => {
    it('should create a new track successfully', async () => {
      const artistId = 'artist1';
      const trackData = {
        title: 'New Track',
        description: 'Test track',
        duration: 180
      };
      
      // Mock artist exists
      const mockArtist = { id: artistId, artist_name: 'Test Artist' };
      Artist.findByPk.mockResolvedValue(mockArtist);
      
      // Mock track creation
      const mockCreatedTrack = { 
        id: '1', 
        ...trackData, 
        artist_id: artistId,
        setGenres: jest.fn()
      };
      Track.create.mockResolvedValue(mockCreatedTrack);
      
      // Mock Track.findByPk to return a track for getTrackById call
      const mockTrackForGetById = { 
        id: '1', 
        ...trackData, 
        artist_id: artistId,
        artist: mockArtist
      };
      Track.findByPk.mockResolvedValue(mockTrackForGetById);

      const result = await trackService.createTrack(artistId, trackData);
      
      expect(Artist.findByPk).toHaveBeenCalledWith(artistId);
      expect(Track.create).toHaveBeenCalledWith({
        artist_id: artistId,
        title: trackData.title,
        description: trackData.description,
        duration: trackData.duration,
        is_explicit: false,
        status: 'active'
      });
      expect(clearTracksListCache).toHaveBeenCalled();
      expect(result).toEqual(mockTrackForGetById);
    });

    it('should throw error when artist is not found', async () => {
      const artistId = 'nonexistent';
      const trackData = { title: 'New Track' };
      
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(trackService.createTrack(artistId, trackData)).rejects.toThrow('Artist not found');
    });

    it('should associate genres when provided', async () => {
      const artistId = 'artist1';
      const trackData = {
        title: 'New Track',
        genreIds: ['genre1', 'genre2']
      };
      
      // Mock artist exists
      const mockArtist = { id: artistId, artist_name: 'Test Artist' };
      Artist.findByPk.mockResolvedValue(mockArtist);
      
      // Mock track creation with setGenres method
      const mockCreatedTrack = { 
        id: '1', 
        title: 'New Track', 
        artist_id: artistId,
        setGenres: jest.fn()
      };
      Track.create.mockResolvedValue(mockCreatedTrack);
      
      // Mock Track.findByPk to return a track for getTrackById call
      const mockTrackForGetById = { 
        id: '1', 
        title: 'New Track', 
        artist_id: artistId,
        artist: mockArtist
      };
      Track.findByPk.mockResolvedValue(mockTrackForGetById);

      const result = await trackService.createTrack(artistId, trackData);
      
      expect(mockCreatedTrack.setGenres).toHaveBeenCalledWith(['genre1', 'genre2']);
    });
  });

  describe('updateTrack', () => {
    it('should update a track successfully', async () => {
      const trackId = '1';
      const updateData = { title: 'Updated Track' };
      
      // Mock track exists
      const mockTrack = { 
        id: trackId, 
        title: 'Original Track',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            title: updateData.title || this.title
          });
        }),
        setGenres: jest.fn()
      };
      Track.findByPk.mockResolvedValueOnce(mockTrack);
      
      // Mock Track.findByPk to return updated track for getTrackById call
      const mockTrackForGetById = { id: trackId, title: 'Updated Track' };
      Track.findByPk.mockResolvedValueOnce(mockTrackForGetById);

      const result = await trackService.updateTrack(trackId, updateData);
      
      expect(Track.findByPk).toHaveBeenCalledWith(trackId);
      expect(mockTrack.update).toHaveBeenCalledWith(updateData);
      expect(clearTrackCache).toHaveBeenCalledWith(trackId);
      expect(clearTracksListCache).toHaveBeenCalled();
      expect(result).toEqual(mockTrackForGetById);
    });

    it('should throw error when track is not found', async () => {
      const trackId = 'nonexistent';
      const updateData = { title: 'Updated Track' };
      
      Track.findByPk.mockResolvedValue(null);
      
      await expect(trackService.updateTrack(trackId, updateData)).rejects.toThrow('Track not found');
    });

    it('should update genre associations when provided', async () => {
      const trackId = '1';
      const updateData = { 
        title: 'Updated Track',
        genreIds: ['genre1', 'genre2']
      };
      
      // Mock track exists
      const mockTrack = { 
        id: trackId, 
        title: 'Original Track',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties and setGenres method
          const updatedObj = { 
            id: this.id, 
            title: updateData.title || this.title,
            setGenres: jest.fn()
          };
          // Call the setGenres method if genreIds are provided
          if (updateData.genreIds) {
            updatedObj.setGenres(updateData.genreIds);
          }
          return Promise.resolve(updatedObj);
        }),
        setGenres: jest.fn()
      };
      Track.findByPk.mockResolvedValueOnce(mockTrack);
      
      // Mock Track.findByPk to return updated track for getTrackById call
      const mockTrackForGetById = { id: trackId, title: 'Updated Track' };
      Track.findByPk.mockResolvedValueOnce(mockTrackForGetById);

      const result = await trackService.updateTrack(trackId, updateData);
      
      expect(mockTrack.update).toHaveBeenCalledWith(updateData);
      // Check that setGenres was called on the updated object
      expect(mockTrack.update).toHaveBeenCalledWith(expect.objectContaining({
        genreIds: ['genre1', 'genre2']
      }));
    });
  });

  describe('deleteTrack', () => {
    it('should delete a track successfully (soft delete)', async () => {
      const trackId = '1';
      
      // Mock track exists
      const mockTrack = { 
        id: trackId, 
        title: 'Test Track',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            title: updateData.title || this.title,
            status: updateData.status || this.status
          });
        }),
        setGenres: jest.fn()
      };
      Track.findByPk.mockResolvedValue(mockTrack);

      const result = await trackService.deleteTrack(trackId);
      
      expect(Track.findByPk).toHaveBeenCalledWith(trackId);
      expect(mockTrack.update).toHaveBeenCalledWith({ status: 'deleted' });
      expect(clearTrackCache).toHaveBeenCalledWith(trackId);
      expect(clearTracksListCache).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Track deleted successfully' });
    });

    it('should throw error when track is not found', async () => {
      const trackId = 'nonexistent';
      
      Track.findByPk.mockResolvedValue(null);
      
      await expect(trackService.deleteTrack(trackId)).rejects.toThrow('Track not found');
    });
  });
});