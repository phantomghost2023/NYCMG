const { Artist, User } = require('../models');
const { 
  getCachedArtist, 
  setCachedArtist, 
  clearArtistCache,
  getCachedArtistsList,
  setCachedArtistsList,
  clearArtistsListCache
} = require('./cache.service');

const getAllArtists = async (options = {}) => {
  try {
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'DESC' } = options;
    
    // Create cache key based on options
    const cacheKey = `artists_list_${limit}_${offset}_${sortBy}_${sortOrder}`;
    let cachedResult = getCachedArtistsList();
    
    if (cachedResult && cachedResult[cacheKey]) {
      return cachedResult[cacheKey];
    }
    
    // Optimized query with specific attributes to reduce data transfer
    const artists = await Artist.findAndCountAll({
      attributes: ['id', 'artist_name', 'verified_nyc', 'profile_picture_url', 'created_at', 'updated_at'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username'] // Only include necessary user fields
      }],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      // Add index hints for better performance
      logging: false // Disable logging in production for better performance
    });
    
    const result = {
      artists: artists.rows,
      totalCount: artists.count,
      limit,
      offset
    };
    
    // Cache the result
    if (!cachedResult) {
      cachedResult = {};
    }
    cachedResult[cacheKey] = result;
    setCachedArtistsList(cachedResult);
    
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch artists: ${error.message}`);
  }
};

const getArtistById = async (id) => {
  try {
    // Check cache first
    let artist = getCachedArtist(id);
    if (artist) {
      return artist;
    }
    
    // If not in cache, fetch from database with optimized query
    artist = await Artist.findByPk(id, {
      attributes: ['id', 'artist_name', 'verified_nyc', 'profile_picture_url', 'created_at', 'updated_at'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email']
      }],
      logging: false // Disable logging in production for better performance
    });
    
    if (!artist) {
      throw new Error('Artist not found');
    }
    
    // Cache the result
    setCachedArtist(id, artist);
    
    return artist;
  } catch (error) {
    throw new Error(`Failed to fetch artist: ${error.message}`);
  }
};

const createArtist = async (userId, artistData) => {
  try {
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if user is already an artist
    const existingArtist = await Artist.findOne({ where: { user_id: userId } });
    if (existingArtist) {
      throw new Error('User is already registered as an artist');
    }
    
    // Create artist
    const artist = await Artist.create({
      user_id: userId,
      artist_name: artistData.artist_name,
      verified_nyc: artistData.verified_nyc || false,
      profile_picture_url: artistData.profile_picture_url || null
    });
    
    // Clear artists list cache when a new artist is created
    clearArtistsListCache();
    
    return artist;
  } catch (error) {
    throw new Error(`Failed to create artist: ${error.message}`);
  }
};

const updateArtist = async (id, updateData) => {
  try {
    const artist = await Artist.findByPk(id);
    
    if (!artist) {
      throw new Error('Artist not found');
    }
    
    // Only allow updating specific fields
    const allowedFields = ['artist_name', 'verified_nyc', 'profile_picture_url'];
    const filteredUpdateData = {};
    
    for (const field of allowedFields) {
      if (field in updateData) {
        filteredUpdateData[field] = updateData[field];
      }
    }
    
    const updatedArtist = await artist.update(filteredUpdateData);
    
    // Clear cache for this artist and artists list
    clearArtistCache(id);
    clearArtistsListCache();
    
    return updatedArtist;
  } catch (error) {
    throw new Error(`Failed to update artist: ${error.message}`);
  }
};

const deleteArtist = async (id) => {
  try {
    const artist = await Artist.findByPk(id);
    
    if (!artist) {
      throw new Error('Artist not found');
    }
    
    await artist.destroy();
    
    // Clear cache for this artist and artists list
    clearArtistCache(id);
    clearArtistsListCache();
    
    return { message: 'Artist deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete artist: ${error.message}`);
  }
};

module.exports = {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
};