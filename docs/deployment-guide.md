# Deployment Guide

This document provides instructions for deploying the NYCMG application to various environments.

## Overview

The NYCMG application consists of three main components that can be deployed independently or together:

1. **Backend API** - Node.js/Express server
2. **Web Frontend** - Next.js web application
3. **Mobile App** - React Native mobile application

## Prerequisites

Before deploying, ensure you have:
- Node.js 18.x or 20.x installed
- Docker (optional, for containerized deployment)
- Appropriate cloud credentials (AWS, Google Cloud, etc.)
- Database access (PostgreSQL for production)
- Environment variables configured

## Backend API Deployment

### Environment Variables

Create a `.env.production` file in the `backend` directory:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_jwt_secret_here
BCRYPT_SALT_ROUNDS=10
REDIS_URL=redis://localhost:6379
```

### Deployment Options

#### 1. Traditional Deployment

```bash
cd backend
npm install --production
npm start
```

#### 2. Docker Deployment

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
cd backend
docker build -t nycmg-backend .
docker run -p 3000:3000 nycmg-backend
```

#### 3. PM2 Deployment

```bash
cd backend
npm install -g pm2
pm2 start src/index.js --name nycmg-backend
pm2 startup
pm2 save
```

## Web Frontend Deployment

### Environment Variables

Create a `.env.production` file in the `web` directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### Deployment Options

#### 1. Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### 2. Traditional Deployment

```bash
cd web
npm install
npm run build
npm start
```

#### 3. Docker Deployment

Create `web/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
cd web
docker build -t nycmg-web .
docker run -p 3000:3000 nycmg-web
```

#### 4. Static Export

```bash
cd web
npm install
npm run build
npm run export
```

The static files will be in the `out` directory.

## Mobile App Deployment

### Environment Variables

Create a `.env.production` file in the `mobile` directory:

```env
API_URL=https://your-backend-url.com/api
```

### Android Deployment

#### 1. Generate Signed APK

```bash
cd mobile
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
cd android
./gradlew assembleRelease
```

#### 2. Generate App Bundle (Recommended for Play Store)

```bash
cd mobile/android
./gradlew bundleRelease
```

### iOS Deployment

#### 1. Using Xcode

1. Open `mobile/ios/NYCMG.xcworkspace` in Xcode
2. Select your development team
3. Set scheme to Release
4. Build and archive

#### 2. Using Command Line

```bash
cd mobile
npx react-native run-ios --configuration Release
```

## Docker Compose Deployment

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/nycmg
    depends_on:
      - db
      - redis

  web:
    build: ./web
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3000/api
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=nycmg
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

## Kubernetes Deployment

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nycmg-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nycmg-backend
  template:
    metadata:
      labels:
        app: nycmg-backend
    spec:
      containers:
      - name: backend
        image: nycmg-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"

---
apiVersion: v1
kind: Service
metadata:
  name: nycmg-backend-service
spec:
  selector:
    app: nycmg-backend
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
```

## Environment-Specific Configurations

### Development

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/nycmg_dev
```

### Staging

```env
NODE_ENV=staging
PORT=3000
DATABASE_URL=postgresql://staging_user:password@staging_host:5432/nycmg_staging
```

### Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://prod_user:password@prod_host:5432/nycmg_prod
```

## Monitoring and Logging

### Backend

Implement Winston logging:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Web

Use Next.js built-in analytics or integrate with services like:

- Google Analytics
- Sentry for error tracking
- LogRocket for session replay

### Mobile

Use React Native logging libraries:

- react-native-logs
- sentry-react-native for error tracking

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for web frontend
4. **Rate Limiting**: Implement rate limiting in backend
5. **Input Validation**: Validate all user inputs
6. **Authentication**: Use secure JWT implementation

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use NGINX or cloud load balancer
2. **Database**: Use connection pooling
3. **Caching**: Implement Redis caching
4. **CDN**: Use CDN for static assets

### Vertical Scaling

1. **Database**: Optimize queries and indexes
2. **Caching**: Implement in-memory caching
3. **Compression**: Enable GZIP compression

## Backup and Recovery

### Database Backup

```bash
# PostgreSQL backup
pg_dump -h hostname -U username database_name > backup.sql

# Restore
psql -h hostname -U username database_name < backup.sql
```

### File Backup

1. **User Uploads**: Store in cloud storage (S3, Google Cloud Storage)
2. **Database Dumps**: Schedule regular backups
3. **Code**: Version control with Git

## Troubleshooting

### Common Issues

1. **Database Connection**: Check credentials and network access
2. **Environment Variables**: Verify all required variables are set
3. **Port Conflicts**: Ensure ports are available
4. **Permission Issues**: Check file and directory permissions

### Debugging

1. **Logs**: Check application logs
2. **Health Checks**: Implement health check endpoints
3. **Monitoring**: Set up application monitoring

## Rollback Procedures

1. **Database**: Restore from latest backup
2. **Application**: Deploy previous version
3. **Configuration**: Revert environment variables
4. **Infrastructure**: Rollback infrastructure changes

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Security Patches**: Apply security patches promptly
3. **Performance Monitoring**: Monitor application performance
4. **Log Rotation**: Implement log rotation to prevent disk full issues