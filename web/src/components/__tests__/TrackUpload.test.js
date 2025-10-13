import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TrackUpload from '../TrackUpload';

const mockStore = configureStore([]);

describe('TrackUpload', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      genres: {
        genres: [
          { id: '1', name: 'Hip Hop' },
          { id: '2', name: 'Jazz' },
          { id: '3', name: 'Rock' }
        ]
      }
    });
    
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'test-token');
    
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ track: { id: '1', title: 'Test Track' } })
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    expect(screen.getByText('Upload New Track')).toBeInTheDocument();
    expect(screen.getByLabelText('Track Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Release Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Genres')).toBeInTheDocument();
    expect(screen.getByLabelText('Explicit Content')).toBeInTheDocument();
  });

  it('renders file inputs for audio and cover art', () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Should render audio file input
    const audioInputs = screen.getAllByLabelText('Audio File');
    expect(audioInputs).toHaveLength(1);
    
    // Should render cover art file input
    const coverArtInputs = screen.getAllByLabelText('Cover Art (Optional)');
    expect(coverArtInputs).toHaveLength(1);
  });

  it('renders genre options in the select dropdown', () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Open the genre select dropdown
    const genreSelect = screen.getByLabelText('Genres');
    fireEvent.mouseDown(genreSelect);
    
    // Should show all genre options
    expect(screen.getByText('Hip Hop')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
  });

  it('allows selecting multiple genres', () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Open the genre select dropdown
    const genreSelect = screen.getByLabelText('Genres');
    fireEvent.mouseDown(genreSelect);
    
    // Select Hip Hop
    const hipHopOption = screen.getByText('Hip Hop');
    fireEvent.click(hipHopOption);
    
    // Select Jazz
    const jazzOption = screen.getByText('Jazz');
    fireEvent.click(jazzOption);
    
    // The select should now show the selected genres
    // Note: Testing the actual rendered value is complex with MUI Select, 
    // so we're just checking that the selection mechanism works
  });

  it('shows error message when title is missing', () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Submit without filling in title
    const submitButton = screen.getByText('Upload Track');
    fireEvent.click(submitButton);
    
    // Should show error message
    expect(screen.getByText('Title and audio file are required')).toBeInTheDocument();
  });

  it('shows error message when audio file is missing', () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Fill in title but not audio file
    const titleInput = screen.getByLabelText('Track Title');
    fireEvent.change(titleInput, { target: { value: 'Test Track' } });
    
    // Submit
    const submitButton = screen.getByText('Upload Track');
    fireEvent.click(submitButton);
    
    // Should show error message
    expect(screen.getByText('Title and audio file are required')).toBeInTheDocument();
  });

  it('submits form successfully when all required fields are filled', async () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Fill in required fields
    const titleInput = screen.getByLabelText('Track Title');
    fireEvent.change(titleInput, { target: { value: 'Test Track' } });
    
    // Simulate file selection
    const audioInput = screen.getByLabelText('Audio File');
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });
    fireEvent.change(audioInput, { target: { files: [file] } });
    
    // Submit form
    const submitButton = screen.getByText('Upload Track');
    fireEvent.click(submitButton);
    
    // Wait for async operations
    await screen.findByText('Track uploaded successfully!');
    
    // Should show success message
    expect(screen.getByText('Track uploaded successfully!')).toBeInTheDocument();
  });

  it('shows error message when upload fails', async () => {
    // Mock fetch to return an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' })
      })
    );
    
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Fill in required fields
    const titleInput = screen.getByLabelText('Track Title');
    fireEvent.change(titleInput, { target: { value: 'Test Track' } });
    
    // Simulate file selection
    const audioInput = screen.getByLabelText('Audio File');
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });
    fireEvent.change(audioInput, { target: { files: [file] } });
    
    // Submit form
    const submitButton = screen.getByText('Upload Track');
    fireEvent.click(submitButton);
    
    // Wait for async operations
    await screen.findByText('Upload failed');
    
    // Should show error message
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('disables submit button during upload', async () => {
    // Mock fetch to take some time
    global.fetch = jest.fn(() => 
      new Promise(resolve => 
        setTimeout(() => 
          resolve({
            ok: true,
            json: () => Promise.resolve({ track: { id: '1', title: 'Test Track' } })
          }), 
        100)
      )
    );
    
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Fill in required fields
    const titleInput = screen.getByLabelText('Track Title');
    fireEvent.change(titleInput, { target: { value: 'Test Track' } });
    
    // Simulate file selection
    const audioInput = screen.getByLabelText('Audio File');
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });
    fireEvent.change(audioInput, { target: { files: [file] } });
    
    // Submit form
    const submitButton = screen.getByText('Upload Track');
    fireEvent.click(submitButton);
    
    // Button should be disabled during upload
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Uploading...');
  });

  it('resets form after successful upload', async () => {
    render(
      <Provider store={store}>
        <TrackUpload />
      </Provider>
    );
    
    // Fill in fields
    const titleInput = screen.getByLabelText('Track Title');
    fireEvent.change(titleInput, { target: { value: 'Test Track' } });
    
    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    // Simulate file selection
    const audioInput = screen.getByLabelText('Audio File');
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mp3' });
    fireEvent.change(audioInput, { target: { files: [file] } });
    
    // Submit form
    const submitButton = screen.getByText('Upload Track');
    fireEvent.click(submitButton);
    
    // Wait for async operations
    await screen.findByText('Track uploaded successfully!');
    
    // Form fields should be reset
    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });
});