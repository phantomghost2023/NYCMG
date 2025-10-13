import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createComment, 
  fetchComments, 
  updateComment, 
  deleteComment 
} from '../store/commentSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import {
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const CommentSection = ({ entityType, entityId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  // Fetch comments when component mounts
  useEffect(() => {
    if (entityId) {
      dispatch(fetchComments({ entityType, entityId }));
    }
  }, [dispatch, entityType, entityId]);
  
  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const commentData = {
      content: newComment.trim(),
      [`${entityType}_id`]: entityId
    };
    
    dispatch(createComment(commentData));
    setNewComment('');
  };
  
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditContent(content);
  };
  
  const handleSaveEdit = (commentId) => {
    if (editContent.trim() === '') return;
    
    dispatch(updateComment({ commentId, content: editContent.trim() }));
    setEditingCommentId(null);
    setEditContent('');
  };
  
  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(commentId));
    }
  };
  
  const entityComments = comments[entityId] || [];
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({entityComments.length})
      </Typography>
      
      {user && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
            />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleAddComment}
                disabled={loading || newComment.trim() === ''}
              >
                Post
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {entityComments.map((comment) => (
        <Card key={comment.id} sx={{ mb: 2 }}>
          <CardHeader
            title={comment.user?.username || 'Anonymous'}
            subheader={new Date(comment.created_at).toLocaleString()}
            action={
              user && user.id === comment.user_id && (
                <>
                  <IconButton onClick={() => handleEditComment(comment.id, comment.content)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteComment(comment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }
          />
          <CardContent>
            {editingCommentId === comment.id ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  variant="outlined"
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSaveEdit(comment.id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditingCommentId(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Typography>{comment.content}</Typography>
            )}
          </CardContent>
        </Card>
      ))}
      
      {entityComments.length === 0 && !loading && (
        <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
          No comments yet. Be the first to comment!
        </Typography>
      )}
      
      {error && (
        <Typography color="error" align="center" sx={{ py: 2 }}>
          Error loading comments: {error}
        </Typography>
      )}
    </Box>
  );
};

export default CommentSection;