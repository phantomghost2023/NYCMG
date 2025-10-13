# NYCMG API Documentation

## Overview

This document provides documentation for the NYCMG API endpoints. The API follows REST principles and uses JSON for request and response bodies.

## Performance Optimizations

The NYCMG platform implements several performance optimizations to ensure fast response times and scalability:

1. **Caching Layer**: In-memory caching for frequently accessed data
2. **Database Query Optimization**: Indexes and optimized queries for faster data retrieval
3. **Connection Pooling**: Efficient database connection management
4. **Query Result Optimization**: Specific attribute selection to reduce data transfer

See [Database Optimization Summary](./db_optimization_summary.md) for detailed information about database performance improvements.

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Base URL

```
http://localhost:3001/api/v1
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "email": "string",
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "role": "string"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Authenticate a user

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "role": "string"
  },
  "token": "jwt_token"
}
```

#### POST /auth/refresh
Refresh authentication token

**Response:**
```json
{
  "token": "new_jwt_token"
}
```

#### GET /auth/profile
Get authenticated user's profile

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "role": "string"
  }
}
```

#### PUT /auth/profile
Update user profile

**Request Body:**
```json
{
  "username": "string",
  "phone": "string"
}
```

### Boroughs

#### GET /boroughs
List all boroughs

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string"
  }
]
```

#### GET /boroughs/:id
Get a specific borough

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string"
}
```

### Genres

#### GET /genres
List all genres

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string"
  }
]
```

#### GET /genres/:id
Get a specific genre

**Response:**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string"
}
```

### Artists

#### GET /artists
List all artists

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)

**Response:**
```json
{
  "artists": [
    {
      "id": "uuid",
      "artist_name": "string",
      "verified_nyc": "boolean"
    }
  ],
  "totalCount": "integer",
  "limit": "integer",
  "offset": "integer"
}
```

#### GET /artists/:id
Get a specific artist

**Response:**
```json
{
  "id": "uuid",
  "artist_name": "string",
  "verified_nyc": "boolean",
  "user": {
    "username": "string",
    "email": "string"
  }
}
```

#### POST /artists
Create a new artist (requires authentication)

**Request Body:**
```json
{
  "artist_name": "string",
  "verified_nyc": "boolean"
}
```

#### PUT /artists/:id
Update an artist (requires authentication)

**Request Body:**
``json
{
  "artist_name": "string",
  "verified_nyc": "boolean"
}
```

### Tracks

#### GET /tracks
List all tracks

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)
- `search`: string (search term)
- `boroughIds`: array of uuids (filter by boroughs)
- `genreIds`: array of uuids (filter by genres)
- `artistId`: uuid (filter by artist)
- `isExplicit`: boolean (filter by explicit content)
- `sortBy`: string (sort field: created_at, title, release_date)
- `sortOrder`: string (sort order: ASC, DESC)

**Response:**
``json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "release_date": "date",
      "audio_url": "string",
      "cover_art_url": "string",
      "is_explicit": "boolean",
      "artist": {
        "id": "uuid",
        "artist_name": "string"
      },
      "genres": [
        {
          "id": "uuid",
          "name": "string"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "totalPages": "integer",
    "totalCount": "integer",
    "limit": "integer",
    "offset": "integer"
  }
}
```

#### GET /tracks/:id
Get a specific track

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "release_date": "date",
  "audio_url": "string",
  "cover_art_url": "string",
  "is_explicit": "boolean",
  "artist": {
    "id": "uuid",
    "artist_name": "string"
  },
  "genres": [
    {
      "id": "uuid",
      "name": "string"
    }
  ]
}
```

#### POST /tracks
Create a new track (requires authentication)

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "release_date": "date",
  "is_explicit": "boolean",
  "genreIds": ["uuid"]
}
```

#### PUT /tracks/:id
Update a track (requires authentication)

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "release_date": "date",
  "is_explicit": "boolean",
  "genreIds": ["uuid"]
}
```

### Track Upload

