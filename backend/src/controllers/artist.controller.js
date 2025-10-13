const { 
  getAllArtists, 
  getArtistById, 
  createArtist, 
  updateArtist, 
  deleteArtist 
} = require('../services/artist.service');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');
const { createArtistSchema, updateArtistSchema, validate } = require('../middleware/validation.middleware');

const listArtists = async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    };
    
    const result = await getAllArtists(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getArtist = async (req, res) => {
  try {
    const artist = await getArtistById(req.params.id);
    res.json(artist);
  } catch (error) {
    if (error.message === 'Artist not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    // Extract user ID from request (set by auth middleware)
    const userId = req.user.userId;
    
    const artist = await createArtist(userId, req.body);
    res.status(201).json(artist);
  } catch (error) {
    if (error.message === 'User is already registered as an artist') {
      return res.status(409).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    // For now, only allow artists to update their own profile
    // In a real app, you'd want to check if the user owns this artist profile
    const artist = await updateArtist(req.params.id, req.body);
    res.json(artist);
  } catch (error) {
    if (error.message === 'Artist not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteArtist(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Artist not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listArtists,
  getArtist,
  create: [validate(createArtistSchema), create],
  update: [validate(updateArtistSchema), update],
  remove
};