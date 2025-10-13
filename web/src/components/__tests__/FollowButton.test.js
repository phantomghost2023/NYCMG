import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FollowButton from '../FollowButton';

const mockStore = configureStore([]);

describe('FollowButton', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      follows: {
        followingStatus: {
          'user2': false
        },
        loading: false
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders follow button when not following', () => {
    render(
      <Provider store={store}>
        <FollowButton userId="user2" />
      </Provider>
    );
    
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('renders following button when already following', () => {
    // Update store to show user is being followed
    const followingStore = mockStore({
      follows: {
        followingStatus: {
          'user2': true // Following this user
        },
        loading: false
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={followingStore}>
        <FollowButton userId="user2" />
      </Provider>
    );
    
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('renders icon variant correctly', () => {
    render(
      <Provider store={store}>
        <FollowButton userId="user2" variant="icon" />
      </Provider>
    );
    
    // Should render an icon button with PersonAdd icon
    const iconButton = screen.getByRole('button');
    expect(iconButton).toBeInTheDocument();
    expect(iconButton).toContainElement(screen.getByLabelText('Follow'));
  });

  it('dispatches follow action when follow button is clicked', () => {
    render(
      <Provider store={store}>
        <FollowButton userId="user2" />
      </Provider>
    );
    
    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);
    
    // Check that dispatch was called with followUser action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('follows/followUser'),
        payload: 'user2'
      })
    );
  });

  it('dispatches unfollow action when following button is clicked', () => {
    // Update store to show user is being followed
    const followingStore = mockStore({
      follows: {
        followingStatus: {
          'user2': true
        },
        loading: false
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={followingStore}>
        <FollowButton userId="user2" />
      </Provider>
    );
    
    const followingButton = screen.getByText('Following');
    fireEvent.click(followingButton);
    
    // Check that dispatch was called with unfollowUser action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('follows/unfollowUser'),
        payload: 'user2'
      })
    );
  });

  it('disables button when loading', () => {
    // Update store to show loading state
    const loadingStore = mockStore({
      follows: {
        followingStatus: {
          'user2': false
        },
        loading: true
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <FollowButton userId="user2" />
      </Provider>
    );
    
    const followButton = screen.getByText('Follow');
    expect(followButton).toBeDisabled();
  });

  it('does not render button when user is viewing their own profile', () => {
    // Update store to simulate user viewing their own profile
    const selfStore = mockStore({
      follows: {
        followingStatus: {
          'user1': false // Same ID as current user
        },
        loading: false
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={selfStore}>
        <FollowButton userId="user1" />
      </Provider>
    );
    
    // Should not render anything
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});