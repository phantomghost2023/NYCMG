const { Like, User, Track, Artist, Album, Comment } = require('../models');

const createLike = async (userId, likeData) => {
  try {
    const { track_id, artist_id, album_id, comment_id } = likeData;
    
    // Validate that exactly one entity is being liked
    const entityCount = [track_id, artist_id, album_id, comment_id].filter(Boolean).length;
    if (entityCount !== 1) {
      throw new Error('Must like exactly one entity (track, artist, album, or comment)');
    }
    
    // Validate entity exists
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
    
    if (comment_id) {
      const comment = await Comment.findByPk(comment_id);
      if (!comment) {
        throw new Error('Comment not found');
      }
    }
    
    // Check if like already exists
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        track_id,
        artist_id,
        album_id,
        comment_id
      }
    });
    
    if (existingLike) {
      throw new Error('Already liked this entity');
    }
    
    // Create like
    const like = await Like.create({
      user_id: userId,
      track_id,
      artist_id,
      album_id,
      comment_id
    });
    
    return like;
  } catch (error) {
    throw new Error(`Failed to create like: ${error.message}`);
  }
};

const removeLike = async (userId, likeData) => {
  try {
    const { track_id, artist_id, album_id, comment_id } = likeData;
    
    // Find the like
    const like = await Like.findOne({
      where: {
        user_id: userId,
        track_id,
        artist_id,
        album_id,
        comment_id
      }
    });
    
    if (!like) {
      throw new Error('Like not found');
    }
    
    // Delete like
    await like.destroy();
    
    return { message: 'Like removed successfully' };
  } catch (error) {
    throw new Error(`Failed to remove like: ${error.message}`);
  }
};

const getLikesCount = async (entityType, entityId) => {
  try {
    const whereClause = {};
    whereClause[`${entityType}_id`] = entityId;
    
    const count = await Like.count({
      where: whereClause
    });
    
    return { count };
  } catch (error) {
    throw new Error(`Failed to fetch likes count: ${error.message}`);
  }
};

const getUserLikes = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0 } = options;
    
    const likes = await Like.findAndCountAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Track,
          as: 'track',
          attributes: ['id', 'title']
        },
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'artist_name']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'title']
        },
        {
          model: Comment,
          as: 'comment',
          attributes: ['id', 'content']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return likes;
  } catch (error) {
    throw new Error(`Failed to fetch user likes: ${error.message}`);
  }
};

const isLiked = async (userId, likeData) => {
  try {
    const { track_id, artist_id, album_id, comment_id } = likeData;
    
    const like = await Like.findOne({
      where: {
        user_id: userId,
        track_id,
        artist_id,
        album_id,
        comment_id
      }
    });
    
    return !!like;
  } catch (error) {
    throw new Error(`Failed to check like status: ${error.message}`);
  }
};

module.exports = {
  createLike,
  removeLike,
  getLikesCount,
  getUserLikes,
  isLiked
};