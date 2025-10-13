// Mock the models
jest.mock('../../models', () => {
  const mockLike = {
    create: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    findAndCountAll: jest.fn(),
    destroy: jest.fn()
  };
  
  return {
    Like: mockLike,
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
    },
    Comment: {
      findByPk: jest.fn()
    }
  };
});

// Import the actual service functions
const likeService = require('../like.service');
const { Like, Track, Artist, Album, Comment } = require('../../models');

describe('Like Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createLike', () => {
    it('should create a like on a track successfully', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'track1'
      };
      
      // Mock that the track exists
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      
      // Mock that the like doesn't already exist
      Like.findOne.mockResolvedValue(null);
      
      // Mock like creation
      const mockLike = { 
        id: '1', 
        user_id: userId,
        track_id: 'track1'
      };
      Like.create.mockResolvedValue(mockLike);

      const result = await likeService.createLike(userId, likeData);
      
      expect(Track.findByPk).toHaveBeenCalledWith('track1');
      expect(Like.findOne).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          track_id: 'track1',
          artist_id: undefined,
          album_id: undefined,
          comment_id: undefined
        }
      });
      expect(Like.create).toHaveBeenCalledWith({
        user_id: userId,
        track_id: 'track1',
        artist_id: undefined,
        album_id: undefined,
        comment_id: undefined
      });
      expect(result).toEqual(mockLike);
    });

    it('should throw error when no entity is specified', async () => {
      const userId = 'user1';
      const likeData = {};
      
      await expect(likeService.createLike(userId, likeData)).rejects.toThrow('Must like exactly one entity (track, artist, album, or comment)');
    });

    it('should throw error when multiple entities are specified', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'track1',
        artist_id: 'artist1'
      };
      
      await expect(likeService.createLike(userId, likeData)).rejects.toThrow('Must like exactly one entity (track, artist, album, or comment)');
    });

    it('should throw error when track is not found', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'nonexistent'
      };
      
      Track.findByPk.mockResolvedValue(null);
      
      await expect(likeService.createLike(userId, likeData)).rejects.toThrow('Track not found');
    });

    it('should throw error when artist is not found', async () => {
      const userId = 'user1';
      const likeData = {
        artist_id: 'nonexistent'
      };
      
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(likeService.createLike(userId, likeData)).rejects.toThrow('Artist not found');
    });

    it('should throw error when album is not found', async () => {
      const userId = 'user1';
      const likeData = {
        album_id: 'nonexistent'
      };
      
      Album.findByPk.mockResolvedValue(null);
      
      await expect(likeService.createLike(userId, likeData)).rejects.toThrow('Album not found');
    });

    it('should throw error when comment is not found', async () => {
      const userId = 'user1';
      const likeData = {
        comment_id: 'nonexistent'
      };
      
      Comment.findByPk.mockResolvedValue(null);
      
      await expect(likeService.createLike(userId, likeData)).rejects.toThrow('Comment not found');
    });

    it('should throw error when already liked the entity', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'track1'
      };
      
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      
      // Mock that the like already exists
      const existingLike = { id: '1', user_id: userId, track_id: 'track1' };
      Like.findOne.mockResolvedValue(existingLike);
      
      await expect(likeService.createLike(userId, likeData)).rejects.toThrow('Already liked this entity');
    });
  });

  describe('removeLike', () => {
    it('should remove a like successfully', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'track1'
      };
      
      // Mock that the like exists
      const mockLike = { 
        id: '1', 
        user_id: userId,
        track_id: 'track1',
        destroy: jest.fn().mockResolvedValue()
      };
      Like.findOne.mockResolvedValue(mockLike);

      const result = await likeService.removeLike(userId, likeData);
      
      expect(Like.findOne).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          track_id: 'track1',
          artist_id: undefined,
          album_id: undefined,
          comment_id: undefined
        }
      });
      expect(mockLike.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Like removed successfully' });
    });

    it('should throw error when like is not found', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'track1'
      };
      
      // Mock that the like doesn't exist
      Like.findOne.mockResolvedValue(null);
      
      await expect(likeService.removeLike(userId, likeData)).rejects.toThrow('Like not found');
    });
  });

  describe('getLikesCount', () => {
    it('should get likes count for a track', async () => {
      const entityType = 'track';
      const entityId = 'track1';
      
      Like.count.mockResolvedValue(5);

      const result = await likeService.getLikesCount(entityType, entityId);
      
      expect(Like.count).toHaveBeenCalledWith({
        where: { track_id: 'track1' }
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('getUserLikes', () => {
    it('should fetch user likes', async () => {
      const userId = 'user1';
      
      const mockResult = {
        rows: [
          { id: '1', track_id: 'track1', track: { id: 'track1', title: 'Test Track' } }
        ],
        count: 1
      };
      
      Like.findAndCountAll.mockResolvedValue(mockResult);

      const result = await likeService.getUserLikes(userId);
      
      expect(Like.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: userId },
          order: [['created_at', 'DESC']]
        })
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('isLiked', () => {
    it('should return true when entity is liked', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'track1'
      };
      
      // Mock that the entity is liked
      const mockLike = { id: '1', user_id: userId, track_id: 'track1' };
      Like.findOne.mockResolvedValue(mockLike);

      const result = await likeService.isLiked(userId, likeData);
      
      expect(Like.findOne).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          track_id: 'track1',
          artist_id: undefined,
          album_id: undefined,
          comment_id: undefined
        }
      });
      expect(result).toBe(true);
    });

    it('should return false when entity is not liked', async () => {
      const userId = 'user1';
      const likeData = {
        track_id: 'track1'
      };
      
      // Mock that the entity is not liked
      Like.findOne.mockResolvedValue(null);

      const result = await likeService.isLiked(userId, likeData);
      
      expect(Like.findOne).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          track_id: 'track1',
          artist_id: undefined,
          album_id: undefined,
          comment_id: undefined
        }
      });
      expect(result).toBe(false);
    });
  });
});