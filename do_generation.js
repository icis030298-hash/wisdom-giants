const fs = require('fs');
const path = require('path');
const https = require('https');

const envLocalPath = path.join(__dirname, '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

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

function getBackground(category) {
    if (category === 'wisdom') return 'deep navy or blue background';
    if (category === 'arts') return 'vibrant pastel pink or soft violet background';
    if (category === 'leadership' || category === 'business') return 'bold amber or orange background';
    return 'cool teal or green background';
}

const props = {
    "elizabeth-i": "royal crown",
    "gwanggaeto-the-great": "sword",
    "winston-churchill": "cigar",
    "qin-shi-huang": "terracotta warrior",
    "augustus": "laurel wreath",
    "otto-von-bismarck": "spiked helmet",
    "peter-the-great": "ship model",
    "catherine-the-great": "royal scepter",
    "simon-bolivar": "military sword",
    "margaret-thatcher": "handbag",
    "john-d-rockefeller": "oil barrel",
    "ataturk": "kalpak hat",
    "theodore-roosevelt": "round glasses",
    "anne-frank": "diary",
    "rosa-parks": "bus ticket",
    "frederick-douglass": "book",
    "harriet-tubman": "lantern",
    "florence-nightingale": "oil lamp",
    "yu-gwan-sun": "taegukgi",
    "louis-braille": "braille book",
    "joan-of-arc": "banner",
    "harriet-beecher-stowe": "feather pen",
    "rigoberta-menchu": "woven textile",
    "kim-gu": "round glasses",
    "buddha": "lotus flower",
    "friedrich-nietzsche": "mustache",
    "immanuel-kant": "pocket watch",
    "rene-descartes": "geometric compass",
    "jean-jacques-rousseau": "quill",
    "sigmund-freud": "cigar",
    "carl-jung": "mandala",
    "baruch-spinoza": "lens",
    "sun-tzu": "bamboo scroll",
    "david-hume": "book",
    "john-locke": "quill",
    "simone-de-beauvoir": "book",
    "hannah-arendt": "typewriter",
    "soren-kierkegaard": "umbrella",
    "arthur-schopenhauer": "flute",
    "isaac-newton": "apple",
    "galileo-galilei": "telescope",
    "charles-darwin": "finch",
    "michelangelo": "chisel",
    "claude-monet": "palette",
    "fyodor-dostoevsky": "manuscript",
    "victor-hugo": "inkwell",
    "anton-chekhov": "pince-nez",
    "frederic-chopin": "piano keys",
    "katsushika-hokusai": "paintbrush",
    "mary-shelley": "gothic quill"
};

async function run() {
    const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, 'scratch/image-tasks.json'), 'utf8'));
    const tempDir = path.join(__dirname, 'scratch/temp_images');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    console.log("Generating 50 images...");
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const bg = getBackground(task.category);
        const prop = props[task.slug] || "book";
        
        const prompt = `A modern flat vector avatar of ${task.slug.replace(/-/g, ' ')} holding a ${prop}, clean lines, highly stylized, character portrait. Solid pastel circle background. ${bg}.`;
        
        const targetPath = path.join(tempDir, `${task.slug}.jpg`);
        if (fs.existsSync(targetPath)) continue;

        console.log(`[${i+1}/${tasks.length}] Generating for ${task.slug}`);
        let success = false;
        let retries = 0;
        while(!success && retries < 3) {
            try {
                const base64Data = await generateImage(prompt);
                fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));
                success = true;
            } catch (e) {
                retries++;
                console.log("Error:", e.body || e.message);
                await sleep(5000);
            }
        }
        await sleep(1000);
    }
    console.log("All generated.");
}
run();
