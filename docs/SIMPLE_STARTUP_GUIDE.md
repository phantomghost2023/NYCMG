# NYCMG Simple Startup Guide

This guide provides a step-by-step approach to get the NYCMG project running without complex dependency conflicts.

## Prerequisites

1. Node.js v16.x or higher
2. PostgreSQL database
3. Git

## Step 1: Clean Start

1. **Backup your current project** (if you want to keep any changes)
2. **Delete the current project folder**
3. **Re-clone the repository** (or create a fresh copy)

## Step 2: Manual Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a fresh package.json:
   ```bash
   npm init -y
   ```

3. Install backend dependencies one by one:
   ```bash
   npm install express cors helmet dotenv pg sequelize jsonwebtoken bcryptjs joi winston multer sharp
   npm install --save-dev nodemon jest supertest eslint
   ```

4. Verify installation:
   ```bash
   dir node_modules\sequelize
   dir node_modules\pg
   ```

## Step 3: Manual Web Setup

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Create a fresh package.json:
   ```bash
   npm init -y
   ```

3. Install web dependencies:
   ```bash
   npm install next react react-dom react-redux @reduxjs/toolkit axios @mui/material @mui/icons-material
   npm install --save-dev eslint
   ```

## Step 4: Manual Mobile Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Create a fresh package.json:
   ```bash
   npm init -y
   ```

3. Install mobile dependencies:
   ```bash
   npm install react-native @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack @reduxjs/toolkit react-redux axios
   npm install --save-dev @react-native-community/cli jest eslint
   ```

## Step 5: Environment Setup

1. Create `.env` files in each module directory with the required environment variables
2. Set up your PostgreSQL database
3. Run database migrations (if applicable)

## Step 6: Running the Application

1. **Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Web**:
   ```bash
   cd web
   npm run dev
   ```

3. **Mobile**:
   ```bash
   cd mobile
   npm start
   ```

## Troubleshooting Tips

1. **If you encounter "Invalid Version" errors**:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json
   - Reinstall with `--legacy-peer-deps`

2. **If you encounter permission errors**:
   - Use `sudo` on macOS/Linux (not recommended)
   - Configure npm to use a different directory

3. **If you encounter network issues**:
   - Try using a different npm registry
   - Increase timeout settings

## Alternative Approach: Docker

Consider using Docker to eliminate local environment conflicts:

1. Create Dockerfiles for each module
2. Use Docker Compose to manage all services
3. This approach isolates dependencies and eliminates conflicts

## Quick Verification Script

After installation, run this to verify everything is working:

```bash
# Check backend
cd backend
node -e "require('sequelize'); console.log('Sequelize OK'); require('pg'); console.log('PG OK');"

# Check web
cd ../web
node -e "require('react'); console.log('React OK'); require('next'); console.log('Next.js OK');"

# Check mobile
cd ../mobile
node -e "require('react-native'); console.log('React Native OK');"
```

This approach should get you up and running without the dependency conflicts you've been experiencing.