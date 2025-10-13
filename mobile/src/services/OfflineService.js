import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineService {
  // Cache tracks for offline playback
  async cacheTrack(track) {
    try {
      // In a real implementation, you would download the audio file
      // For now, we'll just store the track metadata
      const cachedTracks = await this.getCachedTracks();
      const existingIndex = cachedTracks.findIndex(t => t.id === track.id);
      
      if (existingIndex >= 0) {
        cachedTracks[existingIndex] = track;
      } else {
        cachedTracks.push(track);
      }
      
      await AsyncStorage.setItem('cachedTracks', JSON.stringify(cachedTracks));
      return true;
    } catch (error) {
      console.error('Error caching track:', error);
      return false;
    }
  }

  // Get cached tracks
  async getCachedTracks() {
    try {
      const cachedTracks = await AsyncStorage.getItem('cachedTracks');
      return cachedTracks ? JSON.parse(cachedTracks) : [];
    } catch (error) {
      console.error('Error getting cached tracks:', error);
      return [];
    }
  }

  // Remove cached track
  async removeCachedTrack(trackId) {
    try {
      const cachedTracks = await this.getCachedTracks();
      const filteredTracks = cachedTracks.filter(track => track.id !== trackId);
      await AsyncStorage.setItem('cachedTracks', JSON.stringify(filteredTracks));
      return true;
    } catch (error) {
      console.error('Error removing cached track:', error);
      return false;
    }
  }

  // Check if track is cached
  async isTrackCached(trackId) {
    try {
      const cachedTracks = await this.getCachedTracks();
      return cachedTracks.some(track => track.id === trackId);
    } catch (error) {
      console.error('Error checking if track is cached:', error);
      return false;
    }
  }

  // Cache user data
  async cacheUserData(userData) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error caching user data:', error);
      return false;
    }
  }

  // Get cached user data
  async getCachedUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting cached user data:', error);
      return null;
    }
  }

  // Cache boroughs data
  async cacheBoroughsData(boroughsData) {
    try {
      await AsyncStorage.setItem('boroughsData', JSON.stringify(boroughsData));
      return true;
    } catch (error) {
      console.error('Error caching boroughs data:', error);
      return false;
    }
  }

  // Get cached boroughs data
  async getCachedBoroughsData() {
    try {
      const boroughsData = await AsyncStorage.getItem('boroughsData');
      return boroughsData ? JSON.parse(boroughsData) : null;
    } catch (error) {
      console.error('Error getting cached boroughs data:', error);
      return null;
    }
  }

  // Cache artists data
  async cacheArtistsData(artistsData) {
    try {
      await AsyncStorage.setItem('artistsData', JSON.stringify(artistsData));
      return true;
    } catch (error) {
      console.error('Error caching artists data:', error);
      return false;
    }
  }

  // Get cached artists data
  async getCachedArtistsData() {
    try {
      const artistsData = await AsyncStorage.getItem('artistsData');
      return artistsData ? JSON.parse(artistsData) : null;
    } catch (error) {
      console.error('Error getting cached artists data:', error);
      return null;
    }
  }

  // Clear all cached data
  async clearAllCache() {
    try {
      await AsyncStorage.removeItem('cachedTracks');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('boroughsData');
      await AsyncStorage.removeItem('artistsData');
      // Remove new settings
      await AsyncStorage.removeItem('autoPlay');
      await AsyncStorage.removeItem('equalizer');
      await AsyncStorage.removeItem('dataSaver');
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  // Get offline mode status
  async isOfflineMode() {
    try {
      const offlineMode = await AsyncStorage.getItem('offlineMode');
      return offlineMode === 'true';
    } catch (error) {
      console.error('Error getting offline mode status:', error);
      return false;
    }
  }

  // Set offline mode status
  async setOfflineMode(enabled) {
    try {
      await AsyncStorage.setItem('offlineMode', enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting offline mode status:', error);
      return false;
    }
  }

  // Get download quality setting
  async getDownloadQuality() {
    try {
      const quality = await AsyncStorage.getItem('downloadQuality');
      return quality || 'high'; // default to high quality
    } catch (error) {
      console.error('Error getting download quality:', error);
      return 'high';
    }
  }

  // Set download quality setting
  async setDownloadQuality(quality) {
    try {
      await AsyncStorage.setItem('downloadQuality', quality);
      return true;
    } catch (error) {
      console.error('Error setting download quality:', error);
      return false;
    }
  }

  // Get notifications enabled setting
  async getNotificationsEnabled() {
    try {
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      return notifications !== 'false'; // default to true
    } catch (error) {
      console.error('Error getting notifications setting:', error);
      return true;
    }
  }

  // Set notifications enabled setting
  async setNotificationsEnabled(enabled) {
    try {
      await AsyncStorage.setItem('notificationsEnabled', enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting notifications setting:', error);
      return false;
    }
  }

  // Get dark mode setting
  async getDarkMode() {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      return darkMode === 'true';
    } catch (error) {
      console.error('Error getting dark mode setting:', error);
      return false;
    }
  }

  // Set dark mode setting
  async setDarkMode(enabled) {
    try {
      await AsyncStorage.setItem('darkMode', enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting dark mode setting:', error);
      return false;
    }
  }

  // Get auto play setting
  async getAutoPlay() {
    try {
      const autoPlay = await AsyncStorage.getItem('autoPlay');
      return autoPlay !== 'false'; // default to true
    } catch (error) {
      console.error('Error getting auto play setting:', error);
      return true;
    }
  }

  // Set auto play setting
  async setAutoPlay(enabled) {
    try {
      await AsyncStorage.setItem('autoPlay', enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting auto play setting:', error);
      return false;
    }
  }

  // Get equalizer setting
  async getEqualizer() {
    try {
      const equalizer = await AsyncStorage.getItem('equalizer');
      return equalizer || 'default'; // default to default preset
    } catch (error) {
      console.error('Error getting equalizer setting:', error);
      return 'default';
    }
  }

  // Set equalizer setting
  async setEqualizer(preset) {
    try {
      await AsyncStorage.setItem('equalizer', preset);
      return true;
    } catch (error) {
      console.error('Error setting equalizer setting:', error);
      return false;
    }
  }

  // Get data saver setting
  async getDataSaver() {
    try {
      const dataSaver = await AsyncStorage.getItem('dataSaver');
      return dataSaver === 'true';
    } catch (error) {
      console.error('Error getting data saver setting:', error);
      return false;
    }
  }

  // Set data saver setting
  async setDataSaver(enabled) {
    try {
      await AsyncStorage.setItem('dataSaver', enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting data saver setting:', error);
      return false;
    }
  }
}

export default new OfflineService();