#### POST /track-upload/upload
Upload a track with audio file and cover art (requires authentication)

**Form Data:**
- `title`: string
- `description`: string
- `releaseDate`: date
- `isExplicit`: boolean
- `genreIds`: JSON array of genre IDs
- `audio`: audio file
- `coverArt`: image file (optional)

**Response:**
```json
{
  "message": "Track uploaded successfully",
  "track": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "release_date": "date",
    "audio_url": "string",
    "cover_art_url": "string",
    "is_explicit": "boolean",
    "artist": {
      "id": "uuid",
      "artist_name": "string"
    },
    "genres": [
      {
        "id": "uuid",
        "name": "string"
      }
    ]
  }
}
```

### Notifications

#### GET /notifications
Get user notifications

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)
- `includeRead`: boolean (default: false) - include read notifications

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "string",
      "title": "string",
      "message": "string",
      "is_read": "boolean",
      "related_id": "uuid",
      "related_type": "string",
      "created_at": "date",
      "updated_at": "date"
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "totalPages": "integer",
    "totalCount": "integer",
    "limit": "integer",
    "offset": "integer"
  }
}
```

#### PUT /notifications/:id/read
Mark a notification as read

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "string",
  "title": "string",
  "message": "string",
  "is_read": "boolean",
  "related_id": "uuid",
  "related_type": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

#### PUT /notifications/read-all
Mark all notifications as read

**Response:**
```json
{
  "updatedCount": "integer"
}
```

#### DELETE /notifications/:id
Delete a notification

**Response:**
```json
{
  "message": "Notification deleted successfully"
}
```

### Follows

#### POST /follows
Follow a user (requires authentication)

**Request Body:**
```json
{
  "followingId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "follower_id": "uuid",
  "following_id": "uuid",
  "created_at": "date",
  "updated_at": "date"
}
```

#### DELETE /follows/:followingId
Unfollow a user (requires authentication)

**Response:**
```json
{
  "message": "Successfully unfollowed user"
}
```

#### GET /follows/:userId/followers
Get followers for a user

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "follower_id": "uuid",
      "following_id": "uuid",
      "created_at": "date",
      "updated_at": "date",
      "follower": {
        "id": "uuid",
        "username": "string",
        "email": "string"
      }
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "totalPages": "integer",
    "totalCount": "integer",
    "limit": "integer",
    "offset": "integer"
  }
}
```

#### GET /follows/:userId/following
Get users that a user is following

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "follower_id": "uuid",
      "following_id": "uuid",
      "created_at": "date",
      "updated_at": "date",
      "following": {
        "id": "uuid",
        "username": "string",
        "email": "string"
      }
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "totalPages": "integer",
    "totalCount": "integer",
    "limit": "integer",
    "offset": "integer"
  }
}
```

#### GET /follows/following/:followingId
Check if current user is following another user (requires authentication)

**Response:**
```json
{
  "following": "boolean"
}
```

### Comments

#### POST /comments
Create a comment (requires authentication)

**Request Body:**
```json
{
  "track_id": "uuid", // Optional
  "artist_id": "uuid", // Optional
  "album_id": "uuid", // Optional
  "parent_id": "uuid", // Optional
  "content": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "track_id": "uuid",
  "artist_id": "uuid",
  "album_id": "uuid",
  "parent_id": "uuid",
  "content": "string",
  "created_at": "date",
  "updated_at": "date",
  "user": {
    "id": "uuid",
    "username": "string"
  },
  "parent": {
    "id": "uuid",
    "content": "string"
  }
}
```

#### GET /comments/:entityType/:entityId
Get comments for an entity

**Path Parameters:**
- `entityType`: string (track, artist, album)
- `entityId`: uuid

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "track_id": "uuid",
      "artist_id": "uuid",
      "album_id": "uuid",
      "parent_id": "uuid",
      "content": "string",
      "created_at": "date",
      "updated_at": "date",
      "user": {
        "id": "uuid",
        "username": "string"
      },
      "replies": [
        {
          "id": "uuid",
          "content": "string",
          "created_at": "date",
          "user": {
            "id": "uuid",
            "username": "string"
          }
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "totalPages": "integer",
    "totalCount": "integer",
    "limit": "integer",
    "offset": "integer"
  }
}
```

