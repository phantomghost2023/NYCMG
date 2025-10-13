# Library Management Features

## Overview
This document describes the implementation of library management features for the NYCMG mobile application. The library management features include playlists and favorites functionality.

## Architecture

### Redux Store Structure
The library management features are implemented using Redux slices for state management:

1. **Playlist Slice** - Manages user playlists functionality
2. **Favorite Slice** - Manages user favorites functionality

### Components
1. **Playlist** - Component for displaying playlist information
2. **FavoriteButton** - Button component for adding/removing favorites
3. **LibraryScreen** - Main library screen with tabs for offline, playlists, and favorites
4. **PlaylistDetailScreen** - Screen for viewing and managing a specific playlist

## Implementation Details

### Playlist Slice
Located at [playlistSlice.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\store\playlistSlice.js)

#### State Structure
```javascript
{
  playlists: [], // Array of user playlists
  selectedPlaylist: null, // Currently selected playlist
  loading: false, // Loading state
  error: null // Error message
}
```

#### Actions
1. **createPlaylist** - Create a new playlist
2. **getUserPlaylists** - Get all playlists for the current user
3. **getPlaylist** - Get a specific playlist by ID
4. **updatePlaylist** - Update playlist information
5. **deletePlaylist** - Delete a playlist
6. **addTrackToPlaylist** - Add a track to a playlist
7. **removeTrackFromPlaylist** - Remove a track from a playlist

### Favorite Slice
Located at [favoriteSlice.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\store\favoriteSlice.js)

#### State Structure
```javascript
{
  favorites: [], // Array of favorite tracks
  favoriteStatus: {}, // Map of trackId to favorite status (boolean)
  loading: false, // Loading state
  error: null // Error message
}
```

#### Actions
1. **addFavorite** - Add a track to favorites
2. **removeFavorite** - Remove a track from favorites
3. **getUserFavorites** - Get all favorite tracks for the current user
4. **isFavorite** - Check if a specific track is favorited

## Components

### Playlist
Located at [Playlist.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\components\Playlist.js)

A component that displays playlist information including name, description, and track count.

#### Props
- **playlist** (required) - The playlist object to display
- **onPress** (required) - Function to call when playlist is pressed
- **style** (optional) - Additional styles to apply to the component

### FavoriteButton
Located at [FavoriteButton.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\components\FavoriteButton.js)

A button component that allows users to add/remove tracks from their favorites. It displays a heart icon that changes color based on favorite status.

#### Props
- **trackId** (required) - The ID of the track to favorite/unfavorite
- **style** (optional) - Additional styles to apply to the button

### LibraryScreen
Located at [LibraryScreen.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\screens\LibraryScreen.js)

The main library screen that provides tabs for offline tracks, playlists, and favorites.

#### Features
1. **Tab Navigation** - Switch between offline tracks, playlists, and favorites
2. **Playlist Management** - Create and delete playlists
3. **Offline Tracks** - View downloaded tracks for offline listening
4. **Favorites** - View favorited tracks

### PlaylistDetailScreen
Located at [PlaylistDetailScreen.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\screens\PlaylistDetailScreen.js)

A screen that displays the contents of a specific playlist and allows users to remove tracks.

#### Features
1. **Playlist Information** - Display playlist name, description, and track count
2. **Track List** - Show all tracks in the playlist with artist information
3. **Track Removal** - Remove tracks from the playlist
4. **Track Playback** - Play tracks directly from the playlist

## Integration Points

### Store Integration
The library management slices are integrated into the main Redux store in [store/index.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\store\index.js):

```javascript
import playlistReducer from './playlistSlice';
import favoriteReducer from './favoriteSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    playlist: playlistReducer,
    favorite: favoriteReducer,
  },
});
```

### Component Usage
The library management components can be used throughout the application:

```javascript
// In LibraryScreen
<Playlist playlist={playlist} onPress={handlePlaylistPress} />

// In TrackDetailScreen
<FavoriteButton trackId={track.id} />

// Navigation to playlist detail
navigation.navigate('PlaylistDetail', { playlistId: playlist.id });
```

## API Integration

### Playlist Endpoints
- **POST /playlist** - Create a new playlist
- **GET /playlist/user** - Get all playlists for the current user
- **GET /playlist/:id** - Get a specific playlist
- **PUT /playlist/:id** - Update a playlist
- **DELETE /playlist/:id** - Delete a playlist
- **POST /playlist/:id/track** - Add a track to a playlist
- **DELETE /playlist/:id/track/:trackId** - Remove a track from a playlist

### Favorite Endpoints
- **POST /favorite** - Add a track to favorites
- **DELETE /favorite/:trackId** - Remove a track from favorites
- **GET /favorite** - Get all favorite tracks for the current user
- **GET /favorite/status/:trackId** - Check if a track is favorited

## Authentication

All library management features require authentication. When a user is not authenticated, the components will either:
1. Display a message prompting the user to login
2. Navigate to the login screen when actions are attempted

## Testing

### Unit Tests
Unit tests for the library management components and slices are located in the [\_\_tests\_\_](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__) directory:

1. [Playlist.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\Playlist.test.js)
2. [FavoriteButton.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\FavoriteButton.test.js)
3. [playlistSlice.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\playlistSlice.test.js)
4. [favoriteSlice.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\favoriteSlice.test.js)

### Test Coverage
The tests cover:
1. Component rendering
2. User interactions
3. State management
4. API integration
5. Error handling
6. Authentication flows

## Future Enhancements

### Advanced Features
1. **Smart Playlists** - Automatically generated playlists based on user preferences
2. **Playlist Sharing** - Share playlists with other users
3. **Collaborative Playlists** - Allow multiple users to contribute to a playlist
4. **Playlist Recommendations** - Suggest new tracks for playlists
5. **Offline Playlist Sync** - Sync playlists for offline access

### Performance Improvements
1. **Pagination** - Implement pagination for large playlists
2. **Caching** - Cache playlist data for offline access
3. **Batch Operations** - Add/remove multiple tracks at once

### UI/UX Enhancements
1. **Drag and Drop** - Reorder tracks in playlists via drag and drop
2. **Custom Playlist Images** - Allow users to set custom cover art
3. **Playlist Sorting** - Sort playlists by various criteria
4. **Search and Filter** - Search within playlists and filter by criteria