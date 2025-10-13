import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  addNotification
} from '../store/notificationSlice';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const {
    notifications,
    unreadCount,
    loading,
    error
  } = useSelector((state) => state.notifications);

  const [open, setOpen] = useState(false);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications({ limit: 10, offset: 0 }));
    }
  }, [open, dispatch]);

  // Simulate receiving real-time notifications (in a real app, this would come from WebSocket)
  useEffect(() => {
    // This is just for demonstration - in a real app, you would connect to WebSocket
    const simulateRealTimeNotification = () => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const types = ['track_upload', 'new_follower', 'comment', 'like'];
        const messages = [
          'New track uploaded by your favorite artist',
          'Someone followed you',
          'New comment on your track',
          'Your track was liked'
        ];
        
        const randomIndex = Math.floor(Math.random() * types.length);
        
        const newNotification = {
          id: Date.now().toString(),
          type: types[randomIndex],
          title: 'New Notification',
          message: messages[randomIndex],
          is_read: false,
          created_at: new Date().toISOString()
        };
        
        dispatch(addNotification(newNotification));
      }
    };

    if (open) {
      const interval = setInterval(simulateRealTimeNotification, 10000);
      return () => clearInterval(interval);
    }
  }, [open, dispatch]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'track_upload':
        return '🎵';
      case 'new_follower':
        return '👤';
      case 'comment':
        return '💬';
      case 'like':
        return '👍';
      case 'mention':
        return '@';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'track_upload':
        return 'primary';
      case 'new_follower':
        return 'success';
      case 'comment':
        return 'info';
      case 'like':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleToggle}
          size="large"
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      {open && (
        <Paper
          sx={{
            position: 'absolute',
            top: 50,
            right: 0,
            width: 400,
            maxHeight: 500,
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: 3
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClick={handleToggle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {notifications.length > 0 && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                {unreadCount} unread
              </Typography>
              <Button
                size="small"
                startIcon={<MarkEmailReadIcon />}
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            </Box>
          )}

          {loading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Loading notifications...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error">Error: {error}</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'textSecondary', mb: 2 }} />
              <Typography color="textSecondary">No notifications</Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: notification.is_read ? 'inherit' : 'action.selected',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h5" sx={{ mr: 1 }}>
                            {getNotificationIcon(notification.type)}
                          </Typography>
                          <Chip
                            label={notification.type.replace('_', ' ')}
                            size="small"
                            color={getNotificationColor(notification.type)}
                            variant="outlined"
                          />
                        </Box>
                        <Box>
                          {!notification.is_read && (
                            <IconButton
                              size="small"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <MarkEmailReadIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(notification.id)}
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textPrimary">
                              {notification.message}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="textSecondary">
                              {new Date(notification.created_at).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default NotificationPanel;