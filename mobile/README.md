# NYCMG Mobile App

This is the mobile application for the NYCMG (NYC Music Growth) platform, built with React Native.

## Prerequisites

See [requirements.txt](requirements.txt) for detailed system and software requirements.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NYCMG/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install CocoaPods dependencies (iOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the Application

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web (if configured)
```bash
npm run web
```

## Development

### Folder Structure
```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── store/          # Redux store and slices
│   ├── assets/         # Images, fonts, etc.
│   └── utils/          # Utility functions
├── App.js              # Main application component
└── index.js            # Entry point
```

### Adding New Screens
1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation configuration in `App.js`
3. Import the screen component at the top of `App.js`

### State Management
The app uses Redux Toolkit for state management with slices for different features:
- `authSlice` - Authentication state
- `boroughSlice` - Borough data
- `artistSlice` - Artist data

### Navigation
The app uses React Navigation with a bottom tab navigator for main screens and a stack navigator for detailed views.

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Building for Production

### iOS
1. Update the version in `app.json`
2. Build the app:
   ```bash
   npx react-native build-ios --mode="release"
   ```

### Android
1. Update the version in `app.json`
2. Build the app:
   ```bash
   npx react-native build-android --mode="release"
   ```

## Troubleshooting

### iOS Issues
- If you encounter build issues, try cleaning the build folder:
  ```bash
  cd ios && xcodebuild clean && cd ..
  ```

### Android Issues
- If you encounter build issues, try cleaning the build folder:
  ```bash
  cd android && ./gradlew clean && cd ..
  ```

### Dependency Issues
- If you encounter dependency issues, try reinstalling node_modules:
  ```bash
  rm -rf node_modules && npm install
  ```