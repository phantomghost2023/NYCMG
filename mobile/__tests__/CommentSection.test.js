import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CommentSection from '../src/components/CommentSection';

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

// Mock commentSlice actions
jest.mock('../src/store/commentSlice', () => ({
  addComment: jest.fn(),
  getComments: jest.fn(),
  deleteComment: jest.fn(),
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  return RN;
});

describe('CommentSection', () => {
  const mockDispatch = jest.fn();
  const mockUseDispatch = require('react-redux').useDispatch;
  const mockUseSelector = require('react-redux').useSelector;
  const { addComment, getComments, deleteComment } = require('../src/store/commentSlice');
  const Alert = require('react-native').Alert;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
    Alert.alert.mockClear();
  });

  it('renders comment section with track id', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('comment')) {
        return { comments: {}, loading: false };
      }
      if (selector.toString().includes('auth')) {
        return { isAuthenticated: true, user: { id: 1 } };
      }
      return {};
    });

    const { getByPlaceholderText } = render(<CommentSection trackId={1} />);
    
    expect(getByPlaceholderText('Add a comment...')).toBeTruthy();
  });

  it('dispatches getComments on mount', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('comment')) {
        return { comments: {}, loading: false };
      }
      if (selector.toString().includes('auth')) {
        return { isAuthenticated: true, user: { id: 1 } };
      }
      return {};
    });

    render(<CommentSection trackId={1} />);
    
    expect(getComments).toHaveBeenCalledWith(1);
  });

  it('dispatches addComment when send button is pressed', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('comment')) {
        return { comments: {}, loading: false };
      }
      if (selector.toString().includes('auth')) {
        return { isAuthenticated: true, user: { id: 1 } };
      }
      return {};
    });

    const { getByPlaceholderText, getByText } = render(<CommentSection trackId={1} />);
    
    const input = getByPlaceholderText('Add a comment...');
    fireEvent.changeText(input, 'Test comment');
    
    const sendButton = getByText('Send');
    fireEvent.press(sendButton);
    
    expect(addComment).toHaveBeenCalledWith({ trackId: 1, content: 'Test comment' });
  });

  it('shows alert when trying to add empty comment', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('comment')) {
        return { comments: {}, loading: false };
      }
      if (selector.toString().includes('auth')) {
        return { isAuthenticated: true, user: { id: 1 } };
      }
      return {};
    });

    const { getByText } = render(<CommentSection trackId={1} />);
    
    const sendButton = getByText('Send');
    fireEvent.press(sendButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Empty Comment', 'Please enter a comment');
  });

  it('shows alert when user is not authenticated', () => {
    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('comment')) {
        return { comments: {}, loading: false };
      }
      if (selector.toString().includes('auth')) {
        return { isAuthenticated: false };
      }
      return {};
    });

    const { getByText } = render(<CommentSection trackId={1} />);
    
    const sendButton = getByText('Send');
    fireEvent.press(sendButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Login Required', 'You need to login to add comments');
  });

  it('renders comments list', () => {
    const mockComments = {
      1: [
        {
          id: 1,
          content: 'Test comment',
          userId: 1,
          user: { username: 'testuser' },
          createdAt: new Date().toISOString(),
        },
      ],
    };

    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('comment')) {
        return { comments: mockComments, loading: false };
      }
      if (selector.toString().includes('auth')) {
        return { isAuthenticated: true, user: { id: 1 } };
      }
      return {};
    });

    const { getByText } = render(<CommentSection trackId={1} />);
    
    expect(getByText('Test comment')).toBeTruthy();
    expect(getByText('testuser')).toBeTruthy();
  });

  it('dispatches deleteComment when delete button is pressed', () => {
    const mockComments = {
      1: [
        {
          id: 1,
          content: 'Test comment',
          userId: 1,
          user: { username: 'testuser' },
          createdAt: new Date().toISOString(),
        },
      ],
    };

    mockUseSelector.mockImplementation(selector => {
      if (selector.toString().includes('comment')) {
        return { comments: mockComments, loading: false };
      }
      if (selector.toString().includes('auth')) {
        return { isAuthenticated: true, user: { id: 1 } };
      }
      return {};
    });

    const { getByText } = render(<CommentSection trackId={1} />);
    
    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);
    
    // Get the callback function from the Alert.alert call
    const alertCall = Alert.alert.mock.calls[0];
    const confirmCallback = alertCall[2][1].onPress; // Second button is "Delete"
    
    // Call the confirm callback
    confirmCallback();
    
    expect(deleteComment).toHaveBeenCalledWith(1);
  });
});