import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  likeEntity, 
  unlikeEntity, 
  fetchLikesCount, 
  checkLikeStatus 
} from '../store/likeSlice';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const LikeButton = ({ entityType, entityId, size = 'medium' }) => {
  const dispatch = useDispatch();
  const { likes, likesCount, loading } = useSelector((state) => state.likes);
  const { user } = useSelector((state) => state.auth);
  
  // Create entity key for lookup
  const entityKey = `${entityType}:${entityId}`;
  
  // Check if entity is liked
  const isLiked = likes[entityKey] || false;
  
  // Get likes count
  const count = likesCount[entityKey] || 0;
  
  // Fetch initial like status and count
  useEffect(() => {
    if (entityId) {
      // Fetch likes count
      dispatch(fetchLikesCount({ entityType, entityId }));
      
      // Check if user has liked this entity
      if (user) {
        const likeData = {
          [`${entityType}_id`]: entityId
        };
        dispatch(checkLikeStatus(likeData));
      }
    }
  }, [dispatch, entityType, entityId, user]);
  
  const handleLike = () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please log in to like this content');
      return;
    }
    
    const likeData = {
      [`${entityType}_id`]: entityId
    };
    
    if (isLiked) {
      dispatch(unlikeEntity(likeData));
    } else {
      dispatch(likeEntity(likeData));
    }
  };
  
  return (
    <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
      <IconButton
        onClick={handleLike}
        disabled={loading}
        size={size}
        color={isLiked ? 'error' : 'default'}
      >
        {isLiked ? <Favorite /> : <FavoriteBorder />}
        {count > 0 && (
          <Typography 
            component="span" 
            sx={{ 
              ml: 0.5, 
              fontSize: size === 'small' ? '0.75rem' : '0.875rem' 
            }}
          >
            {count}
          </Typography>
        )}
      </IconButton>
    </Tooltip>
  );
};

export default LikeButton;