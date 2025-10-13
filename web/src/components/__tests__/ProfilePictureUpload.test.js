import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProfilePictureUpload from '../ProfilePictureUpload';

const mockStore = configureStore([]);

describe('ProfilePictureUpload', () => {
  let store;
  const mockArtist = {
    id: '1',
    artist_name: 'Test Artist',
    profile_picture_url: null
  };

  beforeEach(() => {
    store = mockStore({
      artists: {
        selectedArtist: mockArtist,
        loading: false,
        error: null
      },
      auth: {
        user: { id: '1' },
        isAuthenticated: true
      }
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <ProfilePictureUpload artist={mockArtist} />
      </Provider>
    );
    
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('displays profile picture when available', () => {
    const artistWithPicture = {
      ...mockArtist,
      profile_picture_url: 'https://example.com/profile.jpg'
    };

    render(
      <Provider store={store}>
        <ProfilePictureUpload artist={artistWithPicture} />
      </Provider>
    );
    
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });
});