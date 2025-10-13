# NYCMG Backend API

This is the backend API for the NYCMG (NYC Music Growth) platform, built with Node.js, Express, and PostgreSQL.

## Prerequisites

See [requirements.txt](requirements.txt) for detailed system and software requirements.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NYCMG/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other configuration.

4. Set up the database:
   - Create a PostgreSQL database
   - Update the database credentials in `.env`

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Performance Optimizations

The backend implements several performance optimizations:

1. **Caching Layer**: In-memory caching for frequently accessed data using NodeCache
2. **Database Query Optimization**: Indexes and optimized queries for faster data retrieval
3. **Connection Pooling**: Efficient database connection management with optimized pool settings
4. **Query Result Optimization**: Specific attribute selection to reduce data transfer
5. **Rate Limiting**: API rate limiting to prevent abuse and ensure fair usage

See the [Database Optimization Summary](../docs/db_optimization_summary.md) for detailed information about database performance improvements.

## API Documentation

The API is organized around REST principles and follows versioning. All endpoints are prefixed with `/api/v1`.

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login with existing credentials
- `POST /api/v1/auth/refresh` - Refresh authentication token
- `GET /api/v1/auth/profile` - Get authenticated user's profile (requires token)
- `PUT /api/v1/auth/profile` - Update user profile (requires token)

### Borough Endpoints
- `GET /api/v1/boroughs` - List all boroughs
- `GET /api/v1/boroughs/:id` - Get a specific borough

### Genre Endpoints
- `GET /api/v1/genres` - List all genres
- `GET /api/v1/genres/:id` - Get a specific genre

### Artist Endpoints
- `GET /api/v1/artists` - List all artists
- `GET /api/v1/artists/:id` - Get a specific artist
- `POST /api/v1/artists` - Create a new artist (requires authentication)
- `PUT /api/v1/artists/:id` - Update an artist (requires authentication)
- `DELETE /api/v1/artists/:id` - Delete an artist (requires admin authentication)

### Track Endpoints
- `GET /api/v1/tracks` - List all tracks
- `GET /api/v1/tracks/:id` - Get a specific track
- `POST /api/v1/tracks` - Create a new track (requires authentication)
- `PUT /api/v1/tracks/:id` - Update a track (requires authentication)
- `DELETE /api/v1/tracks/:id` - Delete a track (requires admin authentication)

### Album Endpoints
- `GET /api/v1/albums` - List all albums
- `GET /api/v1/albums/:id` - Get a specific album
- `POST /api/v1/albums` - Create a new album (requires authentication)
- `PUT /api/v1/albums/:id` - Update an album (requires authentication)
- `DELETE /api/v1/albums/:id` - Delete an album (requires admin authentication)

### Database Optimization Endpoints (Admin Only)
- `POST /api/v1/db-optimization/indexes` - Add database indexes
- `POST /api/v1/db-optimization/pool` - Optimize connection pool
- `GET /api/v1/db-optimization/stats` - Get database statistics
- `GET /api/v1/db-optimization/analyze` - Analyze query plans
- `POST /api/v1/db-optimization/queries` - Optimize frequently used queries

## Database Schema

The database schema is automatically created when the application starts. See the main documentation for detailed schema information.

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Deployment

The application can be deployed to any Node.js hosting platform. Make sure to set the appropriate environment variables in production.