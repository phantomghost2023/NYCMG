const { createNotification } = require('./notification.service');

// Store connected clients
const connectedClients = new Map();
let io;

// Initialize WebSocket server
const initWebSocketServer = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user with their socket
    socket.on('register', (userId) => {
      connectedClients.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove user from connected clients
      for (const [userId, socketId] of connectedClients.entries()) {
        if (socketId === socket.id) {
          connectedClients.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

// Send notification to a specific user
const sendNotificationToUser = (userId, notificationData) => {
  const socketId = connectedClients.get(userId);
  if (socketId && io) {
    // Emit the notification to the specific user
    io.to(socketId).emit('notification', notificationData);
    return true;
  }
  return false;
};

// Send notification to all connected users
const broadcastNotification = (notificationData) => {
  if (io) {
    io.emit('notification', notificationData);
  }
};

// Create and send a notification
const createAndSendNotification = async (userId, notificationData) => {
  try {
    // Create notification in database
    const notification = await createNotification({
      user_id: userId,
      ...notificationData
    });

    // Send real-time notification
    sendNotificationToUser(userId, notification);

    return notification;
  } catch (error) {
    console.error('Failed to create and send notification:', error);
    throw error;
  }
};

module.exports = {
  initWebSocketServer,
  sendNotificationToUser,
  broadcastNotification,
  createAndSendNotification,
  connectedClients
};