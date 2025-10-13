// Mock the models
jest.mock('../../models', () => {
  const mockComment = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  };
  
  return {
    Comment: mockComment,
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
const commentService = require('../comment.service');
const { Comment, User, Track, Artist, Album } = require('../../models');

describe('Comment Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a new comment on a track successfully', async () => {
      const userId = 'user1';
      const commentData = {
        track_id: 'track1',
        content: 'Great track!'
      };
      
      // Mock that the track exists
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      
      // Mock comment creation
      const mockCreatedComment = { 
        id: '1', 
        user_id: userId,
        track_id: 'track1',
        content: 'Great track!'
      };
      Comment.create.mockResolvedValue(mockCreatedComment);
      
      // Mock Comment.findByPk to return a comment with associations
      const mockCommentWithAssociations = { 
        id: '1', 
        user_id: userId,
        track_id: 'track1',
        content: 'Great track!',
        user: { id: userId, username: 'testuser' }
      };
      Comment.findByPk.mockResolvedValue(mockCommentWithAssociations);

      const result = await commentService.createComment(userId, commentData);
      
      expect(Track.findByPk).toHaveBeenCalledWith('track1');
      expect(Comment.create).toHaveBeenCalledWith({
        user_id: userId,
        track_id: 'track1',
        artist_id: undefined,
        album_id: undefined,
        parent_id: undefined,
        content: 'Great track!'
      });
      expect(result).toEqual(mockCommentWithAssociations);
    });

    it('should throw error when no entity is specified', async () => {
      const userId = 'user1';
      const commentData = {
        content: 'Great track!'
      };
      
      await expect(commentService.createComment(userId, commentData)).rejects.toThrow('Must comment on a track, artist, or album');
    });

    it('should throw error when content is empty', async () => {
      const userId = 'user1';
      const commentData = {
        track_id: 'track1',
        content: '   '
      };
      
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      
      await expect(commentService.createComment(userId, commentData)).rejects.toThrow('Comment content cannot be empty');
    });

    it('should throw error when parent comment is not found', async () => {
      const userId = 'user1';
      const commentData = {
        track_id: 'track1',
        parent_id: 'nonexistent',
        content: 'Great track!'
      };
      
      Track.findByPk.mockResolvedValue({ id: 'track1', title: 'Test Track' });
      Comment.findByPk.mockResolvedValue(null);
      
      await expect(commentService.createComment(userId, commentData)).rejects.toThrow('Parent comment not found');
    });

    it('should throw error when track is not found', async () => {
      const userId = 'user1';
      const commentData = {
        track_id: 'nonexistent',
        content: 'Great track!'
      };
      
      Track.findByPk.mockResolvedValue(null);
      
      await expect(commentService.createComment(userId, commentData)).rejects.toThrow('Track not found');
    });

    it('should throw error when artist is not found', async () => {
      const userId = 'user1';
      const commentData = {
        artist_id: 'nonexistent',
        content: 'Great artist!'
      };
      
      Artist.findByPk.mockResolvedValue(null);
      
      await expect(commentService.createComment(userId, commentData)).rejects.toThrow('Artist not found');
    });

    it('should throw error when album is not found', async () => {
      const userId = 'user1';
      const commentData = {
        album_id: 'nonexistent',
        content: 'Great album!'
      };
      
      Album.findByPk.mockResolvedValue(null);
      
      await expect(commentService.createComment(userId, commentData)).rejects.toThrow('Album not found');
    });
  });

  describe('getComments', () => {
    it('should fetch comments for a track', async () => {
      const entityType = 'track';
      const entityId = 'track1';
      
      const mockResult = {
        rows: [
          { id: '1', content: 'Great track!', user: { id: 'user1', username: 'testuser' } }
        ],
        count: 1
      };
      
      Comment.findAndCountAll.mockResolvedValue(mockResult);

      const result = await commentService.getComments(entityType, entityId);
      
      expect(Comment.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { track_id: 'track1', parent_id: null },
          order: [['created_at', 'DESC']]
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should fetch comments for an artist', async () => {
      const entityType = 'artist';
      const entityId = 'artist1';
      
      const mockResult = {
        rows: [],
        count: 0
      };
      
      Comment.findAndCountAll.mockResolvedValue(mockResult);

      await commentService.getComments(entityType, entityId);
      
      expect(Comment.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { artist_id: 'artist1', parent_id: null }
        })
      );
    });

    it('should fetch comments for an album', async () => {
      const entityType = 'album';
      const entityId = 'album1';
      
      const mockResult = {
        rows: [],
        count: 0
      };
      
      Comment.findAndCountAll.mockResolvedValue(mockResult);

      await commentService.getComments(entityType, entityId);
      
      expect(Comment.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { album_id: 'album1', parent_id: null }
        })
      );
    });
  });

  describe('updateComment', () => {
    it('should update a comment successfully', async () => {
      const commentId = '1';
      const userId = 'user1';
      const updateData = { content: 'Updated comment' };
      
      // Mock comment exists and belongs to user
      const mockComment = { 
        id: commentId, 
        user_id: userId,
        content: 'Original comment',
        update: jest.fn().mockImplementation(function(updateData) {
          // Return a new object with the updated properties
          return Promise.resolve({ 
            id: this.id, 
            user_id: this.user_id,
            content: updateData.content || this.content
          });
        })
      };
      Comment.findByPk.mockResolvedValueOnce(mockComment);
      
      // Mock Comment.findByPk to return updated comment with associations
      const mockCommentWithAssociations = { 
        id: commentId, 
        user_id: userId,
        content: 'Updated comment',
        user: { id: userId, username: 'testuser' }
      };
      Comment.findByPk.mockResolvedValueOnce(mockCommentWithAssociations);

      const result = await commentService.updateComment(commentId, userId, updateData);
      
      expect(Comment.findByPk).toHaveBeenCalledWith(commentId);
      expect(mockComment.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockCommentWithAssociations);
    });

    it('should throw error when comment is not found', async () => {
      const commentId = 'nonexistent';
      const userId = 'user1';
      const updateData = { content: 'Updated comment' };
      
      Comment.findByPk.mockResolvedValue(null);
      
      await expect(commentService.updateComment(commentId, userId, updateData)).rejects.toThrow('Comment not found');
    });

    it('should throw error when user does not own the comment', async () => {
      const commentId = '1';
      const userId = 'user1';
      const updateData = { content: 'Updated comment' };
      
      // Mock comment exists but belongs to different user
      const mockComment = { 
        id: commentId, 
        user_id: 'user2', // Different user
        content: 'Original comment'
      };
      Comment.findByPk.mockResolvedValue(mockComment);
      
      await expect(commentService.updateComment(commentId, userId, updateData)).rejects.toThrow('You can only edit your own comments');
    });

    it('should throw error when content is empty', async () => {
      const commentId = '1';
      const userId = 'user1';
      const updateData = { content: '   ' };
      
      // Mock comment exists and belongs to user
      const mockComment = { 
        id: commentId, 
        user_id: userId,
        content: 'Original comment'
      };
      Comment.findByPk.mockResolvedValue(mockComment);
      
      await expect(commentService.updateComment(commentId, userId, updateData)).rejects.toThrow('Comment content cannot be empty');
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment successfully', async () => {
      const commentId = '1';
      const userId = 'user1';
      
      // Mock comment exists and belongs to user
      const mockComment = { 
        id: commentId, 
        user_id: userId,
        destroy: jest.fn().mockResolvedValue()
      };
      Comment.findByPk.mockResolvedValue(mockComment);

      const result = await commentService.deleteComment(commentId, userId);
      
      expect(Comment.findByPk).toHaveBeenCalledWith(commentId);
      expect(mockComment.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });

    it('should throw error when comment is not found', async () => {
      const commentId = 'nonexistent';
      const userId = 'user1';
      
      Comment.findByPk.mockResolvedValue(null);
      
      await expect(commentService.deleteComment(commentId, userId)).rejects.toThrow('Comment not found');
    });

    it('should throw error when user does not own the comment', async () => {
      const commentId = '1';
      const userId = 'user1';
      
      // Mock comment exists but belongs to different user
      const mockComment = { 
        id: commentId, 
        user_id: 'user2' // Different user
      };
      Comment.findByPk.mockResolvedValue(mockComment);
      
      await expect(commentService.deleteComment(commentId, userId)).rejects.toThrow('You can only delete your own comments');
    });
  });
});