#### PUT /comments/:id
Update a comment (requires authentication)

**Path Parameters:**
- `id`: uuid

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "track_id": "uuid",
  "artist_id": "uuid",
  "album_id": "uuid",
  "parent_id": "uuid",
  "content": "string",
  "created_at": "date",
  "updated_at": "date",
  "user": {
    "id": "uuid",
    "username": "string"
  }
}
```

#### DELETE /comments/:id
Delete a comment (requires authentication)

**Path Parameters:**
- `id`: uuid

**Response:**
``json
{
  "message": "Comment deleted successfully"
}
```

### Likes

#### POST /likes
Like an entity (requires authentication)

**Request Body:**
```json
{
  "track_id": "uuid", // Optional
  "artist_id": "uuid", // Optional
  "album_id": "uuid", // Optional
  "comment_id": "uuid" // Optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "track_id": "uuid",
  "artist_id": "uuid",
  "album_id": "uuid",
  "comment_id": "uuid",
  "created_at": "date",
  "updated_at": "date"
}
```

#### DELETE /likes
Unlike an entity (requires authentication)

**Request Body:**
```json
{
  "track_id": "uuid", // Optional
  "artist_id": "uuid", // Optional
  "album_id": "uuid", // Optional
  "comment_id": "uuid" // Optional
}
```

**Response:**
```json
{
  "message": "Like removed successfully"
}
```

#### GET /likes/:entityType/:entityId
Get likes count for an entity

**Path Parameters:**
- `entityType`: string (track, artist, album, comment)
- `entityId`: uuid

**Response:**
```json
{
  "count": "integer"
}
```

#### GET /likes
Get current user's likes (requires authentication)

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "track_id": "uuid",
      "artist_id": "uuid",
      "album_id": "uuid",
      "comment_id": "uuid",
      "created_at": "date",
      "updated_at": "date",
      "track": {
        "id": "uuid",
        "title": "string"
      },
      "artist": {
        "id": "uuid",
        "artist_name": "string"
      },
      "album": {
        "id": "uuid",
        "title": "string"
      },
      "comment": {
        "id": "uuid",
        "content": "string"
      }
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "totalPages": "integer",
    "totalCount": "integer",
    "limit": "integer",
    "offset": "integer"
  }
}
```

#### POST /likes/check
Check if current user has liked an entity (requires authentication)

**Request Body:**
```json
{
  "track_id": "uuid", // Optional
  "artist_id": "uuid", // Optional
  "album_id": "uuid", // Optional
  "comment_id": "uuid" // Optional
}
```

**Response:**
```json
{
  "liked": "boolean"
}
```

### Shares

#### POST /shares
Share an entity (requires authentication)

**Request Body:**
```json
{
  "track_id": "uuid", // Optional
  "artist_id": "uuid", // Optional
  "album_id": "uuid", // Optional
  "platform": "string" // Optional (facebook, twitter, instagram, tiktok, other)
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "track_id": "uuid",
  "artist_id": "uuid",
  "album_id": "uuid",
  "platform": "string",
  "share_url": "string",
  "created_at": "date",
  "updated_at": "date"
}
```

#### GET /shares/:entityType/:entityId
Get shares count for an entity

**Path Parameters:**
- `entityType`: string (track, artist, album)
- `entityId`: uuid

**Response:**
```json
{
  "count": "integer"
}
```

#### GET /shares
Get current user's shares (requires authentication)

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "track_id": "uuid",
      "artist_id": "uuid",
      "album_id": "uuid",
      "platform": "string",
      "share_url": "string",
      "created_at": "date",
      "updated_at": "date",
      "track": {
        "id": "uuid",
        "title": "string"
      },
      "artist": {
        "id": "uuid",
        "artist_name": "string"
      },
      "album": {
        "id": "uuid",
        "title": "string"
      }
    }
  ],
  "pagination": {
    "currentPage": "integer",
    "totalPages": "integer",
    "totalCount": "integer",
    "limit": "integer",
    "offset": "integer"
  }
}
```

