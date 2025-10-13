const { Genre } = require('../models');
const { getCachedGenres, setCachedGenres, clearGenresCache } = require('./cache.service');

const getAllGenres = async () => {
  try {
    // Check cache first
    let genres = getCachedGenres();
    if (genres) {
      return genres;
    }
    
    // If not in cache, fetch from database with optimized query
    genres = await Genre.findAll({
      attributes: ['id', 'name', 'description', 'created_at', 'updated_at'], // Only necessary fields
      order: [['name', 'ASC']],
      logging: false // Disable logging in production for better performance
    });
    
    // Cache the result
    setCachedGenres(genres);
    
    return genres;
  } catch (error) {
    throw new Error(`Failed to fetch genres: ${error.message}`);
  }
};

const getGenreById = async (id) => {
  try {
    const genre = await Genre.findByPk(id, {
      attributes: ['id', 'name', 'description', 'created_at', 'updated_at'], // Only necessary fields
      logging: false // Disable logging in production for better performance
    });
    
    if (!genre) {
      throw new Error('Genre not found');
    }
    
    return genre;
  } catch (error) {
    throw new Error(`Failed to fetch genre: ${error.message}`);
  }
};

const createGenre = async (genreData) => {
  try {
    const genre = await Genre.create(genreData);
    
    // Clear genres cache when a new genre is created
    clearGenresCache();
    
    return genre;
  } catch (error) {
    throw new Error(`Failed to create genre: ${error.message}`);
  }
};

const updateGenre = async (id, updateData) => {
  try {
    const genre = await Genre.findByPk(id);
    
    if (!genre) {
      throw new Error('Genre not found');
    }
    
    const updatedGenre = await genre.update(updateData);
    
    // Clear genres cache when a genre is updated
    clearGenresCache();
    
    return updatedGenre;
  } catch (error) {
    throw new Error(`Failed to update genre: ${error.message}`);
  }
};

const deleteGenre = async (id) => {
  try {
    const genre = await Genre.findByPk(id);
    
    if (!genre) {
      throw new Error('Genre not found');
    }
    
    await genre.destroy();
    
    // Clear genres cache when a genre is deleted
    clearGenresCache();
    
    return { message: 'Genre deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete genre: ${error.message}`);
  }
};

module.exports = {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
};