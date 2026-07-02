const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Load API Key
const envLocalPath = path.join(__dirname, '../.env.local');
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

const tasksPath = path.join(__dirname, 'batch-1-tasks.json');
if (!fs.existsSync(tasksPath)) {
  console.error("batch-1-tasks.json not found! Please run prepare-batch-1-prompts.js first.");
  process.exit(1);
}

const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
const imagesDir = path.join(__dirname, '../public/images/giants');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Check if a file is the silhouette placeholder
function isPlaceholder(filePath) {
  if (!fs.existsSync(filePath)) return true;
  const data = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5').update(data).digest('hex');
  return hash === '88a94c58262da745a416b6e386e7abd0';
}

// Helper to call Imagen 4 API
function generateImage(prompt) {
  const requestData = JSON.stringify({
    instances: [{ prompt: prompt }],
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

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject({ code: res.statusCode, body: data });
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.predictions && parsed.predictions[0]) {
            resolve(parsed.predictions[0].bytesBase64Encoded);
          } else {
            reject(new Error("Unexpected response format"));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => { reject(err); });
    req.write(requestData);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log(`Starting Batch 1 image generation for ${tasks.length} giants...`);
  
  let newImagesGenerated = 0;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const targetPath = path.join(imagesDir, `${task.slug}.jpg`);

    if (!isPlaceholder(targetPath)) {
      console.log(`[${i + 1}/${tasks.length}] Skipping ${task.slug} (image already exists and is not a silhouette)`);
      continue;
    }

    console.log(`\n[${i + 1}/${tasks.length}] Generating illustration for: ${task.slug} (${task.name})`);
    console.log(`Prompt: "${task.prompt}"`);

    let success = false;
    let retries = 0;

    while (!success && retries < 3) {
      try {
        const base64Data = await generateImage(task.prompt);
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(targetPath, buffer);
        console.log(`Successfully saved illustration to public/images/giants/${task.slug}.jpg`);
        success = true;
        newImagesGenerated++;
      } catch (err) {
        retries++;
        console.error(`Error generating for ${task.slug} (Attempt ${retries}/3):`, err.body || err.message);
        
        if (err.code === 429) {
          console.log("Rate limit (429) encountered. Sleeping for 65 seconds...");
          await sleep(65000);
        } else {
          console.log("Other error occurred. Sleeping for 10 seconds before retry...");
          await sleep(10000);
        }
      }
    }

    if (!success) {
      console.error(`Failed to generate illustration for ${task.slug} after multiple retries. Halting process to avoid further errors.`);
      break;
    }

    // Delay between normal requests to avoid hitting rate limits
    await sleep(3000);
  }

  console.log(`\nProcess completed! Generated ${newImagesGenerated} new illustrations in this run.`);
}

run().catch(err => {
  console.error("Critical error in generation loop:", err);
  process.exit(1);
});
