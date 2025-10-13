import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TrackList from '../TrackList';

const mockStore = configureStore([]);

describe('TrackList', () => {
  let store;
  
  const mockTracks = [
    {
      id: '1',
      title: 'Test Track 1',
      artist: { artist_name: 'Test Artist 1' },
      release_date: '2023-01-01',
      cover_art_url: 'https://example.com/cover1.jpg',
      genres: [
        { id: '1', name: 'Hip Hop' },
        { id: '2', name: 'Rap' }
      ]
    },
    {
      id: '2',
      title: 'Test Track 2',
      artist: { artist_name: 'Test Artist 2' },
      release_date: '2023-02-01',
      cover_art_url: null,
      genres: [
        { id: '3', name: 'Jazz' }
      ]
    }
  ];

  beforeEach(() => {
    store = mockStore({
      tracks: {
        tracks: mockTracks,
        loading: false,
        error: null,
        totalCount: 2,
        currentPage: 1,
        totalPages: 1
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    expect(screen.getByText('Latest Tracks')).toBeInTheDocument();
    expect(screen.getByText('Test Track 1')).toBeInTheDocument();
    expect(screen.getByText('Test Track 2')).toBeInTheDocument();
  });

  it('renders track information correctly', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    // Check first track details
    expect(screen.getByText('Test Track 1')).toBeInTheDocument();
    expect(screen.getByText('by Test Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Released: 1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('Hip Hop')).toBeInTheDocument();
    expect(screen.getByText('Rap')).toBeInTheDocument();
    
    // Check second track details
    expect(screen.getByText('Test Track 2')).toBeInTheDocument();
    expect(screen.getByText('by Test Artist 2')).toBeInTheDocument();
    expect(screen.getByText('Released: 2/1/2023')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
  });

  it('renders cover art when available', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    // First track should have an image
    const coverImage = screen.getByAltText('Test Track 1');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', 'https://example.com/cover1.jpg');
  });

  it('renders placeholder when cover art is not available', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    // Second track should have a placeholder (we can check for the music note)
    expect(screen.getByText('♪')).toBeInTheDocument();
  });

  it('renders loading spinner when loading and no tracks', () => {
    const loadingStore = mockStore({
      tracks: {
        tracks: [],
        loading: true,
        error: null,
        totalCount: 0,
        currentPage: 1,
        totalPages: 1
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <TrackList />
      </Provider>
    );
    
    // Should show loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error message when there is an error and no tracks', () => {
    const errorStore = mockStore({
      tracks: {
        tracks: [],
        loading: false,
        error: 'Failed to load tracks',
        totalCount: 0,
        currentPage: 1,
        totalPages: 1
      }
    });
    
    render(
      <Provider store={errorStore}>
        <TrackList />
      </Provider>
    );
    
    // Should show error message
    expect(screen.getByText('Error loading tracks: Failed to load tracks')).toBeInTheDocument();
  });

  it('renders no tracks message when there are no tracks and not loading', () => {
    const emptyStore = mockStore({
      tracks: {
        tracks: [],
        loading: false,
        error: null,
        totalCount: 0,
        currentPage: 1,
        totalPages: 1
      }
    });
    
    render(
      <Provider store={emptyStore}>
        <TrackList />
      </Provider>
    );
    
    // Should show no tracks message
    expect(screen.getByText('No tracks found')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    // Should render search bar
    expect(screen.getByPlaceholderText('Search tracks, artists, albums...')).toBeInTheDocument();
  });

  it('dispatches fetchTracks when component mounts', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    // Check that dispatch was called with fetchTracks action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('tracks/fetchTracks'),
        payload: expect.objectContaining({
          limit: 10,
          offset: 0
        })
      })
    );
  });

  it('dispatches fetchTracks with search term when search is performed', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    // Perform search
    const searchInput = screen.getByPlaceholderText('Search tracks, artists, albums...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Submit search
    const searchButton = screen.getByLabelText('search');
    fireEvent.click(searchButton);
    
    // Check that dispatch was called with fetchTracks action including search term
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('tracks/fetchTracks'),
        payload: expect.objectContaining({
          search: 'test search',
          limit: 10,
          offset: 0
        })
      })
    );
  });

  it('renders pagination when there are multiple pages', () => {
    const multiPageStore = mockStore({
      tracks: {
        tracks: mockTracks,
        loading: false,
        error: null,
        totalCount: 50,
        currentPage: 1,
        totalPages: 5
      }
    });
    
    render(
      <Provider store={multiPageStore}>
        <TrackList />
      </Provider>
    );
    
    // Should render pagination
    expect(screen.getByText('Showing 1-10 of 50 tracks')).toBeInTheDocument();
  });

  it('renders audio player for each track', () => {
    render(
      <Provider store={store}>
        <TrackList />
      </Provider>
    );
    
    // Should render audio players for each track
    // Since AudioPlayer is a separate component, we can't directly test its content
    // But we can check that the CardActions components are rendered
    const cardActions = screen.getAllByRole('toolbar');
    expect(cardActions).toHaveLength(2);
  });
});