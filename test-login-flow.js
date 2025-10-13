// Test the complete login flow
// Use built-in fetch if available (Node.js 18+), otherwise use a simple approach

async function testLoginFlow() {
  try {
    console.log('Testing dev token generation...');
    
    // Get dev token
    const devTokenResponse = await fetch('http://localhost:3002/api/v1/auth/dev-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Dev token response status:', devTokenResponse.status);
    
    if (!devTokenResponse.ok) {
      const errorData = await devTokenResponse.text();
      console.log('Dev token error:', errorData);
      return;
    }
    
    const devTokenData = await devTokenResponse.json();
    console.log('Dev token data:', JSON.stringify(devTokenData, null, 2));
    
    // Now try to use the token to get profile
    console.log('\nTesting profile fetch with token...');
    const profileResponse = await fetch('http://localhost:3002/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${devTokenData.token}`
      }
    });
    
    console.log('Profile response status:', profileResponse.status);
    
    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.log('Profile fetch error:', errorData);
      return;
    }
    
    const profileData = await profileResponse.json();
    console.log('Profile data:', JSON.stringify(profileData, null, 2));
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// If we're in Node.js and fetch is not available, use a simple HTTP request
if (typeof fetch === 'undefined') {
  const http = require('http');
  
  // Simple HTTP POST request function
  function httpRequest(options, postData) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data)
          });
        });
      });
      
      req.on('error', (e) => {
        reject(e);
      });
      
      if (postData) {
        req.write(postData);
      }
      
      req.end();
    });
  }
  
  // Override fetch for this test
  global.fetch = (url, options = {}) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    
    return httpRequest(requestOptions, options.body);
  };
}

testLoginFlow();