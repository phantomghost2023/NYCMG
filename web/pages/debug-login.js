import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';

export default function DebugLogin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('AdminPass123!');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDirectFetch = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Making direct fetch request...');
      const response = await fetch('http://localhost:3002/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response received:', response);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const text = await response.text();
      console.log('Response text:', text);
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Parsed JSON data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        setResult({ success: false, error: 'Invalid response format', text });
        return;
      }
      
      if (response.ok) {
        setResult({ success: true, data });
      } else {
        setResult({ success: false, error: data.error || 'Login failed', data });
      }
    } catch (error) {
      console.error('Network error:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Debug Login
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
          onClick={handleDirectFetch}
          disabled={loading}
          sx={{ mt: 2, backgroundColor: '#FF4081', '&:hover': { backgroundColor: '#F50057' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Direct Fetch'}
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