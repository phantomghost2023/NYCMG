import { useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { API_BASE_URL } from 'nycmg-shared';

export default function DebugNetwork() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full URL:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'AdminPass123!'
        }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const text = await response.text();
      console.log('Response text:', text);
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed JSON data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        setResult({ type: 'error', message: 'Invalid JSON response', text });
        return;
      }
      
      if (response.ok) {
        setResult({ type: 'success', status: response.status, data });
      } else {
        setResult({ type: 'error', status: response.status, message: data.error || 'Login failed', data });
      }
    } catch (error) {
      console.error('Network error:', error);
      setResult({ type: 'error', message: error.message, error: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Debug Network
      </Typography>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={testLogin}
          disabled={loading}
          sx={{ backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Login'}
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