/**
 * Test script for AI Error Handling Integration
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testAIErrorHandling() {
  console.log('🧪 Testing AI Error Handling Integration...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ Health Check:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health Check Failed:', error.message);
      console.log('   Make sure the backend server is running on port 3001');
      return;
    }

    // Test 2: AI Error Handling health check
    console.log('\n2. Testing AI Error Handling health endpoint...');
    try {
      const aiHealthResponse = await axios.get(`${API_BASE_URL}/api/v1/ai-error-handling/health`);
      console.log('✅ AI Error Handling Health:', aiHealthResponse.data);
    } catch (error) {
      console.log('❌ AI Error Handling Health Failed:', error.message);
    }

    // Test 3: Error statistics
    console.log('\n3. Testing error statistics endpoint...');
    try {
      const statsResponse = await axios.get(`${API_BASE_URL}/api/v1/ai-error-handling/stats`, {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Error Statistics:', statsResponse.data);
    } catch (error) {
      console.log('❌ Error Statistics Failed:', error.message);
    }

    // Test 4: Recent errors
    console.log('\n4. Testing recent errors endpoint...');
    try {
      const recentResponse = await axios.get(`${API_BASE_URL}/api/v1/ai-error-handling/recent?limit=5`, {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Recent Errors:', recentResponse.data);
    } catch (error) {
      console.log('❌ Recent Errors Failed:', error.message);
    }

    // Test 5: AI Chat (if available)
    console.log('\n5. Testing AI chat endpoint...');
    try {
      const chatResponse = await axios.post(`${API_BASE_URL}/api/v1/ai-error-handling/chat`, {
        message: 'Hello, can you help me with error handling?',
        context: {
          component: 'test',
          userAgent: 'Test Script',
          timestamp: new Date().toISOString()
        }
      }, {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ AI Chat Response:', chatResponse.data);
    } catch (error) {
      console.log('❌ AI Chat Failed:', error.message);
    }

    console.log('\n🎉 AI Error Handling Integration Test Completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start your backend server: cd backend && npm start');
    console.log('2. Start your web app: cd web && npm run dev');
    console.log('3. Navigate to http://localhost:3000/error-handling');
    console.log('4. Test the mobile app error handling screen');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAIErrorHandling();
