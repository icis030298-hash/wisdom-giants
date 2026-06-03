require('dotenv').config({ path: '.env.local' });
const https = require('https');

const APIKEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

function testModel(model) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: "Hello, tell me a 1-word greeting." }] }]
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${model}:generateContent?key=${APIKEY}`,
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Content-Length': Buffer.byteLength(body) 
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            resolve({ model, ok: false, error: parsed.error.message });
          } else {
            resolve({ model, ok: true, text: parsed?.candidates?.[0]?.content?.parts?.[0]?.text });
          }
        } catch (e) {
          resolve({ model, ok: false, error: e.message });
        }
      });
    });
    req.on('error', e => resolve({ model, ok: false, error: e.message }));
    req.write(body);
    req.end();
  });
}

async function main() {
  const models = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest'
  ];
  for (const model of models) {
    const res = await testModel(model);
    console.log(`Model: ${model} -> OK: ${res.ok}, Res: ${res.text || res.error}`);
  }
}

main().catch(console.error);
