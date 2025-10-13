const { 
  createComment, 
  getComments, 
  updateComment, 
  deleteComment 
} = require('../services/comment.service');
const { authenticateToken } = require('../middleware/auth.middleware');
const { createCommentSchema, updateCommentSchema, validate } = require('../middleware/validation.middleware');

const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const commentData = req.body;
    
    const comment = await createComment(userId, commentData);
    res.status(201).json(comment);
  } catch (error) {
    if (error.message === 'Must comment on a track, artist, or album' ||
        error.message === 'Comment content cannot be empty' ||
        error.message === 'Parent comment not found' ||
        error.message === 'Track not found' ||
        error.message === 'Artist not found' ||
        error.message === 'Album not found') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const list = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };
    
    // Validate entity type
    const validEntityTypes = ['track', 'artist', 'album'];
    if (!validEntityTypes.includes(entityType)) {
      return res.status(400).json({ error: 'Invalid entity type' });
    }
    
    const result = await getComments(entityType, entityId, options);
    
    res.json({
      data: result.rows,
      pagination: {
        currentPage: Math.floor(result.offset / result.limit) + 1,
        totalPages: Math.ceil(result.count / result.limit),
        totalCount: result.count,
        limit: result.limit,
        offset: result.offset
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;
    
    const comment = await updateComment(id, userId, updateData);
    res.json(comment);
  } catch (error) {
    if (error.message === 'Comment not found' ||
        error.message === 'You can only edit your own comments' ||
        error.message === 'Comment content cannot be empty') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const result = await deleteComment(id, userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Comment not found' ||
        error.message === 'You can only delete your own comments') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create: [validate(createCommentSchema), create],
  list,
  update: [validate(updateCommentSchema), update],
  remove
};