import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AdvancedSearch from '../AdvancedSearch';

const mockStore = configureStore([]);

describe('AdvancedSearch', () => {
  let store;
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    store = mockStore({
      boroughs: {
        boroughs: [
          { id: '1', name: 'Manhattan' },
          { id: '2', name: 'Brooklyn' }
        ],
        loading: false
      },
      genres: {
        genres: [
          { id: '1', name: 'Hip Hop' },
          { id: '2', name: 'Jazz' }
        ],
        loading: false
      }
    });
    
    mockOnSearch.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <AdvancedSearch onSearch={mockOnSearch} />
      </Provider>
    );
    
    expect(screen.getByText('Advanced Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Search tracks, artists, albums...')).toBeInTheDocument();
  });

  it('calls onSearch with correct parameters when search is submitted', () => {
    render(
      <Provider store={store}>
        <AdvancedSearch onSearch={mockOnSearch} />
      </Provider>
    );
    
    // Fill in search term
    const searchInput = screen.getByLabelText('Search tracks, artists, albums...');
    fireEvent.change(searchInput, { target: { value: 'test track' } });
    
    // Submit form
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      search: 'test track',
      boroughIds: [],
      genreIds: [],
      isExplicit: false,
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
  });

  it('allows selection of boroughs and genres', () => {
    render(
      <Provider store={store}>
        <AdvancedSearch onSearch={mockOnSearch} />
      </Provider>
    );
    
    // Open borough select
    const boroughSelect = screen.getByLabelText('Boroughs');
    fireEvent.mouseDown(boroughSelect);
    
    // Select a borough
    const manhattanOption = screen.getByText('Manhattan');
    fireEvent.click(manhattanOption);
    
    // Open genre select
    const genreSelect = screen.getByLabelText('Genres');
    fireEvent.mouseDown(genreSelect);
    
    // Select a genre
    const hipHopOption = screen.getByText('Hip Hop');
    fireEvent.click(hipHopOption);
    
    // Submit form
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      search: '',
      boroughIds: ['1'],
      genreIds: ['1'],
      isExplicit: false,
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
  });
});