const { 
  getAllAlbums, 
  getAlbumById, 
  createAlbum, 
  updateAlbum, 
  deleteAlbum 
} = require('../services/album.service');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');
const { createAlbumSchema, updateAlbumSchema, validate } = require('../middleware/validation.middleware');

const listAlbums = async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      artistId: req.query.artistId
    };
    
    const result = await getAllAlbums(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAlbum = async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id);
    res.json(album);
  } catch (error) {
    if (error.message === 'Album not found') {
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
    
    const album = await createAlbum(artistId, req.body);
    res.status(201).json(album);
  } catch (error) {
    if (error.message === 'Artist not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const album = await updateAlbum(req.params.id, req.body);
    res.json(album);
  } catch (error) {
    if (error.message === 'Album not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteAlbum(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Album not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listAlbums,
  getAlbum,
  create: [validate(createAlbumSchema), create],
  update: [validate(updateAlbumSchema), update],
  remove
};