# NYCMG - NYC Music Guide

[![CI/CD](https://github.com/phantomghost2023/NYCMG/actions/workflows/ci.yml/badge.svg)](https://github.com/phantomghost2023/NYCMG/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.x-blue.svg)](https://nodejs.org/)

NYCMG (NYC Music Guide) is a comprehensive platform for discovering and sharing NYC's vibrant music scene. Built with modern web technologies, NYCMG connects artists with fans, showcases local talent, and provides tools for music discovery by borough and genre.

**STATUS: Development Complete - Ready for Production Deployment**

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### For Music Lovers
- **Borough-Based Discovery**: Explore NYC's music scene by borough
- **Artist Profiles**: Discover detailed information about local artists
- **Music Streaming**: Listen to tracks directly on the platform
- **Social Features**: Follow artists, like tracks, and comment on music
- **Advanced Search**: Find music by genre, borough, artist, or keyword
- **Personalized Recommendations**: Get suggestions based on your listening habits

### For Artists
- **Easy Upload**: Simple interface for uploading tracks and albums
- **Profile Management**: Create and customize your artist profile
- **Audience Engagement**: Connect with fans through comments and social features
- **Analytics**: Track your plays, likes, and follower growth
- **Borough Representation**: Showcase your connection to specific NYC boroughs

### Technical Features
- **Real-time Notifications**: WebSocket-powered live updates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Capability**: Mobile app supports offline listening
- **Scalable Architecture**: Built to handle growth and high traffic
- **Comprehensive API**: RESTful API for third-party integrations

## Architecture

NYCMG follows a modern microservices-inspired architecture within a monorepo structure:

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

## Technology Stack

### Backend
- **Runtime**: Node.js 18.x/20.x
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT
- **Caching**: Redis
- **Real-time**: Socket.IO
- **Logging**: Winston
- **Testing**: Jest, Supertest

### Web Frontend
- **Framework**: Next.js 14
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **Maps**: Mapbox GL
- **Styling**: CSS Modules, Styled Components
- **Testing**: Jest, React Testing Library

### Mobile App
- **Framework**: React Native 0.73
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Audio**: React Native Track Player
- **Testing**: Jest, React Native Testing Library

### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana, Loki, Tempo
- **Deployment**: Multiple environment support

### Shared Components
- **Utilities**: Common JavaScript functions
- **Types**: Shared TypeScript interfaces
- **Constants**: Application-wide constants
- **API Client**: Shared API service

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Docker (for containerized development)
- PostgreSQL (or use Docker container)
- Redis (or use Docker container)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/phantomghost2023/NYCMG.git
   cd NYCMG
   ```

2. **Install dependencies:**
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

3. **Set up environment variables:**
   Create `.env` files in each project directory:
   
   **Backend** (`backend/.env`):
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/nycmg
   JWT_SECRET=your_jwt_secret_here
   REDIS_URL=redis://localhost:6379
   ```
   
   **Web Frontend** (`web/.env`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```
   
   **Mobile App** (`mobile/.env`):
   ```env
   API_URL=http://localhost:3000/api
   ```

4. **Start development services:**
   ```bash
   # Start PostgreSQL and Redis containers
   docker-compose up -d
   ```

5. **Run database migrations:**
   ```bash
   cd backend
   npm run migrate
   cd ..
   ```

6. **Start development servers:**
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

## Project Structure

```
NYCMG/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   ├── tests/               # Backend tests
│   └── package.json         # Backend dependencies
├── web/                     # Web frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS styles
│   ├── public/              # Static assets
│   └── package.json         # Web dependencies
├── mobile/                  # Mobile application
│   ├── src/
│   │   ├── components/      # React Native components
│   │   ├── screens/         # Screen components
│   │   ├── navigation/      # Navigation setup
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Images and other assets
│   ├── android/             # Android native code
│   ├── ios/                 # iOS native code
│   └── package.json         # Mobile dependencies
├── shared/                  # Shared code and utilities
│   ├── constants/           # Shared constants
│   ├── types/               # TypeScript types
│   ├── utils/               # Shared utilities
│   └── package.json         # Shared dependencies
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
├── monitoring/              # Monitoring configurations
├── docker-compose.yml       # Docker Compose configuration
└── package.json             # Root dependencies
```

## Development

### Code Quality
- **ESLint**: Code linting for all projects
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Commitlint**: Commit message validation

### Branching Strategy
- **main**: Production-ready code
- **develop**: Development branch
- **feature/**: Feature branches
- **hotfix/**: Hotfix branches
- **release/**: Release branches

### Development Workflow
1. Create a feature branch from `develop`
2. Implement your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Create a pull request to `develop`
6. Code review and merge

## Testing

### Test Structure
- **Unit Tests**: Individual function and component testing
- **Integration Tests**: API endpoint and service testing
- **End-to-End Tests**: User flow testing
- **Performance Tests**: Component rendering performance testing
- **Snapshot Tests**: UI component rendering tests

### Running Tests
```bash
# Run all tests
npm test

# Run backend tests
cd backend
npm test

# Run web frontend tests
cd web
npm test

# Run mobile app tests
cd mobile
npm test

# Run performance tests
cd mobile
npx jest --testMatch='**/*.perf-test.js'
```

### Test Coverage
- Backend: >90%
- Web Frontend: >85%
- Mobile App: >80%

## Deployment

### Docker Deployment
```bash
# Build and run all services
docker-compose up -d
```

### Environment-Specific Deployment
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

### Deployment Scripts
- `scripts/deploy-backend.sh`: Deploy backend service
- `scripts/deploy-web.sh`: Deploy web frontend
- `scripts/deploy-all.sh`: Deploy all services

### Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboard
- **Loki**: Log aggregation
- **Tempo**: Distributed tracing

## Documentation

### User Documentation
- [User Guide](docs/user-guide.md): Complete guide for end users
- [FAQ](docs/faq.md): Frequently asked questions and troubleshooting

### Developer Documentation
- [Developer Guide](docs/developer-guide.md): Technical documentation for developers
- [API Reference](docs/api-reference.md): Complete API documentation
- [Deployment Guide](docs/deployment-guide.md): Deployment instructions
- [Monitoring Guide](docs/monitoring-guide.md): Monitoring setup and configuration
- [Backup & Recovery Guide](docs/backup-recovery-guide.md): Backup and disaster recovery procedures

### Internal Documentation
- [Task List](docs/TASK_LIST.md): Project task tracking
- [Technical Architecture](docs/technical-architecture.md): Detailed architecture documentation
- [Database Schema](docs/database-schema.md): Database design documentation

## Contributing

We welcome contributions to NYCMG! Here's how you can help:

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Commit your changes
6. Push to your fork
7. Create a pull request

### Code Style
- Follow the existing code style
- Use meaningful variable and function names
- Write clear, concise comments
- Keep functions small and focused
- Write unit tests for new functionality

### Pull Request Guidelines
- Include a clear description of changes
- Reference related issues
- Include tests for new functionality
- Ensure all tests pass
- Follow code review feedback

### Reporting Issues
- Use the issue templates
- Provide reproduction steps
- Include environment information
- Add screenshots when relevant
- Check for existing issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped build NYCMG
- Inspired by NYC's incredible music scene
- Built with modern web technologies for the best user experience

---

*NYCMG - Celebrating NYC's Music Scene*