# NYCMG API Reference

This document provides detailed information about the NYCMG REST API endpoints.

## Base URL
```
https://api.nycmg.com/v1
```

For local development:
```
http://localhost:3000/api
```

## Authentication

Most API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Register
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

**Status Codes:**
- `201 Created` - User registered successfully
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Username or email already exists

### Login
Authenticate an existing user.

**Endpoint:** `POST /auth/login`

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
    "id": "number",
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

**Status Codes:**
- `200 OK` - Authentication successful
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid credentials

### Logout
Invalidate the current user session.

**Endpoint:** `POST /auth/logout`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**
- `200 OK` - Logout successful
- `401 Unauthorized` - Invalid or missing token

## Users

### Get Current User Profile
Retrieve the profile information of the authenticated user.

**Endpoint:** `GET /users/profile`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "profilePicture": "string",
  "bio": "string",
  "location": "string",
  "createdAt": "date"
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Invalid or missing token

### Update User Profile
Update the profile information of the authenticated user.

**Endpoint:** `PUT /users/profile`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN
- Content-Type: application/json

**Request Body:**
```json
{
  "username": "string",
  "bio": "string",
  "location": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "profilePicture": "string",
  "bio": "string",
  "location": "string",
  "updatedAt": "date"
}
```

**Status Codes:**
- `200 OK` - Profile updated successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid or missing token
- `409 Conflict` - Username already exists

### Upload Profile Picture
Upload a new profile picture for the authenticated user.

**Endpoint:** `POST /users/profile/picture`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN
- Content-Type: multipart/form-data

**Form Data:**
- file: Image file (JPG, PNG, GIF)

**Response:**
```json
{
  "profilePicture": "string"
}
```

**Status Codes:**
- `200 OK` - Profile picture uploaded successfully
- `400 Bad Request` - Invalid file format or size
- `401 Unauthorized` - Invalid or missing token

## Artists

### Get Artist Profile
Retrieve the profile information of a specific artist.

**Endpoint:** `GET /artists/{id}`

**Path Parameters:**
- id: Artist ID

**Response:**
```json
{
  "id": "number",
  "userId": "number",
  "stageName": "string",
  "bio": "string",
  "profilePicture": "string",
  "coverPhoto": "string",
  "verified": "boolean",
  "followersCount": "number",
  "tracksCount": "number",
  "createdAt": "date"
}
```

**Status Codes:**
- `200 OK` - Artist profile retrieved successfully
- `404 Not Found` - Artist not found

### Get Artist Tracks
Retrieve tracks uploaded by a specific artist.

**Endpoint:** `GET /artists/{id}/tracks`

**Path Parameters:**
- id: Artist ID

**Query Parameters:**
- page: Page number (default: 1)
- limit: Number of items per page (default: 20, max: 100)

**Response:**
```json
{
  "tracks": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "audioUrl": "string",
      "coverArtUrl": "string",
      "duration": "number",
      "playCount": "number",
      "likesCount": "number",
      "createdAt": "date"
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

**Status Codes:**
- `200 OK` - Tracks retrieved successfully
- `404 Not Found` - Artist not found

### Follow Artist
Follow a specific artist.

**Endpoint:** `POST /artists/{id}/follow`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN

**Path Parameters:**
- id: Artist ID

**Response:**
```json
{
  "message": "Successfully followed artist"
}
```

**Status Codes:**
- `200 OK` - Artist followed successfully
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Artist not found
- `409 Conflict` - Already following this artist

### Unfollow Artist
Unfollow a specific artist.

**Endpoint:** `DELETE /artists/{id}/follow`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN

**Path Parameters:**
- id: Artist ID

**Response:**
```json
{
  "message": "Successfully unfollowed artist"
}
```

**Status Codes:**
- `200 OK` - Artist unfollowed successfully
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Artist not found

## Tracks

### Upload Track
Upload a new track.

**Endpoint:** `POST /tracks`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN
- Content-Type: multipart/form-data

**Form Data:**
- title: Track title
- description: Track description
- audioFile: Audio file (MP3, WAV, FLAC)
- coverArt: Cover art image (JPG, PNG) (optional)
- genreId: Genre ID (optional)
- boroughId: Borough ID (optional)

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "audioUrl": "string",
  "coverArtUrl": "string",
  "duration": "number",
  "genre": {
    "id": "number",
    "name": "string"
  },
  "borough": {
    "id": "number",
    "name": "string"
  },
  "playCount": "number",
  "likesCount": "number",
  "createdAt": "date"
}
```

