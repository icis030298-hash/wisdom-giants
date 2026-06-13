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

const missingImagesPath = path.join(__dirname, 'missing-images.json');
if (!fs.existsSync(missingImagesPath)) {
  console.error("missing-images.json not found!");
  process.exit(1);
}

const missingImages = JSON.parse(fs.readFileSync(missingImagesPath, 'utf8'));
console.log(`Loaded ${missingImages.length} missing giants.`);

// Helper function to call Gemini API
function callGemini(batch, batchNum) {
  const prompt = `You are an expert design assistant.
We need to generate a flat vector illustration avatar for each historical giant in the list.
For each giant, assign a simple, iconic, symbolic prop relevant to their life or achievements (e.g., Galileo -> holding a telescope, Homer -> holding a lyre, Turing -> holding a cogwheel/paper tape, etc.). Keep it to ONE simple prop.
Formulate a prompt in the "NanoBanana MBTI" style:
- "A modern flat vector avatar of [English Name] [action with prop, e.g. holding a telescope / holding a quill], clean lines, highly stylized, character portrait. Solid pastel circle background. [background color]."
- Background color mapping based on category:
  - "philosophy": "deep navy or blue background"
  - "science": "cool teal or green background"
  - "arts": "vibrant pastel pink or soft violet background"
  - "society": "cool teal or green background"
  - "leadership": "bold amber or orange background"
  - "business": "bold amber or orange background"

Please output a JSON array of objects. Each object should have:
- slug: (use original slug)
- name: (use original name)
- category: (use original category)
- prop: (simple description of the selected prop, e.g. "telescope")
- prompt: (the full English prompt generated based on instructions above)

Input giants (Batch ${batchNum}):
${JSON.stringify(batch, null, 2)}

Return ONLY the valid JSON array block. No markdown wrapper, no extra text.`;

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

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API Error: ${res.statusCode}\nResponse: ${data}`));
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const text = parsed.candidates[0].content.parts[0].text;
          const jsonResult = JSON.parse(text.trim());
          resolve(jsonResult);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}\nRaw text: ${data}`));
        }
      });
    });

    req.on('error', (err) => { reject(err); });
    req.write(requestData);
    req.end();
  });
}

async function run() {
  const mid = Math.ceil(missingImages.length / 2);
  const batch1 = missingImages.slice(0, mid);
  const batch2 = missingImages.slice(mid);

  console.log(`Requesting Batch 1 (${batch1.length} giants)...`);
  const res1 = await callGemini(batch1, 1);
  console.log(`Successfully received Batch 1 prompts.`);

  console.log(`Requesting Batch 2 (${batch2.length} giants)...`);
  const res2 = await callGemini(batch2, 2);
  console.log(`Successfully received Batch 2 prompts.`);

  const allPrompts = [...res1, ...res2];
  const outputPath = path.join(__dirname, 'pending-generation-tasks.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPrompts, null, 2), 'utf8');
  console.log(`Saved ${allPrompts.length} prompt tasks to ${outputPath}`);
}

run().catch(err => {
  console.error("Error running script:", err);
  process.exit(1);
});
