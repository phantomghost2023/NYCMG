# Mobile App Integration Tests

This directory contains integration tests for the NYCMG mobile application. These tests verify that different components and services work together correctly.

## Test Structure

- `audioService.integration.test.js` - Tests integration between AudioService and Redux store
- `offlineService.integration.test.js` - Tests integration between OfflineService, AsyncStorage, and Redux store
- `notificationService.integration.test.js` - Tests integration between NotificationService, AsyncStorage, and Redux store
- `services.integration.test.js` - Comprehensive tests for cross-service integration

## What is Tested

### Audio Service Integration
- Interaction between AudioService and react-native-track-player
- Synchronization of playback state with Redux store
- Track management and queue handling

### Offline Service Integration
- Caching of tracks, user data, and app data
- Offline mode functionality
- Settings persistence with AsyncStorage
- Sync between offline data and Redux store

### Notification Service Integration
- Notification settings management
- Permission handling
- Notification scheduling and display
- Sync between notification settings and Redux store

### Cross-Service Integration
- Coordinated functionality between multiple services
- Error handling across service boundaries
- User preference synchronization across services

## Running Integration Tests

To run all integration tests:

```bash
npm test -- --testPathPattern=__tests__/integration
```

To run a specific integration test:

```bash
npm test __tests__/integration/audioService.integration.test.js
```

## Test Patterns

These integration tests follow these patterns:

1. **Mock external dependencies** - All external services and APIs are mocked
2. **Verify interactions** - Tests check that services correctly communicate with each other
3. **Test error scenarios** - Error handling across service boundaries is verified
4. **Validate state synchronization** - Redux store updates are verified after service operations

## Adding New Integration Tests

When adding new integration tests:

1. Create a new test file in this directory
2. Follow the naming convention `[service].integration.test.js`
3. Mock all external dependencies
4. Focus on testing interactions between components rather than individual unit functionality
5. Include error handling scenarios
6. Verify state changes in the Redux store when appropriate