**Status Codes:**
- `201 Created` - Track uploaded successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid or missing token
- `413 Payload Too Large` - File too large

### Get Track
Retrieve information about a specific track.

**Endpoint:** `GET /tracks/{id}`

**Path Parameters:**
- id: Track ID

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "audioUrl": "string",
  "coverArtUrl": "string",
  "duration": "number",
  "genre": {
    "id": "number",
    "name": "string"
  },
  "borough": {
    "id": "number",
    "name": "string"
  },
  "artist": {
    "id": "number",
    "username": "string",
    "profilePicture": "string"
  },
  "playCount": "number",
  "likesCount": "number",
  "commentsCount": "number",
  "createdAt": "date"
}
```

**Status Codes:**
- `200 OK` - Track retrieved successfully
- `404 Not Found` - Track not found

### Update Track
Update information about a specific track.

**Endpoint:** `PUT /tracks/{id}`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN
- Content-Type: application/json

**Path Parameters:**
- id: Track ID

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "genreId": "number",
  "boroughId": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "audioUrl": "string",
  "coverArtUrl": "string",
  "duration": "number",
  "genre": {
    "id": "number",
    "name": "string"
  },
  "borough": {
    "id": "number",
    "name": "string"
  },
  "playCount": "number",
  "likesCount": "number",
  "updatedAt": "date"
}
```

**Status Codes:**
- `200 OK` - Track updated successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Not authorized to update this track
- `404 Not Found` - Track not found

### Delete Track
Delete a specific track.

**Endpoint:** `DELETE /tracks/{id}`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN

**Path Parameters:**
- id: Track ID

**Response:**
```json
{
  "message": "Track deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Track deleted successfully
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Not authorized to delete this track
- `404 Not Found` - Track not found

### Get Tracks
Retrieve a list of tracks with optional filtering and pagination.

**Endpoint:** `GET /tracks`

**Query Parameters:**
- page: Page number (default: 1)
- limit: Number of items per page (default: 20, max: 100)
- borough: Filter by borough ID
- genre: Filter by genre ID
- artist: Filter by artist ID
- search: Search term for title or description
- sortBy: Sort field (createdAt, playCount, likesCount)
- sortOrder: Sort order (asc, desc)

**Response:**
```json
{
  "tracks": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "audioUrl": "string",
      "coverArtUrl": "string",
      "duration": "number",
      "genre": {
        "id": "number",
        "name": "string"
      },
      "borough": {
        "id": "number",
        "name": "string"
      },
      "artist": {
        "id": "number",
        "username": "string",
        "profilePicture": "string"
      },
      "playCount": "number",
      "likesCount": "number",
      "createdAt": "date"
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

**Status Codes:**
- `200 OK` - Tracks retrieved successfully

### Like Track
Like a specific track.

**Endpoint:** `POST /tracks/{id}/like`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN

**Path Parameters:**
- id: Track ID

**Response:**
```json
{
  "message": "Track liked successfully"
}
```

**Status Codes:**
- `200 OK` - Track liked successfully
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Track not found
- `409 Conflict` - Already liked this track

### Unlike Track
Remove like from a specific track.

**Endpoint:** `DELETE /tracks/{id}/like`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN

**Path Parameters:**
- id: Track ID

**Response:**
```json
{
  "message": "Track unliked successfully"
}
```

**Status Codes:**
- `200 OK` - Track unliked successfully
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Track not found

### Get Track Comments
Retrieve comments for a specific track.

**Endpoint:** `GET /tracks/{id}/comments`

**Path Parameters:**
- id: Track ID

**Query Parameters:**
- page: Page number (default: 1)
- limit: Number of items per page (default: 20, max: 100)

**Response:**
```json
{
  "comments": [
    {
      "id": "number",
      "content": "string",
      "user": {
        "id": "number",
        "username": "string",
        "profilePicture": "string"
      },
      "createdAt": "date"
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

**Status Codes:**
- `200 OK` - Comments retrieved successfully
- `404 Not Found` - Track not found

### Add Track Comment
Add a comment to a specific track.

**Endpoint:** `POST /tracks/{id}/comments`

**Headers:**
- Authorization: Bearer YOUR_JWT_TOKEN
- Content-Type: application/json

**Path Parameters:**
- id: Track ID

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "content": "string",
  "user": {
    "id": "number",
    "username": "string",
    "profilePicture": "string"
  },
  "createdAt": "date"
}
```

**Status Codes:**
- `201 Created` - Comment added successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Track not found

## Boroughs

### Get Boroughs
Retrieve a list of all boroughs.

**Endpoint:** `GET /boroughs`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string"
  }
]
```

**Status Codes:**
- `200 OK` - Boroughs retrieved successfully

### Get Borough
Retrieve information about a specific borough.

**Endpoint:** `GET /boroughs/{id}`

**Path Parameters:**
- id: Borough ID

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "location": {
    "latitude": "number",
    "longitude": "number"
  }
}
```

