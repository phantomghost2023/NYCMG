# NYCMG Database Schema Design

## Overview

This document outlines the database schema for the NYCMG platform, designed to support the hyper-local, artist-owned digital ecosystem for NYC music discovery and curation.

## Entity Relationship Diagram

```
Users ────────────────◄─────────────── Artists
 │                                      │
 │                                      │
 ▼                                      ▼
UserProfiles                      ArtistProfiles
 │                                      │
 │                                      │
 ▼                                      ▼
Follows ───────────────────────────► ArtistFollows
 │                                      │
 │                                      │
 ▼                                      ▼
Playlists ◄──────────────────────────► PlaylistTracks
 │                                      │
 │                                      │
 ▼                                      ▼
PlaylistLikes                     TrackPlays
 │                                      │
 │                                      │
 ▼                                      ▼
Boroughs ◄── Genres ◄── TrackGenres ─► Tracks ─► Albums
 │            │                         │        │
 │            │                         │        │
 ▼            ▼                         ▼        ▼
Neighborhoods Events ─────────────────► Venues
              │                         │
              │                         │
              ▼                         ▼
          EventArtists             ArtistVenues
              │
              │
              ▼
          TicketPurchases
```

## Core Tables

### 1. Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user', -- user, artist, admin, curator
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. UserProfiles Table

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(100),
    avatar_url TEXT,
    borough_id UUID REFERENCES boroughs(id),
    bio TEXT,
    preferences JSONB, -- Genre preferences, notification settings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Artists Table

```sql
CREATE TABLE artists (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_name VARCHAR(100) NOT NULL,
    verified_nyc BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. ArtistProfiles Table

```sql
CREATE TABLE artist_profiles (
    id UUID PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    bio TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    bandcamp_url TEXT,
    patreon_url TEXT,
    merch_url TEXT,
    story TEXT, -- Rich text content for "The Story" tab
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Boroughs Table

```sql
CREATE TABLE boroughs (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    banner_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial data
INSERT INTO boroughs (id, name) VALUES 
(gen_random_uuid(), 'Manhattan'),
(gen_random_uuid(), 'Brooklyn'),
(gen_random_uuid(), 'Queens'),
(gen_random_uuid(), 'The Bronx'),
(gen_random_uuid(), 'Staten Island');
```

### 6. Neighborhoods Table

```sql
CREATE TABLE neighborhoods (
    id UUID PRIMARY KEY,
    borough_id UUID REFERENCES boroughs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Genres Table

```sql
CREATE TABLE genres (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Tracks Table

```sql
CREATE TABLE tracks (
    id UUID PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INTEGER, -- in seconds
    release_date DATE,
    audio_url TEXT,
    cover_art_url TEXT,
    is_explicit BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. Albums Table

```sql
CREATE TABLE albums (
    id UUID PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    release_date DATE,
    cover_art_url TEXT,
    is_explicit BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. TrackGenres Table (Many-to-Many)

```sql
CREATE TABLE track_genres (
    id UUID PRIMARY KEY,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(track_id, genre_id)
);
```

### 11. ArtistNeighborhoods Table (Many-to-Many)

```sql
CREATE TABLE artist_neighborhoods (
    id UUID PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE CASCADE,
    connection_type VARCHAR(50), -- primary, secondary, collaborated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(artist_id, neighborhood_id)
);
```

## User Interaction Tables

### 12. Follows Table

```sql
CREATE TABLE follows (
    id UUID PRIMARY KEY,
    follower_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_user_id, followed_user_id)
);
```

### 13. ArtistFollows Table

```sql
CREATE TABLE artist_follows (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, artist_id)
);
```

### 14. Playlists Table

```sql
CREATE TABLE playlists (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    cover_art_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 15. PlaylistTracks Table

```sql
CREATE TABLE playlist_tracks (
    id UUID PRIMARY KEY,
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, track_id)
);
```

### 16. Favorites Table

```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, track_id)
);
```

### 17. TrackPlays Table

```sql
CREATE TABLE track_plays (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    play_duration INTEGER, -- seconds played
    borough_id UUID REFERENCES boroughs(id),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 18. PlaylistLikes Table

```sql
CREATE TABLE playlist_likes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, playlist_id)
);
```

## Events & Venues Tables

### 19. Venues Table

```sql
CREATE TABLE venues (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    borough_id UUID REFERENCES boroughs(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    website_url TEXT,
    phone VARCHAR(20),
    capacity INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 20. Events Table

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    door_time TIMESTAMP,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    ticket_url TEXT,
    cover_charge DECIMAL(10, 2),
    age_restriction VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, sold_out
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 21. EventArtists Table (Many-to-Many)

```sql
CREATE TABLE event_artists (
    id UUID PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    performance_time TIMESTAMP,
    billing_type VARCHAR(20), -- headliner, support, dj
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, artist_id)
);
```

### 22. TicketPurchases Table

```sql
CREATE TABLE ticket_purchases (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ticket_count INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2),
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(100),
    confirmation_code VARCHAR(50)
);
```

## Subscription & Revenue Tables

### 23. SubscriptionPlans Table

```sql
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    billing_period VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
    features JSONB, -- List of features included in this plan
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 24. UserSubscriptions Table

