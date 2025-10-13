import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Add this import
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux'; // Add this import
import { API_BASE_URL } from 'nycmg-shared';
import TrackList from '../src/components/TrackList';
import Navigation from '../src/components/Navigation';

export default function Home() {
  const router = useRouter(); // Add this
  const { isAuthenticated } = useSelector((state) => state.auth); // Add this
  const [boroughs, setBoroughs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add this useEffect to redirect unauthenticated users
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Add this useEffect to fetch boroughs only when authenticated
  useEffect(() => {
    if (isAuthenticated === true) {
      const fetchBoroughs = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/boroughs`);
          const data = await response.json();
          
          if (response.ok) {
            setBoroughs(data);
          } else {
            setError(data.error || 'Failed to fetch boroughs');
          }
        } catch (err) {
          setError('Network error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchBoroughs();
    }
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isAuthenticated === null || isAuthenticated === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated (this will be handled by the useEffect above)
  if (isAuthenticated === false) {
    return null; // or you can return a loading spinner
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Head>
        <title>NYCMG - NYC Music Growth</title>
        <meta name="description" content="Discover NYC music by borough" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h1" align="center" gutterBottom>
              Discover NYC Music
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Explore the unique sounds of each NYC borough
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2, flexWrap: 'wrap' }}>
              <Link href="/map" passHref>
                <Button variant="contained" size="large" startIcon={<MapIcon />}>
                  Explore by Map
                </Button>
              </Link>
              <Link href="/search" passHref>
                <Button variant="outlined" size="large" startIcon={<SearchIcon />}>
                  Search Music
                </Button>
              </Link>
              <Link href="/profile" passHref>
                <Button variant="outlined" size="large" startIcon={<PersonIcon />}>
                  My Profile
                </Button>
              </Link>
              <Link href="/settings" passHref>
                <Button variant="outlined" size="large" startIcon={<SettingsIcon />}>
                  Settings
                </Button>
              </Link>
            </Box>
          </Container>
        </Box>

        <Container sx={{ py: 8 }} maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            NYC Boroughs
          </Typography>
          <Grid container spacing={4}>
            {boroughs.map((borough) => (
              <Grid item key={borough.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{ pt: '56.25%', bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Typography variant="h1" component="div" sx={{ color: '#FF4081' }}>
                      {borough.name.charAt(0)}
                    </Typography>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {borough.name}
                    </Typography>
                    <Typography>
                      {borough.description || 'Explore the music scene in this borough.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Container sx={{ py: 8 }} maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Featured Tracks
          </Typography>
          <TrackList />
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
}