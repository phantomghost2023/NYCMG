import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrack, clearSelectedTrack } from '../../store/trackSlice';
import { Container, Typography, Box, Card, CardContent, CardMedia, CircularProgress, Alert, Chip, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AudioPlayer from '../../components/AudioPlayer';
import SocialInteractionBar from '../../components/SocialInteractionBar';

const TrackContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const TrackHeader = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(4),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const Section = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

export default function TrackPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { selectedTrack, loading, error } = useSelector((state) => state.tracks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTrack(id));
    }

    return () => {
      dispatch(clearSelectedTrack());
    };
  }, [id, dispatch]);

  if (router.isFallback) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <TrackContainer maxWidth="md">
        <Alert severity="error">{error}</Alert>
      </TrackContainer>
    );
  }

  if (!selectedTrack && !loading) {
    return (
      <TrackContainer maxWidth="md">
        <Alert severity="info">Track not found</Alert>
      </TrackContainer>
    );
  }

  return (
    <TrackContainer maxWidth="md">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : selectedTrack && (
        <>
          <TrackHeader>
            {selectedTrack.cover_art_url ? (
              <CardMedia
                component="img"
                image={selectedTrack.cover_art_url}
                alt={selectedTrack.title}
                sx={{ 
                  width: 200, 
                  height: 200, 
                  margin: '0 auto 20px',
                  border: '3px solid #fff',
                  boxShadow: 3
                }}
              />
            ) : (
              <CardMedia
                component="div"
                sx={{ 
                  width: 200, 
                  height: 200, 
                  margin: '0 auto 20px',
                  border: '3px solid #fff',
                  boxShadow: 3,
                  bgcolor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h1" component="div" sx={{ color: '#FF4081' }}>
                  ♪
                </Typography>
              </CardMedia>
            )}
            <Typography variant="h3" component="h1" gutterBottom>
              {selectedTrack.title}
            </Typography>
            {selectedTrack.artist && (
              <Typography variant="h6" color="textSecondary" gutterBottom>
                by {selectedTrack.artist.artist_name}
              </Typography>
            )}
            {selectedTrack.release_date && (
              <Typography variant="body1" color="textSecondary">
                Released: {new Date(selectedTrack.release_date).toLocaleDateString()}
              </Typography>
            )}
            {selectedTrack.is_explicit && (
              <Chip label="Explicit" color="error" size="small" />
            )}
          </TrackHeader>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Listen
              </Typography>
              <AudioPlayer track={selectedTrack} />
            </CardContent>
          </Section>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedTrack.description || 'No description available.'}
              </Typography>
              
              {selectedTrack.genres && selectedTrack.genres.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Genres
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedTrack.genres.map((genre) => (
                      <Chip key={genre.id} label={genre.name} variant="outlined" />
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Section>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Social
              </Typography>
              <SocialInteractionBar 
                entityType="track" 
                entityId={selectedTrack.id} 
                userId={selectedTrack.artist?.user_id} 
              />
            </CardContent>
          </Section>
        </>
      )}
    </TrackContainer>
  );
}