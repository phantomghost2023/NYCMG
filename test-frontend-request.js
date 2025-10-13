const { API_BASE_URL } = require('./shared');

console.log('API_BASE_URL:', API_BASE_URL);

// Test a simple fetch request
fetch(`${API_BASE_URL}/auth/dev-token`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));