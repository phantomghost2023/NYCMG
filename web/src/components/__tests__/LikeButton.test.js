import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LikeButton from '../LikeButton';

const mockStore = configureStore([]);

describe('LikeButton', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      likes: {
        likes: {
          'track:track1': false
        },
        likesCount: {
          'track:track1': 5
        },
        loading: false
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders like button with count when not liked', () => {
    render(
      <Provider store={store}>
        <LikeButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Should show the like count
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Should show the outlined heart icon (not liked)
    expect(screen.getByLabelText('Like')).toBeInTheDocument();
  });

  it('renders unlike button with count when already liked', () => {
    // Update store to show entity is liked
    const likedStore = mockStore({
      likes: {
        likes: {
          'track:track1': true // Liked this entity
        },
        likesCount: {
          'track:track1': 5
        },
        loading: false
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={likedStore}>
        <LikeButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Should show the filled heart icon (liked)
    expect(screen.getByLabelText('Unlike')).toBeInTheDocument();
    
    // Should still show the like count
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('dispatches like action when like button is clicked', () => {
    render(
      <Provider store={store}>
        <LikeButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    const likeButton = screen.getByRole('button');
    fireEvent.click(likeButton);
    
    // Check that dispatch was called with likeEntity action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('likes/likeEntity'),
        payload: expect.objectContaining({
          track_id: 'track1'
        })
      })
    );
  });

  it('dispatches unlike action when unlike button is clicked', () => {
    // Update store to show entity is liked
    const likedStore = mockStore({
      likes: {
        likes: {
          'track:track1': true
        },
        likesCount: {
          'track:track1': 5
        },
        loading: false
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={likedStore}>
        <LikeButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    const unlikeButton = screen.getByRole('button');
    fireEvent.click(unlikeButton);
    
    // Check that dispatch was called with unlikeEntity action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('likes/unlikeEntity'),
        payload: expect.objectContaining({
          track_id: 'track1'
        })
      })
    );
  });

  it('disables button when loading', () => {
    // Update store to show loading state
    const loadingStore = mockStore({
      likes: {
        likes: {
          'track:track1': false
        },
        likesCount: {
          'track:track1': 5
        },
        loading: true
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <LikeButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    const likeButton = screen.getByRole('button');
    expect(likeButton).toBeDisabled();
  });

  it('shows alert when unauthenticated user tries to like', () => {
    // Mock window.alert
    window.alert = jest.fn();
    
    // Update store to show no authenticated user
    const noUserStore = mockStore({
      likes: {
        likes: {
          'track:track1': false
        },
        likesCount: {
          'track:track1': 5
        },
        loading: false
      },
      auth: {
        user: null // No authenticated user
      }
    });
    
    render(
      <Provider store={noUserStore}>
        <LikeButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    const likeButton = screen.getByRole('button');
    fireEvent.click(likeButton);
    
    // Check that alert was called
    expect(window.alert).toHaveBeenCalledWith('Please log in to like this content');
  });

  it('renders with small size correctly', () => {
    render(
      <Provider store={store}>
        <LikeButton entityType="track" entityId="track1" size="small" />
      </Provider>
    );
    
    // Check that the count is rendered with smaller font size
    const countElement = screen.getByText('5');
    expect(countElement).toBeInTheDocument();
  });

  it('fetches initial like status and count on mount', () => {
    render(
      <Provider store={store}>
        <LikeButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Check that dispatch was called with fetchLikesCount action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('likes/fetchLikesCount'),
        payload: {
          entityType: 'track',
          entityId: 'track1'
        }
      })
    );
    
    // Check that dispatch was called with checkLikeStatus action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('likes/checkLikeStatus'),
        payload: {
          track_id: 'track1'
        }
      })
    );
  });
});