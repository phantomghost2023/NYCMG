# NYCMG Updated Installation Guide

This guide provides updated instructions for installing the NYCMG project with modern, supported dependencies.

## Updated Dependencies Overview

### Root Dependencies
- **lerna**: Updated from ^6.0.0 to ^8.0.0

### Backend Dependencies
- **express**: Updated from ^4.18.0 to ^4.19.0
- **helmet**: Updated from ^6.0.0 to ^7.0.0
- **dotenv**: Updated from ^16.0.0 to ^16.4.5
- **pg**: Updated from ^8.8.0 to ^8.11.0
- **sequelize**: Updated from ^6.25.0 to ^6.37.0
- **jsonwebtoken**: Updated from ^9.0.0 to ^9.0.2
- **joi**: Updated from ^17.7.0 to ^17.12.0
- **winston**: Updated from ^3.8.0 to ^3.13.0
- **sharp**: Updated from ^0.31.0 to ^0.33.0
- **nodemon**: Updated from ^2.0.20 to ^3.1.0
- **supertest**: Updated from ^6.3.0 to ^6.3.4
- **eslint**: Updated from ^8.25.0 to ^8.57.0

### Web Dependencies
- **next**: Updated from 12.3.1 to 14.2.3
- **react-redux**: Updated from ^8.0.0 to ^9.1.0
- **@reduxjs/toolkit**: Updated from ^1.8.0 to ^2.2.3
- **axios**: Updated from ^1.1.0 to ^1.6.8
- **mapbox-gl**: Updated from ^2.10.0 to ^3.3.0
- **@mui/material**: Updated from ^5.10.0 to ^5.15.15
- **@mui/icons-material**: Updated from ^5.10.0 to ^5.15.15
- **eslint-config-next**: Updated from 12.3.1 to 15.5.4
- **@testing-library/jest-dom**: Updated from ^5.16.0 to ^6.4.2
- **@testing-library/react**: Updated from ^13.4.0 to ^14.2.1

### Mobile Dependencies
- **react**: Updated from 18.1.0 to 18.2.0
- **react-native**: Updated from 0.70.0 to 0.73.0
- **react-navigation**: Replaced with @react-navigation/native (^6.1.9) and @react-navigation/stack (^6.3.20)
- **react-native-maps**: Updated from ^1.3.0 to ^1.10.0
- **react-native-vector-icons**: Updated from ^9.2.0 to ^10.0.0
- **react-redux**: Updated from ^8.0.0 to ^9.1.0
- **@reduxjs/toolkit**: Updated from ^1.8.0 to ^2.2.3
- **axios**: Updated from ^1.1.0 to ^1.6.8
- **react-native-track-player**: Updated from ^3.0.0 to ^4.0.0
- **@react-native/eslint-config**: Updated from @react-native-community/eslint-config (^2.0.0) to @react-native/eslint-config (0.82.0)
- **@babel/core**: Updated from ^7.12.9 to ^7.24.0
- **@babel/runtime**: Updated from ^7.12.5 to ^7.24.0
- **babel-jest**: Updated from ^26.6.3 to ^29.7.0
- **eslint**: Updated from ^7.32.0 to ^9.37.0
- **jest**: Updated from ^26.6.3 to ^29.7.0
- **@react-native/babel-preset**: Updated from metro-react-native-babel-preset (^0.72.0) to @react-native/babel-preset (0.82.0)
- **react-test-renderer**: Updated from 18.1.0 to 18.2.0

### Shared Dependencies
- **jest**: Updated from ^29.0.0 to ^29.7.0
- **eslint**: Updated from ^8.25.0 to ^9.37.0

## Installation Instructions

### Prerequisites
1. Node.js version 18.x or higher
2. npm version 9.x or higher (comes with Node.js)
3. Python 3.x (required for some native modules)

### Quick Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NYCMG
   ```

2. Install dependencies using the robust installation script:
   ```bash
   # Windows
   scripts\install_dependencies_robust.bat
   
   # macOS/Linux
   scripts/install_dependencies_robust.ps1
   ```

### Clean Installation (Recommended if you're having issues)
```bash
# Windows
scripts\install_dependencies_robust.bat -clean

# macOS/Linux
scripts/install_dependencies_robust.ps1 -Clean
```

### Manual Installation
If the scripts don't work, you can manually install dependencies:

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. Install web dependencies:
   ```bash
   cd web
   npm install
   cd ..
   ```

4. Install mobile dependencies:
   ```bash
   cd mobile
   npm install
   cd ..
   ```

5. Install shared dependencies:
   ```bash
   cd shared
   npm install
   cd ..
   ```

## Important Notes

### React Navigation Changes
The mobile app has been updated to use the modern React Navigation v6 instead of the deprecated React Navigation v4. If you have existing code that uses the old navigation patterns, you'll need to update it to use the new API.

### React Native Updates
The React Native version has been updated from 0.70.0 to 0.73.0. This is a significant update that includes many performance improvements and bug fixes, but may require updating some native code if you have custom native modules.

### Breaking Changes
Some dependencies have breaking changes:
1. **mapbox-gl**: Updated from v2 to v3, which includes breaking changes to the API
2. **@mui/material**: Updated to a newer version with potential styling changes
3. **React Navigation**: Completely replaced with the modern @react-navigation packages

## Troubleshooting

### If you encounter issues after updating:
1. Clear all caches:
   ```bash
   # Windows
   scripts\cleanup_dependencies.bat
   
   # macOS/Linux
   scripts/cleanup_dependencies.ps1
   ```

2. Reinstall with clean flag:
   ```bash
   # Windows
   scripts\install_dependencies_robust.bat -clean
   
   # macOS/Linux
   scripts/install_dependencies_robust.ps1 -Clean
   ```

3. Check for compatibility issues in your code with the updated dependencies

### Common Issues and Solutions

1. **Native module linking issues** (React Native):
   - Run `npx react-native run-ios` or `npx react-native run-android` to rebuild native modules

2. **Peer dependency conflicts**:
   - Use `npm install --legacy-peer-deps` if you encounter peer dependency issues

3. **Build failures**:
   - Clear the build cache: `npm run clean` in the respective directories

## Verification

After installation, verify that everything is working correctly:

1. Check that all dependencies are installed:
   ```bash
   # In each directory (backend, web, mobile, shared)
   npm list
   ```

2. Run the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Web
   cd web
   npm run dev
   
   # Mobile
   cd mobile
   npm start
   ```

3. Run tests:
   ```bash
   # In each directory
   npm test
   ```

This updated installation guide should help you successfully install the NYCMG project with modern, supported dependencies that will reduce the deprecation warnings and improve the overall stability of the project.