const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

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

const pendingTasksPath = path.join(__dirname, 'pending-generation-tasks.json');
if (!fs.existsSync(pendingTasksPath)) {
  console.error("pending-generation-tasks.json not found!");
  process.exit(1);
}

const pendingTasks = JSON.parse(fs.readFileSync(pendingTasksPath, 'utf8'));
const imagesDir = path.join(__dirname, '../public/images/giants');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
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

// Git push utility
function gitPushCheckpoint(count) {
  try {
    console.log(`[Git] Committing batch of ${count} new illustrations...`);
    execSync('git add public/images/giants/ scratch/image-generation-progress.json', { stdio: 'inherit' });
    execSync('git commit -m "feat(illustration): add next batch of giant avatars via private key"', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    console.log(`[Git] Successfully pushed progress checkpoint.`);
  } catch (err) {
    console.error(`[Git] Error during push checkpoint:`, err.message);
  }
}

// Update progress file
function updateProgressFile() {
  try {
    const files = fs.readdirSync(imagesDir);
    const completedSlugs = [];
    files.forEach(file => {
      if (file.endsWith('.jpg') || file.endsWith('.png')) {
        completedSlugs.push(path.parse(file).name);
      }
    });
    fs.writeFileSync(path.join(__dirname, 'image-generation-progress.json'), JSON.stringify(completedSlugs, null, 2), 'utf8');
    console.log(`[Progress] Synchronized image-generation-progress.json with ${completedSlugs.length} slugs.`);
  } catch (err) {
    console.error(`[Progress] Failed to update progress file:`, err.message);
  }
}

async function run() {
  console.log("Starting private key-based image generation process...");

  let newImagesGenerated = 0;

  for (let i = 0; i < pendingTasks.length; i++) {
    const task = pendingTasks[i];
    const targetPath = path.join(imagesDir, `${task.slug}.jpg`);

    if (fs.existsSync(targetPath)) {
      // Already exists, skip
      continue;
    }

    console.log(`\n[${i + 1}/${pendingTasks.length}] Generating for: ${task.slug} (${task.name})`);
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
        
        // Update local progress
        updateProgressFile();
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

    // Git push checkpoint every 10 images
    if (newImagesGenerated > 0 && newImagesGenerated % 10 === 0) {
      gitPushCheckpoint(newImagesGenerated);
    }

    // Delay between normal requests to avoid hitting rate limits
    await sleep(3000);
  }

  // Final push if any new images were generated
  if (newImagesGenerated > 0) {
    gitPushCheckpoint(newImagesGenerated);
  }

  console.log(`\nProcess completed! Generated ${newImagesGenerated} new illustrations in this run.`);
}

run().catch(err => {
  console.error("Critical error in generation loop:", err);
  process.exit(1);
});
