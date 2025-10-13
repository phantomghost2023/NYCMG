import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, getComments, deleteComment } from '../store/commentSlice';

const CommentSection = ({ trackId }) => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comment);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (trackId) {
      dispatch(getComments(trackId));
    }
  }, [trackId, dispatch]);

  const handleAddComment = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'You need to login to add comments');
      return;
    }

    if (!newComment.trim()) {
      Alert.alert('Empty Comment', 'Please enter a comment');
      return;
    }

    dispatch(addComment({ trackId, content: newComment.trim() }));
    setNewComment('');
  };

  const handleDeleteComment = (commentId) => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'You need to login to delete comments');
      return;
    }

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteComment(commentId)),
        },
      ]
    );
  };

  const renderComment = ({ item: comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.username}>
          {comment.user?.username || 'Anonymous'}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(comment.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.commentText}>{comment.content}</Text>
      {isAuthenticated && user && user.id === comment.userId && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteComment(comment.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const trackComments = comments[trackId] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments ({trackComments.length})</Text>
      
      {isAuthenticated ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleAddComment}
            disabled={!newComment.trim() || loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loginPrompt}>
          Login to add comments
        </Text>
      )}
      
      {loading && trackComments.length === 0 ? (
        <Text style={styles.loadingText}>Loading comments...</Text>
      ) : (
        <FlatList
          data={trackComments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id.toString()}
          style={styles.commentsList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginPrompt: {
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  commentsList: {
    maxHeight: 300,
  },
  commentContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    color: '#666',
    lineHeight: 20,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
});

export default CommentSection;