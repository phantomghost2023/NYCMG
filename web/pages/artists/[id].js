import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtist, clearSelectedArtist } from '../../store/artistSlice';
import { Container, Typography, Box, Card, CardContent, CardMedia, CircularProgress, Alert, Chip, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import AlbumList from '../../components/AlbumList';
import ArtistTrackList from '../../components/ArtistTrackList';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import SocialInteractionBar from '../../components/SocialInteractionBar';

const ArtistContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const ArtistHeader = styled(Box)(({ theme }) => ({
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

export default function ArtistPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { selectedArtist, loading, error } = useSelector((state) => state.artists);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchArtist(id));
    }

    return () => {
      dispatch(clearSelectedArtist());
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
      <ArtistContainer maxWidth="md">
        <Alert severity="error">{error}</Alert>
      </ArtistContainer>
    );
  }

  if (!selectedArtist && !loading) {
    return (
      <ArtistContainer maxWidth="md">
        <Alert severity="info">Artist not found</Alert>
      </ArtistContainer>
    );
  }

  // Check if the current user is viewing their own profile
  const isOwnProfile = isAuthenticated && user && selectedArtist && user.id === selectedArtist.user_id;

  return (
    <ArtistContainer maxWidth="md">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : selectedArtist && (
        <>
          <ArtistHeader>
            {isOwnProfile ? (
              <ProfilePictureUpload artist={selectedArtist} />
            ) : selectedArtist.profile_picture_url ? (
              <CardMedia
                component="img"
                image={selectedArtist.profile_picture_url}
                alt={selectedArtist.artist_name}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  margin: '0 auto 20px',
                  border: '3px solid #fff',
                  boxShadow: 3
                }}
              />
            ) : (
              <CardMedia
                component="div"
                sx={{ 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  bgcolor: '#e0e0e0', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '3px solid #fff',
                  boxShadow: 3
                }}
              >
                <Typography variant="h4" component="div" sx={{ color: '#FF4081' }}>
                  {selectedArtist.artist_name.charAt(0)}
                </Typography>
              </CardMedia>
            )}
            <Typography variant="h3" component="h1" gutterBottom>
              {selectedArtist.artist_name}
            </Typography>
            {selectedArtist.user && (
              <Typography variant="h6" color="textSecondary" gutterBottom>
                @{selectedArtist.user.username}
              </Typography>
            )}
            {selectedArtist.verified_nyc && (
              <Chip label="Verified NYC Artist" color="success" />
            )}
            
            {isOwnProfile && (
              <Box sx={{ mt: 2 }}>
                <Link href="/upload" passHref>
                  <Button variant="contained" color="primary">
                    Upload Music
                  </Button>
                </Link>
              </Box>
            )}
          </ArtistHeader>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                About
              </Typography>
              <Typography variant="body1" paragraph>
                This is where the artist's biography would appear. In a full implementation,
                this would show detailed information about the artist, their history, and
                their connection to NYC.
              </Typography>
            </CardContent>
          </Section>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Discography
              </Typography>
              <AlbumList artistId={selectedArtist.id} />
            </CardContent>
          </Section>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Tracks
              </Typography>
              <ArtistTrackList artistId={selectedArtist.id} />
            </CardContent>
          </Section>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Social
              </Typography>
              <SocialInteractionBar 
                entityType="artist" 
                entityId={selectedArtist.id} 
                userId={selectedArtist.user_id} 
              />
            </CardContent>
          </Section>

          <Section>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Upcoming Events
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Information about upcoming shows and events would appear here.
              </Typography>
            </CardContent>
          </Section>
        </>
      )}
    </ArtistContainer>
  );
}