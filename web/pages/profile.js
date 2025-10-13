import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Navigation from '../src/components/Navigation';
import TrackList from '../src/components/TrackList';
import AlbumList from '../src/components/AlbumList';
import FollowButton from '../src/components/FollowButton';
import SocialInteractionBar from '../src/components/SocialInteractionBar';
import ProfilePictureUpload from '../src/components/ProfilePictureUpload';
import { fetchArtist } from '../src/store/artistSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { selectedArtist: user, loading } = useSelector(state => state.artists);
  const [tabValue, setTabValue] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploadType, setUploadType] = useState('track');

  useEffect(() => {
    // Fetch real artist data instead of using mock data
    // Assuming we have the artist ID from auth state or URL params
    // For now, using a placeholder ID - in real implementation this would come from auth
    const artistId = 1; // This should come from the authenticated user's data
    if (artistId) {
      dispatch(fetchArtist(artistId));
    }
  }, [dispatch]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle upload type change
  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
  };

  // Handle upload action
  const handleUpload = () => {
    // In a real implementation, this would navigate to the appropriate upload page
    // based on the selected upload type
    switch(uploadType) {
      case 'track':
        window.location.href = '/upload';
        break;
      case 'album':
        // For now, redirect to the same upload page, but this page
        window.location.href = '/upload';
        break;
      case 'ep':
        // For now, redirect to the same upload page, but this could be a different page
        window.location.href = '/upload';
        break;
      default:
        window.location.href = '/upload';
    }
  };

  if (loading && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state if needed
  if (!user && !loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Error loading profile</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Head>
        <title>NYCMG - {user?.artist_name || user?.displayName}'s Profile</title>
        <meta name="description" content={`${user?.artist_name || user?.displayName}'s profile on NYCMG`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        {/* Profile Header */}
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {/* Use the ProfilePictureUpload component for real functionality */}
                  <ProfilePictureUpload artist={user} />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={9}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                      {user?.artist_name || user?.displayName}
                    </Typography>
                    {user?.verified && (
                      <Chip label="Verified Artist" color="primary" size="small" />
                    )}
                  </Box>
                  
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    @{user?.username}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.bio}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ mr: 3 }}>
                      <strong>{user?.followers?.toLocaleString() || 0}</strong> followers
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 3 }}>
                      <strong>{user?.following?.toLocaleString() || 0}</strong> following
                    </Typography>
                    <Typography variant="body2">
                      <strong>{user?.tracksPlayed?.toLocaleString() || 0}</strong> tracks played
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Button 
                      variant={isFollowing ? "outlined" : "contained"} 
                      onClick={handleFollow}
                      sx={{ mr: 2 }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    
                    {/* Upload options for artists */}
                    {user?.is_artist && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <FormControl sx={{ minWidth: 120, mr: 2 }}>
                          <InputLabel>Upload Type</InputLabel>
                          <Select
                            value={uploadType}
                            label="Upload Type"
                            onChange={handleUploadTypeChange}
                          >
                            <MenuItem value="track">Single Track</MenuItem>
                            <MenuItem value="ep">EP</MenuItem>
                            <MenuItem value="album">Album</MenuItem>
                          </Select>
                        </FormControl>
                        <Button 
                          variant="contained" 
                          color="secondary"
                          onClick={handleUpload}
                        >
                          Upload
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Profile Content */}
        <Container sx={{ py: 4 }} maxWidth="lg">
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Tracks" />
            <Tab label="Albums" />
            <Tab label="Playlists" />
            <Tab label="Activity" />
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Recent Tracks
              </Typography>
              <TrackList />
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Albums
              </Typography>
              <AlbumList />
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Playlists
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="div"
                      sx={{ height: 140, bgcolor: '#FF4081' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h3">
                        My Favorites
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        24 tracks
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="div"
                      sx={{ height: 140, bgcolor: '#1db954' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h3">
                        Workout Mix
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        18 tracks
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="div"
                      sx={{ height: 140, bgcolor: '#84bd00' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h3">
                        Chill Vibes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        32 tracks
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>You</strong> uploaded a new track: "Summer in the City"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    2 hours ago
                  </Typography>
                  <SocialInteractionBar 
                    likes={42} 
                    comments={7} 
                    shares={3} 
                    onLike={() => {}} 
                    onComment={() => {}} 
                    onShare={() => {}} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>You</strong> followed <strong>Queens Collective</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    1 day ago
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Container>
      </main>

      <footer style={{ backgroundColor: '#333', color: 'white', padding: '2rem 0' }}>
        <Container maxWidth="lg">
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} NYCMG - NYC Music Growth
          </Typography>
        </Container>
      </footer>
    </div>
  );
};

export default UserProfile;