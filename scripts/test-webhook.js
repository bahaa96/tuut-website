const http = require('http');
const https = require('https');

// Configuration
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhook/regenerate-sitemap';
const WEBHOOK_SECRET = process.env.SITEMAP_WEBHOOK_SECRET || 'test-secret';

function makeRequest(url, method = 'POST') {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const parsedUrl = new URL(url);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers,
        });
      });
    });

    req.on('error', reject);

    // Add request body for POST
    if (method === 'POST') {
      req.write(JSON.stringify({ test: true }));
    }

    req.end();
  });
}

async function testWebhook() {
  console.log('🧪 Testing Sitemap Regeneration Webhook');
  console.log('=====================================\n');

  try {
    // Test GET request first
    console.log('1️⃣ Testing GET request...');
    const getResponse = await makeRequest(WEBHOOK_URL, 'GET');
    console.log(`Status: ${getResponse.statusCode}`);
    console.log('Response:', JSON.parse(getResponse.body));
    console.log('✅ GET request successful\n');

    // Test POST request
    console.log('2️⃣ Testing POST request...');
    const startTime = Date.now();
    const postResponse = await makeRequest(WEBHOOK_URL, 'POST');
    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log(`Status: ${postResponse.statusCode}`);
    console.log(`Duration: ${duration} seconds`);
    console.log('Response:', JSON.parse(postResponse.body));
    console.log('✅ POST request successful\n');

  } catch (error) {
    console.error('❌ Webhook test failed:', error);
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testWebhook();
}

module.exports = { testWebhook };