import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AudioPlayer from '../src/components/AudioPlayer';

// Mock react-native-track-player
jest.mock('react-native-track-player', () => ({
  useTrackPlayerEvents: jest.fn(),
  usePlaybackState: jest.fn(() => ({ state: 'idle' })),
  TrackPlayerEvents: {
    PLAYBACK_STATE: 'playback-state',
    PLAYBACK_TRACK_CHANGED: 'playback-track-changed',
  },
  State: {
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
  },
  setupPlayer: jest.fn(),
  updateOptions: jest.fn(),
  add: jest.fn(),
  reset: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  skip: jest.fn(),
  skipToNext: jest.fn(),
  skipToPrevious: jest.fn(),
  seekTo: jest.fn(),
  getPosition: jest.fn(() => Promise.resolve(0)),
  getDuration: jest.fn(() => Promise.resolve(180)),
  getCurrentTrack: jest.fn(() => Promise.resolve(null)),
  getTrack: jest.fn(() => Promise.resolve(null)),
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('AudioPlayer', () => {
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

  it('renders correctly with a track', () => {
    const { getByText } = render(<AudioPlayer track={mockTrack} />);
    
    expect(getByText('Test Track')).toBeTruthy();
    expect(getByText('Test Artist')).toBeTruthy();
  });

  it('does not render when no track is provided', () => {
    const { toJSON } = render(<AudioPlayer track={null} />);
    
    expect(toJSON()).toBeNull();
  });

  it('formats time correctly', () => {
    const { getByText } = render(<AudioPlayer track={mockTrack} />);
    
    // Should show 0:00 for initial position
    expect(getByText('0:00')).toBeTruthy();
    
    // Should show 3:00 for duration
    expect(getByText('3:00')).toBeTruthy();
  });

  it('toggles playback when play button is pressed', () => {
    const { getByTestId } = render(<AudioPlayer track={mockTrack} />);
    
    const playButton = getByTestId('play-button');
    fireEvent.press(playButton);
    
    // Add assertions for play/pause functionality
  });

  it('skips to next track when next button is pressed', () => {
    const { getByTestId } = render(<AudioPlayer track={mockTrack} />);
    
    const nextButton = getByTestId('next-button');
    fireEvent.press(nextButton);
    
    // Add assertions for skip functionality
  });

  it('skips to previous track when previous button is pressed', () => {
    const { getByTestId } = render(<AudioPlayer track={mockTrack} />);
    
    const previousButton = getByTestId('previous-button');
    fireEvent.press(previousButton);
    
    // Add assertions for skip functionality
  });
});