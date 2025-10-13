// Use built-in fetch if available (Node.js 18+), otherwise require node-fetch
const fetch = global.fetch || require('node-fetch');

async function testConnection() {
  try {
    console.log('Testing connection to backend...');
    
    // Test basic connection
    const healthResponse = await fetch('http://localhost:3002/health');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health check data:', healthData);
    }
    
    // Test login endpoint
    console.log('\nTesting login endpoint...');
    const loginResponse = await fetch('http://localhost:3002/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'AdminPass123!'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login successful!');
      console.log('User:', loginData.user);
      console.log('Token length:', loginData.token.length);
    } else {
      const errorData = await loginResponse.json();
      console.log('Login failed:', errorData);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testConnection();