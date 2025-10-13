# NYCMG Frontend Component Architecture

## Overview

This document outlines the frontend component architecture for the NYCMG platform, designed to support a seamless, engaging user experience across mobile and web platforms while maintaining the hyper-local, artist-centric focus.

## Technology Stack

### Mobile Applications
- **Framework**: React Native
- **State Management**: Redux Toolkit with Redux Saga
- **Navigation**: React Navigation v6
- **UI Components**: NativeBase + Custom Components
- **Maps**: Mapbox GL Native
- **Audio**: React Native Track Player
- **Storage**: AsyncStorage, React Native FS

### Web Application
- **Framework**: React.js with Next.js
- **State Management**: Redux Toolkit with Redux Saga
- **Routing**: Next.js Router
- **UI Components**: Material-UI + Custom Components
- **Maps**: Mapbox GL JS
- **Audio**: HTML5 Audio API with Howler.js
- **Build Tool**: Webpack

### Shared Libraries
- **UI Components**: Shared React component library
- **Utilities**: Shared utility functions
- **API Client**: Shared Axios-based API client
- **Theme**: Shared design system and theme

## Component Hierarchy

### Root Structure

```
App
├── Providers (Auth, Theme, Store)
├── Navigation
│   ├── MainTabs
│   ├── AuthStack
│   └── ModalStack
└── GlobalComponents
    ├── Toast
    ├── LoadingOverlay
    └── ErrorBoundary
```

### Main Tab Navigation

```
MainTabs
├── HomeTab
├── ExploreTab
├── LiveTab
├── LibraryTab
└── ProfileTab
```

## Detailed Component Architecture

### 1. Authentication Flow Components

#### AuthStack
```
AuthStack
├── WelcomeScreen
├── LoginScreen
├── RegisterScreen
├── ForgotPasswordScreen
└── OnboardingFlow
    ├── BoroughSelection
    ├── GenreSelection
    └── ProfileSetup
```

**WelcomeScreen**
- Purpose: Entry point for new users
- Key Features: 
  - Animated NYC map background
  - Platform value proposition
  - Login/Register options
  - Continue as Guest option

**LoginScreen**
- Purpose: Authenticate existing users
- Props: 
  - onSubmit(credentials)
  - onForgotPassword()
  - onRegister()
- State: email, password, loading, error
- Validations: Email format, password length

**RegisterScreen**
- Purpose: Create new user accounts
- Props: 
  - onSubmit(userData)
  - onLogin()
- State: email, password, username, firstName, lastName, loading, error
- Validations: Email uniqueness, password strength, required fields

**OnboardingFlow**
- Purpose: Personalize user experience
- Components:
  - BoroughSelection: Interactive NYC map for borough choice
  - GenreSelection: Cloud of genre tags for preference selection
  - ProfileSetup: Optional profile information

### 2. Home Tab Components

#### HomeTab
```
HomeTab
├── HomeHeader
├── HeroCarousel
├── PersonalizedFeed
├── EditorsPicks
└── QuickAccessBar
```

**HomeHeader**
- Purpose: Display user greeting and search access
- Features:
  - User avatar/profile access
  - Search button
  - Notification indicator

**HeroCarousel**
- Purpose: Promote upcoming events and releases
- Features:
  - Auto-rotating featured content
  - Manual swipe navigation
  - Call-to-action buttons (ticket purchase, listen now)
  - Indicators for current slide

**PersonalizedFeed**
- Purpose: Show content based on user preferences
- Features:
  - Infinite scroll list of tracks/albums
  - Borough origin labels
  - Quick play functionality
  - Save/share options

**EditorsPicks**
- Purpose: Showcase curator-selected content
- Features:
  - Section headers for different curator categories
  - Horizontal scrolling playlist cards
  - Rich editorial descriptions

### 3. Explore Tab Components

#### ExploreTab
```
ExploreTab
├── ExploreHeader
├── NYCMap
├── BoroughDetail
│   ├── BoroughHeader
│   ├── GenreNeighborhoods
│   │   └── NeighborhoodRow
│   │       └── TrackGrid
│   │           └── TrackCard
│   └── QuickPlayModal
└── SearchOverlay
```

**NYCMap**
- Purpose: Geographic discovery interface
- Features:
  - Interactive borough selection
  - Animated borough boundaries
  - Current location detection
  - Custom map markers for featured venues

