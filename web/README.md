# NYCMG Web App

This is the web application for the NYCMG (NYC Music Growth) platform, built with Next.js and React.

## Prerequisites

See [requirements.txt](requirements.txt) for detailed system and software requirements.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NYCMG/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at http://localhost:3000

### Production Mode
```bash
npm run build
npm start
```

## Project Structure

```
web/
├── src/
│   ├── pages/          # Next.js pages
│   ├── components/     # React components
│   ├── store/          # Redux store and slices
│   ├── styles/         # CSS and styling files
│   ├── assets/         # Images, fonts, etc.
│   ├── utils/          # Utility functions
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── styles/             # Global styles
```

### Pages
- `pages/index.js` - Home page
- `pages/login.js` - Login page
- `pages/register.js` - Registration page
- `pages/boroughs/[id].js` - Borough detail page
- `pages/artists/[id].js` - Artist profile page

### Components
Reusable UI components are located in the `src/components/` directory.

### State Management
The app uses Redux Toolkit for state management with slices for different features:
- `authSlice` - Authentication state
- `boroughSlice` - Borough data
- `artistSlice` - Artist data

### Styling
The app uses Material-UI for components and styling. Global styles are in `src/styles/globals.css`.

## API Integration
The web app communicates with the backend API through Redux async thunks. The base API URL is configured in the shared module.

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Deployment

The app can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or a custom Node.js server.

### Deploy to Vercel
1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the Next.js framework and configure the deployment

### Deploy to Netlify
1. Build the application:
   ```bash
   npm run build
   ```
2. Configure Netlify to serve the `out` directory

### Deploy to Custom Server
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

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