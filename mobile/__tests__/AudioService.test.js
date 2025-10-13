import { 
  setupPlayer, 
  addTrack, 
  playTrack, 
  togglePlayback, 
  skipToNext, 
  skipToPrevious, 
  seekTo, 
  getProgress, 
  getCurrentTrack 
} from '../src/services/AudioService';

// Mock react-native-track-player
jest.mock('react-native-track-player', () => ({
  setupPlayer: jest.fn(),
  updateOptions: jest.fn(),
  add: jest.fn(),
  reset: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  skipToNext: jest.fn(),
  skipToPrevious: jest.fn(),
  seekTo: jest.fn(),
  getPosition: jest.fn(),
  getDuration: jest.fn(),
  getCurrentTrack: jest.fn(),
  getTrack: jest.fn(),
  STATE_PAUSED: 'paused',
  STATE_PLAYING: 'playing',
  CAPABILITY_PLAY: 'CAPABILITY_PLAY',
  CAPABILITY_PAUSE: 'CAPABILITY_PAUSE',
  CAPABILITY_SKIP_TO_NEXT: 'CAPABILITY_SKIP_TO_NEXT',
  CAPABILITY_SKIP_TO_PREVIOUS: 'CAPABILITY_SKIP_TO_PREVIOUS',
  CAPABILITY_SEEK_TO: 'CAPABILITY_SEEK_TO',
}));

describe('AudioService', () => {
  const mockTrack = {
    id: 1,
    title: 'Test Track',
    artist: { username: 'Test Artist' },
    audioUrl: 'https://example.com/test.mp3',
    coverArtUrl: 'https://example.com/cover.jpg',
    duration: 180,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setupPlayer', () => {
    it('should setup player successfully', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.setupPlayer.mockResolvedValueOnce();
      
      const result = await setupPlayer();
      
      expect(result).toBe(true);
      expect(TrackPlayer.setupPlayer).toHaveBeenCalled();
      expect(TrackPlayer.updateOptions).toHaveBeenCalledWith({
        stopWithApp: false,
        capabilities: [
          'CAPABILITY_PLAY',
          'CAPABILITY_PAUSE',
          'CAPABILITY_SKIP_TO_NEXT',
          'CAPABILITY_SKIP_TO_PREVIOUS',
          'CAPABILITY_SEEK_TO',
        ],
        compactCapabilities: [
          'CAPABILITY_PLAY',
          'CAPABILITY_PAUSE',
          'CAPABILITY_SKIP_TO_NEXT',
        ],
      });
    });

    it('should handle setup player error', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.setupPlayer.mockRejectedValueOnce(new Error('Setup failed'));
      
      const result = await setupPlayer();
      
      expect(result).toBe(false);
      expect(TrackPlayer.setupPlayer).toHaveBeenCalled();
    });
  });

  describe('addTrack', () => {
    it('should add track to player', async () => {
      const TrackPlayer = require('react-native-track-player');
      
      await addTrack(mockTrack);
      
      expect(TrackPlayer.add).toHaveBeenCalledWith({
        id: '1',
        url: 'https://example.com/test.mp3',
        title: 'Test Track',
        artist: 'Test Artist',
        artwork: 'https://example.com/cover.jpg',
        duration: 180,
      });
    });
  });

  describe('playTrack', () => {
    it('should reset player and play track', async () => {
      const TrackPlayer = require('react-native-track-player');
      
      await playTrack(mockTrack);
      
      expect(TrackPlayer.reset).toHaveBeenCalled();
      expect(TrackPlayer.add).toHaveBeenCalledWith({
        id: '1',
        url: 'https://example.com/test.mp3',
        title: 'Test Track',
        artist: 'Test Artist',
        artwork: 'https://example.com/cover.jpg',
        duration: 180,
      });
      expect(TrackPlayer.play).toHaveBeenCalled();
    });
  });

  describe('togglePlayback', () => {
    it('should pause when currently playing', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(1);
      
      await togglePlayback('playing');
      
      expect(TrackPlayer.pause).toHaveBeenCalled();
    });

    it('should play when currently paused', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(1);
      
      await togglePlayback('paused');
      
      expect(TrackPlayer.play).toHaveBeenCalled();
    });

    it('should not toggle when no current track', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(null);
      
      await togglePlayback('playing');
      
      expect(TrackPlayer.play).not.toHaveBeenCalled();
      expect(TrackPlayer.pause).not.toHaveBeenCalled();
    });
  });

  describe('skipToNext', () => {
    it('should skip to next track', async () => {
      const TrackPlayer = require('react-native-track-player');
      
      await skipToNext();
      
      expect(TrackPlayer.skipToNext).toHaveBeenCalled();
    });

    it('should handle skip to next error', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.skipToNext.mockRejectedValueOnce(new Error('No next track'));
      
      await skipToNext();
      
      // Should not throw error
      expect(TrackPlayer.skipToNext).toHaveBeenCalled();
    });
  });

  describe('skipToPrevious', () => {
    it('should skip to previous track', async () => {
      const TrackPlayer = require('react-native-track-player');
      
      await skipToPrevious();
      
      expect(TrackPlayer.skipToPrevious).toHaveBeenCalled();
    });

    it('should handle skip to previous error', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.skipToPrevious.mockRejectedValueOnce(new Error('No previous track'));
      
      await skipToPrevious();
      
      // Should not throw error
      expect(TrackPlayer.skipToPrevious).toHaveBeenCalled();
    });
  });

  describe('seekTo', () => {
    it('should seek to position', async () => {
      const TrackPlayer = require('react-native-track-player');
      
      await seekTo(30);
      
      expect(TrackPlayer.seekTo).toHaveBeenCalledWith(30);
    });
  });

  describe('getProgress', () => {
    it('should get progress', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getPosition.mockResolvedValueOnce(30);
      TrackPlayer.getDuration.mockResolvedValueOnce(180);
      
      const progress = await getProgress();
      
      expect(progress).toEqual({ position: 30, duration: 180 });
      expect(TrackPlayer.getPosition).toHaveBeenCalled();
      expect(TrackPlayer.getDuration).toHaveBeenCalled();
    });
  });

  describe('getCurrentTrack', () => {
    it('should get current track', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(1);
      TrackPlayer.getTrack.mockResolvedValueOnce(mockTrack);
      
      const track = await getCurrentTrack();
      
      expect(track).toEqual(mockTrack);
      expect(TrackPlayer.getCurrentTrack).toHaveBeenCalled();
      expect(TrackPlayer.getTrack).toHaveBeenCalledWith(1);
    });

    it('should return null when no current track', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(null);
      
      const track = await getCurrentTrack();
      
      expect(track).toBeNull();
      expect(TrackPlayer.getCurrentTrack).toHaveBeenCalled();
      expect(TrackPlayer.getTrack).not.toHaveBeenCalled();
    });
  });
});