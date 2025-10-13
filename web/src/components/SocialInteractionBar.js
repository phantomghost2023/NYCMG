import React from 'react';
import { Box, Divider, Paper } from '@mui/material';
import FollowButton from './FollowButton';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';

const SocialInteractionBar = ({ entityType, entityId, userId }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <LikeButton entityType={entityType} entityId={entityId} />
          <ShareButton entityType={entityType} entityId={entityId} />
        </Box>
        
        {userId && (
          <FollowButton userId={userId} variant="icon" />
        )}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <CommentSection entityType={entityType} entityId={entityId} />
    </Paper>
  );
};

export default SocialInteractionBar;