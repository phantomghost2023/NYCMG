const fs = require('fs');
const path = require('path');

// Simple test runner that just checks if test files exist
const testDir = '__tests__';
const testFiles = fs.readdirSync(testDir);

console.log('Found test files:');
testFiles.forEach(file => {
  console.log(`- ${file}`);
});

console.log('\nTest setup appears to be complete.');
console.log('To run tests, you would typically use a command like:');
console.log('npx jest');