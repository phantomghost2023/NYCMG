# Developer Guide

## Repository Information

The NYCMG project is hosted on GitHub at: https://github.com/phantomghost2023/NYCMG

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Development Environment](#development-environment)
5. [Code Structure](#code-structure)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

## Project Overview

NYCMG (NYC Music Guide) is a comprehensive platform for discovering and sharing NYC's vibrant music scene. The platform consists of:

- **Backend API**: Node.js/Express server with PostgreSQL database
- **Web Frontend**: Next.js web application
- **Mobile App**: React Native mobile application
- **Shared Components**: Common utilities and configurations

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Frontend  │    │   Third Party   │
│  (React Native) │    │   (Next.js)     │    │    Services     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                      ┌──────────▼──────────┐
                      │    Backend API      │
                      │   (Node.js/Express) │
                      └──────────┬──────────┘
                                 │
                      ┌──────────▼──────────┐
                      │    PostgreSQL       │
                      │     Database        │
                      └─────────────────────┘
```

### Component Architecture
- **Backend**: RESTful API with controllers, services, and models
- **Frontend**: Component-based UI with Redux state management
- **Mobile**: Native mobile experience with Redux and navigation
- **Shared**: Common utilities, types, and configurations

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT
- **Caching**: Redis
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Validation**: Joi

### Web Frontend
- **Framework**: Next.js
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **Styling**: CSS Modules, Styled Components
- **Maps**: Mapbox GL
- **Testing**: Jest, React Testing Library
- **Build Tool**: Webpack

### Mobile App
- **Framework**: React Native
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Audio**: React Native Track Player
- **Testing**: Jest, React Native Testing Library

### Shared
- **Utilities**: Common JavaScript functions
- **Types**: TypeScript interfaces and types
- **Constants**: Shared constants and configurations

## Development Environment

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Docker (for containerized development)
- PostgreSQL (or Docker container)
- Redis (or Docker container)

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/nycmg.git
cd nycmg
```

#### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install web frontend dependencies
cd web
npm install
cd ..

# Install mobile app dependencies
cd mobile
npm install
cd ..
```

#### 3. Environment Configuration
Create `.env` files in each project directory:

**Backend** (backend/.env):
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/nycmg
JWT_SECRET=your_jwt_secret_here
REDIS_URL=redis://localhost:6379
```

**Web Frontend** (web/.env):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

**Mobile App** (mobile/.env):
```env
API_URL=http://localhost:3000/api
```

#### 4. Database Setup
```bash
# Start PostgreSQL and Redis containers
docker-compose up -d

# Run database migrations
cd backend
npm run migrate
```

#### 5. Start Development Servers
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start web frontend
cd web
npm run dev

# Terminal 3: Start mobile app
cd mobile
npm start
```

## Code Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
├── tests/               # Test files
└── package.json         # Dependencies
```

### Web Frontend Structure
```
web/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   ├── store/           # Redux store
│   ├── services/        # API services
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   └── styles/          # CSS styles
├── public/              # Static assets
└── package.json         # Dependencies
```

### Mobile App Structure
```
mobile/
├── src/
│   ├── components/      # React Native components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation setup
│   ├── store/           # Redux store
│   ├── utils/           # Utility functions
│   └── assets/          # Images and other assets
├── android/             # Android native code
├── ios/                 # iOS native code
└── package.json         # Dependencies
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```javascript
// Request
{
  "username": "string",
  "email": "string",
  "password": "string"
}

// Response
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

#### POST /api/auth/login
Login existing user
```javascript
// Request
{
  "email": "string",
  "password": "string"
}

// Response
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

### User Endpoints

#### GET /api/users/profile
Get current user profile
```javascript
// Response
{
  "id": "number",
  "username": "string",
  "email": "string",
  "profilePicture": "string",
  "bio": "string"
}
```

#### PUT /api/users/profile
Update user profile
```javascript
// Request
{
  "username": "string",
  "bio": "string",
  "profilePicture": "string"
}

// Response
{
  "id": "number",
  "username": "string",
  "email": "string",
  "profilePicture": "string",
  "bio": "string"
}
```

### Track Endpoints

#### POST /api/tracks
Upload a new track
```javascript
// Request (multipart/form-data)
{
  "title": "string",
  "description": "string",
  "audioFile": "file",
  "coverArt": "file"
}

// Response
{
  "id": "number",
  "title": "string",
  "description": "string",
  "audioUrl": "string",
  "coverArtUrl": "string",
  "duration": "number",
  "createdAt": "date"
}
```

#### GET /api/tracks
Get tracks with pagination
```javascript
// Query Parameters
?page=1&limit=20&borough=manhattan&genre=hiphop

// Response
{
  "tracks": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "audioUrl": "string",
      "coverArtUrl": "string",
      "duration": "number",
      "artist": {
        "id": "number",
        "username": "string"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

## Database Schema

### Users Table
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    profile_picture_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Artists Table
```
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) UNIQUE NOT NULL,
    genre VARCHAR(50),
    bio TEXT,
    profile_picture_url TEXT,
    cover_photo_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tracks Table
```
CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    audio_file_url TEXT NOT NULL,
    duration INTEGER, -- in seconds
    genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
    borough_id INTEGER REFERENCES boroughs(id) ON DELETE SET NULL,
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Web Frontend Testing
```bash
cd web
npm test
```

### Mobile App Testing
```bash
cd mobile
npm test
```

### Test Structure
- **Unit Tests**: Individual function and component testing
- **Integration Tests**: API endpoint and service testing
- **End-to-End Tests**: User flow testing
- **Snapshot Tests**: UI component rendering tests

## Deployment

### Docker Deployment
```bash
# Build and run all services
docker-compose up -d
```

### Manual Deployment
1. Build backend:
   ```bash
   cd backend
   npm run build
   ```

2. Build web frontend:
   ```bash
   cd web
   npm run build
   ```

3. Deploy mobile app:
   ```bash
   cd mobile
   # Follow platform-specific deployment guides
   ```

### Environment Variables for Production
- **NODE_ENV**: production
- **DATABASE_URL**: Production database connection string
- **JWT_SECRET**: Secure production secret
- **REDIS_URL**: Production Redis connection string

## Contributing

### Git Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Write tests
5. Commit changes
6. Push to fork
7. Create pull request

### Code Style
- Follow ESLint configuration
- Use consistent naming conventions
- Write clear, descriptive comments
- Keep functions small and focused
- Use TypeScript for type safety

### Pull Request Guidelines
- Include a clear description of changes
- Reference related issues
- Include tests for new functionality
- Ensure all tests pass
- Follow code review feedback

### Issue Reporting
- Use issue templates
- Provide reproduction steps
- Include environment information
- Add screenshots when relevant
- Check for existing issues

## Best Practices

### Backend Best Practices
- Use async/await for database operations
- Implement proper error handling
- Validate all input data
- Use middleware for common functionality
- Implement rate limiting
- Log important events

### Frontend Best Practices
- Use React hooks appropriately
- Implement proper state management
- Optimize component rendering
- Handle loading and error states
- Use responsive design
- Implement accessibility features

### Mobile Best Practices
- Optimize for performance
- Handle different screen sizes
- Implement offline functionality
- Use native components when possible
- Optimize battery usage
- Follow platform guidelines

## Troubleshooting

### Common Development Issues

#### Database Connection Errors
- Verify PostgreSQL is running
- Check DATABASE_URL environment variable
- Ensure correct credentials
- Check firewall settings

#### Dependency Installation Failures
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json
- Reinstall dependencies
- Check Node.js version compatibility

#### API Endpoint Errors
- Check server logs
- Verify endpoint URLs
- Test with API client (Postman, curl)
- Check authentication tokens

### Debugging Tips
- Use console.log for debugging
- Enable detailed logging
- Use development tools (React DevTools, Redux DevTools)
- Check browser console for errors
- Use debugging breakpoints

## Security Considerations

### Authentication Security
- Use HTTPS in production
- Implement proper password hashing
- Use secure JWT tokens
- Implement token refresh mechanisms
- Validate user sessions

### Data Security
- Sanitize user input
- Use parameterized queries
- Implement proper authorization
- Encrypt sensitive data
- Regularly update dependencies

### API Security
- Implement rate limiting
- Use CORS appropriately
- Validate API requests
- Implement proper error handling
- Monitor for suspicious activity

This guide provides a comprehensive overview of the NYCMG platform for developers. For specific implementation details, refer to the codebase and inline documentation.