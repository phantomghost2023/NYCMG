const NodeCache = require('node-cache');

// Create cache instances with different TTLs
const boroughCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const genreCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const artistCache = new NodeCache({ stdTTL: 180 }); // 3 minutes
const trackCache = new NodeCache({ stdTTL: 120 }); // 2 minutes
const albumCache = new NodeCache({ stdTTL: 180 }); // 3 minutes

// Cache keys
const CACHE_KEYS = {
  BOROUGHS: 'boroughs',
  GENRES: 'genres',
  ARTIST: (id) => `artist_${id}`,
  ARTISTS_LIST: 'artists_list',
  TRACK: (id) => `track_${id}`,
  TRACKS_LIST: 'tracks_list',
  ALBUM: (id) => `album_${id}`,
  ALBUMS_LIST: 'albums_list',
  USER_PROFILE: (id) => `user_profile_${id}`,
  USER_NOTIFICATIONS: (id) => `user_notifications_${id}`,
  USER_FOLLOWS: (id) => `user_follows_${id}`,
  USER_FOLLOWING: (id) => `user_following_${id}`
};

// Borough caching
const getCachedBoroughs = () => {
  return boroughCache.get(CACHE_KEYS.BOROUGHS);
};

const setCachedBoroughs = (boroughs) => {
  return boroughCache.set(CACHE_KEYS.BOROUGHS, boroughs);
};

const clearBoroughsCache = () => {
  return boroughCache.del(CACHE_KEYS.BOROUGHS);
};

// Genre caching
const getCachedGenres = () => {
  return genreCache.get(CACHE_KEYS.GENRES);
};

const setCachedGenres = (genres) => {
  return genreCache.set(CACHE_KEYS.GENRES, genres);
};

const clearGenresCache = () => {
  return genreCache.del(CACHE_KEYS.GENRES);
};

// Artist caching
const getCachedArtist = (id) => {
  return artistCache.get(CACHE_KEYS.ARTIST(id));
};

const setCachedArtist = (id, artist) => {
  return artistCache.set(CACHE_KEYS.ARTIST(id), artist);
};

const getCachedArtistsList = () => {
  return artistCache.get(CACHE_KEYS.ARTISTS_LIST);
};

const setCachedArtistsList = (artists) => {
  return artistCache.set(CACHE_KEYS.ARTISTS_LIST, artists);
};

const clearArtistCache = (id) => {
  return artistCache.del(CACHE_KEYS.ARTIST(id));
};

const clearArtistsListCache = () => {
  return artistCache.del(CACHE_KEYS.ARTISTS_LIST);
};

// Track caching
const getCachedTrack = (id) => {
  return trackCache.get(CACHE_KEYS.TRACK(id));
};

const setCachedTrack = (id, track) => {
  return trackCache.set(CACHE_KEYS.TRACK(id), track);
};

const getCachedTracksList = () => {
  return trackCache.get(CACHE_KEYS.TRACKS_LIST);
};

const setCachedTracksList = (tracks) => {
  return trackCache.set(CACHE_KEYS.TRACKS_LIST, tracks);
};

const clearTrackCache = (id) => {
  return trackCache.del(CACHE_KEYS.TRACK(id));
};

const clearTracksListCache = () => {
  return trackCache.del(CACHE_KEYS.TRACKS_LIST);
};

// Album caching
const getCachedAlbum = (id) => {
  return albumCache.get(CACHE_KEYS.ALBUM(id));
};

const setCachedAlbum = (id, album) => {
  return albumCache.set(CACHE_KEYS.ALBUM(id), album);
};

const getCachedAlbumsList = () => {
  return albumCache.get(CACHE_KEYS.ALBUMS_LIST);
};

const setCachedAlbumsList = (albums) => {
  return albumCache.set(CACHE_KEYS.ALBUMS_LIST, albums);
};

const clearAlbumCache = (id) => {
  return albumCache.del(CACHE_KEYS.ALBUM(id));
};

const clearAlbumsListCache = () => {
  return albumCache.del(CACHE_KEYS.ALBUMS_LIST);
};

// User profile caching
const getCachedUserProfile = (id) => {
  return artistCache.get(CACHE_KEYS.USER_PROFILE(id));
};

const setCachedUserProfile = (id, profile) => {
  return artistCache.set(CACHE_KEYS.USER_PROFILE(id), profile);
};

const clearUserProfileCache = (id) => {
  return artistCache.del(CACHE_KEYS.USER_PROFILE(id));
};

// Cache statistics
const getCacheStats = () => {
  return {
    boroughs: boroughCache.getStats(),
    genres: genreCache.getStats(),
    artists: artistCache.getStats(),
    tracks: trackCache.getStats(),
    albums: albumCache.getStats()
  };
};

// Clear all caches
const clearAllCaches = () => {
  boroughCache.flushAll();
  genreCache.flushAll();
  artistCache.flushAll();
  trackCache.flushAll();
  albumCache.flushAll();
};

module.exports = {
  // Borough caching
  getCachedBoroughs,
  setCachedBoroughs,
  clearBoroughsCache,
  
  // Genre caching
  getCachedGenres,
  setCachedGenres,
  clearGenresCache,
  
  // Artist caching
  getCachedArtist,
  setCachedArtist,
  getCachedArtistsList,
  setCachedArtistsList,
  clearArtistCache,
  clearArtistsListCache,
  
  // Track caching
  getCachedTrack,
  setCachedTrack,
  getCachedTracksList,
  setCachedTracksList,
  clearTrackCache,
  clearTracksListCache,
  
  // Album caching
  getCachedAlbum,
  setCachedAlbum,
  getCachedAlbumsList,
  setCachedAlbumsList,
  clearAlbumCache,
  clearAlbumsListCache,
  
  // User caching
  getCachedUserProfile,
  setCachedUserProfile,
  clearUserProfileCache,
  
  // Cache management
  getCacheStats,
  clearAllCaches,
  
  CACHE_KEYS
};