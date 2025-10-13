# NYCMG Dependency Updates Summary

This document summarizes all the dependency updates made to resolve installation issues and modernize the NYCMG project.

## Issues Addressed

The project was experiencing dependency installation issues due to:
1. Outdated dependencies with deprecation warnings
2. Unsupported package versions
3. Inconsistent configurations between package.json and lerna.json

## Updates Made

### 1. Configuration Fixes
- Updated `lerna.json` to correctly reference existing project directories
- Ensured consistency between root `package.json` workspaces and `lerna.json` packages

### 2. Root Dependencies
- **lerna**: Updated from ^6.0.0 to ^8.0.0

### 3. Backend Dependencies
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

### 4. Web Dependencies
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

### 5. Mobile Dependencies
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

### 6. Shared Dependencies
- **jest**: Updated from ^29.0.0 to ^29.7.0
- **eslint**: Updated from ^8.25.0 to ^9.37.0

## New Installation Scripts

Created robust installation scripts to handle dependency installation more reliably:
1. `scripts/install_dependencies_robust.ps1` (PowerShell)
2. `scripts/install_dependencies_robust.bat` (Windows Batch)
3. `scripts/cleanup_dependencies.ps1` (PowerShell)
4. `scripts/cleanup_dependencies.bat` (Windows Batch)
5. `scripts/view_installation_logs.ps1` (PowerShell)

## Documentation Updates

1. Updated `README.md` with references to new scripts
2. Created `SCRIPTS_USAGE_GUIDE.md` with detailed usage instructions
3. Created `DEPENDENCY_FIXES_SUMMARY.md` summarizing initial fixes
4. Created `UPDATED_INSTALLATION_GUIDE.md` with modern dependency information
5. Created `DEPENDENCY_UPDATES_SUMMARY.md` (this document)

## Breaking Changes to Be Aware Of

1. **React Navigation**: Completely replaced v4 with v6, requiring code updates
2. **mapbox-gl**: Updated from v2 to v3 with API breaking changes
3. **React Native**: Updated from 0.70.0 to 0.73.0, which may require native code updates

## Benefits of These Updates

1. **Reduced Deprecation Warnings**: Updated to supported versions that don't show deprecation warnings
2. **Improved Security**: Newer versions include security fixes
3. **Better Performance**: Updated dependencies offer performance improvements
4. **Modern Features**: Access to new features in updated packages
5. **Long-term Maintainability**: Using currently supported versions

## Installation Instructions

To install with the updated dependencies:

1. **Clean Installation** (recommended):
   ```bash
   # Windows
   scripts\install_dependencies_robust.bat -clean
   
   # macOS/Linux
   scripts/install_dependencies_robust.ps1 -Clean
   ```

2. **Standard Installation**:
   ```bash
   # Windows
   scripts\install_dependencies_robust.bat
   
   # macOS/Linux
   scripts/install_dependencies_robust.ps1
   ```

These updates should resolve the dependency installation issues and provide a more stable, modern foundation for the NYCMG project.