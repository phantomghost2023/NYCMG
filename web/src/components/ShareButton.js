import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSharesCount } from '../store/shareSlice';
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Share as ShareIcon
} from '@mui/icons-material';

const ShareButton = ({ entityType, entityId, size = 'medium' }) => {
  const dispatch = useDispatch();
  const { sharesCount, loading } = useSelector((state) => state.shares);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  // Create entity key for lookup
  const entityKey = `${entityType}:${entityId}`;
  
  // Get shares count
  const count = sharesCount[entityKey] || 0;
  
  // Fetch shares count
  useEffect(() => {
    if (entityId) {
      dispatch(fetchSharesCount({ entityType, entityId }));
    }
  }, [dispatch, entityType, entityId]);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleShare = (platform) => {
    // In a real implementation, this would trigger the actual share action
    // For now, we'll just show an alert and update the count
    alert(`Sharing to ${platform} (this would open the platform's share dialog in a real app)`);
    
    // Close the menu
    handleClose();
  };
  
  return (
    <>
      <Tooltip title="Share">
        <IconButton
          onClick={handleClick}
          disabled={loading}
          size={size}
        >
          <ShareIcon />
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
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleShare('Facebook')}>Facebook</MenuItem>
        <MenuItem onClick={() => handleShare('Twitter')}>Twitter</MenuItem>
        <MenuItem onClick={() => handleShare('Instagram')}>Instagram</MenuItem>
        <MenuItem onClick={() => handleShare('TikTok')}>TikTok</MenuItem>
        <MenuItem onClick={() => handleShare('Copy Link')}>Copy Link</MenuItem>
      </Menu>
    </>
  );
};

export default ShareButton;