**BoroughDetail**
- Purpose: Borough-specific content exploration
- Components:

**BoroughHeader**
- Dynamic borough imagery
- Borough name with distinctive typography
- Quick stats (artist count, track count)

**GenreNeighborhoods**
- Horizontal scrollable category list
- Borough-specific genre names
- New content indicators

**NeighborhoodRow**
- Title for genre neighborhood
- "See All" navigation
- Horizontal track grid

**TrackGrid**
- Responsive grid/list view toggle
- Loading states for infinite scroll
- Empty state handling

**TrackCard**
- Large cover art display
- Artist name and track title
- Release date with "New" badges
- "Fire" icon for trending tracks
- Quick play button

**QuickPlayModal**
- Expanded track information
- Large cover art
- Full playback controls
- Action buttons (Go to Artist, Save, Share)

### 4. Artist Profile Components

#### ArtistProfile
```
ArtistProfile
├── ArtistHeader
├── VerificationBadge
├── ArtistStats
├── DiscographySection
│   ├── AlbumGrid
│   └── TrackList
├── StoryTab
├── LiveAndLocalTab
│   ├── EventList
│   └── VenueMap
├── ConnectionsTab
└── SupportSection
```

**ArtistHeader**
- Customizable banner image
- Artist avatar
- Follow button with count
- Artist name display

**VerificationBadge**
- "Verified NYC" badge display
- Tooltip with verification information

**ArtistStats**
- Follower count
- Track/album counts
- "Local Love" metrics visualization

**DiscographySection**
- Chronological release organization
- Album grid view
- Single/EP list view
- Release date filtering

**StoryTab**
- Rich text blog content
- Image embedding support
- Comment functionality
- Social sharing

**LiveAndLocalTab**
- Upcoming events list
- Venue map integration
- Ticket purchase integration
- Event details modal

**ConnectionsTab**
- Visual artist collaboration graph
- Collaborator profile links
- Shared project highlighting

**SupportSection**
- Direct links to external support platforms
- Clear 0% commission messaging
- Support platform icons

### 5. Playback System Components

#### PlaybackSystem
```
PlaybackSystem
├── MiniPlayer
├── FullPlayer
├── PlaybackControls
├── ProgressIndicator
└── QueueManager
```

**MiniPlayer**
- Persistent player at bottom of screen
- Track information display
- Play/pause button
- Expand to full player gesture

**FullPlayer**
- Large cover art display
- Track and artist information
- Full playback controls
- Volume slider
- Queue management

**PlaybackControls**
- Play/pause button
- Skip previous/next
- Shuffle/repeat modes
- Favorite toggle

**ProgressIndicator**
- Scrubbable progress bar
- Time elapsed/remaining
- Chapter markers for longer content

**QueueManager**
- Upcoming track list
- Queue manipulation (reorder, remove)
- Save queue as playlist

### 6. Events & Community Components

#### LiveTab
```
LiveTab
├── EventsHeader
├── EventFilters
├── EventsMap
├── EventsList
└── EventDetail
```

**EventsHeader**
- Title and search access
- View toggle (map/list)
- Filter button

**EventFilters**
- Borough selection
- Date range picker
- Genre filtering
- Price range slider

**EventsMap**
- Venue markers with event information
- Cluster markers for dense areas
- Current location indicator
- Map style matching app theme

**EventsList**
- Vertical list of events
- Date grouping
- Venue and artist information
- Ticket status indicators

**EventDetail**
- Complete event information
- Artist lineup with profile links
- Venue details with map
- Ticket purchase flow

### 7. Library Components

#### LibraryTab
```
LibraryTab
├── LibraryHeader
├── LibrarySections
│   ├── Favorites
│   ├── Playlists
│   ├── Following
│   └── NYC timeline
└── PlaylistDetail
```

**LibraryHeader**
- Section navigation
- Search within library
- Create playlist button

**Favorites**
- Grid/list view of favorited tracks
- Quick play functionality
- Remove from favorites option

**Playlists**
- User-created playlists
- Smart playlists (recently played, frequently played)
- Playlist creation flow

**Following**
- List of followed artists
- Recent activity feed
- Unfollow functionality

**NYC Timeline**
- Map-based listening history
- Time-ordered music discovery
- Location-based memory association

