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
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Navigation from '../../src/components/Navigation';

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [topArtists, setTopArtists] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Mock data for analytics
      const mockStats = {
        totalUsers: 1242,
        totalArtists: 87,
        totalTracks: 1456,
        totalPlays: 24567,
        totalLikes: 8934,
        totalComments: 2341,
        totalShares: 1234
      };
      
      const mockTopArtists = [
        { id: 1, name: 'The Brooklyn Sound', plays: 12450, likes: 3421 },
        { id: 2, name: 'Queens Collective', plays: 9876, likes: 2987 },
        { id: 3, name: 'Manhattan Beats', plays: 8765, likes: 2765 },
        { id: 4, name: 'Bronx Rhythms', plays: 7654, likes: 2345 },
        { id: 5, name: 'Staten Island Vibes', plays: 6543, likes: 1987 }
      ];
      
      const mockRecentActivity = [
        { id: 1, user: 'john_doe', action: 'uploaded track', target: 'Summer Vibes', time: '2 minutes ago' },
        { id: 2, user: 'jane_smith', action: 'liked', target: 'Urban Dreams', time: '5 minutes ago' },
        { id: 3, user: 'music_fan', action: 'commented on', target: 'City Lights', time: '10 minutes ago' },
        { id: 4, user: 'brooklyn_artist', action: 'followed', target: 'Queens Collective', time: '15 minutes ago' },
        { id: 5, user: 'nyc_music', action: 'shared', target: 'Downtown Sounds', time: '20 minutes ago' }
      ];
      
      setStats(mockStats);
      setTopArtists(mockTopArtists);
      setRecentActivity(mockRecentActivity);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Head>
        <title>NYCMG - Analytics Dashboard</title>
        <meta name="description" content="Analytics dashboard for NYCMG platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Analytics Dashboard
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Platform statistics and insights
            </Typography>
          </Container>
        </Box>

        <Container sx={{ py: 4 }} maxWidth="lg">
          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" color="primary">
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="h6" align="center">
                    Total Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" color="secondary">
                    {stats.totalArtists}
                  </Typography>
                  <Typography variant="h6" align="center">
                    Artists
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" sx={{ color: '#4caf50' }}>
                    {stats.totalTracks}
                  </Typography>
                  <Typography variant="h6" align="center">
                    Tracks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" sx={{ color: '#ff9800' }}>
                    {stats.totalPlays}
                  </Typography>
                  <Typography variant="h6" align="center">
                    Total Plays
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Top Artists */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Artists
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Artist</TableCell>
                          <TableCell align="right">Plays</TableCell>
                          <TableCell align="right">Likes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topArtists.map((artist) => (
                          <TableRow key={artist.id}>
                            <TableCell>{artist.name}</TableCell>
                            <TableCell align="right">{artist.plays.toLocaleString()}</TableCell>
                            <TableCell align="right">{artist.likes.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentActivity.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>{activity.user}</TableCell>
                            <TableCell>
                              {activity.action} <strong>{activity.target}</strong>
                            </TableCell>
                            <TableCell>{activity.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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

export default AnalyticsDashboard;