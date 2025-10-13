import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem, Paper, CircularProgress } from '@mui/material';
import { loadUserFromStorage, fetchProfile } from '../src/store/authSlice';
import TrackUpload from '../src/components/TrackUpload';
import AlbumUpload from '../src/components/AlbumUpload';
import EPUpload from '../src/components/EPUpload';

export default function Upload() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [uploadType, setUploadType] = useState('track');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        // Check if user is authenticated
        dispatch(loadUserFromStorage());
        
        // Verify token with backend if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          // Dispatch fetchProfile and wait for result
          const result = await dispatch(fetchProfile());
          
          // Check if profile fetch was successful
          if (fetchProfile.fulfilled.match(result)) {
            console.log('Token verification successful');
          } else if (fetchProfile.rejected.match(result)) {
            console.log('Token verification failed:', result.payload);
            // Token is invalid, clear it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Authentication verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuthentication();
  }, [dispatch]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isVerifying && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isVerifying, router]);

  // Handle upload type change
  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
  };

  // Show loading state while verifying authentication
  if (isVerifying || loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography>Verifying authentication...</Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  // Show redirect message if not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Redirecting to login...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Music
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          As an artist, you can upload your music to share with the NYCMG community.
        </Alert>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select Upload Type</InputLabel>
            <Select
              value={uploadType}
              label="Select Upload Type"
              onChange={handleUploadTypeChange}
            >
              <MenuItem value="track">Single Track</MenuItem>
              <MenuItem value="ep">EP (3-6 tracks)</MenuItem>
              <MenuItem value="album">Full Album</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        
        {uploadType === 'track' && <TrackUpload />}
        {uploadType === 'ep' && <EPUpload />}
        {uploadType === 'album' && <AlbumUpload uploadType="album" />}
      </Box>
    </Container>
  );
}