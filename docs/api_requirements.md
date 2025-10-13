# NYCMG API Requirements and Endpoints

## Overview

This document defines the API requirements and endpoints for the NYCMG platform, organized by functional domains to support the hyper-local, artist-owned digital ecosystem for NYC music discovery and curation.

## API Standards

### RESTful Principles
- Resource-based URLs
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Proper HTTP status codes
- JSON request/response format
- Token-based authentication (JWT)

### Versioning
- API version in URL: `/api/v1/`
- Semantic versioning for breaking changes

### Security
- HTTPS only
- JWT tokens for authentication
- Rate limiting
- Input validation and sanitization
- CORS configuration

## Authentication & User Management APIs

### Auth Endpoints

#### POST `/api/v1/auth/register`
Register a new user account

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "username": "string",
  "first_name": "string",
  "last_name": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "role": "string"
  },
  "token": "jwt_token"
}
```

#### POST `/api/v1/auth/login`
Authenticate user credentials

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

#### POST `/api/v1/auth/refresh`
Refresh authentication token

**Response:**
```json
{
  "token": "new_jwt_token"
}
```

#### GET `/api/v1/auth/profile`
Get authenticated user's profile

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "string",
  "username": "string",
  "first_name": "string",
  "last_name": "string",
  "display_name": "string",
  "avatar_url": "string",
  "bio": "string",
  "borough_id": "uuid",
  "preferences": {}
}
```

#### PUT `/api/v1/auth/profile`
Update user profile

**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "display_name": "string",
  "bio": "string",
  "borough_id": "uuid",
  "preferences": {}
}
```

### User Management Endpoints

#### GET `/api/v1/users/{user_id}`
Get public user profile

#### GET `/api/v1/users/{user_id}/playlists`
Get user's public playlists

#### GET `/api/v1/users/{user_id}/favorites`
Get user's favorite tracks

## Artist Management APIs

### Artist Registration & Profiles

#### POST `/api/v1/artists`
Register as an artist

**Request Body:**
```json
{
  "artist_name": "string",
  "bio": "string"
}
```

#### GET `/api/v1/artists/{artist_id}`
Get artist profile

**Response:**
```json
{
  "id": "uuid",
  "artist_name": "string",
  "verified_nyc": "boolean",
  "bio": "string",
  "avatar_url": "string",
  "banner_url": "string",
  "website_url": "string",
  "bandcamp_url": "string",
  "patreon_url": "string",
  "merch_url": "string",
  "story": "string",
  "follower_count": "integer",
  "track_count": "integer",
  "album_count": "integer"
}
```

#### PUT `/api/v1/artists/{artist_id}`
Update artist profile

#### GET `/api/v1/artists/{artist_id}/tracks`
Get artist's tracks

#### GET `/api/v1/artists/{artist_id}/albums`
Get artist's albums

#### GET `/api/v1/artists/{artist_id}/events`
Get artist's upcoming events

### Artist Content Management

#### POST `/api/v1/tracks`
Upload a new track

#### PUT `/api/v1/tracks/{track_id}`
Update track information

#### DELETE `/api/v1/tracks/{track_id}`
Delete a track

#### POST `/api/v1/albums`
Create a new album

#### PUT `/api/v1/albums/{album_id}`
Update album information

#### POST `/api/v1/albums/{album_id}/tracks`
Add tracks to album

## Music Discovery APIs

### Borough & Location APIs

#### GET `/api/v1/boroughs`
List all NYC boroughs

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "banner_url": "string"
  }
]
```

#### GET `/api/v1/boroughs/{borough_id}`
Get borough details

#### GET `/api/v1/boroughs/{borough_id}/neighborhoods`
Get neighborhoods in a borough

#### GET `/api/v1/boroughs/{borough_id}/genres`
Get popular genres in a borough

#### GET `/api/v1/boroughs/{borough_id}/tracks`
Get tracks from a borough

**Query Parameters:**
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)
- `sort`: string (default: "release_date")
- `order`: string (default: "desc")
- `genre_id`: uuid (optional)

### Genre APIs

#### GET `/api/v1/genres`
List all genres

#### GET `/api/v1/genres/{genre_id}`
Get genre details

#### GET `/api/v1/genres/{genre_id}/tracks`
Get tracks in a genre

### Search APIs

#### GET `/api/v1/search`
Global search across artists, tracks, albums

**Query Parameters:**
- `q`: string (search term)
- `type`: string (artist|track|album, comma separated)
- `limit`: integer (default: 20)

#### GET `/api/v1/search/suggestions`
Get search suggestions

**Query Parameters:**
- `q`: string (partial search term)

### Recommendations APIs

#### GET `/api/v1/recommendations/personalized`
Get personalized recommendations

#### GET `/api/v1/recommendations/trending`
Get trending tracks

#### GET `/api/v1/recommendations/local`
Get locally popular tracks

## Playback & Library APIs

### Playback APIs

#### POST `/api/v1/playback/start`
Start track playback

**Request Body:**
```json
{
  "track_id": "uuid",
  "borough_id": "uuid" (optional)
}
```

#### POST `/api/v1/playback/complete`
Record completed playback

**Request Body:**
```json
{
  "track_id": "uuid",
  "play_duration": "integer" (seconds)
}
```

