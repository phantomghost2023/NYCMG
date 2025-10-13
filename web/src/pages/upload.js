import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Alert } from '@mui/material';
import { loadUserFromStorage } from '../store/authSlice';
import TrackUpload from '../components/TrackUpload';

export default function UploadTrack() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
          Upload New Track
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          As an artist, you can upload your music tracks to share with the NYCMG community.
        </Alert>
        
        <TrackUpload />
      </Box>
    </Container>
  );
}