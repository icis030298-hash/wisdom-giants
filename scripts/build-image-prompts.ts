import fs from 'fs';
import path from 'path';
import https from 'https';

// Load API key from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) apiKey = match[1].trim();
}
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const zeroByteGiants = [
  'elizabeth-i', 'gwanggaeto-the-great', 'winston-churchill', 'qin-shi-huang',
  'augustus', 'otto-von-bismarck', 'peter-the-great', 'catherine-the-great',
  'simon-bolivar', 'john-d-rockefeller', 'ataturk', 'theodore-roosevelt',
  'anne-frank', 'rosa-parks', 'frederick-douglass', 'harriet-tubman',
  'florence-nightingale', 'yu-gwan-sun', 'louis-braille', 'joan-of-arc',
  'harriet-beecher-stowe', 'kim-gu', 'buddha', 'friedrich-nietzsche',
  'immanuel-kant', 'rene-descartes', 'jean-jacques-rousseau', 'sigmund-freud',
  'carl-jung', 'baruch-spinoza', 'sun-tzu', 'david-hume', 'john-locke',
  'simone-de-beauvoir', 'hannah-arendt', 'soren-kierkegaard', 'arthur-schopenhauer',
  'isaac-newton', 'galileo-galilei', 'charles-darwin', 'michelangelo',
  'claude-monet', 'fyodor-dostoevsky', 'victor-hugo', 'anton-chekhov',
  'frederic-chopin', 'katsushika-hokusai', 'mary-shelley'
];

async function callGemini(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.candidates && json.candidates[0]?.content?.parts[0]) {
            resolve(json.candidates[0].content.parts[0].text.trim());
          } else {
            reject(new Error(json.error?.message || 'Empty API response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

const GIANTS_DATA_PATH = path.resolve(process.cwd(), 'src/data/giants.ts');
const giantsContent = fs.readFileSync(GIANTS_DATA_PATH, 'utf8');

async function main() {
  console.log(`Generating prompts for ${zeroByteGiants.length} zero-byte giants...`);
  
  // Extract info for these giants
  const targets = zeroByteGiants.map(slug => {
    // Find category and MBTI from giantsContent or default
    // We can parse Category or MBTI. Let's do a simple regex search in giants.ts
    const slugRegex = new RegExp(`slug:\\s*['"]${slug}['"]`, 'i');
    const slugIndex = giantsContent.search(slugRegex);
    let category = 'wisdom';
    let mbti = 'INFJ'; // default fallback
    let name = slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

    if (slugIndex !== -1) {
      // Look backward or forward to find category
      const snippet = giantsContent.substring(Math.max(0, slugIndex - 500), Math.min(giantsContent.length, slugIndex + 500));
      const catMatch = snippet.match(/category:\s*['"]([^'"]+)['"]/);
      if (catMatch) category = catMatch[1];
      
      const dnaMatch = snippet.match(/dnaCode:\s*['"]([^'"]+)['"]/);
      if (dnaMatch) mbti = dnaMatch[1]; // wait, dnaCode is MBTI in this project!

      const nameMatch = snippet.match(/name:\s*['"]([^'"]+)['"]/);
      if (nameMatch) name = nameMatch[1];
    }

    return { slug, name, category, mbti };
  });

  const prompt = `You are a creative prompt engineer for an MBTI-themed historical wisdom app.
We need portrait prompts for these giants:
${JSON.stringify(targets, null, 2)}

For each giant, generate a prompt in the "NanoBanana MBTI" style:
1. Base instruction: "A modern flat vector avatar of [Name] holding [One Symbolic Prop], clean lines, highly stylized, character portrait."
2. Background instruction: "Solid pastel circle background."
3. Category colors:
   - wisdom: "deep navy or blue background"
   - arts: "vibrant pastel pink or soft violet background"
   - leadership / business: "bold amber or orange background"
   - science / society: "cool teal or green background"
4. Add style keys: "outline-less, flat design, smooth matte textures, soft low-contrast gradients, minimalist background with abstract geometric shapes".

Return a JSON array of objects:
[
  {
    "slug": "...",
    "prompt": "..."
  }
]`;

  try {
    const response = await callGemini(prompt);
    const parsed = JSON.parse(response);
    const outputPath = path.resolve(process.cwd(), 'scratch/image-prompts-to-generate.json');
    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), 'utf8');
    console.log(`Saved prompts for ${parsed.length} giants at ${outputPath}`);
  } catch (e) {
    console.error('Error generating prompts:', e);
  }
}

main();
