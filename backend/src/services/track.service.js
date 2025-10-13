const { Track, Artist, Album, Genre } = require('../models');
const { Op } = require('sequelize');
const { 
  getCachedTrack, 
  setCachedTrack, 
  clearTrackCache,
  getCachedTracksList,
  setCachedTracksList,
  clearTracksListCache
} = require('./cache.service');

const getAllTracks = async (options = {}) => {
  try {
    const { limit = 20, offset = 0, sortBy = 'created_at', sortOrder = 'DESC', boroughIds, genreIds, search, artistId, isExplicit } = options;
    
    // Create cache key based on options
    const cacheKey = `tracks_list_${limit}_${offset}_${sortBy}_${sortOrder}_${boroughIds ? boroughIds.join(',') : ''}_${genreIds ? genreIds.join(',') : ''}_${search || ''}_${artistId || ''}_${isExplicit !== undefined ? isExplicit : ''}`;
    let cachedResult = getCachedTracksList();
    
    if (cachedResult && cachedResult[cacheKey]) {
      return cachedResult[cacheKey];
    }
    
    const whereClause = {
      status: 'active' // Only fetch active tracks by default
    };
    
    // Add search filter if provided
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add borough filter if provided
    if (boroughIds && boroughIds.length > 0) {
      whereClause.borough_id = { [Op.in]: boroughIds };
    }
    
    // Add artist filter if provided
    if (artistId) {
      whereClause.artist_id = artistId;
    }
    
    // Add explicit content filter if provided
    if (isExplicit !== undefined) {
      whereClause.is_explicit = isExplicit;
    }
    
    const includeOptions = [
      {
        model: Artist,
        as: 'artist',
        attributes: ['id', 'artist_name'] // Only necessary fields
      }
    ];
    
    // Add album include only if album_id exists
    includeOptions.push({
      model: Album,
      as: 'album',
      attributes: ['id', 'title'],
      required: false // LEFT JOIN to avoid excluding tracks without albums
    });
    
    // Add genre filter if provided
    if (genreIds && genreIds.length > 0) {
      includeOptions.push({
        model: Genre,
        as: 'genres',
        where: { id: { [Op.in]: genreIds } },
        through: { attributes: [] },
        required: true // INNER JOIN since we're filtering by genre
      });
    } else {
      // Include genres without filtering
      includeOptions.push({
        model: Genre,
        as: 'genres',
        through: { attributes: [] },
        required: false // LEFT JOIN to include tracks without genres
      });
    }
    
    // Validate sortBy parameter
    const validSortFields = ['created_at', 'title', 'release_date'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    
    // Validate sortOrder parameter
    const sortOrderValue = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    
    // Optimized query with specific attributes and performance improvements
    const tracks = await Track.findAndCountAll({
      attributes: ['id', 'title', 'artist_id', 'album_id', 'duration', 'release_date', 'is_explicit', 'status', 'created_at', 'updated_at'],
      where: whereClause,
      include: includeOptions,
      limit,
      offset,
      order: [[sortField, sortOrderValue]],
      distinct: true, // Ensure accurate count when using includes
      logging: false // Disable logging in production for better performance
    });
    
    const result = {
      tracks: tracks.rows,
      totalCount: tracks.count,
      limit,
      offset
    };
    
    // Cache the result
    if (!cachedResult) {
      cachedResult = {};
    }
    cachedResult[cacheKey] = result;
    setCachedTracksList(cachedResult);
    
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch tracks: ${error.message}`);
  }
};

const getTrackById = async (id) => {
  try {
    // Check cache first
    let track = getCachedTrack(id);
    if (track) {
      return track;
    }
    
    // If not in cache, fetch from database with optimized query
    track = await Track.findByPk(id, {
      attributes: ['id', 'title', 'artist_id', 'album_id', 'description', 'duration', 'release_date', 'audio_url', 'cover_art_url', 'is_explicit', 'status', 'created_at', 'updated_at'],
      include: [
        {
          model: Artist,
          as: 'artist',
          attributes: ['id', 'artist_name']
        },
        {
          model: Album,
          as: 'album',
          attributes: ['id', 'title'],
          required: false
        },
        {
          model: Genre,
          as: 'genres',
          through: { attributes: [] },
          required: false
        }
      ],
      logging: false // Disable logging in production for better performance
    });
    
    if (!track) {
      throw new Error('Track not found');
    }
    
    // Cache the result
    setCachedTrack(id, track);
    
    return track;
  } catch (error) {
    throw new Error(`Failed to fetch track: ${error.message}`);
  }
};

const createTrack = async (artistId, trackData) => {
  try {
    // Verify artist exists
    const artist = await Artist.findByPk(artistId);
    if (!artist) {
      throw new Error('Artist not found');
    }
    
    // Create track
    const track = await Track.create({
      artist_id: artistId,
      title: trackData.title,
      description: trackData.description,
      duration: trackData.duration,
      release_date: trackData.release_date,
      audio_url: trackData.audio_url,
      cover_art_url: trackData.cover_art_url,
      is_explicit: trackData.is_explicit || false,
      status: trackData.status || 'active'
    });
    
    // Associate genres if provided
    if (trackData.genreIds && Array.isArray(trackData.genreIds)) {
      await track.setGenres(trackData.genreIds);
    }
    
    // Reload track with associations
    const fullTrack = await getTrackById(track.id);
    
    // Clear tracks list cache when a new track is created
    clearTracksListCache();
    
    return fullTrack;
  } catch (error) {
    throw new Error(`Failed to create track: ${error.message}`);
  }
};

const updateTrack = async (id, updateData) => {
  try {
    const track = await Track.findByPk(id);
    
    if (!track) {
      throw new Error('Track not found');
    }
    
    const updatedTrack = await track.update(updateData);
    
    // Update genre associations if provided
    if (updateData.genreIds && Array.isArray(updateData.genreIds)) {
      await updatedTrack.setGenres(updateData.genreIds);
    }
    
    // Reload track with associations
    const fullTrack = await getTrackById(updatedTrack.id);
    
    // Clear cache for this track and tracks list
    clearTrackCache(id);
    clearTracksListCache();
    
    return fullTrack;
  } catch (error) {
    throw new Error(`Failed to update track: ${error.message}`);
  }
};

const deleteTrack = async (id) => {
  try {
    const track = await Track.findByPk(id);
    
    if (!track) {
      throw new Error('Track not found');
    }
    
    // Soft delete by updating status
    await track.update({ status: 'deleted' });
    
    // Clear cache for this track and tracks list
    clearTrackCache(id);
    clearTracksListCache();
    
    return { message: 'Track deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete track: ${error.message}`);
  }
};

module.exports = {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack
};