```sql
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, expired
    payment_method VARCHAR(50), -- stripe, paypal, etc.
    subscription_id VARCHAR(100), -- External payment provider ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 25. ArtistRevenue Table

```sql
CREATE TABLE artist_revenue (
    id UUID PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_streams INTEGER DEFAULT 0,
    unique_listeners INTEGER DEFAULT 0,
    revenue_amount DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    calculation_details JSONB, -- Details of UCPS calculation
    paid_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_release_date ON tracks(release_date);
CREATE INDEX idx_albums_artist_id ON albums(artist_id);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX idx_track_plays_track_id ON track_plays(track_id);
CREATE INDEX idx_track_plays_user_id ON track_plays(user_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_artist_revenue_artist_id ON artist_revenue(artist_id);
CREATE INDEX idx_artist_revenue_period ON artist_revenue(period_start, period_end);
```

## Views for Common Queries

### 1. Artist Profile View

```sql
CREATE VIEW artist_profile_view AS
SELECT 
    a.id AS artist_id,
    a.artist_name,
    ap.bio,
    ap.avatar_url,
    ap.banner_url,
    a.verified_nyc,
    COUNT(DISTINCT af.user_id) AS follower_count,
    COUNT(DISTINCT t.id) AS track_count,
    COUNT(DISTINCT al.id) AS album_count
FROM artists a
LEFT JOIN artist_profiles ap ON a.id = ap.artist_id
LEFT JOIN artist_follows af ON a.id = af.artist_id
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN albums al ON a.id = al.artist_id
GROUP BY a.id, a.artist_name, ap.bio, ap.avatar_url, ap.banner_url, a.verified_nyc;
```

### 2. Track Details View

```sql
CREATE VIEW track_details_view AS
SELECT 
    t.id AS track_id,
    t.title,
    t.duration,
    t.release_date,
    t.cover_art_url,
    a.id AS artist_id,
    a.artist_name,
    al.id AS album_id,
    al.title AS album_title,
    STRING_AGG(g.name, ', ') AS genres
FROM tracks t
JOIN artists a ON t.artist_id = a.id
LEFT JOIN albums al ON t.album_id = al.id
LEFT JOIN track_genres tg ON t.id = tg.track_id
LEFT JOIN genres g ON tg.genre_id = g.id
GROUP BY t.id, t.title, t.duration, t.release_date, t.cover_art_url, a.id, a.artist_name, al.id, al.title;
```

## Notes on Implementation

1. **UUIDs**: All primary keys use UUIDs for global uniqueness and security
2. **Soft Deletes**: Most entities use a status field rather than hard deletes
3. **JSONB Fields**: Used for flexible data structures like preferences and features
4. **Geospatial Data**: Stored as separate lat/long fields rather than PostGIS for simplicity
5. **User-Centric Payment System**: Revenue tracking is designed to support the UCPS model
6. **Borough Integration**: Geographic data is integrated throughout for local focus
7. **Artist Rights**: Schema designed to ensure artists maintain 100% ownership