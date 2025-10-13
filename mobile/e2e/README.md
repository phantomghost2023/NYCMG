# End-to-End Testing for NYCMG Mobile App

## Overview
This directory contains end-to-end tests for the NYCMG mobile application using Detox. The tests simulate real user interactions with the app to ensure all features work correctly in an integrated environment.

## Test Structure
- `authentication.e2e.js` - Tests for login and registration flows
- `navigation.e2e.js` - Tests for app navigation between screens
- `social.e2e.js` - Tests for social features (following, liking, commenting)
- `library.e2e.js` - Tests for library management (playlists, favorites)
- `map.e2e.js` - Tests for map-based discovery features
- `settings.e2e.js` - Tests for settings and preferences

## Prerequisites
1. Detox installed as a dev dependency
2. iOS Simulator or Android Emulator set up
3. Built application binaries (APK for Android, APP for iOS)

## Configuration
The Detox configuration is defined in `detox.config.js` with support for both iOS and Android platforms in debug and release modes.

## Running Tests
```bash
# Build the app for testing
npx detox build -c ios.sim.debug
# or for Android
npx detox build -c android.emu.debug

# Run the tests
npx detox test -c ios.sim.debug
# or for Android
npx detox test -c android.emu.debug
```

## Test Development
When adding new e2e tests, make sure to:
1. Add unique test IDs to UI elements in the React Native components
2. Follow the existing test patterns
3. Test both happy paths and error cases
4. Keep tests independent and focused on specific user flows

## Test IDs
All UI elements that need to be interacted with in tests should have unique `testID` props. For example:
```jsx
<TouchableOpacity testID="loginButton" onPress={handleLogin}>
  <Text>Login</Text>
</TouchableOpacity>
```

## Best Practices
1. Use meaningful test descriptions
2. Keep tests focused on specific user scenarios
3. Use appropriate waits for asynchronous operations
4. Clean up state between tests
5. Test both positive and negative cases