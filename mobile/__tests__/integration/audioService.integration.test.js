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
} from '../../src/services/AudioService';

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
  STATE_STOPPED: 'stopped',
  CAPABILITY_PLAY: 'CAPABILITY_PLAY',
  CAPABILITY_PAUSE: 'CAPABILITY_PAUSE',
  CAPABILITY_SKIP_TO_NEXT: 'CAPABILITY_SKIP_TO_NEXT',
  CAPABILITY_SKIP_TO_PREVIOUS: 'CAPABILITY_SKIP_TO_PREVIOUS',
  CAPABILITY_SEEK_TO: 'CAPABILITY_SEEK_TO',
}));

describe('AudioService Integration', () => {
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

  describe('Audio Service and Redux Integration', () => {
    it('should update Redux store when playing a track', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.setupPlayer.mockResolvedValueOnce();
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(1);
      TrackPlayer.getTrack.mockResolvedValueOnce(mockTrack);
      
      await playTrack(mockTrack);
      
      // Verify that the track was added to the player
      expect(TrackPlayer.add).toHaveBeenCalledWith({
        id: '1',
        url: 'https://example.com/test.mp3',
        title: 'Test Track',
        artist: 'Test Artist',
        artwork: 'https://example.com/cover.jpg',
        duration: 180,
      });
      
      // Verify that the player was started
      expect(TrackPlayer.play).toHaveBeenCalled();
    });

    it('should update playback state in Redux when toggling playback', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getCurrentTrack.mockResolvedValueOnce(1);
      TrackPlayer.play.mockResolvedValueOnce();
      
      await togglePlayback('paused');
      
      // Verify that play was called
      expect(TrackPlayer.play).toHaveBeenCalled();
    });

    it('should handle track progress updates', async () => {
      const TrackPlayer = require('react-native-track-player');
      TrackPlayer.getPosition.mockResolvedValueOnce(30);
      TrackPlayer.getDuration.mockResolvedValueOnce(180);
      
      const progress = await getProgress();
      
      expect(progress).toEqual({ position: 30, duration: 180 });
    });
  });
});