const { Album, Artist, Track } = require('../models');
const { 
  getCachedAlbum, 
  setCachedAlbum, 
  clearAlbumCache,
  getCachedAlbumsList,
  setCachedAlbumsList,
  clearAlbumsListCache
} = require('./cache.service');

const getAllAlbums = async (options = {}) => {
  try {
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'DESC', artistId } = options;
    
    // Create cache key based on options
    const cacheKey = `albums_list_${limit}_${offset}_${sortBy}_${sortOrder}_${artistId || ''}`;
    let cachedResult = getCachedAlbumsList();
    
    if (cachedResult && cachedResult[cacheKey]) {
      return cachedResult[cacheKey];
    }
    
    const whereClause = {
      status: 'active' // Only fetch active albums by default
    };
    
    // Add artist filter if provided
    if (artistId) {
      whereClause.artist_id = artistId;
    }
    
    // Optimized query with specific attributes and performance improvements
    const albums = await Album.findAndCountAll({
      attributes: ['id', 'title', 'artist_id', 'description', 'release_date', 'cover_art_url', 'is_explicit', 'status', 'created_at', 'updated_at'],
      where: whereClause,
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'artist_name']
        },
        {
          model: Track,
          as: 'tracks',
          attributes: ['id', 'title', 'duration'],
          where: {
            status: 'active' // Only include active tracks
          },
          required: false // LEFT JOIN to avoid excluding albums without tracks
        }
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true, // Ensure accurate count when using includes
      logging: false // Disable logging in production for better performance
    });
    
    const result = {
      albums: albums.rows,
      totalCount: albums.count,
      limit,
      offset
    };
    
    // Cache the result
    if (!cachedResult) {
      cachedResult = {};
    }
    cachedResult[cacheKey] = result;
    setCachedAlbumsList(cachedResult);
    
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch albums: ${error.message}`);
  }
};

const getAlbumById = async (id) => {
  try {
    // Check cache first
    let album = getCachedAlbum(id);
    if (album) {
      return album;
    }
    
    // If not in cache, fetch from database with optimized query
    album = await Album.findByPk(id, {
      attributes: ['id', 'title', 'artist_id', 'description', 'release_date', 'cover_art_url', 'is_explicit', 'status', 'created_at', 'updated_at'],
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'artist_name']
        },
        {
          model: Track,
          as: 'tracks',
          attributes: ['id', 'title', 'duration', 'release_date'],
          where: {
            status: 'active' // Only include active tracks
          },
          required: false
        }
      ],
      logging: false // Disable logging in production for better performance
    });
    
    if (!album) {
      throw new Error('Album not found');
    }
    
    // Cache the result
    setCachedAlbum(id, album);
    
    return album;
  } catch (error) {
    throw new Error(`Failed to fetch album: ${error.message}`);
  }
};

const createAlbum = async (artistId, albumData) => {
  try {
    // Verify artist exists
    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      throw new Error('Artist not found');
    }
    
    // Create album
    const album = await Album.create({
      artist_id: artistId,
      title: albumData.title,
      description: albumData.description,
      release_date: albumData.release_date,
      cover_art_url: albumData.cover_art_url,
      is_explicit: albumData.is_explicit || false,
      status: albumData.status || 'active'
    });
    
    // Reload album with associations
    const fullAlbum = await getAlbumById(album.id);
    
    // Clear albums list cache when a new album is created
    clearAlbumsListCache();
    
    return fullAlbum;
  } catch (error) {
    throw new Error(`Failed to create album: ${error.message}`);
  }
};

const updateAlbum = async (id, updateData) => {
  try {
    const album = await Album.findByPk(id);
    
    if (!album) {
      throw new Error('Album not found');
    }
    
    const updatedAlbum = await album.update(updateData);
    
    // Reload album with associations
    const fullAlbum = await getAlbumById(updatedAlbum.id);
    
    // Clear cache for this album and albums list
    clearAlbumCache(id);
    clearAlbumsListCache();
    
    return fullAlbum;
  } catch (error) {
    throw new Error(`Failed to update album: ${error.message}`);
  }
};

const deleteAlbum = async (id) => {
  try {
    const album = await Album.findByPk(id);
    
    if (!album) {
      throw new Error('Album not found');
    }
    
    // Soft delete by updating status
    await album.update({ status: 'deleted' });
    
    // Clear cache for this album and albums list
    clearAlbumCache(id);
    clearAlbumsListCache();
    
    return { message: 'Album deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete album: ${error.message}`);
  }
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum
};