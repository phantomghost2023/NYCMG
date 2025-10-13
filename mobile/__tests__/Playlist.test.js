import React from 'react';
import { render } from '@testing-library/react-native';
import Playlist from '../src/components/Playlist';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('Playlist', () => {
  const mockPlaylist = {
    id: 1,
    name: 'Test Playlist',
    description: 'A test playlist',
    tracks: [
      { id: 1, title: 'Track 1' },
      { id: 2, title: 'Track 2' },
    ],
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders playlist with tracks', () => {
    const { getByText } = render(
      <Playlist playlist={mockPlaylist} onPress={mockOnPress} />
    );
    
    expect(getByText('Test Playlist')).toBeTruthy();
    expect(getByText('2 tracks')).toBeTruthy();
    expect(getByText('A test playlist')).toBeTruthy();
  });

  it('renders playlist without description', () => {
    const playlistWithoutDescription = {
      ...mockPlaylist,
      description: null,
    };
    
    const { getByText, queryByText } = render(
      <Playlist playlist={playlistWithoutDescription} onPress={mockOnPress} />
    );
    
    expect(getByText('Test Playlist')).toBeTruthy();
    expect(getByText('2 tracks')).toBeTruthy();
    expect(queryByText('A test playlist')).toBeNull();
  });

  it('renders playlist with single track', () => {
    const playlistWithSingleTrack = {
      ...mockPlaylist,
      tracks: [{ id: 1, title: 'Track 1' }],
    };
    
    const { getByText } = render(
      <Playlist playlist={playlistWithSingleTrack} onPress={mockOnPress} />
    );
    
    expect(getByText('1 track')).toBeTruthy();
  });
});