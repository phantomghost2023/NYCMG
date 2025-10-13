# Social Features Implementation

## Overview
This document describes the implementation of social features for the NYCMG mobile application. The social features include following artists, liking tracks, and commenting on tracks.

## Architecture

### Redux Store Structure
The social features are implemented using Redux slices for state management:

1. **Follow Slice** - Manages artist following functionality
2. **Like Slice** - Manages track liking functionality
3. **Comment Slice** - Manages track comments functionality

### Components
1. **FollowButton** - Button component for following/unfollowing artists
2. **LikeButton** - Button component for liking/unliking tracks
3. **CommentSection** - Component for displaying and managing comments
4. **SocialInteractionBar** - Component that combines all social features

## Implementation Details

### Follow Slice
Located at [followSlice.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\store\followSlice.js)

#### State Structure
```javascript
{
  following: {}, // Map of artistId to following status (boolean)
  followersCount: {}, // Map of artistId to followers count (number)
  loading: false, // Loading state
  error: null // Error message
}
```

#### Actions
1. **followArtist** - Follow an artist
2. **unfollowArtist** - Unfollow an artist
3. **getFollowingStatus** - Get following status for an artist
4. **getFollowersCount** - Get followers count for an artist

### Like Slice
Located at [likeSlice.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\store\likeSlice.js)

#### State Structure
```javascript
{
  liked: {}, // Map of trackId to like status (boolean)
  likesCount: {}, // Map of trackId to likes count (number)
  loading: false, // Loading state
  error: null // Error message
}
```

#### Actions
1. **likeTrack** - Like a track
2. **unlikeTrack** - Unlike a track
3. **getLikeStatus** - Get like status for a track
4. **getLikesCount** - Get likes count for a track

### Comment Slice
Located at [commentSlice.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\store\commentSlice.js)

#### State Structure
```javascript
{
  comments: {}, // Map of trackId to comments array
  loading: false, // Loading state
  error: null // Error message
}
```

#### Actions
1. **addComment** - Add a comment to a track
2. **getComments** - Get comments for a track
3. **deleteComment** - Delete a comment

## Components

### FollowButton
Located at [FollowButton.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\components\FollowButton.js)

A button component that allows users to follow/unfollow artists. It displays different text and styles based on the following status.

#### Props
- **artistId** (required) - The ID of the artist to follow/unfollow
- **style** (optional) - Additional styles to apply to the button

### LikeButton
Located at [LikeButton.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\components\LikeButton.js)

A button component that allows users to like/unlike tracks. It displays a heart icon and optionally shows the likes count.

#### Props
- **trackId** (required) - The ID of the track to like/unlike
- **showCount** (optional) - Whether to display the likes count
- **style** (optional) - Additional styles to apply to the button

### CommentSection
Located at [CommentSection.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\components\CommentSection.js)

A component that displays comments for a track and allows users to add new comments. Authenticated users can also delete their own comments.

#### Props
- **trackId** (required) - The ID of the track to display comments for

### SocialInteractionBar
Located at [SocialInteractionBar.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\components\SocialInteractionBar.js)

A component that combines all social features into a single bar. It can display follow, like, and share buttons based on the props.

#### Props
- **artistId** (optional) - The ID of the artist for following functionality
- **trackId** (optional) - The ID of the track for liking functionality
- **showFollow** (optional) - Whether to display the follow button
- **showLike** (optional) - Whether to display the like button
- **showShare** (optional) - Whether to display the share button
- **onSharePress** (optional) - Function to call when share button is pressed
- **style** (optional) - Additional styles to apply to the bar

## Integration Points

### Store Integration
The social slices are integrated into the main Redux store in [store/index.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\src\store\index.js):

```javascript
import followReducer from './followSlice';
import likeReducer from './likeSlice';
import commentReducer from './commentSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    follow: followReducer,
    like: likeReducer,
    comment: commentReducer,
  },
});
```

### Component Usage
The social components can be used in any screen that needs social functionality:

```javascript
// In ArtistProfileScreen
<SocialInteractionBar 
  artistId={selectedArtist.id}
  showLike={false}
  showShare={false}
/>

// In TrackDetailScreen
<SocialInteractionBar 
  artistId={track.artist_id}
  trackId={track.id}
/>

// Standalone usage
<FollowButton artistId={artist.id} />
<LikeButton trackId={track.id} showCount={true} />
<CommentSection trackId={track.id} />
```

## API Integration

### Follow Endpoints
- **POST /follow** - Follow an artist
- **DELETE /follow/:artistId** - Unfollow an artist
- **GET /follow/status/:artistId** - Get following status
- **GET /follow/count/:artistId** - Get followers count

### Like Endpoints
- **POST /like** - Like a track
- **DELETE /like/:trackId** - Unlike a track
- **GET /like/status/:trackId** - Get like status
- **GET /like/count/:trackId** - Get likes count

### Comment Endpoints
- **POST /comment** - Add a comment
- **GET /comment/:trackId** - Get comments for a track
- **DELETE /comment/:commentId** - Delete a comment

## Authentication

All social features require authentication. When a user is not authenticated, the components will either:
1. Display a message prompting the user to login
2. Navigate to the login screen when actions are attempted

## Testing

### Unit Tests
Unit tests for the social components and slices are located in the [\_\_tests\_\_](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__) directory:

1. [FollowButton.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\FollowButton.test.js)
2. [LikeButton.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\LikeButton.test.js)
3. [CommentSection.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\CommentSection.test.js)
4. [SocialInteractionBar.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\SocialInteractionBar.test.js)
5. [followSlice.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\followSlice.test.js)
6. [likeSlice.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\likeSlice.test.js)
7. [commentSlice.test.js](file:///g:\PhantomGhost\Storage\Media\Media\Projects\MyProjects\NYCMG\mobile\__tests__\commentSlice.test.js)

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
1. **Share Functionality** - Implement track/artist sharing
2. **Notifications** - Notify users of new followers, likes, and comments
3. **User Profiles** - Enhanced user profile pages with social metrics
4. **Activity Feed** - Timeline of social activities from followed artists
5. **Playlists** - User-created playlists with social features

### Performance Improvements
1. **Pagination** - Implement pagination for comments
2. **Caching** - Cache social data for offline access
3. **Real-time Updates** - WebSocket integration for real-time social updates

### UI/UX Enhancements
1. **Animations** - Add animations for social interactions
2. **Customization** - Allow users to customize social preferences
3. **Accessibility** - Improve accessibility for social features