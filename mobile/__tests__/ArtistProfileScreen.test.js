import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ArtistProfileScreen from '../src/screens/ArtistProfileScreen';

const mockStore = configureStore([]);

describe('ArtistProfileScreen', () => {
  let store;
  
  const mockArtist = {
    id: '1',
    artist_name: 'Test Artist',
    verified_nyc: true,
    user: {
      username: 'testartist'
    }
  };

  beforeEach(() => {
    store = mockStore({
      artists: {
        selectedArtist: mockArtist,
        loading: false,
        error: null
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders without crashing', () => {
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    const { getByText } = render(
      <Provider store={store}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    expect(getByText('Test Artist')).toBeTruthy();
    expect(getByText('@testartist')).toBeTruthy();
    expect(getByText('Verified NYC Artist')).toBeTruthy();
    expect(getByText('About')).toBeTruthy();
    expect(getByText('Discography')).toBeTruthy();
    expect(getByText('Upcoming Events')).toBeTruthy();
  });

  it('dispatches fetchArtist on mount', () => {
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    render(
      <Provider store={store}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that dispatch was called with fetchArtist action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('artists/fetchArtist'),
        payload: '1'
      })
    );
  });

  it('sets navigation options with artist name', () => {
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    render(
      <Provider store={store}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that navigation options were set
    expect(navigation.setOptions).toHaveBeenCalledWith({
      title: 'Test Artist',
    });
  });

  it('shows loading indicator when loading', () => {
    const loadingStore = mockStore({
      artists: {
        selectedArtist: null,
        loading: true,
        error: null
      }
    });
    
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    const { getByText } = render(
      <Provider store={loadingStore}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that loading indicator is displayed
    expect(getByText('Loading artist profile...')).toBeTruthy();
  });

  it('shows error message when there is an error', () => {
    const errorStore = mockStore({
      artists: {
        selectedArtist: null,
        loading: false,
        error: 'Failed to load artist'
      }
    });
    
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    const { getByText } = render(
      <Provider store={errorStore}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that error message is displayed
    expect(getByText('Error: Failed to load artist')).toBeTruthy();
  });

  it('shows not found message when artist is not found', () => {
    const notFoundStore = mockStore({
      artists: {
        selectedArtist: null,
        loading: false,
        error: null
      }
    });
    
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    const { getByText } = render(
      <Provider store={notFoundStore}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that not found message is displayed
    expect(getByText('Artist not found')).toBeTruthy();
  });

  it('dispatches fetchArtist when retry button is pressed', () => {
    const errorStore = mockStore({
      artists: {
        selectedArtist: null,
        loading: false,
        error: 'Failed to load artist'
      }
    });
    
    errorStore.dispatch = jest.fn();
    
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    const { getByText } = render(
      <Provider store={errorStore}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Press retry button
    const retryButton = getByText('Retry');
    fireEvent.press(retryButton);
    
    // Check that dispatch was called with fetchArtist action
    expect(errorStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('artists/fetchArtist'),
        payload: '1'
      })
    );
  });

  it('dispatches clearSelectedArtist on unmount', () => {
    const route = { params: { artistId: '1', artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    
    const { unmount } = render(
      <Provider store={store}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Unmount the component
    unmount();
    
    // Check that dispatch was called with clearSelectedArtist action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('artists/clearSelectedArtist')
      })
    );
  });

  it('does not dispatch fetchArtist when artistId is not provided', () => {
    const route = { params: { artistName: 'Test Artist' } };
    const navigation = { setOptions: jest.fn() };
    render(
      <Provider store={store}>
        <ArtistProfileScreen route={route} navigation={navigation} />
      </Provider>
    );
    
    // Check that fetchArtist was not dispatched
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('artists/fetchArtist')
      })
    );
  });
});