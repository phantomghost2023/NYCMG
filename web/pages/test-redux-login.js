import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../src/store/authSlice';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

export default function TestReduxLogin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('AdminPass123!');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleReduxLogin = async () => {
    console.log('Dispatching login action with:', { email, password });
    const result = await dispatch(login({ email, password }));
    console.log('Login action result:', result);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Test Redux Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mt: 4 }}>
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
          onClick={handleReduxLogin}
          disabled={loading}
          sx={{ mt: 2, backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Redux Login'}
        </Button>
      </Box>
    </Container>
  );
}