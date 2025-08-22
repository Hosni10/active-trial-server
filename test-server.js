const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testServer() {
  console.log('Testing Atomics Trial Backend Server...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    console.log('✅ Health endpoint working\n');

    // Test stats endpoint
    console.log('2. Testing stats endpoint...');
    const statsResponse = await fetch(`${BASE_URL}/api/tournament-registrations/stats`);
    const statsData = await statsResponse.json();
    console.log('Stats:', statsData);
    console.log('✅ Stats endpoint working\n');

    // Test registrations endpoint
    console.log('3. Testing registrations endpoint...');
    const registrationsResponse = await fetch(`${BASE_URL}/api/tournament-registrations`);
    const registrationsData = await registrationsResponse.json();
    console.log('Registrations:', registrationsData);
    console.log('✅ Registrations endpoint working\n');

    console.log('🎉 All endpoints are working correctly!');
    console.log('\nServer is ready to handle tournament registrations.');

  } catch (error) {
    console.error('❌ Error testing server:', error.message);
    console.log('\nMake sure:');
    console.log('1. MongoDB is running');
    console.log('2. Server is started with: npm run dev');
    console.log('3. Port 5000 is available');
  }
}

// Run the test
testServer();
