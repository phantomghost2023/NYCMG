const { 
  setCachedBoroughs, 
  getCachedBoroughs, 
  clearBoroughsCache,
  setCachedArtist,
  getCachedArtist,
  clearArtistCache,
  clearAllCaches
} = require('../cache.service');

describe('Cache Service', () => {
  beforeEach(() => {
    clearAllCaches();
  });

  describe('Borough Caching', () => {
    it('should cache and retrieve boroughs', () => {
      const boroughs = [{ id: 1, name: 'Manhattan' }];
      
      // Cache boroughs
      setCachedBoroughs(boroughs);
      
      // Retrieve from cache
      const cachedBoroughs = getCachedBoroughs();
      
      expect(cachedBoroughs).toEqual(boroughs);
    });

    it('should clear boroughs cache', () => {
      const boroughs = [{ id: 1, name: 'Manhattan' }];
      
      // Cache boroughs
      setCachedBoroughs(boroughs);
      
      // Clear cache
      clearBoroughsCache();
      
      // Try to retrieve from cache
      const cachedBoroughs = getCachedBoroughs();
      
      expect(cachedBoroughs).toBeUndefined();
    });
  });

  describe('Artist Caching', () => {
    it('should cache and retrieve artist by ID', () => {
      const artistId = 'artist123';
      const artist = { id: artistId, name: 'Test Artist' };
      
      // Cache artist
      setCachedArtist(artistId, artist);
      
      // Retrieve from cache
      const cachedArtist = getCachedArtist(artistId);
      
      expect(cachedArtist).toEqual(artist);
    });

    it('should clear artist cache by ID', () => {
      const artistId = 'artist123';
      const artist = { id: artistId, name: 'Test Artist' };
      
      // Cache artist
      setCachedArtist(artistId, artist);
      
      // Clear cache for this artist
      clearArtistCache(artistId);
      
      // Try to retrieve from cache
      const cachedArtist = getCachedArtist(artistId);
      
      expect(cachedArtist).toBeUndefined();
    });
  });

  describe('Cache Management', () => {
    it('should clear all caches', () => {
      // Set up some cached data
      const boroughs = [{ id: 1, name: 'Manhattan' }];
      const artistId = 'artist123';
      const artist = { id: artistId, name: 'Test Artist' };
      
      setCachedBoroughs(boroughs);
      setCachedArtist(artistId, artist);
      
      // Verify data is cached
      expect(getCachedBoroughs()).toEqual(boroughs);
      expect(getCachedArtist(artistId)).toEqual(artist);
      
      // Clear all caches
      clearAllCaches();
      
      // Verify caches are cleared
      expect(getCachedBoroughs()).toBeUndefined();
      expect(getCachedArtist(artistId)).toBeUndefined();
    });
  });
});