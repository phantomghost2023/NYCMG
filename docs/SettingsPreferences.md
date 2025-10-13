# Settings and Preferences

## Overview
This document describes the enhanced settings and preferences implementation for the NYCMG mobile application. The settings feature provides users with comprehensive control over their app experience.

## Architecture

### Service Layer
The settings functionality is primarily handled by the [OfflineService](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\services\OfflineService.js#L3-L238), which manages persistent storage of user preferences using AsyncStorage.

### UI Layer
The [SettingsScreen](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\screens\SettingsScreen.js#L11-L423) component provides a comprehensive interface for users to manage their preferences, organized into logical sections.

## Settings Categories

### Account
- **User Information** - Displays current logged-in user
- **Logout** - Securely logs the user out of the application

### Playback
- **Offline Mode** - Enables/disables offline playback functionality
- **Auto Play** - Automatically plays the next track when current track ends
- **Download Quality** - Controls audio quality for downloaded tracks (Low, Medium, High)
- **Equalizer** - Audio equalizer presets (Default, Bass, Treble, Rock, Pop, Jazz)

### Data Usage
- **Data Saver** - Reduces data consumption by lowering audio quality and limiting background data

### Notifications
- **Enable Notifications** - Controls whether the app can send push notifications

### Appearance
- **Dark Mode** - Toggles between light and dark UI themes

### Storage
- **Clear Cache** - Removes all downloaded content and cached data

### About
- **Version** - Displays current app version
- **Terms of Service** - Link to terms of service
- **Privacy Policy** - Link to privacy policy

## Implementation Details

### OfflineService Methods
The OfflineService provides methods for managing all settings:

#### Basic Settings
1. **isOfflineMode()** / **setOfflineMode()** - Manage offline mode status
2. **getDownloadQuality()** / **setDownloadQuality()** - Manage download quality
3. **getNotificationsEnabled()** / **setNotificationsEnabled()** - Manage notifications
4. **getDarkMode()** / **setDarkMode()** - Manage dark mode preference

#### Enhanced Settings
1. **getAutoPlay()** / **setAutoPlay()** - Manage auto-play functionality
2. **getEqualizer()** / **setEqualizer()** - Manage equalizer presets
3. **getDataSaver()** / **setDataSaver()** - Manage data saver mode

#### Storage Management
1. **clearAllCache()** - Remove all cached data

### SettingsScreen Features

#### Section Organization
The settings screen is organized into logical sections with clear headings and consistent styling.

#### Interactive Controls
1. **Switches** - For boolean settings (offline mode, notifications, etc.)
2. **Button Groups** - For multi-option settings (download quality, equalizer)
3. **Action Items** - For destructive actions (logout, clear cache)

#### User Feedback
1. **Alerts** - Confirmation dialogs for destructive actions
2. **Linking** - External links for legal documents
3. **Status Messages** - Feedback for setting changes

## Data Persistence

### AsyncStorage Keys
All settings are stored using the following keys:
- **offlineMode** - Boolean string ('true'/'false')
- **downloadQuality** - String ('low'/'medium'/'high')
- **notificationsEnabled** - Boolean string ('true'/'false')
- **darkMode** - Boolean string ('true'/'false')
- **autoPlay** - Boolean string ('true'/'false')
- **equalizer** - String preset name
- **dataSaver** - Boolean string ('true'/'false')

### Default Values
Settings have sensible defaults:
- Offline Mode: false
- Download Quality: 'high'
- Notifications Enabled: true
- Dark Mode: false
- Auto Play: true
- Equalizer: 'default'
- Data Saver: false

## Integration Points

### Audio Player Integration
Settings affect audio playback:
- **Offline Mode** - Determines whether to play cached or streaming tracks
- **Download Quality** - Affects quality of downloaded tracks
- **Auto Play** - Controls automatic playback of next track
- **Equalizer** - Affects audio processing
- **Data Saver** - Reduces streaming quality

### UI Integration
Settings affect the user interface:
- **Dark Mode** - Changes color scheme throughout the app
- **Data Saver** - May affect image loading and quality

### Notification Integration
Settings affect notifications:
- **Notifications Enabled** - Controls all push notifications

## Testing

### Unit Tests
Unit tests for the enhanced settings are located in [enhancedSettings.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\enhancedSettings.test.js).

### Test Coverage
The tests cover:
1. Component rendering
2. User interactions with settings controls
3. Setting persistence and retrieval
4. External link handling
5. Confirmation dialogs
6. Error handling

## Security Considerations

### Data Storage
- Settings are stored locally using AsyncStorage
- Sensitive user data is not stored in settings
- All settings are user-specific and isolated

### Privacy
- Settings do not contain personally identifiable information
- External links open in the system browser
- No tracking or analytics in settings

## Performance Considerations

### Storage Efficiency
- Settings are stored as simple key-value pairs
- Minimal storage footprint
- Efficient read/write operations

### UI Performance
- Settings are loaded once on screen mount
- Updates are asynchronous and non-blocking
- Minimal re-renders due to efficient state management

## Future Enhancements

### Advanced Features
1. **Custom Equalizer** - Allow users to create custom equalizer presets
2. **Scheduled Dark Mode** - Automatically switch based on time of day
3. **Battery Saver** - Additional power-saving options
4. **Language Selection** - Multi-language support
5. **Accessibility Settings** - Font size, contrast, and other accessibility options

### UI/UX Improvements
1. **Settings Search** - Search functionality for finding specific settings
2. **Recently Changed** - Highlight recently modified settings
3. **Setting Descriptions** - Detailed explanations for each setting
4. **Import/Export** - Backup and restore settings

### Integration Enhancements
1. **System Integration** - Sync with system-level settings where appropriate
2. **Smart Defaults** - Adaptive settings based on usage patterns
3. **Cross-Device Sync** - Sync settings across multiple devices