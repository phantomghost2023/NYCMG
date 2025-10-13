import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../src/store/authSlice';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

export default function TestNetwork() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('AdminPass123!');
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting login with credentials:', { email, password });
    const result = await dispatch(login({ email, password }));
    console.log('Login result:', result);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Test Network Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={handleLogin}
        sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}
      >
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ mt: 2, backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Debug Information:</Typography>
        <Typography>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Typography>
        <Typography>Loading: {loading ? 'Yes' : 'No'}</Typography>
        <Typography>Error: {error || 'None'}</Typography>
      </Box>
    </Container>
  );
}