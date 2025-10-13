# NYCMG Web Application

The web frontend for the NYC Music Guide platform, built with Next.js and Material-UI.

## Features

### Music Discovery
- **Map-Based Discovery**: Interactive map showing artists and venues across NYC boroughs
- **Search**: Advanced search functionality for tracks, artists, and albums
- **Borough Exploration**: Dedicated pages for each NYC borough

### Social Features
- **User Profiles**: Customizable profiles with activity feeds
- **Following System**: Follow artists and other users
- **Social Interactions**: Like, comment, and share functionality

### Music Library
- **Personal Library**: Save favorite tracks, albums, and playlists
- **Playlist Management**: Create and manage custom playlists
- **Listening History**: Track previously played music

### Content Creation
- **Track Upload**: Artists can upload their music
- **Profile Customization**: Customize artist profiles

### Admin Dashboard
- **User Management**: Admin tools for managing user accounts
- **Content Moderation**: Review and moderate reported content
- **Analytics & Reporting**: Platform statistics and insights

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Next.js pages
├── store/          # Redux store and slices
├── styles/         # Global styles
└── services/       # API service functions
```

## Testing
```bash
npm test
```

## Deployment
The application is containerized with Docker and can be deployed using the provided Dockerfile.

## Environment Variables
Create a `.env.local` file in the root directory to configure environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

## Troubleshooting

### Build Issues
- If you encounter build issues, try cleaning the build cache:
  ```bash
  rm -rf .next
  npm run build
  ```

### Dependency Issues
- If you encounter dependency issues, try reinstalling node_modules:
  ```bash
  rm -rf node_modules && npm install
  ```