const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API Key
const envLocalPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error("API Key not found in .env.local!");
  process.exit(1);
}

const prompt = "A modern flat vector avatar of Cicero holding a scroll, clean lines, highly stylized, character portrait. Solid pastel circle background. deep navy or blue background.";

const requestData = JSON.stringify({
  instances: [
    {
      prompt: prompt
    }
  ],
  parameters: {
    sampleCount: 1,
    aspectRatio: "1:1",
    outputMimeType: "image/jpeg"
  }
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

console.log("Sending request to Imagen 3 API...");

const req = https.request(options, (res) => {
  console.log("Status Code:", res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error("Error Response:", data);
      return;
    }
    try {
      const parsed = JSON.parse(data);
      if (parsed.predictions && parsed.predictions[0]) {
        const base64Data = parsed.predictions[0].bytesBase64Encoded;
        const buffer = Buffer.from(base64Data, 'base64');
        const testOutputPath = path.join(__dirname, 'cicero_test.jpg');
        fs.writeFileSync(testOutputPath, buffer);
        console.log(`Success! Image saved to ${testOutputPath}`);
      } else {
        console.log("Unexpected response format:", parsed);
      }
    } catch (e) {
      console.error("Parsing error:", e.message);
      console.error("Raw response:", data.slice(0, 1000));
    }
  });
});

req.on('error', (err) => {
  console.error("Request error:", err);
});

req.write(requestData);
req.end();
