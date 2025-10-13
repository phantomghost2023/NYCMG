# Push Notifications Implementation

## Overview
This document describes the push notification implementation for the NYCMG mobile application. The implementation uses Firebase Cloud Messaging (FCM) as the push notification service.

## Architecture

### Notification Service
The [NotificationService](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\services\NotificationService.js#L3-L178) is the core component responsible for handling all notification-related functionality:

1. **Initialization** - Sets up the notification service and requests permissions
2. **Permission Management** - Handles notification permissions
3. **Device Token Management** - Gets and manages FCM device tokens
4. **Topic Subscription** - Allows users to subscribe to topics
5. **Notification Display** - Shows notifications to the user
6. **Notification Handling** - Processes incoming notifications

### Integration Points

#### App.js
The main application file initializes the notification service and sets up handlers for incoming notifications:

```javascript
useEffect(() => {
  // Initialize notification service
  NotificationService.initialize();
  
  // Set up notification handlers
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    NotificationService.handlePushNotification(remoteMessage);
  });
  
  // Clean up handlers
  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [dispatch]);
```

#### Notification Handling
The service handles three types of notifications:
1. **Foreground Notifications** - When the app is open
2. **Background Notifications** - When the app is in the background
3. **Quit State Notifications** - When the app is closed

## Implementation Details

### Dependencies
The implementation requires the following Firebase dependencies:
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### Android Setup
1. Add google-services.json to android/app/
2. Update android/build.gradle:
```gradle
dependencies {
  classpath 'com.google.gms:google-services:4.3.15'
}
```

3. Update android/app/build.gradle:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
  implementation 'com.google.firebase:firebase-messaging:23.1.2'
}
```

### iOS Setup
1. Add GoogleService-Info.plist to iOS project
2. Update ios/Podfile:
```ruby
pod 'Firebase/Messaging', '~> 10.12.0'
```

3. Run `cd ios && pod install`

### Notification Service Methods

#### initialize()
Initializes the notification service and requests permissions from the user.

#### requestPermissions()
Requests notification permissions from the user and handles the response.

#### getDeviceToken()
Retrieves the FCM device token for the current device.

#### subscribeToTopic(topic)
Subscribes the device to a specific topic for targeted notifications.

#### unsubscribeFromTopic(topic)
Unsubscribes the device from a specific topic.

#### showNotification(title, body, data)
Displays a local notification to the user.

#### handlePushNotification(notification)
Handles incoming push notifications when the app is in the foreground.

#### handleNotificationTap(notification)
Handles notification taps when the app is in the foreground.

#### handleBackgroundNotificationTap(notification)
Handles notification taps when the app is in the background or quit state.

## Usage Examples

### Sending Notifications
Notifications can be sent through the Firebase Console or via the FCM HTTP API:

```javascript
// Example FCM payload
{
  "to": "DEVICE_TOKEN",
  "notification": {
    "title": "New Track Available",
    "body": "Check out the latest track from your favorite artist"
  },
  "data": {
    "type": "new_track",
    "track_id": "12345"
  }
}
```

### Topic Subscription
Users can subscribe to topics for targeted notifications:

```javascript
// Subscribe to notifications for a specific artist
await NotificationService.subscribeToTopic(`artist_${artistId}`);

// Subscribe to notifications for a specific borough
await NotificationService.subscribeToTopic(`borough_${boroughId}`);
```

### Handling Notification Data
The service can handle custom data in notifications to navigate to specific content:

```javascript
// In NotificationService.js
async handlePushNotification(notification) {
  // Show notification
  await this.showNotification(
    notification.notification.title,
    notification.notification.body,
    notification.data
  );
  
  // Navigate based on data
  if (notification.data.type === 'new_track') {
    // Navigate to track screen
    navigation.navigate('Track', { trackId: notification.data.track_id });
  }
}
```

## Testing

### Unit Tests
Unit tests for the NotificationService are located in [NotificationService.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\NotificationService.test.js).

### Manual Testing
1. Send test notifications through Firebase Console
2. Verify notification display in foreground
3. Verify notification handling in background
4. Test topic subscriptions
5. Test permission requests

## Future Enhancements

### Rich Notifications
- Add support for images in notifications
- Implement action buttons in notifications
- Add support for notification categories

### Notification Preferences
- Allow users to customize notification types
- Implement notification scheduling
- Add do-not-disturb functionality

### Analytics
- Track notification open rates
- Monitor user engagement with notifications
- Implement A/B testing for notifications

## Troubleshooting

### Common Issues

1. **Notifications not showing on iOS**
   - Ensure proper entitlements are configured
   - Check APNs certificate configuration
   - Verify background modes are enabled

2. **Notifications not showing on Android**
   - Verify google-services.json is correctly placed
   - Check manifest permissions
   - Ensure proper Firebase setup

3. **Permission issues**
   - Handle permission denial gracefully
   - Provide clear instructions to users
   - Implement permission request retry logic

### Debugging
Use the Firebase Console to send test messages and verify device token registration. Enable debug mode in Firebase to see detailed logs.