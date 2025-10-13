#!/usr/bin/env node

/**
 * NYCMG Admin Login Test Script
 * 
 * This script tests admin login functionality.
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Read the .env file to get the API base URL
const envPath = path.join(__dirname, '..', 'backend', '.env');
let apiUrl = 'http://localhost:3002/api/v1'; // Changed from 3001 to 3002

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const portMatch = envContent.match(/PORT=(\d+)/);
  if (portMatch) {
    apiUrl = `http://localhost:${portMatch[1]}/api/v1`;
  }
}

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    console.log(`API URL: ${apiUrl}`);
    
    // Test login with admin credentials
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'AdminPass123!'
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Admin login successful!');
      console.log('User:', data.user);
      console.log('Token:', data.token);
      
      // Test admin-only endpoint
      console.log('\nTesting admin-only endpoint...');
      const adminResponse = await fetch(`${apiUrl}/admin/statistics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log('Admin endpoint access successful!');
        console.log('Statistics:', JSON.stringify(adminData, null, 2));
      } else {
        const errorData = await adminResponse.json();
        console.log('Admin endpoint access failed:', errorData.error);
      }
    } else {
      console.log('Admin login failed:', data.error);
    }
  } catch (error) {
    console.error('Error during admin login test:', error.message);
  }
}

// Run the script
testAdminLogin();