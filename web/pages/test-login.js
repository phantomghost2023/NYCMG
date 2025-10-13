import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../src/store/authSlice';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';

export default function TestLogin() {
  const [email, setEmail] = useState('devtest@example.com');
  const [password, setPassword] = useState('DevPass123!');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleTestLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Dispatching login action with:', { email, password });
      const response = await dispatch(login({ email, password }));
      console.log('Login action response:', response);
      
      if (login.fulfilled.match(response)) {
        setResult({ success: true, data: response.payload });
      } else if (login.rejected.match(response)) {
        setResult({ success: false, error: response.payload });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Test Login
      </Typography>
      
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
          onClick={handleTestLogin}
          disabled={loading}
          sx={{ mt: 2, backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Login'}
        </Button>
        
        {result && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: result.success ? '#e8f5e9' : '#ffebee', borderRadius: 1 }}>
            <Typography variant="h6" component="h2">
              Result:
            </Typography>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        )}
      </Box>
    </Container>
  );
}