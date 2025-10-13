import { measureRenders } from 'reassure';
import React from 'react';
import HomeScreen from './HomeScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {},
};

// Mock tracks data
const mockTracks = [
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
];

describe('HomeScreen', () => {
  it('renders correctly with tracks', async () => {
    await measureRenders(
      <HomeScreen 
        navigation={mockNavigation}
        route={mockRoute}
        tracks={mockTracks}
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
      <HomeScreen 
        navigation={mockNavigation}
        route={mockRoute}
        tracks={[]}
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