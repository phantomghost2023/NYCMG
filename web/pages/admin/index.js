import Head from 'next/head';
import Link from 'next/link';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import Navigation from '../../src/components/Navigation';

const AdminDashboard = () => {
  return (
    <div>
      <Head>
        <title>NYCMG - Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for NYCMG platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              Manage the NYCMG platform
            </Typography>
          </Container>
        </Box>

        <Container sx={{ py: 4 }} maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{ height: 140, bgcolor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography variant="h4" component="div" sx={{ color: 'white' }}>
                    Users
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    User Management
                  </Typography>
                  <Typography>
                    Manage user accounts, permissions, and roles.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Link href="/admin/users" passHref>
                    <Button variant="contained" fullWidth>
                      Manage Users
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{ height: 140, bgcolor: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography variant="h4" component="div" sx={{ color: 'white' }}>
                    Content
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Content Moderation
                  </Typography>
                  <Typography>
                    Review and moderate user-generated content.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Link href="/admin/moderation" passHref>
                    <Button variant="contained" fullWidth>
                      Moderate Content
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{ height: 140, bgcolor: '#ff9800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography variant="h4" component="div" sx={{ color: 'white' }}>
                    Analytics
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Analytics & Reports
                  </Typography>
                  <Typography>
                    View platform statistics and generate reports.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Link href="/admin/analytics" passHref>
                    <Button variant="contained" fullWidth>
                      View Analytics
                    </Button>
                  </Link>
                </Box>
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

export default AdminDashboard;