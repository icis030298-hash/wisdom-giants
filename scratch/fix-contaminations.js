const fs = require('fs');
const path = require('path');
const https = require('https');

require('dotenv').config({ path: '.env.local' });
const APIKEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!APIKEY) {
  console.error('No GEMINI_API_KEY found');
  process.exit(1);
}

const koPath = path.join(__dirname, '..', 'messages', 'ko.json');
const enPath = path.join(__dirname, '..', 'messages', 'en.json');
const jaPath = path.join(__dirname, '..', 'messages', 'ja.json');

const koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

const contaminatedSlugs = [
  'al-khwarizmi',
  'br-ambedkar',
  'chandragupta-maurya',
  'omar-khayyam',
  'robert-oppenheimer',
  'saladin',
  'srinivasa-ramanujan',
  'suleiman-the-magnificent',
  'swami-vivekananda',
  'wright-brothers'
];

function geminiRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048, responseMimeType: 'application/json' }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${APIKEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) { reject(new Error(parsed.error.message)); return; }
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(text);
        } catch(e) { reject(new Error('JSON parse error: ' + e.message + ' | Raw: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function translateGiant(slug) {
  const koObj = koData.Giants[slug];
  if (!koObj) {
    console.log(`[WARN] Giant ${slug} not found in ko.json`);
    return;
  }
  
  console.log(`Translating ${slug}...`);
  
  const prompt = `You are a professional translator translating a wisdom app profile for the historical figure: ${slug}.
Translate the following Korean JSON object into English and Japanese.

Korean source object:
${JSON.stringify(koObj, null, 2)}

STRICT RULES:
1. Translate "name" correctly (e.g. "알콰리즈미" -> "Al-Khwarizmi" in English, "アル・フワリズミー" in Japanese).
2. "era" should be translated (e.g., "9세기" -> "9th Century" in English, "9世紀" in Japanese).
3. Do not change the JSON keys. Keep exactly the same keys as the source.
4. Return ONLY valid JSON containing two top-level keys: "en" and "ja", each containing the translated object.
No markdown block wrappers.

Required JSON format:
{
  "en": {
    "name": "...",
    "title": "...",
    "headline": "...",
    "shortDescription": "...",
    "quote": "...",
    "chatGreeting": "...",
    "suggestedQuestions": ["...", "...", "..."],
    "era": "...",
    "pain": "...",
    "recovery": "..."
  },
  "ja": {
    "name": "...",
    "title": "...",
    ...
  }
}`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const raw = await geminiRequest(prompt);
      let parsed = JSON.parse(raw);
      if (!parsed.en || !parsed.ja) {
        throw new Error("Missing 'en' or 'ja' keys in response");
      }
      return parsed;
    } catch (e) {
      console.log(`  [RETRY ${attempts}] for ${slug}: ${e.message}`);
      await sleep(2000);
    }
  }
  throw new Error(`Failed to translate giant ${slug} after 3 attempts`);
}

async function main() {
  for (const slug of contaminatedSlugs) {
    try {
      const translated = await translateGiant(slug);
      
      // Update en.json and ja.json
      enData.Giants[slug] = translated.en;
      jaData.Giants[slug] = translated.ja;
      
      console.log(`  ✓ Translated ${slug}`);
      await sleep(1000);
    } catch (e) {
      console.error(`  ❌ Failed translation for ${slug}:`, e.message);
    }
  }
  
  // Save updated files
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
  fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
  console.log('✓ Successfully saved updated en.json and ja.json files!');
}

main().catch(console.error);
