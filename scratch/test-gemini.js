const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API Key from .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

const original = {
  "name": "Walt Disney",
  "headline": "The pioneer of imagination who turned dreams into reality and enchanted the world.",
  "shortDescription": "The magical journey of Walt Disney and his creative soul.",
  "quote": "If you can dream it, you can do it.",
  "era": "20th Century Giant",
  "chatGreeting": "Greetings, I am Walt Disney. Do you seek the path of wisdom or have questions about my life's journey?",
  "suggestedQuestions": [
    "Tell me about your greatest achievement, Walt Disney.",
    "How did you overcome your most difficult challenges?",
    "What is the most important piece of advice you can give me?"
  ]
};

const prompt = `You are an expert translator. Translate the following JSON object fields into professional, inspiring German.
Fields to translate:
- name: Keep historical name in German format.
- headline: Inspiring German headline.
- shortDescription: Inspiring German description.
- quote: Famous German quote translation.
- chatGreeting: An inspiring greeting in German.
- suggestedQuestions: Translate the 3 questions into German.

Input JSON:
${JSON.stringify(original, null, 2)}

Return ONLY the valid translated JSON block.`;

const requestData = JSON.stringify({
  contents: [{
    parts: [{ text: prompt }]
  }],
  generationConfig: {
    responseMimeType: "application/json"
  }
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

const req = https.request(options, (res) => {
  console.log("Status:", res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Raw Response:", data);
  });
});

req.on('error', (err) => {
  console.error("Error:", err);
});

req.write(requestData);
req.end();
