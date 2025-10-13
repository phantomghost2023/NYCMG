import { measureRenders } from 'reassure';
import React from 'react';
import LibraryScreen from './LibraryScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {},
};

// Mock playlists data
const mockPlaylists = [
  {
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
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Chill Vibes',
    tracks: [
      {
        id: 2,
        title: 'Test Track 2',
        artist: { username: 'Test Artist 2' },
        audioUrl: 'https://example.com/test2.mp3',
        coverArtUrl: 'https://example.com/cover2.jpg',
        duration: 200,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

describe('LibraryScreen', () => {
  it('renders correctly with playlists', async () => {
    await measureRenders(
      <LibraryScreen 
        navigation={mockNavigation}
        route={mockRoute}
        playlists={mockPlaylists}
        loading={false}
        error={null}
      />,
      {
        wrapper: ({ children }) => (
          <div>
            {children}
          </div>
        )
      }
    );
  });

  it('renders correctly while loading', async () => {
    await measureRenders(
      <LibraryScreen 
        navigation={mockNavigation}
        route={mockRoute}
        playlists={[]}
        loading={true}
        error={null}
      />,
      {
        wrapper: ({ children }) => (
          <div>
            {children}
          </div>
        )
      }
    );
  });
});