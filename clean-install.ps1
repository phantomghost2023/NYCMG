# Clean Installation Script for NYCMG Project
Write-Host "Starting clean installation process for NYCMG project..." -ForegroundColor Green

# Remove all node_modules directories
Write-Host "Removing node_modules directories..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\web\node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\backend\node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\shared\node_modules" -ErrorAction SilentlyContinue

# Remove package-lock.json files
Write-Host "Removing package-lock.json files..." -ForegroundColor Yellow
Remove-Item "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\package-lock.json" -ErrorAction SilentlyContinue
Remove-Item "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\web\package-lock.json" -ErrorAction SilentlyContinue
Remove-Item "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\package-lock.json" -ErrorAction SilentlyContinue
Remove-Item "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\backend\package-lock.json" -ErrorAction SilentlyContinue
Remove-Item "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\shared\package-lock.json" -ErrorAction SilentlyContinue

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Clean installation preparation complete!" -ForegroundColor Green
Write-Host "Now installing dependencies for each module..." -ForegroundColor Green

# Install shared module dependencies
Write-Host "Installing shared module dependencies..." -ForegroundColor Yellow
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\shared"
npm install eslint@9.37.0 jest@29.7.0 --legacy-peer-deps

# Install backend module dependencies
Write-Host "Installing backend module dependencies..." -ForegroundColor Yellow
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\backend"
npm install bcryptjs@2.4.3 cors@2.8.5 dotenv@16.4.5 express@4.19.0 helmet@7.0.0 joi@17.12.0 jsonwebtoken@9.0.2 multer@1.4.5-lts.1 pg@8.11.0 sequelize@6.37.0 sharp@0.33.0 winston@3.13.0 eslint@9.37.0 jest@29.7.0 nodemon@3.1.0 supertest@6.3.4 --legacy-peer-deps

# Install web module dependencies
Write-Host "Installing web module dependencies..." -ForegroundColor Yellow
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\web"
npm install next@14.2.3 react@18.2.0 react-dom@18.2.0 react-redux@9.1.0 @reduxjs/toolkit@2.2.3 axios@1.6.8 mapbox-gl@3.3.0 @mui/material@5.15.15 @mui/icons-material@5.15.15 eslint@9.37.0 eslint-config-next@15.5.4 jest@29.7.0 @testing-library/jest-dom@6.4.2 @testing-library/react@14.2.1 @testing-library/user-event@14.5.2 --legacy-peer-deps

# Install mobile module dependencies
Write-Host "Installing mobile module dependencies..." -ForegroundColor Yellow
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile"
npm install react@18.2.0 react-native@0.73.0 @react-navigation/native@7.1.18 @react-navigation/stack@7.4.9 react-native-maps@1.8.4 react-native-vector-icons@10.0.0 react-redux@9.1.0 @reduxjs/toolkit@2.2.3 axios@1.6.8 react-native-track-player@4.0.0 @babel/core@7.24.0 @babel/runtime@7.24.0 @react-native/eslint-config@0.82.0 babel-jest@29.7.0 eslint@9.37.0 jest@29.7.0 @react-native/babel-preset@0.82.0 react-test-renderer@18.2.0 --legacy-peer-deps

# Install caniuse-lite and browserslist to fix the missing './browsers' module
Write-Host "Installing caniuse-lite and browserslist..." -ForegroundColor Yellow
Set-Location "g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG"
npm install caniuse-lite browserslist --legacy-peer-deps

Write-Host "All dependencies installed successfully!" -ForegroundColor Green
Write-Host "You can now run tests for each module." -ForegroundColor Green