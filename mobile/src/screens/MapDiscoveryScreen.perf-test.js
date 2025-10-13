import { measureRenders } from 'reassure';
import React from 'react';
import MapDiscoveryScreen from './MapDiscoveryScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {},
};

// Mock boroughs data
const mockBoroughs = [
  {
    id: 1,
    name: 'Manhattan',
    description: 'The heart of NYC',
    latitude: 40.7128,
    longitude: -74.0060,
    markerColor: '#FF0000',
  },
  {
    id: 2,
    name: 'Brooklyn',
    description: 'The hip borough',
    latitude: 40.6782,
    longitude: -73.9442,
    markerColor: '#00FF00',
  },
];

// Mock artists data
const mockArtists = [
  {
    id: 1,
    username: 'Test Artist 1',
    boroughId: 1,
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 2,
    username: 'Test Artist 2',
    boroughId: 2,
    latitude: 40.6782,
    longitude: -73.9442,
  },
];

describe('MapDiscoveryScreen', () => {
  it('renders correctly with boroughs and artists', async () => {
    await measureRenders(
      <MapDiscoveryScreen 
        navigation={mockNavigation}
        route={mockRoute}
        boroughs={mockBoroughs}
        artists={mockArtists}
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
      <MapDiscoveryScreen 
        navigation={mockNavigation}
        route={mockRoute}
        boroughs={[]}
        artists={[]}
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