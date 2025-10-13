// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockMapView = React.forwardRef((props, ref) => {
    return <View {...props} ref={ref} />;
  });

  const MockMarker = React.forwardRef((props, ref) => {
    return <View {...props} ref={ref} />;
  });

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// Mock react-native-track-player
jest.mock('react-native-track-player', () => ({
  addEventListener: jest.fn(),
  registerEventHandler: jest.fn(),
  setupPlayer: jest.fn(() => Promise.resolve()),
  updateOptions: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  skip: jest.fn(),
  skipToNext: jest.fn(),
  skipToPrevious: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  reset: jest.fn(),
  destroy: jest.fn(),
  getState: jest.fn(() => Promise.resolve('idle')),
  getVolume: jest.fn(() => Promise.resolve(1)),
  setVolume: jest.fn(),
  getRate: jest.fn(() => Promise.resolve(1)),
  setRate: jest.fn(),
  getTrack: jest.fn(() => Promise.resolve(null)),
  getQueue: jest.fn(() => Promise.resolve([])),
  getCurrentTrack: jest.fn(() => Promise.resolve(0)),
  getDuration: jest.fn(() => Promise.resolve(0)),
  getBufferedPosition: jest.fn(() => Promise.resolve(0)),
  getPosition: jest.fn(() => Promise.resolve(0)),
  getProgress: jest.fn(() => Promise.resolve({ position: 0, duration: 0, buffered: 0 })),
  useTrackPlayerEvents: jest.fn(() => {}),
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
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return React.forwardRef((props, ref) => {
    return <View {...props} ref={ref} />;
  });
});

// Mock immer
jest.mock('immer', () => ({
  produce: (state, recipe) => recipe(state),
}));

// Mock react-redux
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: mockUseSelector,
}));

// Set up default mock return values for useSelector
mockUseSelector.mockImplementation((selector) => {
  // Return appropriate mock data based on the selector
  if (selector.toString().includes('state.offline')) {
    return { cachedTracks: [], loading: false };
  }
  if (selector.toString().includes('state.playlist')) {
    return { playlists: [], loading: false };
  }
  if (selector.toString().includes('state.favorite')) {
    return { favorites: [], loading: false };
  }
  if (selector.toString().includes('state.boroughs')) {
    return { boroughs: [], loading: false, error: null };
  }
  if (selector.toString().includes('state.artists')) {
    return { artists: [], loading: false, error: null };
  }
  if (selector.toString().includes('state.auth')) {
    return { user: null, isAuthenticated: false };
  }
  if (selector.toString().includes('state.follow')) {
    return { following: { 1: true }, followersCount: { 1: 100 }, loading: false };
  }
  if (selector.toString().includes('state.like')) {
    return { liked: { 1: true }, likesCount: { 1: 50 }, loading: false };
  }
  // Default return
  return {};
});