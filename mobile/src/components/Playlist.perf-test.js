import { measureRenders } from 'reassure';
import React from 'react';
import Playlist from './Playlist';

// Mock playlist data
const mockPlaylist = {
  id: 1,
  name: 'My Favorites',
  tracks: [
    {
      id: 1,
      title: 'Test Track 1',
      artist: { username: 'Test Artist 1' },
      audioUrl: 'https://example.com/test1.mp3',
      coverArtUrl: 'https://example.com/cover1.jpg',
      duration: 180,
    },
    {
      id: 2,
      title: 'Test Track 2',
      artist: { username: 'Test Artist 2' },
      audioUrl: 'https://example.com/test2.mp3',
      coverArtUrl: 'https://example.com/cover2.jpg',
      duration: 200,
    },
    {
      id: 3,
      title: 'Test Track 3',
      artist: { username: 'Test Artist 3' },
      audioUrl: 'https://example.com/test3.mp3',
      coverArtUrl: 'https://example.com/cover3.jpg',
      duration: 220,
    },
  ],
  createdAt: new Date().toISOString(),
};

describe('Playlist', () => {
  it('renders correctly with tracks', async () => {
    await measureRenders(
      <Playlist 
        playlist={mockPlaylist}
        onPress={() => {}}
      />
    );
  });

  it('renders correctly with empty playlist', async () => {
    await measureRenders(
      <Playlist 
        playlist={{ ...mockPlaylist, tracks: [] }}
        onPress={() => {}}
      />
    );
  });
});