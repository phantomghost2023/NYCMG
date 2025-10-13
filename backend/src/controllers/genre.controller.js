const { 
  getAllGenres, 
  getGenreById, 
  createGenre, 
  updateGenre, 
  deleteGenre 
} = require('../services/genre.service');

const listGenres = async (req, res) => {
  try {
    const genres = await getAllGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGenre = async (req, res) => {
  try {
    const genre = await getGenreById(req.params.id);
    res.json(genre);
  } catch (error) {
    if (error.message === 'Genre not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const genre = await createGenre(req.body);
    res.status(201).json(genre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const genre = await updateGenre(req.params.id, req.body);
    res.json(genre);
  } catch (error) {
    if (error.message === 'Genre not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteGenre(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Genre not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listGenres,
  getGenre,
  create,
  update,
  remove
};