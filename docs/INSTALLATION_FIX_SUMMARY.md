# NYCMG Installation Fix Summary

## Current Status

The installation of dependencies for the NYCMG project is encountering several issues:

1. **Long Installation Time**: The installation process is taking an excessive amount of time due to the large number of dependencies across multiple modules.

2. **Dependency Conflicts**: There are conflicts between different package versions, particularly with caniuse-lite which is causing test failures.

3. **Lerna Issues**: Lerna is having problems with missing dependencies like handlebars and color-support.

4. **Permission Issues**: There are permission issues when trying to remove directories, indicated by ENOTEMPTY errors.

## Root Causes

1. **Complex Monorepo Structure**: The project uses a monorepo structure with four interconnected modules (web, mobile, backend, shared), each with its own dependencies.

2. **Outdated Dependencies**: Some dependencies are outdated and have known issues or conflicts with newer versions of Node.js.

3. **Corrupted Installation**: Previous failed installations may have left corrupted files or directories that are causing conflicts.

## Recommended Solutions

### 1. Clean Installation Process

```bash
# Remove all node_modules directories
rm -rf node_modules
rm -rf web/node_modules
rm -rf mobile/node_modules
rm -rf backend/node_modules
rm -rf shared/node_modules

# Remove package-lock.json files
rm package-lock.json
rm web/package-lock.json
rm mobile/package-lock.json
rm backend/package-lock.json
rm shared/package-lock.json

# Clear npm cache
npm cache clean --force
```

### 2. Install Dependencies Individually

Instead of installing all dependencies at once, install them for each module separately:

```bash
# Install shared module dependencies
cd shared
npm install eslint@9.37.0 jest@29.7.0 --legacy-peer-deps

# Install backend module dependencies
cd ../backend
npm install bcryptjs@2.4.3 cors@2.8.5 dotenv@16.4.5 express@4.19.0 helmet@7.0.0 joi@17.12.0 jsonwebtoken@9.0.2 multer@1.4.5-lts.1 pg@8.11.0 sequelize@6.37.0 sharp@0.33.0 winston@3.13.0 eslint@9.37.0 jest@29.7.0 nodemon@3.1.0 supertest@6.3.4 --legacy-peer-deps

# Install web module dependencies
cd ../web
npm install next@14.2.3 react@18.2.0 react-dom@18.2.0 react-redux@9.1.0 @reduxjs/toolkit@2.2.3 axios@1.6.8 mapbox-gl@3.3.0 @mui/material@5.15.15 @mui/icons-material@5.15.15 eslint@9.37.0 eslint-config-next@15.5.4 jest@29.7.0 @testing-library/jest-dom@6.4.2 @testing-library/react@14.2.1 @testing-library/user-event@14.5.2 --legacy-peer-deps

# Install mobile module dependencies
cd ../mobile
npm install react@18.2.0 react-native@0.73.0 @react-navigation/native@7.1.18 @react-navigation/stack@7.4.9 react-native-maps@1.8.4 react-native-vector-icons@10.0.0 react-redux@9.1.0 @reduxjs/toolkit@2.2.3 axios@1.6.8 react-native-track-player@4.0.0 @babel/core@7.24.0 @babel/runtime@7.24.0 @react-native/eslint-config@0.82.0 babel-jest@29.7.0 eslint@9.37.0 jest@29.7.0 @react-native/babel-preset@0.82.0 react-test-renderer@18.2.0 --legacy-peer-deps
```

### 3. Fix caniuse-lite Issue

The caniuse-lite issue causing test failures can be fixed by installing the package directly:

```bash
# Install caniuse-lite and browserslist to fix the missing './browsers' module
npm install caniuse-lite browserslist --legacy-peer-deps
```

### 4. Use Appropriate Lerna Version

Use Lerna version 6.6.2 which is known to work well with this project:

```bash
# Install Lerna globally
npm install -g lerna@6.6.2

# Bootstrap the project
lerna bootstrap --legacy-peer-deps
```

## Alternative Approach: Use Yarn Workspaces

If npm continues to have issues, consider switching to Yarn workspaces which may handle the monorepo structure more efficiently:

1. Install Yarn globally:
   ```bash
   npm install -g yarn
   ```

2. Update package.json to use workspaces:
   ```json
   {
     "workspaces": [
       "web",
       "mobile",
       "backend",
       "shared"
     ]
   }
   ```

3. Install dependencies:
   ```bash
   yarn install
   ```

## Testing After Installation

Once the dependencies are installed, run tests for each module:

```bash
# Test shared module
cd shared
npm test

# Test backend module
cd ../backend
npm test

# Test web module
cd ../web
npm test

# Test mobile module
cd ../mobile
npm test
```

## Additional Recommendations

1. **Update Node.js**: Consider updating to the latest LTS version of Node.js for better compatibility.

2. **Use .nvmrc**: Create a .nvmrc file to specify the Node.js version for the project.

3. **Regular Maintenance**: Regularly update dependencies to avoid accumulation of outdated packages.

4. **CI/CD Pipeline**: Set up a CI/CD pipeline to automatically test dependency updates.

By following these steps, you should be able to resolve the installation issues and get the NYCMG project running properly.