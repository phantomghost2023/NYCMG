import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CommentSection from '../CommentSection';

const mockStore = configureStore([]);

describe('CommentSection', () => {
  let store;
  
  const mockComments = [
    {
      id: '1',
      content: 'Great track!',
      user_id: 'user1',
      user: { username: 'testuser' },
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      content: 'Thanks for sharing',
      user_id: 'user2',
      user: { username: 'anotheruser' },
      created_at: '2023-01-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    store = mockStore({
      comments: {
        comments: {
          'track1': mockComments
        },
        loading: false,
        error: null
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    store.dispatch = jest.fn();
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    expect(screen.getByText('Comments (2)')).toBeInTheDocument();
    expect(screen.getByText('Great track!')).toBeInTheDocument();
    expect(screen.getByText('Thanks for sharing')).toBeInTheDocument();
  });

  it('displays comment author and timestamp', () => {
    render(
      <Provider store={store}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('anotheruser')).toBeInTheDocument();
    // Note: The exact timestamp format might vary, so we're just checking that it's displayed
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  it('shows edit and delete buttons for own comments', () => {
    render(
      <Provider store={store}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Should show edit and delete buttons for the first comment (owned by testuser)
    const editButtons = screen.getAllByLabelText('Edit');
    const deleteButtons = screen.getAllByLabelText('Delete');
    expect(editButtons).toHaveLength(1);
    expect(deleteButtons).toHaveLength(1);
  });

  it('hides edit and delete buttons for other users comments', () => {
    // Create a store where the current user is different from the comment author
    const differentUserStore = mockStore({
      comments: {
        comments: {
          'track1': [{
            id: '1',
            content: 'Great track!',
            user_id: 'user2', // Different user
            user: { username: 'anotheruser' },
            created_at: '2023-01-01T00:00:00Z'
          }]
        },
        loading: false,
        error: null
      },
      auth: {
        user: { id: 'user1', username: 'testuser' } // Current user
      }
    });
    
    render(
      <Provider store={differentUserStore}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Should not show edit and delete buttons for comments by other users
    expect(screen.queryByLabelText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
  });

  it('allows adding a new comment', () => {
    render(
      <Provider store={store}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    const textarea = screen.getByPlaceholderText('Add a comment...');
    const postButton = screen.getByText('Post');
    
    // Type in the comment
    fireEvent.change(textarea, { target: { value: 'New comment' } });
    
    // Click post button
    fireEvent.click(postButton);
    
    // Check that dispatch was called with correct action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('comments/createComment'),
        payload: expect.objectContaining({
          content: 'New comment',
          track_id: 'track1'
        })
      })
    );
  });

  it('prevents posting empty comments', () => {
    render(
      <Provider store={store}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    const postButton = screen.getByText('Post');
    
    // Button should be disabled when textarea is empty
    expect(postButton).toBeDisabled();
  });

  it('allows editing a comment', () => {
    render(
      <Provider store={store}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Click edit button
    const editButton = screen.getByLabelText('Edit');
    fireEvent.click(editButton);
    
    // Check that edit mode is activated
    const saveButton = screen.getByText('Save');
    const cancelButton = screen.getByText('Cancel');
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    
    // Edit the comment
    const editTextarea = screen.getByRole('textbox');
    fireEvent.change(editTextarea, { target: { value: 'Updated comment' } });
    
    // Click save
    fireEvent.click(saveButton);
    
    // Check that dispatch was called with correct action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('comments/updateComment'),
        payload: expect.objectContaining({
          commentId: '1',
          content: 'Updated comment'
        })
      })
    );
  });

  it('allows deleting a comment', () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    
    render(
      <Provider store={store}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    // Click delete button
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    
    // Check that confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?');
    
    // Check that dispatch was called with correct action
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('comments/deleteComment'),
        payload: '1'
      })
    );
  });

  it('shows message when there are no comments', () => {
    const emptyStore = mockStore({
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
    
    render(
      <Provider store={emptyStore}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const errorStore = mockStore({
      comments: {
        comments: {
          'track1': []
        },
        loading: false,
        error: 'Failed to load comments'
      },
      auth: {
        user: { id: 'user1', username: 'testuser' }
      }
    });
    
    render(
      <Provider store={errorStore}>
        <CommentSection entityType="track" entityId="track1" />
      </Provider>
    );
    
    expect(screen.getByText('Error loading comments: Failed to load comments')).toBeInTheDocument();
  });
});