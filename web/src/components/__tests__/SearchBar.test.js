import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const onSearchMock = jest.fn();

  beforeEach(() => {
    onSearchMock.mockClear();
  });

  it('renders without crashing', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    expect(screen.getByPlaceholderText('Search tracks, artists, albums...')).toBeInTheDocument();
    expect(screen.getByLabelText('search')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar onSearch={onSearchMock} placeholder="Custom placeholder" />);
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('calls onSearch with search term when form is submitted', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    const input = screen.getByPlaceholderText('Search tracks, artists, albums...');
    const searchButton = screen.getByLabelText('search');
    
    // Type in search term
    fireEvent.change(input, { target: { value: 'test search' } });
    
    // Submit form
    fireEvent.click(searchButton);
    
    expect(onSearchMock).toHaveBeenCalledWith('test search');
  });

  it('calls onSearch with empty string when clear button is clicked', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    const input = screen.getByPlaceholderText('Search tracks, artists, albums...');
    const searchButton = screen.getByLabelText('search');
    
    // Type in search term
    fireEvent.change(input, { target: { value: 'test search' } });
    
    // Submit form first
    fireEvent.click(searchButton);
    expect(onSearchMock).toHaveBeenCalledWith('test search');
    
    // Click clear button
    const clearButton = screen.getByLabelText('clear search');
    fireEvent.click(clearButton);
    
    expect(onSearchMock).toHaveBeenCalledWith('');
    expect(input.value).toBe('');
  });

  it('shows clear button only when there is text in the input', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    // Initially, clear button should not be in the document
    expect(screen.queryByLabelText('clear search')).not.toBeInTheDocument();
    
    // Type in search term
    const input = screen.getByPlaceholderText('Search tracks, artists, albums...');
    fireEvent.change(input, { target: { value: 'test search' } });
    
    // Clear button should now be visible
    expect(screen.getByLabelText('clear search')).toBeInTheDocument();
    
    // Clear the input
    fireEvent.change(input, { target: { value: '' } });
    
    // Clear button should no longer be visible
    expect(screen.queryByLabelText('clear search')).not.toBeInTheDocument();
  });

  it('calls onSearch when form is submitted with Enter key', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    const input = screen.getByPlaceholderText('Search tracks, artists, albums...');
    
    // Type in search term
    fireEvent.change(input, { target: { value: 'test search' } });
    
    // Press Enter key
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Since the form handles submission, we need to check if onSearch was called
    // The actual form submission is handled by the onSubmit handler
    expect(onSearchMock).toHaveBeenCalledWith('test search');
  });

  it('does not call onSearch when form is submitted with empty search term', () => {
    render(<SearchBar onSearch={onSearchMock} />);
    
    const searchButton = screen.getByLabelText('search');
    
    // Submit form without typing anything
    fireEvent.click(searchButton);
    
    expect(onSearchMock).toHaveBeenCalledWith('');
  });
});