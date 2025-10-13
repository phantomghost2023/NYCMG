import { useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';

export default function SimpleTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing fetch to health endpoint...');
      const response = await fetch('http://localhost:3002/health');
      const data = await response.json();
      setResult({ type: 'success', data });
    } catch (error) {
      console.error('Fetch error:', error);
      setResult({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testLoginFetch = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing login fetch...');
      const response = await fetch('http://localhost:3002/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'AdminPass123!'
        }),
      });
      
      console.log('Login response:', response);
      const text = await response.text();
      console.log('Response text:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        setResult({ type: 'error', message: 'Invalid JSON response', text });
        return;
      }
      
      if (response.ok) {
        setResult({ type: 'success', data });
      } else {
        setResult({ type: 'error', message: data.error || 'Login failed', data });
      }
    } catch (error) {
      console.error('Login fetch error:', error);
      setResult({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Simple Test
      </Typography>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={testFetch}
          disabled={loading}
          sx={{ backgroundColor: '#2196F3', '&:hover': { backgroundColor: '#1976D2' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Health Endpoint'}
        </Button>
        
        <Button
          variant="contained"
          onClick={testLoginFetch}
          disabled={loading}
          sx={{ backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Login Fetch'}
        </Button>
      </Box>
      
      {result && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: result.type === 'success' ? '#e8f5e9' : '#ffebee', borderRadius: 1 }}>
          <Typography variant="h6" component="h2">
            Result:
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Box>
      )}
    </Container>
  );
}