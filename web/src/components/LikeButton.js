import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  likeEntity, 
  unlikeEntity, 
  fetchLikesCount, 
  checkLikeStatus 
} from '../store/likeSlice';
import { 
  IconButton, 
  Tooltip, 
  Typography, 
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const LikeButton = ({ 
  entityType, 
  entityId, 
  size = 'medium',
  showCount = true,
  disabled = false,
  onLikeChange 
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { likes, likesCount, loading, error } = useSelector((state) => state.likes);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Create entity key for lookup
  const entityKey = `${entityType}:${entityId}`;
  
  // Check if entity is liked
  const isLiked = likes[entityKey] || false;
  
  // Get likes count
  const count = likesCount[entityKey] || 0;
  
  // Snackbar state for error messages
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  
  // Handle error messages
  const handleError = useCallback((message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }, []);
  
  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Fetch initial like status and count
  useEffect(() => {
    if (entityId && entityType) {
      // Fetch likes count
      dispatch(fetchLikesCount({ entityType, entityId }))
        .unwrap()
        .catch((err) => {
          console.error('Failed to fetch likes count:', err);
        });
      
      // Check if user has liked this entity
      if (isAuthenticated && user) {
        const likeData = {
          [`${entityType}_id`]: entityId
        };
        
        dispatch(checkLikeStatus(likeData))
          .unwrap()
          .catch((err) => {
            console.error('Failed to check like status:', err);
          });
      }
    }
  }, [dispatch, entityType, entityId, isAuthenticated, user]);
  
  // Handle like/unlike action
  const handleLike = async (e) => {
    // Prevent any default behavior that might cause navigation
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    
    // Prevent multiple clicks while loading
    if (loading) return;
    
    try {
      const likeData = {
        [`${entityType}_id`]: entityId
      };
      
      if (isLiked) {
        // Unlike the entity
        await dispatch(unlikeEntity(likeData)).unwrap();
        if (onLikeChange) onLikeChange(false, count - 1);
      } else {
        // Like the entity
        await dispatch(likeEntity(likeData)).unwrap();
        if (onLikeChange) onLikeChange(true, count + 1);
      }
    } catch (err) {
      const errorMessage = err || 'Failed to update like status';
      handleError(errorMessage);
      console.error('Like action failed:', err);
    }
  };
  
  // Determine button color based on like status
  const buttonColor = isLiked ? 'error' : 'default';
  
  // Determine icon based on like status
  const LikeIcon = isLiked ? Favorite : FavoriteBorder;
  
  return (
    <>
      <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
        <span> {/* Wrapper span to allow IconButton to be disabled properly */}
          <IconButton
            onClick={handleLike}
            disabled={disabled || loading || !entityId || !entityType}
            size={size}
            color={buttonColor}
            type="button"
            aria-label={isLiked ? 'Unlike' : 'Like'}
            sx={{
              position: 'relative'
            }}
          >
            {loading ? (
              <CircularProgress 
                size={size === 'small' ? 16 : 24} 
                color={isLiked ? 'error' : 'inherit'} 
              />
            ) : (
              <LikeIcon />
            )}
            
            {showCount && count > 0 && (
              <Typography 
                component="span" 
                sx={{ 
                  ml: 0.5, 
                  fontSize: size === 'small' ? '0.75rem' : '0.875rem',
                  fontWeight: isLiked ? 'bold' : 'normal'
                }}
              >
                {count}
              </Typography>
            )}
          </IconButton>
        </span>
      </Tooltip>
      
      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LikeButton;