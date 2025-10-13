// Simple test to verify track upload functionality
const fs = require('fs');

// Read the test data file
const testData = JSON.parse(fs.readFileSync('test-data.json', 'utf8'));

console.log('Using token:', testData.token);
console.log('Artist ID:', testData.artistId);

// Instructions for manual testing
console.log(`
To test track upload:

1. Open test-upload.html in your browser
2. Fill in the form with:
   - Title: "Test Track"
   - Description: "This is a test track"
   - Audio File: Select the test-audio.wav file
   - Token: ${testData.token}
3. Click "Upload Track"

Or use this curl command:

curl -X POST http://localhost:3001/api/v1/track-upload/upload \\
  -H "Authorization: Bearer ${testData.token}" \\
  -F "title=Test Track" \\
  -F "description=This is a test track" \\
  -F "audio=@test-audio.wav" \\
  -F "isExplicit=false"
`);