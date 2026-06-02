const fs = require('fs');
const path = require('path');
const https = require('https');

const envLocalPath = path.join(__dirname, '..', '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error("Error: NEXT_PUBLIC_GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const prompt = "Reply with 'API is working fine' if you receive this message.";
const requestData = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("STATUS:", res.statusCode);
    console.log("RESPONSE:", data);
  });
});

req.on('error', (err) => { console.error(err); });
req.write(requestData);
req.end();
