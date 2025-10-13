// Complete test script to verify track upload functionality
const fs = require('fs');

async function runTest() {
  try {
    console.log('Getting dev token...');
    
    // Get dev token
    const tokenResponse = await fetch('http://localhost:3001/api/v1/auth/dev-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.log('Failed to get dev token:', error.error);
      return;
    }
    
    const tokenData = await tokenResponse.json();
    const token = tokenData.token;
    console.log('Got dev token successfully');
    
    console.log('Creating artist profile...');
    
    // Create artist profile
    const artistResponse = await fetch('http://localhost:3001/api/v1/artists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        artist_name: 'Dev Test Artist'
      })
    });
    
    if (!artistResponse.ok) {
      const error = await artistResponse.json();
      console.log('Failed to create artist:', error.error);
      return;
    }
    
    const artistData = await artistResponse.json();
    console.log('Artist created successfully with ID:', artistData.id);
    
    console.log('Testing track upload...');
    
    // Create FormData for track upload
    const formData = new FormData();
    formData.append('title', 'Test Track');
    formData.append('description', 'This is a test track');
    formData.append('isExplicit', 'false');
    
    // Add the test audio file
    const audioFile = fs.readFileSync('test-audio.wav');
    const audioBlob = new Blob([audioFile], { type: 'audio/wav' });
    formData.append('audio', audioBlob, 'test-audio.wav');
    
    // Upload track
    const uploadResponse = await fetch('http://localhost:3001/api/v1/track-upload/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const uploadResult = await uploadResponse.json();
    
    if (uploadResponse.ok) {
      console.log('Track uploaded successfully!');
      console.log('Track ID:', uploadResult.track.id);
    } else {
      console.log('Track upload failed:', uploadResult.error);
    }
    
  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

runTest();