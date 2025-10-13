# End-to-End Testing Implementation

## Overview
This document describes the implementation of end-to-end (e2e) testing for the NYCMG mobile application. The e2e tests simulate real user interactions to ensure all features work correctly in an integrated environment.

## Technology Stack
- **Detox**: Gray box end-to-end testing framework for mobile apps
- **Jest**: Test runner and assertion library
- **iOS Simulator**: For iOS testing
- **Android Emulator**: For Android testing

## Test Structure
The e2e tests are organized by feature areas:

### Authentication Tests
Located at [authentication.e2e.js](../mobile/e2e/authentication.e2e.js)
- Welcome screen verification
- Login screen navigation
- Invalid credentials handling
- Successful authentication flow

### Navigation Tests
Located at [navigation.e2e.js](../mobile/e2e/navigation.e2e.js)
- Main tab navigation (Home, Explore, Map, Library, Profile, Settings)
- Artist profile navigation
- Playlist detail navigation

### Social Feature Tests
Located at [social.e2e.js](../mobile/e2e/social.e2e.js)
- Following/unfollowing artists
- Liking/unliking tracks
- Adding/deleting comments
- Adding/removing favorites

### Library Management Tests
Located at [library.e2e.js](../mobile/e2e/library.e2e.js)
- Creating/deleting playlists
- Adding/removing tracks from playlists
- Managing favorites

### Map Discovery Tests
Located at [map.e2e.js](../mobile/e2e/map.e2e.js)
- Map screen loading
- Borough marker visibility
- Artist marker visibility
- Navigation from markers to detail screens

### Settings Tests
Located at [settings.e2e.js](../mobile/e2e/settings.e2e.js)
- Toggling offline mode
- Changing download quality
- Managing notifications
- Toggling dark mode
- Clearing cache

## Configuration

### Detox Configuration
The Detox configuration is defined in [detox.config.js](../mobile/detox.config.js) and supports:
- iOS and Android platforms
- Debug and release builds
- Simulator and emulator devices

### Test Runner Configuration
The Jest configuration for e2e tests is defined in [config.json](../mobile/e2e/config.json) and includes:
- Custom test environment
- Test timeout settings
- Test file patterns
- Streamlined reporting

## Implementation Details

### Test IDs
All UI elements that need to be interacted with in tests have unique `testID` props. This allows Detox to locate and interact with elements reliably.

Example:
```jsx
<TouchableOpacity testID="loginButton" onPress={handleLogin}>
  <Text>Login</Text>
</TouchableOpacity>
```

### Test Patterns
The tests follow consistent patterns:
1. **Setup**: Launch app and navigate to required screen
2. **Action**: Perform user interaction
3. **Assertion**: Verify expected outcome

### Asynchronous Operations
Tests properly handle asynchronous operations using Detox's built-in waitFor functionality:
```javascript
await waitFor(element(by.id('successMessage')))
  .toBeVisible()
  .withTimeout(5000);
```

## Running Tests

### Prerequisites
1. Detox installed as a dev dependency
2. iOS Simulator or Android Emulator set up
3. Built application binaries

### Commands
```bash
# Build the app for testing
npm run test:e2e:build:android
# or for iOS
npm run test:e2e:build:ios

# Run all e2e tests
npm run test:e2e
# or for specific platform
npm run test:e2e:android
npm run test:e2e:ios
```

## Test Development Guidelines

### Adding New Tests
1. Create a new `.e2e.js` file in the [e2e](../mobile/e2e/) directory
2. Follow the existing test structure and naming conventions
3. Add meaningful test descriptions
4. Use appropriate waits for asynchronous operations

### Adding Test IDs
1. Add `testID` props to UI elements that need to be interacted with
2. Use descriptive, unique IDs
3. Follow a consistent naming convention (e.g., `screenName_elementPurpose`)

### Best Practices
1. Keep tests independent and focused
2. Test both happy paths and error cases
3. Use appropriate timeouts for async operations
4. Clean up state between tests
5. Use meaningful assertions
6. Document complex test scenarios

## Continuous Integration
The e2e tests are integrated into the CI/CD pipeline and run automatically on:
- Pull requests to main branch
- Scheduled builds
- Release builds

## Future Enhancements

### Test Coverage Expansion
1. Add tests for offline functionality
2. Add tests for push notifications
3. Add tests for audio playback
4. Add tests for file uploads

### Performance Testing
1. Add performance metrics collection
2. Add load testing scenarios
3. Add battery usage monitoring

### Cross-Platform Testing
1. Expand device coverage
2. Add tablet-specific tests
3. Add different OS version testing

### Advanced Testing Scenarios
1. Network condition testing
2. Background/foreground transitions
3. App upgrade scenarios
4. Multi-device interaction testing