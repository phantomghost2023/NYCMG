import { io } from 'socket.io-client';
import { API_BASE_URL } from 'nycmg-shared';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token, userId) {
    if (this.socket && this.isConnected) {
      return;
    }

    // Create socket connection
    this.socket = io(API_BASE_URL, {
      transports: ['websocket'],
      auth: {
        token: token
      }
    });

    // Register event handlers
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Register user with the server
      this.socket.emit('register', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
      
      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          this.connect(token, userId);
        }, 1000 * this.reconnectAttempts); // Exponential backoff
      }
    });

    this.socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      // Handle incoming notification
      this.handleNotification(notification);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  handleNotification(notification) {
    // This method should be overridden by the consumer
    console.log('Notification received:', notification);
  }

  onNotification(callback) {
    this.handleNotification = callback;
  }

  isConnected() {
    return this.isConnected && this.socket;
  }
}

// Create singleton instance
const websocketClient = new WebSocketClient();

export default websocketClient;