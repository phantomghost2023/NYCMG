import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ArtistTrackList from '../ArtistTrackList';

const mockStore = configureStore([]);

describe('ArtistTrackList', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      tracks: {
        tracks: [
          {
            id: 1,
            title: 'Test Track',
            artist: { artist_name: 'Test Artist' },
            genres: [{ id: 1, name: 'Test Genre' }],
            release_date: '2023-01-01'
          }
        ],
        loading: false,
        error: null
      }
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <ArtistTrackList artistId={1} />
      </Provider>
    );
    
    expect(screen.getByText('Test Track')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    store = mockStore({
      tracks: {
        tracks: [],
        loading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <ArtistTrackList artistId={1} />
      </Provider>
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error state', () => {
    store = mockStore({
      tracks: {
        tracks: [],
        loading: false,
        error: 'Failed to load tracks'
      }
    });

    render(
      <Provider store={store}>
        <ArtistTrackList artistId={1} />
      </Provider>
    );
    
    expect(screen.getByText('Error loading tracks: Failed to load tracks')).toBeInTheDocument();
  });
});