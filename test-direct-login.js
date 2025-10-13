const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing direct login with admin credentials...');
    
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
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('Login successful!');
    } else {
      console.log('Login failed:', data.error);
    }
  } catch (error) {
    console.error('Error during login test:', error.message);
  }
}

testLogin();