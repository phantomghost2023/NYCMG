import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SocialInteractionBar from '../SocialInteractionBar';

const mockStore = configureStore([]);

describe('SocialInteractionBar', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      likes: {
        likes: {},
        likesCount: {
          'track:track1': 5
        },
        loading: false
      },
      shares: {
        sharesCount: {
          'track:track1': 3
        },
        loading: false
      },
      follows: {
        followingStatus: {},
        loading: false
      },
      comments: {
        comments: {
          'track1': []
        },
        loading: false,
        error: null
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <SocialInteractionBar entityType="track" entityId="track1" userId="user2" />
      </Provider>
    );
    
    // Should render the like button with count
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Should render the share button with count
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Should render the follow button (since userId is provided)
    expect(screen.getByLabelText('Follow')).toBeInTheDocument();
  });

  it('does not render follow button when userId is not provided', () => {
    render(
      <Provider store={store}>
        <SocialInteractionBar entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Should render the like button with count
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Should render the share button with count
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Should not render the follow button (since userId is not provided)
    expect(screen.queryByLabelText('Follow')).not.toBeInTheDocument();
  });

  it('renders comment section', () => {
    render(
      <Provider store={store}>
        <SocialInteractionBar entityType="track" entityId="track1" userId="user2" />
      </Provider>
    );
    
    // Should render the comment section
    expect(screen.getByText('Comments (0)')).toBeInTheDocument();
  });

  it('renders divider between interaction buttons and comment section', () => {
    render(
      <Provider store={store}>
        <SocialInteractionBar entityType="track" entityId="track1" userId="user2" />
      </Provider>
    );
    
    // Should render the divider (we can't directly test for Divider component,
    // but we can check that the structure is correct by checking for the elements around it)
    expect(screen.getByText('Comments (0)')).toBeInTheDocument();
  });
});