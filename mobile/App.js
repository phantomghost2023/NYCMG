import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import { store } from './src/store';
import { loadUserFromStorage } from './src/store/authSlice';
import { setupPlayer } from './src/services/AudioService';
import NotificationService from './src/services/NotificationService';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';

// Main app component with authentication check
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize the TrackPlayer
    setupPlayer();
    
    // Initialize notification service
    NotificationService.initialize();
    
    // Set up notification handlers
    // In a real implementation with Firebase:
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   NotificationService.handlePushNotification(remoteMessage);
    // });
    
    // const backgroundUnsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
    //   NotificationService.handleBackgroundNotificationTap(remoteMessage);
    // });
    
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       NotificationService.handleBackgroundNotificationTap(remoteMessage);
    //     }
    //   });
    
    // Load user from storage on app start
    dispatch(loadUserFromStorage());
    
    // Cleanup function
    return () => {
      TrackPlayer.destroy();
      // if (unsubscribe) unsubscribe();
      // if (backgroundUnsubscribe) backgroundUnsubscribe();
    };
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;