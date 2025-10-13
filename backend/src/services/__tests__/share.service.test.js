// Mock the models
jest.mock('../../models', () => {
  const mockShare = {
    create: jest.fn(),
    count: jest.fn(),
    findAndCountAll: jest.fn()
  };
  
  return {
    Share: mockShare,
    User: {
      findByPk: jest.fn()
    },
    Track: {
      findByPk: jest.fn()
    },
    Artist: {
      findByPk: jest.fn()
    },
    Album: {
      findByPk: jest.fn()
    }
  };
});

// Import the actual service functions
const shareService = require('../share.service');
const { Share, Track, Artist, Album } = require('../../models');

describe('Share Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createShare', () => {
    it('should create a share on a track successfully', async () => {
      const userId = 'user1';
      const shareData = {
        track_id: 'track1',
        platform: 'facebook'
      };
      
      // Mock that the track exists
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      
      // Mock share creation
      const mockShare = { 
        id: '1', 
        user_id: userId,
        track_id: 'track1',
        platform: 'facebook'
      };
      Share.create.mockResolvedValue(mockShare);

      const result = await shareService.createShare(userId, shareData);
      
      expect(Track.findByPk).toHaveBeenCalledWith('track1');
      expect(Share.create).toHaveBeenCalledWith({
        user_id: userId,
        track_id: 'track1',
        artist_id: undefined,
        album_id: undefined,
        platform: 'facebook'
      });
      expect(result).toEqual(mockShare);
    });

    it('should throw error when no entity is specified', async () => {
      const userId = 'user1';
      const shareData = {
        platform: 'facebook'
      };
      
      await expect(shareService.createShare(userId, shareData)).rejects.toThrow('Must share exactly one entity (track, artist, or album)');
    });

    it('should throw error when multiple entities are specified', async () => {
      const userId = 'user1';
      const shareData = {
        track_id: 'track1',
        artist_id: 'artist1',
        platform: 'facebook'
      };
      
      await expect(shareService.createShare(userId, shareData)).rejects.toThrow('Must share exactly one entity (track, artist, or album)');
    });

    it('should throw error when track is not found', async () => {
      const userId = 'user1';
      const shareData = {
        track_id: 'nonexistent',
        platform: 'facebook'
      };
      
      Track.findByPk.mockResolvedValue(null);
      
      await expect(shareService.createShare(userId, shareData)).rejects.toThrow('Track not found');
    });

    it('should throw error when artist is not found', async () => {
      const userId = 'user1';
      const shareData = {
        artist_id: 'nonexistent',
        platform: 'facebook'
      };
      
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(shareService.createShare(userId, shareData)).rejects.toThrow('Artist not found');
    });

    it('should throw error when album is not found', async () => {
      const userId = 'user1';
      const shareData = {
        album_id: 'nonexistent',
        platform: 'facebook'
      };
      
      Album.findByPk.mockResolvedValue(null);
      
      await expect(shareService.createShare(userId, shareData)).rejects.toThrow('Album not found');
    });

    it('should throw error when platform is invalid', async () => {
      const userId = 'user1';
      const shareData = {
        track_id: 'track1',
        platform: 'invalid_platform'
      };
      
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      
      await expect(shareService.createShare(userId, shareData)).rejects.toThrow('Invalid platform');
    });

    it('should allow valid platforms', async () => {
      const userId = 'user1';
      const shareData = {
        track_id: 'track1',
        platform: 'twitter'
      };
      
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      
      const mockShare = { 
        id: '1', 
        user_id: userId,
        track_id: 'track1',
        platform: 'twitter'
      };
      Share.create.mockResolvedValue(mockShare);

      const result = await shareService.createShare(userId, shareData);
      
      expect(Share.create).toHaveBeenCalledWith({
        user_id: userId,
        track_id: 'track1',
        artist_id: undefined,
        album_id: undefined,
        platform: 'twitter'
      });
      expect(result).toEqual(mockShare);
    });
  });

  describe('getSharesCount', () => {
    it('should get shares count for a track', async () => {
      const entityType = 'track';
      const entityId = 'track1';
      
      Share.count.mockResolvedValue(3);

      const result = await shareService.getSharesCount(entityType, entityId);
      
      expect(Share.count).toHaveBeenCalledWith({
        where: { track_id: 'track1' }
      });
      expect(result).toEqual({ count: 3 });
    });
  });

  describe('getUserShares', () => {
    it('should fetch user shares', async () => {
      const userId = 'user1';
      
      const mockResult = {
        rows: [
          { id: '1', track_id: 'track1', track: { id: 'track1', title: 'Test Track' } }
        ],
        count: 1
      };
      
      Share.findAndCountAll.mockResolvedValue(mockResult);

      const result = await shareService.getUserShares(userId);
      
      expect(Share.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: userId },
          order: [['created_at', 'DESC']]
        })
      );
      expect(result).toEqual(mockResult);
    });
  });
});