const { Share, User, Track, Artist, Album } = require('../models');

const createShare = async (userId, shareData) => {
  try {
    const { track_id, artist_id, album_id, platform } = shareData;
    
    // Validate that exactly one entity is being shared
    const entityCount = [track_id, artist_id, album_id].filter(Boolean).length;
    if (entityCount !== 1) {
      throw new Error('Must share exactly one entity (track, artist, or album)');
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
    
    // Validate platform if provided
    const validPlatforms = ['facebook', 'twitter', 'instagram', 'tiktok', 'other'];
    if (platform && !validPlatforms.includes(platform)) {
      throw new Error('Invalid platform');
    }
    
    // Create share
    const share = await Share.create({
      user_id: userId,
      track_id,
      artist_id,
      album_id,
      platform
    });
    
    return share;
  } catch (error) {
    throw new Error(`Failed to create share: ${error.message}`);
  }
};

const getSharesCount = async (entityType, entityId) => {
  try {
    const whereClause = {};
    whereClause[`${entityType}_id`] = entityId;
    
    const count = await Share.count({
      where: whereClause
    });
    
    return { count };
  } catch (error) {
    throw new Error(`Failed to fetch shares count: ${error.message}`);
  }
};

const getUserShares = async (userId, options = {}) => {
  try {
    const { limit = 20, offset = 0 } = options;
    
    const shares = await Share.findAndCountAll({
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
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return shares;
  } catch (error) {
    throw new Error(`Failed to fetch user shares: ${error.message}`);
  }
};

module.exports = {
  createShare,
  getSharesCount,
  getUserShares
};