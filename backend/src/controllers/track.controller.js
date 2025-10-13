const { 
  getAllTracks, 
  getTrackById, 
  createTrack, 
  updateTrack, 
  deleteTrack 
} = require('../services/track.service');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');
const { createTrackSchema, updateTrackSchema, validate } = require('../middleware/validation.middleware');

const listTracks = async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      boroughIds: null,
      genreIds: null,
      search: req.query.search,
      artistId: req.query.artistId,
      isExplicit: req.query.isExplicit !== undefined ? req.query.isExplicit === 'true' : undefined
    };
    
    // Parse boroughIds and genreIds from query parameters
    if (req.query.boroughIds) {
      try {
        options.boroughIds = Array.isArray(req.query.boroughIds) 
          ? req.query.boroughIds 
          : JSON.parse(req.query.boroughIds);
      } catch (e) {
        // If parsing fails, treat as single value
        options.boroughIds = [req.query.boroughIds];
      }
    }
    
    if (req.query.genreIds) {
      try {
        options.genreIds = Array.isArray(req.query.genreIds) 
          ? req.query.genreIds 
          : JSON.parse(req.query.genreIds);
      } catch (e) {
        // If parsing fails, treat as single value
        options.genreIds = [req.query.genreIds];
      }
    }
    
    const result = await getAllTracks(options);
    
    // Format response for pagination
    res.json({
      data: result.tracks,
      pagination: {
        currentPage: Math.floor(result.offset / result.limit) + 1,
        totalPages: Math.ceil(result.totalCount / result.limit),
        totalCount: result.totalCount,
        limit: result.limit,
        offset: result.offset
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTrack = async (req, res) => {
  try {
    const track = await getTrackById(req.params.id);
    res.json(track);
  } catch (error) {
    if (error.message === 'Track not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    // Extract artist ID from request (in a real app, you'd verify the user is the artist)
    const artistId = req.body.artist_id || req.user.artistId;
    
    if (!artistId) {
      return res.status(400).json({ error: 'Artist ID is required' });
    }
    
    const track = await createTrack(artistId, req.body);
    res.status(201).json(track);
  } catch (error) {
    if (error.message === 'Artist not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const track = await updateTrack(req.params.id, req.body);
    res.json(track);
  } catch (error) {
    if (error.message === 'Track not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteTrack(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Track not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listTracks,
  getTrack,
  create: [validate(createTrackSchema), create],
  update: [validate(updateTrackSchema), update],
  remove
};