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

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        const imageModels = parsed.models.filter(m => m.name.toLowerCase().includes('image') || m.name.toLowerCase().includes('imagen'));
        console.log("All image models found:");
        console.log(JSON.stringify(imageModels, null, 2));
        if (imageModels.length === 0) {
          console.log("No image models found. Total models available:", parsed.models.map(m => m.name));
        }
      } else {
        console.log("Response does not contain models list:", parsed);
      }
    } catch(e) {
      console.error("Error parsing response:", e.message);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
