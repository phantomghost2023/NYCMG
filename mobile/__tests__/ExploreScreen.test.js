import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ExploreScreen from '../src/screens/ExploreScreen';

const mockStore = configureStore([]);

describe('ExploreScreen', () => {
  let store;
  
  const mockArtists = [
    { 
      id: '1', 
      artist_name: 'Test Artist 1', 
      user: { username: 'testartist1' } 
    },
    { 
      id: '2', 
      artist_name: 'Test Artist 2', 
      user: { username: 'testartist2' } 
    }
  ];

  beforeEach(() => {
    store = mockStore({
      artists: {
        artists: mockArtists,
        loading: false,
        error: null,
        totalCount: 2
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders without crashing', () => {
    const route = { params: { boroughId: '1', boroughName: 'Manhattan' } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    expect(getByText('Explore Manhattan')).toBeTruthy();
    expect(getByText('Discover local artists')).toBeTruthy();
    expect(getByText('Artists')).toBeTruthy();
    expect(getByText('2 artists found')).toBeTruthy();
    expect(getByText('Test Artist 1')).toBeTruthy();
    expect(getByText('Test Artist 2')).toBeTruthy();
  });

  it('dispatches fetchArtists on mount when boroughId is provided', () => {
    const route = { params: { boroughId: '1', boroughName: 'Manhattan' } };
    const navigation = { navigate: jest.fn() };
    render(
      <Provider store={store}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that dispatch was called with fetchArtists action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('artists/fetchArtists')
      })
    );
  });

  it('navigates to ArtistProfile when artist is pressed', () => {
    const route = { params: { boroughId: '1', boroughName: 'Manhattan' } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Press on first artist
    const artistCard = getByText('Test Artist 1');
    fireEvent.press(artistCard);
    
    // Check that navigation was called with correct parameters
    expect(navigation.navigate).toHaveBeenCalledWith('ArtistProfile', {
      artistId: '1',
      artistName: 'Test Artist 1'
    });
  });

  it('shows loading indicator when loading', () => {
    const loadingStore = mockStore({
      artists: {
        artists: [],
        loading: true,
        error: null,
        totalCount: 0
      }
    });
    
    const route = { params: { boroughId: '1', boroughName: 'Manhattan' } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={loadingStore}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that loading indicator is displayed
    expect(getByText('Loading artists...')).toBeTruthy();
  });

  it('shows error message when there is an error', () => {
    const errorStore = mockStore({
      artists: {
        artists: [],
        loading: false,
        error: 'Failed to load artists',
        totalCount: 0
      }
    });
    
    const route = { params: { boroughId: '1', boroughName: 'Manhattan' } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={errorStore}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that error message is displayed
    expect(getByText('Error: Failed to load artists')).toBeTruthy();
  });

  it('dispatches fetchArtists when retry button is pressed', () => {
    const errorStore = mockStore({
      artists: {
        artists: [],
        loading: false,
        error: 'Failed to load artists',
        totalCount: 0
      }
    });
    
    errorStore.dispatch = jest.fn();
    
    const route = { params: { boroughId: '1', boroughName: 'Manhattan' } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={errorStore}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Press retry button
    const retryButton = getByText('Retry');
    fireEvent.press(retryButton);
    
    // Check that dispatch was called with fetchArtists action
    expect(errorStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('artists/fetchArtists')
      })
    );
  });

  it('does not dispatch fetchArtists when boroughId is not provided', () => {
    const route = { params: { boroughName: 'Manhattan' } };
    const navigation = { navigate: jest.fn() };
    render(
      <Provider store={store}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that fetchArtists was not dispatched
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('artists/fetchArtists')
      })
    );
  });

  it('shows default title when boroughName is not provided', () => {
    const route = { params: { boroughId: '1' } };
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <ExploreScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that default title is displayed
    expect(getByText('Explore NYC')).toBeTruthy();
  });
});