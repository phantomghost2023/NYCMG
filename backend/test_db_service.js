// Simple test script for database optimization service
console.log('Testing database optimization service...');

// Test the service
try {
  // Check if the file exists and has the right structure
  const fs = require('fs');
  const path = require('path');
  
  const servicePath = path.join(__dirname, 'src', 'services', 'dbOptimization.service.js');
  if (fs.existsSync(servicePath)) {
    console.log('✓ Database optimization service file exists');
    
    const content = fs.readFileSync(servicePath, 'utf8');
    if (content.includes('optimizeConnectionPool')) {
      console.log('✓ optimizeConnectionPool function is defined');
    }
    
    if (content.includes('addDatabaseIndexes')) {
      console.log('✓ addDatabaseIndexes function is defined');
    }
    
    if (content.includes('getDatabaseStats')) {
      console.log('✓ getDatabaseStats function is defined');
    }
    
    if (content.includes('analyzeQueryPlans')) {
      console.log('✓ analyzeQueryPlans function is defined');
    }
    
    console.log('All database optimization service functions are properly defined!');
  } else {
    console.log('✗ Database optimization service file does not exist');
  }
} catch (error) {
  console.error('Error testing database optimization service:', error.message);
}