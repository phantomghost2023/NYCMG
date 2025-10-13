const { Comment, User, Track, Artist, Album } = require('../models');

const createComment = async (userId, commentData) => {
  try {
    // Validate that at least one entity is being commented on
    const { track_id, artist_id, album_id, parent_id, content } = commentData;
    
    if (!track_id && !artist_id && !album_id) {
      throw new Error('Must comment on a track, artist, or album');
    }
    
    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }
    
    // Validate parent comment if provided
    if (parent_id) {
      const parentComment = await Comment.findByPk(parent_id);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
    }
    
    // Validate entity exists if provided
    if (track_id) {
      const track = await Track.findByPk(track_id);
      if (!track) {
        throw new Error('Track not found');
      }
    }
    
    if (artist_id) {
      const artist = await Artist.findByPk(artist_id);
      if (!artist) {
        throw new Error('Artist not found');
      }
    }
    
    if (album_id) {
      const album = await Album.findByPk(album_id);
      if (!album) {
        throw new Error('Album not found');
      }
    }
    
    // Create comment
    const comment = await Comment.create({
      user_id: userId,
      track_id,
      artist_id,
      album_id,
      parent_id,
      content: content.trim()
    });
    
    // Load associated data
    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          as: 'parent',
          attributes: ['id', 'content']
        }
      ]
    });
    
    return fullComment;
  } catch (error) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }
};

const getComments = async (entityType, entityId, options = {}) => {
  try {
    const { limit = 20, offset = 0 } = options;
    
    // Build where clause based on entity type
    const whereClause = {};
    whereClause[`${entityType}_id`] = entityId;
    whereClause.parent_id = null; // Only top-level comments
    
    const comments = await Comment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          as: 'replies',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }]
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return comments;
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
};

const updateComment = async (commentId, userId, updateData) => {
  try {
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    // Check if user owns the comment
    if (comment.user_id !== userId) {
      throw new Error('You can only edit your own comments');
    }
    
    // Validate content if provided
    if (updateData.content) {
      if (updateData.content.trim().length === 0) {
        throw new Error('Comment content cannot be empty');
      }
      updateData.content = updateData.content.trim();
    }
    
    const updatedComment = await comment.update(updateData);
    
    // Load associated data
    const fullComment = await Comment.findByPk(updatedComment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });
    
    return fullComment;
  } catch (error) {
    throw new Error(`Failed to update comment: ${error.message}`);
  }
};

const deleteComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    // Check if user owns the comment or is admin
    if (comment.user_id !== userId) {
      throw new Error('You can only delete your own comments');
    }
    
    // Delete comment
    await comment.destroy();
    
    return { message: 'Comment deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};