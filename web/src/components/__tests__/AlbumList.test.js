import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AlbumList from '../AlbumList';

const mockStore = configureStore([]);

describe('AlbumList', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      albums: {
        albums: [
          {
            id: 1,
            title: 'Test Album',
            tracks: [{ id: 1, title: 'Test Track' }],
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
        <AlbumList artistId={1} />
      </Provider>
    );
    
    expect(screen.getByText('Test Album')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    store = mockStore({
      albums: {
        albums: [],
        loading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <AlbumList artistId={1} />
      </Provider>
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error state', () => {
    store = mockStore({
      albums: {
        albums: [],
        loading: false,
        error: 'Failed to load albums'
      }
    });

    render(
      <Provider store={store}>
        <AlbumList artistId={1} />
      </Provider>
    );
    
    expect(screen.getByText('Error loading albums: Failed to load albums')).toBeInTheDocument();
  });
});