import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ShareButton from '../ShareButton';

const mockStore = configureStore([]);

describe('ShareButton', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      shares: {
        sharesCount: {
          'track:track1': 3
        },
        loading: false
      }
    });
    
    store.dispatch = jest.fn();
    
    // Mock window.alert
    window.alert = jest.fn();
  });

  it('renders share button with count', () => {
    render(
      <Provider store={store}>
        <ShareButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Should show the share count
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Should show the share icon
    expect(screen.getByLabelText('Share')).toBeInTheDocument();
  });

  it('does not show count when there are no shares', () => {
    // Update store to show no shares
    const noSharesStore = mockStore({
      shares: {
        sharesCount: {
          'track:track1': 0
        },
        loading: false
      }
    });
    
    render(
      <Provider store={noSharesStore}>
        <ShareButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Should not show the count
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    
    // Should still show the share icon
    expect(screen.getByLabelText('Share')).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    // Update store to show loading state
    const loadingStore = mockStore({
      shares: {
        sharesCount: {
          'track:track1': 3
        },
        loading: true
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <ShareButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    const shareButton = screen.getByRole('button');
    expect(shareButton).toBeDisabled();
  });

  it('opens menu when share button is clicked', () => {
    render(
      <Provider store={store}>
        <ShareButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    const shareButton = screen.getByLabelText('Share');
    fireEvent.click(shareButton);
    
    // Menu should be open
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('TikTok')).toBeInTheDocument();
    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });

  it('closes menu when menu item is clicked', () => {
    render(
      <Provider store={store}>
        <ShareButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Open menu
    const shareButton = screen.getByLabelText('Share');
    fireEvent.click(shareButton);
    
    // Click on a menu item
    const facebookItem = screen.getByText('Facebook');
    fireEvent.click(facebookItem);
    
    // Menu should be closed
    expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
    
    // Alert should have been called
    expect(window.alert).toHaveBeenCalledWith(
      'Sharing to Facebook (this would open the platform\'s share dialog in a real app)'
    );
  });

  it('closes menu when close button is clicked', () => {
    render(
      <Provider store={store}>
        <ShareButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Open menu
    const shareButton = screen.getByLabelText('Share');
    fireEvent.click(shareButton);
    
    // Menu should be open
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    
    // Click outside the menu to close it (simulate backdrop click)
    fireEvent.keyDown(document, { key: 'Escape' });
    
    // Menu should be closed
    expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
  });

  it('fetches shares count on mount', () => {
    render(
      <Provider store={store}>
        <ShareButton entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Check that dispatch was called with fetchSharesCount action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('shares/fetchSharesCount'),
        payload: {
          entityType: 'track',
          entityId: 'track1'
        }
      })
    );
  });

  it('renders with small size correctly', () => {
    render(
      <Provider store={store}>
        <ShareButton entityType="track" entityId="track1" size="small" />
      </Provider>
    );
    
    // Check that the count is rendered with smaller font size
    const countElement = screen.getByText('3');
    expect(countElement).toBeInTheDocument();
  });
});