### Cache Management

#### GET /cache/stats
Get cache statistics (requires authentication)

**Response:**
```json
{
  "boroughs": {
    "hits": "integer",
    "misses": "integer",
    "keys": "integer",
    "ksize": "integer",
    "vsize": "integer"
  },
  "genres": {
    "hits": "integer",
    "misses": "integer",
    "keys": "integer",
    "ksize": "integer",
    "vsize": "integer"
  },
  "artists": {
    "hits": "integer",
    "misses": "integer",
    "keys": "integer",
    "ksize": "integer",
    "vsize": "integer"
  },
  "tracks": {
    "hits": "integer",
    "misses": "integer",
    "keys": "integer",
    "ksize": "integer",
    "vsize": "integer"
  },
  "albums": {
    "hits": "integer",
    "misses": "integer",
    "keys": "integer",
    "ksize": "integer",
    "vsize": "integer"
  }
}
```

#### DELETE /cache/clear
Clear all caches (requires authentication, admin only)

**Response:**
```json
{
  "message": "All caches cleared successfully"
}
```

### Audio Streaming

#### GET /audio/stream/:filename
Stream an audio file with support for range requests

**Path Parameters:**
- `filename`: string (name of the audio file)

**Headers:**
- `Range`: string (optional, for partial content requests, e.g., "bytes=0-1023")

**Response:**
- For full file: 200 OK with audio content
- For partial content: 206 Partial Content with requested byte range
- For invalid range: 416 Range Not Satisfiable

**Example:**
```
GET /api/v1/audio/stream/sample-track.mp3
Range: bytes=0-1023
```

## Real-time Notifications (WebSocket)

### Connection
Connect to `ws://localhost:3001` with the following authentication header:
```
Authorization: Bearer <token>
```

### Events

#### Client Events
- `register` - Register user with their ID
  ```json
  {
    "userId": "uuid"
  }
  ```

#### Server Events
- `notification` - Receive a new notification
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "type": "string",
    "title": "string",
    "message": "string",
    "is_read": "boolean",
    "related_id": "uuid",
    "related_type": "string",
    "created_at": "date"
  }
  ```

### Database Optimization

#### POST /db-optimization/indexes
Add database indexes for improved query performance (requires authentication, admin only)

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

#### POST /db-optimization/pool
Optimize database connection pool settings (requires authentication, admin only)

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

#### GET /db-optimization/stats
Get database performance statistics (requires authentication, admin only)

**Response:**
```json
{
  "tableSizes": [
    {
      "schemaname": "string",
      "tablename": "string",
      "size": "string",
      "size_bytes": "integer"
    }
  ],
  "indexStats": [
    {
      "schemaname": "string",
      "tablename": "string",
      "indexname": "string",
      "idx_tup_read": "integer",
      "idx_tup_fetch": "integer"
    }
  ],
  "slowQueries": [
    {
      "query": "string",
      "calls": "integer",
      "total_time": "number",
      "mean_time": "number",
      "rows": "integer"
    }
  ]
}
```

#### GET /db-optimization/analyze
Analyze query execution plans for optimization opportunities (requires authentication, admin only)

**Response:**
```json
{
  "artistQuery": [
    {
      "QUERY PLAN": "string"
    }
  ],
  "trackQuery": [
    {
      "QUERY PLAN": "string"
    }
  ],
  "searchQuery": [
    {
      "QUERY PLAN": "string"
    }
  ]
}
```

#### POST /db-optimization/queries
Optimize frequently used queries (requires authentication, admin only)

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Exceeding the rate limit will result in a 429 (Too Many Requests) response.

## CORS

The API supports CORS for web applications hosted on approved domains.