**Status Codes:**
- `200 OK` - Borough retrieved successfully
- `404 Not Found` - Borough not found

### Get Borough Tracks
Retrieve tracks associated with a specific borough.

**Endpoint:** `GET /boroughs/{id}/tracks`

**Path Parameters:**
- id: Borough ID

**Query Parameters:**
- page: Page number (default: 1)
- limit: Number of items per page (default: 20, max: 100)

**Response:**
```json
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
      },
      "playCount": "number",
      "likesCount": "number",
      "createdAt": "date"
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

**Status Codes:**
- `200 OK` - Tracks retrieved successfully
- `404 Not Found` - Borough not found

## Genres

### Get Genres
Retrieve a list of all genres.

**Endpoint:** `GET /genres`

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string"
  }
]
```

**Status Codes:**
- `200 OK` - Genres retrieved successfully

### Get Genre
Retrieve information about a specific genre.

**Endpoint:** `GET /genres/{id}`

**Path Parameters:**
- id: Genre ID

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string"
}
```

**Status Codes:**
- `200 OK` - Genre retrieved successfully
- `404 Not Found` - Genre not found

### Get Genre Tracks
Retrieve tracks associated with a specific genre.

**Endpoint:** `GET /genres/{id}/tracks`

**Path Parameters:**
- id: Genre ID

**Query Parameters:**
- page: Page number (default: 1)
- limit: Number of items per page (default: 20, max: 100)

**Response:**
```json
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
      },
      "playCount": "number",
      "likesCount": "number",
      "createdAt": "date"
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

**Status Codes:**
- `200 OK` - Tracks retrieved successfully
- `404 Not Found` - Genre not found

## Search

### Search
Search for tracks, artists, genres, and boroughs.

**Endpoint:** `GET /search`

**Query Parameters:**
- q: Search query
- type: Search type (track, artist, genre, borough, all)
- page: Page number (default: 1)
- limit: Number of items per page (default: 20, max: 100)

**Response:**
```json
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
      },
      "playCount": "number",
      "likesCount": "number",
      "createdAt": "date"
    }
  ],
  "artists": [
    {
      "id": "number",
      "username": "string",
      "profilePicture": "string",
      "bio": "string"
    }
  ],
  "genres": [
    {
      "id": "number",
      "name": "string",
      "description": "string"
    }
  ],
  "boroughs": [
    {
      "id": "number",
      "name": "string",
      "description": "string"
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

**Status Codes:**
- `200 OK` - Search results retrieved successfully
- `400 Bad Request` - Invalid search parameters

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object" (optional)
  }
}
```

### Common Error Codes

- `INVALID_INPUT` - Invalid input data provided
- `UNAUTHORIZED` - Authentication required or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate entry)
- `INTERNAL_ERROR` - Internal server error
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Anonymous requests**: 100 requests per hour
- **Authenticated requests**: 1000 requests per hour

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Pagination

All list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, maximum: 100)

Pagination responses include a `pagination` object:
```json
{
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

## WebSockets

The API supports real-time updates through WebSockets for notifications and live data.

### Connection
```
WebSocket URL: wss://api.nycmg.com/v1/ws
```

### Events

#### Track Played
```json
{
  "event": "track.played",
  "data": {
    "trackId": "number",
    "userId": "number"
  }
}
```

#### New Comment
```json
{
  "event": "comment.new",
  "data": {
    "trackId": "number",
    "comment": {
      "id": "number",
      "content": "string",
      "user": {
        "id": "number",
        "username": "string"
      },
      "createdAt": "date"
    }
  }
}
```

#### Track Liked
```json
{
  "event": "track.liked",
  "data": {
    "trackId": "number",
    "userId": "number"
  }
}
```

## Changelog

### v1.0.0 (Initial Release)
- User authentication endpoints
- Track management endpoints
- Artist profile endpoints
- Borough and genre endpoints
- Search functionality
- Real-time notifications via WebSockets

This API reference provides comprehensive documentation for all NYCMG API endpoints. For implementation details and examples, refer to the developer guide and codebase.