import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtists } from '../../store/artistSlice';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const BoroughContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(4),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const ArtistCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

export default function BoroughPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { artists, loading, error, totalCount } = useSelector((state) => state.artists);
  const [boroughName, setBoroughName] = useState('');

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch the borough details
      // For now, we'll just set a placeholder name
      setBoroughName(`Borough ${id}`);
      
      // Fetch artists for this borough
      // In a real app, you would pass the borough ID as a filter
      dispatch(fetchArtists());
    }
  }, [id, dispatch]);

  if (router.isFallback) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BoroughContainer maxWidth="lg">
      <Header>
        <Typography variant="h3" component="h1" gutterBottom>
          {boroughName}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Discover local artists in this borough
        </Typography>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Artists in {boroughName}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {totalCount} artists found
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {artists.map((artist) => (
            <Grid item key={artist.id} xs={12} sm={6} md={4}>
              <ArtistCard>
                <CardMedia
                  component="div"
                  sx={{ pt: '56.25%', bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography variant="h2" component="div" sx={{ color: '#FF4081' }}>
                    {artist.artist_name.charAt(0)}
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {artist.artist_name}
                  </Typography>
                  {artist.user && (
                    <Typography variant="body2" color="textSecondary">
                      @{artist.user.username}
                    </Typography>
                  )}
                </CardContent>
              </ArtistCard>
            </Grid>
          ))}
        </Grid>
      )}
    </BoroughContainer>
  );
}