**PlaylistDetail**
- Playlist cover art
- Track listing with reorder capability
- Collaborative editing options
- Share functionality

### 8. Profile Components

#### ProfileTab
```
ProfileTab
├── UserProfile
├── AccountSettings
├── SubscriptionManagement
└── Preferences
```

**UserProfile**
- User avatar and information
- Borough preference display
- Genre preferences
- Social statistics

**AccountSettings**
- Email/password management
- Profile information editing
- Notification preferences
- Privacy settings

**SubscriptionManagement**
- Current plan information
- Billing history
- Plan upgrade/downgrade
- Cancellation flow

**Preferences**
- Audio quality settings
- Download preferences
- Borough/genre preferences
- Notification settings

## State Management Structure

### Redux Store Structure
```
store
├── auth
│   ├── user
│   ├── token
│   └── isAuthenticated
├── playback
│   ├── currentTrack
│   ├── isPlaying
│   ├── queue
│   └── volume
├── library
│   ├── favorites
│   ├── playlists
│   └── following
├── discovery
│   ├── boroughs
│   ├── genres
│   ├── tracks
│   └── recommendations
├── artists
│   ├── profiles
│   ├── discographies
│   └── events
├── events
│   ├── list
│   ├── filters
│   └── venues
└── ui
    ├── loading
    ├── errors
    └── modals
```

## Design System

### Color Palette
- Primary: #FF4081 (Pink for energy and NYC vibe)
- Secondary: #2196F3 (Blue for trust and technology)
- Background: #FFFFFF (Light) / #121212 (Dark)
- Text: #212121 (Dark) / #FFFFFF (Light)
- Borough Colors: Distinct colors for each borough

### Typography
- Headings: Roboto Bold
- Body: Roboto Regular
- Borough Fonts: Custom fonts reflecting each borough's character

### Spacing System
- 4px increments (4, 8, 12, 16, 24, 32, 48, 64)
- Consistent padding and margin usage
- Responsive spacing for different screen sizes

## Performance Optimization Strategies

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Vendor chunk separation

### Caching
- HTTP caching for API responses
- Image caching with expiration
- In-memory cache for frequently accessed data

### Bundle Optimization
- Tree shaking for unused code
- Image optimization and compression
- Minification and compression

### Rendering Optimization
- Virtualized lists for large datasets
- Memoization of expensive components
- Conditional rendering of non-critical elements

## Accessibility Features

### Visual Accessibility
- High contrast mode
- Adjustable text sizes
- Screen reader support
- Colorblind-friendly palette

### Motor Accessibility
- Keyboard navigation support
- Voice control compatibility
- Reduced motion options

### Cognitive Accessibility
- Clear navigation structure
- Consistent interaction patterns
- Simple, jargon-free language

## Cross-Platform Considerations

### Platform-Specific Adaptations
- iOS: Follow iOS design guidelines
- Android: Follow Material Design principles
- Web: Responsive design for all screen sizes

### Feature Parity
- Core functionality available on all platforms
- Platform-specific features (e.g., Siri/Google Assistant integration)
- Consistent user experience across devices

## Testing Strategy

### Component Testing
- Unit tests for individual components
- Snapshot testing for UI consistency
- Integration tests for component interactions

### End-to-End Testing
- User flow testing
- Cross-platform scenario testing
- Performance benchmarking

### Accessibility Testing
- Automated accessibility scanning
- Manual testing with screen readers
- Keyboard navigation verification

## Internationalization

### Localization Support
- Multi-language support
- Right-to-left language support
- Cultural adaptation for content

### Content Management
- Externalized strings
- Dynamic content loading
- Regional content variations

## Analytics and Monitoring

### User Behavior Tracking
- Screen view tracking
- Interaction event logging
- User journey mapping

### Performance Monitoring
- Load time measurements
- Error rate tracking
- User experience metrics

## Security Considerations

### Data Protection
- Secure storage of authentication tokens
- Encryption of sensitive user data
- Secure communication protocols

### Input Validation
- Client-side validation
- Sanitization of user inputs
- Protection against injection attacks

This component architecture provides a solid foundation for building the NYCMG platform with a focus on the unique value proposition of hyper-local, artist-centric music discovery while ensuring a high-quality user experience across all supported platforms.