import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapDiscoveryScreen from '../src/screens/MapDiscoveryScreen';

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const MockMapView = jest.fn().mockImplementation(() => 'MapView');
  const MockMarker = jest.fn().mockImplementation(() => 'Marker');
  const MockCallout = jest.fn().mockImplementation(() => 'Callout');
  
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

// Mock PermissionsAndroid
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.PermissionsAndroid = {
    request: jest.fn(),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  };
  return RN;
});

describe('MapDiscoveryScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockBoroughs = [
    {
      id: 1,
      name: 'Manhattan',
      description: 'The heart of NYC',
    },
    {
      id: 2,
      name: 'Brooklyn',
      description: 'The hip borough',
    },
  ];

  const mockArtists = [
    {
      id: 1,
      artist_name: 'Test Artist 1',
      borough_id: 1,
      user: { username: 'testuser1' },
    },
    {
      id: 2,
      artist_name: 'Test Artist 2',
      borough_id: 2,
      user: { username: 'testuser2' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(selector => {
      if (selector.toString().includes('boroughs')) {
        return { boroughs: mockBoroughs, loading: false };
      }
      if (selector.toString().includes('artists')) {
        return { artists: mockArtists, loading: false };
      }
      return {};
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<MapDiscoveryScreen navigation={mockNavigation} />);
    
    expect(getByText('Discover NYC Music')).toBeTruthy();
    expect(getByText('Tap on markers to explore')).toBeTruthy();
  });

  it('requests location permissions on mount', () => {
    const PermissionsAndroid = require('react-native').PermissionsAndroid;
    PermissionsAndroid.request.mockResolvedValue('granted');
    
    render(<MapDiscoveryScreen navigation={mockNavigation} />);
    
    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      'ACCESS_FINE_LOCATION',
      expect.objectContaining({
        title: 'Location Permission',
        message: 'NYCMG needs access to your location to show nearby artists.',
      })
    );
  });

  it('handles borough press navigation', () => {
    const { getByText } = render(<MapDiscoveryScreen navigation={mockNavigation} />);
    
    // In a real test, we would interact with the map markers
    // For now, we'll test the navigation function directly
    const screen = require('../src/screens/MapDiscoveryScreen').default;
    const instance = new screen({ navigation: mockNavigation });
    
    instance.handleBoroughPress(mockBoroughs[0]);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Explore', {
      boroughId: 1,
      boroughName: 'Manhattan',
    });
  });

  it('handles artist press navigation', () => {
    const { getByText } = render(<MapDiscoveryScreen navigation={mockNavigation} />);
    
    // In a real test, we would interact with the map markers
    // For now, we'll test the navigation function directly
    const screen = require('../src/screens/MapDiscoveryScreen').default;
    const instance = new screen({ navigation: mockNavigation });
    
    instance.handleArtistPress(mockArtists[0]);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ArtistProfile', {
      artistId: 1,
      artistName: 'Test Artist 1',
    });
  });

  it('gets artists for borough', () => {
    const screen = require('../src/screens/MapDiscoveryScreen').default;
    const instance = new screen({ navigation: mockNavigation });
    
    const boroughArtists = instance.getArtistsForBorough(1);
    
    expect(boroughArtists).toHaveLength(1);
    expect(boroughArtists[0].artist_name).toBe('Test Artist 1');
  });

  it('gets borough coordinates', () => {
    const screen = require('../src/screens/MapDiscoveryScreen').default;
    const instance = new screen({ navigation: mockNavigation });
    
    const coords = instance.getBoroughCoordinates({ id: 1 });
    
    expect(coords).toHaveProperty('latitude');
    expect(coords).toHaveProperty('longitude');
  });

  it('gets artist coordinates', () => {
    const screen = require('../src/screens/MapDiscoveryScreen').default;
    const instance = new screen({ navigation: mockNavigation });
    
    const coords = instance.getArtistCoordinates(mockArtists[0]);
    
    expect(coords).toHaveProperty('latitude');
    expect(coords).toHaveProperty('longitude');
  });
});