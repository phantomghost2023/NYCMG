import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NotificationPanel from '../NotificationPanel';

const mockStore = configureStore([]);

describe('NotificationPanel', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      notifications: {
        notifications: [
          {
            id: '1',
            type: 'track_upload',
            title: 'New Track',
            message: 'A new track was uploaded',
            is_read: false,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            type: 'new_follower',
            title: 'New Follower',
            message: 'Someone followed you',
            is_read: true,
            created_at: new Date().toISOString()
          }
        ],
        unreadCount: 1,
        loading: false,
        error: null
      }
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <NotificationPanel />
      </Provider>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays notification count badge', () => {
    render(
      <Provider store={store}>
        <NotificationPanel />
      </Provider>
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens panel when clicked', () => {
    render(
      <Provider store={store}>
        <NotificationPanel />
      </Provider>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays notifications when panel is open', () => {
    render(
      <Provider store={store}>
        <NotificationPanel />
      </Provider>
    );
    
    // Open the panel
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('New Track')).toBeInTheDocument();
    expect(screen.getByText('New Follower')).toBeInTheDocument();
  });
});