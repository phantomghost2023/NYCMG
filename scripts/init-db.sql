-- Create tables for NYCMG application

-- Users table
CREATE TABLE IF NOT EXISTS users (
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

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
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

-- Boroughs table
CREATE TABLE IF NOT EXISTS boroughs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    location POINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cover_art_url TEXT,
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
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

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, track_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Shares table
CREATE TABLE IF NOT EXISTS shares (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    platform VARCHAR(50), -- e.g., 'twitter', 'facebook', 'instagram'
    share_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_genre_id ON tracks(genre_id);
CREATE INDEX IF NOT EXISTS idx_tracks_borough_id ON tracks(borough_id);
CREATE INDEX IF NOT EXISTS idx_comments_track_id ON comments(track_id);
CREATE INDEX IF NOT EXISTS idx_likes_track_id ON likes(track_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_shares_track_id ON shares(track_id);

-- Insert sample boroughs
INSERT INTO boroughs (name, description) VALUES
    ('Manhattan', 'The heart of New York City, known for its skyscrapers, Central Park, and cultural attractions.'),
    ('Brooklyn', 'The most populous borough, known for its cultural diversity, indie music scene, and artistic communities.'),
    ('Queens', 'The largest borough by area, known for its ethnic diversity and two major airports.'),
    ('The Bronx', 'Home to Yankee Stadium and the birthplace of hip hop.'),
    ('Staten Island', 'The least populated borough, known for its suburban feel and the Staten Island Ferry.');

-- Insert sample genres
INSERT INTO genres (name, description) VALUES
    ('Hip Hop', 'A cultural movement that began in the Bronx in the 1970s.'),
    ('Jazz', 'A music genre that originated in New Orleans in the late 19th century.'),
    ('Rock', 'A broad genre of popular music that originated as "rock and roll" in the United States.'),
    ('Electronic', 'Music that employs electronic musical instruments and electronic music technology.'),
    ('Pop', 'A genre of popular music that originated in the mid-1950s.'),
    ('R&B', 'A genre of popular African-American music that originated in the 1940s.'),
    ('Classical', 'Art music produced or rooted in the traditions of Western culture.'),
    ('Folk', 'A genre that evolved from traditional music and began in the 20th century.');