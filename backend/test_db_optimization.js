// Simple test script for database optimization service
console.log('Testing database optimization service...');

// Import the service
try {
  const { optimizeConnectionPool } = require('./src/services/dbOptimization.service');
  console.log('Database optimization service imported successfully');
  
  // Test connection pool optimization
  const result = optimizeConnectionPool();
  console.log('Connection pool optimization result:', result);
  
  console.log('Test completed successfully');
} catch (error) {
  console.error('Error testing database optimization service:', error.message);
}