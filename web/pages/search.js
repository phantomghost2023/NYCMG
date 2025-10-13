import Head from 'next/head';
import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navigation from '../src/components/Navigation';
import TrackList from '../src/components/TrackList';
import AlbumList from '../src/components/AlbumList';

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    albums: []
  });

  useEffect(() => {
    // Simulate search when component mounts with a default query
    handleSearch('jazz');
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchQuery(query);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock search results
      const mockResults = {
        tracks: [
          { id: 1, title: 'Midnight Jazz', artist: 'NYC Jazz Collective', plays: 1240, duration: '4:32' },
          { id: 2, title: 'Urban Blues', artist: 'Brooklyn Sound', plays: 980, duration: '3:45' },
          { id: 3, title: 'City Lights', artist: 'Manhattan Beats', plays: 2100, duration: '5:12' }
        ],
        artists: [
          { id: 1, name: 'NYC Jazz Collective', followers: 12400, verified: true },
          { id: 2, name: 'Brooklyn Sound', followers: 8700, verified: false },
          { id: 3, name: 'Queens Collective', followers: 15600, verified: true }
        ],
        albums: [
          { id: 1, title: 'NYC Sessions', artist: 'NYC Jazz Collective', tracks: 12, year: 2023 },
          { id: 2, title: 'Brooklyn Vibes', artist: 'Brooklyn Sound', tracks: 10, year: 2022 },
          { id: 3, title: 'Queens Chronicles', artist: 'Queens Collective', tracks: 15, year: 2023 }
        ]
      };
      
      setSearchResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  return (
    <div>
      <Head>
        <title>NYCMG - Search</title>
        <meta name="description" content="Search for music on NYCMG" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        {/* Search Header */}
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Search NYCMG
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TextField
                fullWidth
                maxWidth="md"
                placeholder="Search for tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 600 }}
              />
            </Box>
          </Container>
        </Box>

        {/* Search Results */}
        <Container sx={{ py: 4 }} maxWidth="lg">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
            </Box>
          ) : searchQuery ? (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Search results for "{searchQuery}"
              </Typography>
              
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label={`Tracks (${searchResults.tracks.length})`} />
                <Tab label={`Artists (${searchResults.artists.length})`} />
                <Tab label={`Albums (${searchResults.albums.length})`} />
              </Tabs>

              {tabValue === 0 && (
                <Box>
                  {searchResults.tracks.length > 0 ? (
                    <TrackList tracks={searchResults.tracks} />
                  ) : (
                    <Typography>No tracks found.</Typography>
                  )}
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  {searchResults.artists.length > 0 ? (
                    <Grid container spacing={3}>
                      {searchResults.artists.map((artist) => (
                        <Grid item xs={12} sm={6} md={4} key={artist.id}>
                          <Card>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#FF4081', mr: 2 }}>
                                  {artist.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" component="h3">
                                    {artist.name}
                                    {artist.verified && (
                                      <Chip label="Verified" color="primary" size="small" sx={{ ml: 1 }} />
                                    )}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {artist.followers.toLocaleString()} followers
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Chip label="Follow" variant="outlined" />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography>No artists found.</Typography>
                  )}
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  {searchResults.albums.length > 0 ? (
                    <AlbumList albums={searchResults.albums} />
                  ) : (
                    <Typography>No albums found.</Typography>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Enter a search term to find music, artists, and albums
              </Typography>
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

export default SearchPage;