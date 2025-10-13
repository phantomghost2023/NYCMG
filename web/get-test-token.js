// Script to register a test user, create an artist, and get a valid token
const fs = require('fs');

// Wait for rate limiter to reset
setTimeout(async () => {
  try {
    // Register a new user
    const registerResponse = await fetch('http://localhost:3001/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'uploadtest@example.com',
        username: 'uploadtest',
        password: 'StrongPass123!'
      })
    });
    
    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      console.log('Registration failed:', error.error);
      return;
    }
    
    const registerData = await registerResponse.json();
    console.log('User registered successfully');
    
    // Login to get token
    const loginResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'uploadtest@example.com',
        password: 'StrongPass123!'
      })
    });
    
    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.log('Login failed:', error.error);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('User logged in successfully');
    console.log('Token:', loginData.token);
    
    // Create artist profile
    const artistResponse = await fetch('http://localhost:3001/api/v1/artists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        artist_name: 'Upload Test Artist'
      })
    });
    
    if (!artistResponse.ok) {
      const error = await artistResponse.json();
      console.log('Artist creation failed:', error.error);
      return;
    }
    
    const artistData = await artistResponse.json();
    console.log('Artist created successfully');
    console.log('Artist ID:', artistData.id);
    
    // Save token and artist info to a file
    const testData = {
      token: loginData.token,
      userId: loginData.user.id,
      artistId: artistData.id
    };
    
    fs.writeFileSync('test-data.json', JSON.stringify(testData, null, 2));
    console.log('Test data saved to test-data.json');
    console.log('Use this token in the test-upload.html page');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}, 5000); // Wait 5 seconds for rate limiter