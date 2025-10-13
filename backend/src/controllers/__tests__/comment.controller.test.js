const { create, list, update, remove } = require('../comment.controller');
const { 
  createComment, 
  getComments, 
  updateComment, 
  deleteComment 
} = require('../../services/comment.service');

// Mock the comment service functions
jest.mock('../../services/comment.service');

describe('Comment Controller', () => {
  let req, res;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock request and response objects
    req = {
      query: {},
      params: {},
      body: {},
      user: { userId: 'currentUserId' }
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      req.body = {
        content: 'New Comment',
        track_id: 'track1'
      };
      
      const mockComment = { id: '1', content: 'New Comment', track_id: 'track1', user_id: 'currentUserId' };
      createComment.mockResolvedValue(mockComment);

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(createComment).toHaveBeenCalledWith('currentUserId', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should handle validation errors', async () => {
      req.body = {
        content: 'New Comment'
      };
      
      const errorMessage = 'Must comment on a track, artist, or album';
      createComment.mockRejectedValue(new Error(errorMessage));

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle service errors', async () => {
      req.body = {
        content: 'New Comment',
        track_id: 'track1'
      };
      
      const errorMessage = 'Database error';
      createComment.mockRejectedValue(new Error(errorMessage));

      // Since create is an array with middleware, we need to call the actual function
      const createFunction = Array.isArray(create) ? create[1] : create;
      await createFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('list', () => {
    it('should return a list of comments', async () => {
      req.params = {
        entityType: 'track',
        entityId: 'track1'
      };
      
      req.query = {
        limit: '10',
        offset: '0'
      };

      const mockResult = {
        rows: [{ id: 1, content: 'Test Comment' }],
        count: 1,
        limit: 10,
        offset: 0
      };

      getComments.mockResolvedValue(mockResult);

      await list(req, res);

      expect(getComments).toHaveBeenCalledWith('track', 'track1', {
        limit: 10,
        offset: 0
      });
      
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 1, content: 'Test Comment' }],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 1,
          limit: 10,
          offset: 0
        }
      });
    });

    it('should return 400 for invalid entity type', async () => {
      req.params = {
        entityType: 'invalid',
        entityId: 'entity1'
      };

      await list(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid entity type' });
    });

    it('should handle service errors', async () => {
      req.params = {
        entityType: 'track',
        entityId: 'track1'
      };
      
      const errorMessage = 'Database error';
      getComments.mockRejectedValue(new Error(errorMessage));

      await list(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const commentId = '1';
      req.params.id = commentId;
      req.body = {
        content: 'Updated Comment'
      };
      
      const mockComment = { id: commentId, content: 'Updated Comment' };
      updateComment.mockResolvedValue(mockComment);

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(updateComment).toHaveBeenCalledWith(commentId, 'currentUserId', req.body);
      expect(res.json).toHaveBeenCalledWith(mockComment);
    });

    it('should handle validation errors', async () => {
      const commentId = '1';
      req.params.id = commentId;
      req.body = {
        content: ''
      };
      
      const errorMessage = 'Comment content cannot be empty';
      updateComment.mockRejectedValue(new Error(errorMessage));

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle service errors', async () => {
      const commentId = '1';
      req.params.id = commentId;
      req.body = {
        content: 'Updated Comment'
      };
      
      const errorMessage = 'Database error';
      updateComment.mockRejectedValue(new Error(errorMessage));

      // Since update is an array with middleware, we need to call the actual function
      const updateFunction = Array.isArray(update) ? update[1] : update;
      await updateFunction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('remove', () => {
    it('should delete a comment', async () => {
      const commentId = '1';
      req.params.id = commentId;
      
      const mockResult = { message: 'Comment deleted successfully' };
      deleteComment.mockResolvedValue(mockResult);

      await remove(req, res);

      expect(deleteComment).toHaveBeenCalledWith(commentId, 'currentUserId');
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle validation errors', async () => {
      const commentId = 'nonexistent';
      req.params.id = commentId;
      
      const errorMessage = 'Comment not found';
      deleteComment.mockRejectedValue(new Error(errorMessage));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle service errors', async () => {
      const commentId = '1';
      req.params.id = commentId;
      
      const errorMessage = 'Database error';
      deleteComment.mockRejectedValue(new Error(errorMessage));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});