const { 
  createShare, 
  getSharesCount, 
  getUserShares 
} = require('../services/share.service');
const { authenticateToken } = require('../middleware/auth.middleware');
const { shareSchema, validate } = require('../middleware/validation.middleware');

const share = async (req, res) => {
  try {
    const userId = req.user.userId;
    const shareData = req.body;
    
    const share = await createShare(userId, shareData);
    res.status(201).json(share);
  } catch (error) {
    if (error.message === 'Must share exactly one entity (track, artist, or album)' ||
        error.message === 'Track not found' ||
        error.message === 'Artist not found' ||
        error.message === 'Album not found' ||
        error.message === 'Invalid platform') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const getShares = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate entity type
    const validEntityTypes = ['track', 'artist', 'album'];
    if (!validEntityTypes.includes(entityType)) {
      return res.status(400).json({ error: 'Invalid entity type' });
    }
    
    const result = await getSharesCount(entityType, entityId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listUserShares = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    };
    
    const result = await getUserShares(userId, options);
    
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

module.exports = {
  share: [validate(shareSchema), share],
  getShares,
  listUserShares
};