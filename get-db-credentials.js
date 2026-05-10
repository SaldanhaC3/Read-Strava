const https = require('https');

const projectRef = 'ndpexvlmtnzcgkwzoqyr';
const token = 'sb_publishable_6OtEM9uHFpSyeTmBTrzRAQ_xj3xWGpz';

// Try to get database info
const options = {
  hostname: 'api.supabase.com',
  path: `/v1/projects/${projectRef}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
