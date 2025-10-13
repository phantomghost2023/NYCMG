import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../store/followSlice';
import { Button, IconButton, Tooltip } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';

const FollowButton = ({ userId, variant = 'button' }) => {
  const dispatch = useDispatch();
  const { followingStatus, loading } = useSelector((state) => state.follows);
  const { user } = useSelector((state) => state.auth);
  
  // Check if current user is following this user
  const isFollowing = followingStatus[userId] || false;
  
  // Prevent user from following themselves
  const isSelf = user && user.id === userId;
  
  const handleFollow = () => {
    if (isFollowing) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };
  
  if (isSelf) {
    return null;
  }
  
  if (variant === 'icon') {
    return (
      <Tooltip title={isFollowing ? 'Unfollow' : 'Follow'}>
        <IconButton
          onClick={handleFollow}
          disabled={loading}
          color={isFollowing ? 'primary' : 'default'}
        >
          {isFollowing ? <PersonRemove /> : <PersonAdd />}
        </IconButton>
      </Tooltip>
    );
  }
  
  return (
    <Button
      variant={isFollowing ? 'outlined' : 'contained'}
      onClick={handleFollow}
      disabled={loading}
      startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
      size="small"
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};

export default FollowButton;