### Playlist APIs

#### GET `/api/v1/playlists`
Get user's playlists

#### POST `/api/v1/playlists`
Create a new playlist

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "is_public": "boolean"
}
```

#### GET `/api/v1/playlists/{playlist_id}`
Get playlist details

#### PUT `/api/v1/playlists/{playlist_id}`
Update playlist

#### DELETE `/api/v1/playlists/{playlist_id}`
Delete playlist

#### POST `/api/v1/playlists/{playlist_id}/tracks`
Add track to playlist

**Request Body:**
```json
{
  "track_id": "uuid"
}
```

#### DELETE `/api/v1/playlists/{playlist_id}/tracks/{track_id}`
Remove track from playlist

#### GET `/api/v1/playlists/{playlist_id}/likes`
Get playlist likes

#### POST `/api/v1/playlists/{playlist_id}/likes`
Like a playlist

#### DELETE `/api/v1/playlists/{playlist_id}/likes`
Unlike a playlist

### Favorites APIs

#### GET `/api/v1/favorites`
Get user's favorites

#### POST `/api/v1/favorites`
Add track to favorites

**Request Body:**
```json
{
  "track_id": "uuid"
}
```

#### DELETE `/api/v1/favorites/{track_id}`
Remove track from favorites

### Following APIs

#### GET `/api/v1/following`
Get user's following list

#### POST `/api/v1/following`
Follow a user/artist

**Request Body:**
```json
{
  "target_id": "uuid",
  "target_type": "string" (user|artist)
}
```

#### DELETE `/api/v1/following/{target_id}`
Unfollow a user/artist

## Events & Community APIs

### Events APIs

#### GET `/api/v1/events`
List upcoming events

**Query Parameters:**
- `borough_id`: uuid (optional)
- `date_from`: date (optional)
- `date_to`: date (optional)
- `genre_id`: uuid (optional)
- `limit`: integer (default: 20)
- `offset`: integer (default: 0)

#### GET `/api/v1/events/{event_id}`
Get event details

#### GET `/api/v1/events/{event_id}/artists`
Get artists performing at event

### Venues APIs

#### GET `/api/v1/venues`
List venues

#### GET `/api/v1/venues/{venue_id}`
Get venue details

#### GET `/api/v1/venues/{venue_id}/events`
Get events at venue

### Ticketing APIs

#### POST `/api/v1/tickets/purchase`
Purchase event tickets

**Request Body:**
```json
{
  "event_id": "uuid",
  "ticket_count": "integer"
}
```

**Response:**
```json
{
  "purchase_id": "uuid",
  "total_amount": "decimal",
  "confirmation_code": "string",
  "redirect_url": "string" (payment gateway URL)
}
```

#### GET `/api/v1/tickets/purchases/{purchase_id}`
Get ticket purchase details

## Subscription & Revenue APIs

### Subscription APIs

#### GET `/api/v1/subscriptions/plans`
List available subscription plans

#### GET `/api/v1/subscriptions/current`
Get user's current subscription

#### POST `/api/v1/subscriptions`
Create/update subscription

**Request Body:**
```json
{
  "plan_id": "uuid",
  "payment_method": "string"
}
```

#### DELETE `/api/v1/subscriptions`
Cancel subscription

### Artist Revenue APIs

#### GET `/api/v1/artists/{artist_id}/revenue`
Get artist's revenue summary

#### GET `/api/v1/artists/{artist_id}/revenue/history`
Get artist's revenue history

## Administrative APIs

### Content Moderation

#### GET `/api/v1/admin/content/pending`
Get pending content for approval

#### POST `/api/v1/admin/content/{content_id}/approve`
Approve content

#### POST `/api/v1/admin/content/{content_id}/reject`
Reject content

### User Management

#### GET `/api/v1/admin/users`
List users

#### PUT `/api/v1/admin/users/{user_id}`
Update user

#### DELETE `/api/v1/admin/users/{user_id}`
Delete user

### Analytics APIs

#### GET `/api/v1/admin/analytics/platform`
Get platform analytics

#### GET `/api/v1/admin/analytics/boroughs`
Get borough analytics

#### GET `/api/v1/admin/analytics/artists`
Get artist analytics

## Error Responses

All API endpoints will return standardized error responses:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

- Authenticated requests: 1000 requests/hour
- Unauthenticated requests: 100 requests/hour
- Specific endpoints may have stricter limits

## Pagination

List endpoints support pagination:

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "page": "integer",
    "limit": "integer",
    "total": "integer",
    "pages": "integer"
  }
}
```

## Filtering & Sorting

List endpoints support filtering and sorting through query parameters:

- `sort`: Field to sort by
- `order`: Sort order (asc|desc)
- `filter[field]`: Filter by field value

## Webhook Endpoints

### Payment Webhooks

#### POST `/api/v1/webhooks/stripe`
Handle Stripe payment events

### Ticketing Webhooks

#### POST `/api/v1/webhooks/ticketing`
Handle ticketing partner events

## Data Export APIs

#### GET `/api/v1/export/user-data`
Export user's data (GDPR compliance)

#### GET `/api/v1/export/artist-revenue`
Export artist's revenue data