import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LibraryScreen from '../src/screens/LibraryScreen';

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

// Mock OfflineService
jest.mock('../src/services/OfflineService', () => ({
  getCachedTracks: jest.fn(),
}));

describe('LibraryScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(() => ({}));
  });

  it('renders correctly when loading', () => {
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.getCachedTracks.mockResolvedValueOnce([]);
    
    const { getByText } = render(<LibraryScreen navigation={mockNavigation} />);
    
    expect(getByText('Loading library...')).toBeTruthy();
  });

  it('renders empty state when no cached tracks', async () => {
    const OfflineService = require('../src/services/OfflineService');
    OfflineService.getCachedTracks.mockResolvedValueOnce([]);
    
    const { findByText } = render(<LibraryScreen navigation={mockNavigation} />);
    
    const emptyText = await findByText('No offline tracks yet');
    expect(emptyText).toBeTruthy();
  });

  it('renders cached tracks', async () => {
    const mockTracks = [
      {
        id: 1,
        title: 'Test Track 1',
        artist: { username: 'Test Artist 1' },
        coverArtUrl: 'https://example.com/cover1.jpg',
      },
      {
        id: 2,
        title: 'Test Track 2',
        artist: { username: 'Test Artist 2' },
      },
    ];

    const OfflineService = require('../src/services/OfflineService');
    OfflineService.getCachedTracks.mockResolvedValueOnce(mockTracks);
    
    const { findByText } = render(<LibraryScreen navigation={mockNavigation} />);
    
    const track1Title = await findByText('Test Track 1');
    const track2Title = await findByText('Test Track 2');
    
    expect(track1Title).toBeTruthy();
    expect(track2Title).toBeTruthy();
  });

  it('navigates to artist profile when artist name is pressed', async () => {
    const mockTrack = {
      id: 1,
      title: 'Test Track',
      artist: { id: 1, username: 'Test Artist' },
      coverArtUrl: 'https://example.com/cover.jpg',
    };

    const OfflineService = require('../src/services/OfflineService');
    OfflineService.getCachedTracks.mockResolvedValueOnce([mockTrack]);
    
    const { findByText } = render(<LibraryScreen navigation={mockNavigation} />);
    
    const artistText = await findByText('Test Artist');
    fireEvent.press(artistText);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ArtistProfile', { artistId: 1 });
  });

  it('plays track when track item is pressed', async () => {
    const mockTrack = {
      id: 1,
      title: 'Test Track',
      artist: { username: 'Test Artist' },
      coverArtUrl: 'https://example.com/cover.jpg',
    };

    const OfflineService = require('../src/services/OfflineService');
    OfflineService.getCachedTracks.mockResolvedValueOnce([mockTrack]);
    
    const { findByText } = render(<LibraryScreen navigation={mockNavigation} />);
    
    const trackItem = await findByText('Test Track');
    fireEvent.press(trackItem);
    
    // Should log to console when playing track
    expect(console.log).toHaveBeenCalledWith('Playing track:', 'Test Track');
  });
});