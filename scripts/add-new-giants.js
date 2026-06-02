/**
 * add-new-giants.js
 * Generates and adds new giants using Gemini API.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const https = require('https');

const APIKEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!APIKEY) {
  console.error('No GEMINI_API_KEY found in environment');
  process.exit(1);
}

const batches = require('./giants-batches');
const LOCALES = ['en', 'ko', 'de', 'ja', 'es', 'fr', 'it', 'pt'];

function geminiRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: 'application/json' }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${APIKEY}`,
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
        } catch(e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function processGiant(giant) {
  console.log(`\nProcessing ${giant.name} (${giant.slug})...`);
  
  const messagesPrompt = `You are a museum curator AI building profiles for a historical giant.
Target: ${giant.name} (${giant.slug})
Era: ${giant.birth} to ${giant.death}, ${giant.nationality}
Keyword: ${giant.keyword}

Generate JSON for 8 languages: en, ko, de, ja, es, fr, it, pt.
The JSON must have this exact structure (replace '...' with actual translated text in the respective language):

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
  "ko": { ... },
  "de": { ... },
  "ja": { ... },
  "es": { ... },
  "fr": { ... },
  "it": { ... },
  "pt": { ... }
}

Guidelines:
- Name: Localized name (e.g. ko: 벤자민 프랭클린, ja: ベンジャミン・フランクリン).
- Title: Era/Category label.
- Headline: 1-line powerful description.
- shortDescription: 2-3 sentences historical intro.
- quote: The most famous quote (accurate historically).
- chatGreeting: The first greeting as if the giant is speaking to the user.
- era: Historical era string.
- pain: Major struggles in life.
- recovery: How they overcame.
DO NOT wrap in markdown. Output pure JSON.`;

  let msgsJson = null;
  let attempts = 0;
  while (attempts < 3 && !msgsJson) {
    attempts++;
    try {
      const raw = await geminiRequest(messagesPrompt);
      msgsJson = JSON.parse(raw);
    } catch (e) {
      console.log(`  [Messages] Attempt ${attempts} failed: ${e.message}`);
      await sleep(2000);
    }
  }

  if (!msgsJson) throw new Error(`Failed to generate messages for ${giant.slug}`);
  console.log(`  ✓ Messages generated`);

  const epicPrompt = `You are a master storyteller writing the epic narrative of ${giant.name} (${giant.slug}).
Birth: ${giant.birth}, Death: ${giant.death}, Nationality: ${giant.nationality}.

Generate a JSON object with these exact keys. The epic should be moving, historically accurate, and provide modern wisdom. No AI clichés.

{
  "epic_ko": "Korean narrative (min 500 chars).",
  "epic_en": "English narrative (min 300 words).",
  "epic_de": "German narrative.",
  "epic_ja": "Japanese narrative.",
  "epic_es": "Spanish narrative.",
  "epic_fr": "French narrative.",
  "epic_it": "Italian narrative.",
  "epic_pt": "Portuguese narrative.",
  "trials_ko": "Korean summary of trials.",
  "trials_en": "English summary of trials.",
  "overcoming_ko": "Korean summary of overcoming.",
  "overcoming_en": "English summary of overcoming.",
  "wisdom": []
}

DO NOT wrap in markdown. Output pure JSON.`;

  let epicJson = null;
  attempts = 0;
  while (attempts < 3 && !epicJson) {
    attempts++;
    try {
      const raw = await geminiRequest(epicPrompt);
      epicJson = JSON.parse(raw);
      // Ensure wisdom array exists
      if (!epicJson.wisdom) epicJson.wisdom = [];
    } catch (e) {
      console.log(`  [Epic] Attempt ${attempts} failed: ${e.message}`);
      await sleep(2000);
    }
  }

  if (!epicJson) throw new Error(`Failed to generate epic for ${giant.slug}`);
  console.log(`  ✓ Epic generated`);

  return { msgsJson, epicJson };
}

async function main() {
  const tsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
  let tsContent = fs.readFileSync(tsFile, 'utf8');

  // Load existing final-narratives
  const narrativeFile = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
  let narratives = {};
  if (fs.existsSync(narrativeFile)) {
    narratives = JSON.parse(fs.readFileSync(narrativeFile, 'utf8'));
  }

  // Load existing messages
  const msgs = {};
  for (const lang of LOCALES) {
    const p = path.join(__dirname, '..', 'messages', `${lang}.json`);
    msgs[lang] = JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  // Find max ID to increment
  let maxId = 0;
  const idMatches = tsContent.match(/id:\s*["'](\d+)["']/g);
  if (idMatches) {
    idMatches.forEach(m => {
      const id = parseInt(m.match(/\d+/)[0]);
      if (id > maxId) maxId = id;
    });
  }

  let successCount = 0;
  
  for (const giant of batches) {
    if (tsContent.includes(`slug: "${giant.slug}"`) || tsContent.includes(`slug: '${giant.slug}'`)) {
      console.log(`Skipping ${giant.slug}, already exists in giants.ts.`);
      continue;
    }

    try {
      const { msgsJson, epicJson } = await processGiant(giant);
      
      // Update narratives
      narratives[giant.slug] = epicJson;

      // Update messages
      for (const lang of LOCALES) {
        if (!msgs[lang].Giants) msgs[lang].Giants = {};
        if (msgsJson[lang]) {
          msgs[lang].Giants[giant.slug] = msgsJson[lang];
        } else {
          console.log(`  ⚠️ Warning: No ${lang} data returned for ${giant.slug}`);
        }
      }

      // Update giants.ts
      maxId++;
      
      // We will generate the TS block
      // Extract en data for TS file fallback
      const en = msgsJson.en || {};
      const newTsBlock = `  {
    id: "${maxId}",
    name: "${giant.name.replace(/"/g, '\\"')}",
    category: "${giant.category}",
    headline: "${(en.headline || '').replace(/"/g, '\\"')}",
    shortDescription: "${(en.shortDescription || '').replace(/"/g, '\\"')}",
    slug: "${giant.slug}",
    dnaCode: "LPDI",
    quote: "${(en.quote || '').replace(/"/g, '\\"')}",
    pain: "${(en.pain || '').replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    recovery: "${(en.recovery || '').replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    lessons: [],
    persona: "당신은 ${giant.name.replace(/"/g, '\\"')}입니다.",
    imageUrl: "/images/giants/${giant.slug}.jpg",
    era: "${(en.era || '').replace(/"/g, '\\"')}"
  },
`;

      // Insert before the last `];` in giants.ts
      const closingIndex = tsContent.lastIndexOf('];');
      if (closingIndex !== -1) {
        tsContent = tsContent.slice(0, closingIndex) + newTsBlock + tsContent.slice(closingIndex);
      }

      successCount++;
      console.log(`  ✅ Successfully added ${giant.slug}.`);
      
      // Save periodically
      if (successCount % 5 === 0) {
        fs.writeFileSync(narrativeFile, JSON.stringify(narratives, null, 2), 'utf8');
        for (const lang of LOCALES) {
          const p = path.join(__dirname, '..', 'messages', `${lang}.json`);
          fs.writeFileSync(p, JSON.stringify(msgs[lang], null, 2), 'utf8');
        }
        fs.writeFileSync(tsFile, tsContent, 'utf8');
        console.log(`  💾 Saved batch of 5 to disk.`);
      }

      // Sleep to avoid rate limits
      await sleep(1500);
      
    } catch (e) {
      console.error(`  ❌ Failed to process ${giant.slug}:`, e);
    }
  }

  // Final save
  fs.writeFileSync(narrativeFile, JSON.stringify(narratives, null, 2), 'utf8');
  for (const lang of LOCALES) {
    const p = path.join(__dirname, '..', 'messages', `${lang}.json`);
    fs.writeFileSync(p, JSON.stringify(msgs[lang], null, 2), 'utf8');
  }
  fs.writeFileSync(tsFile, tsContent, 'utf8');
  
  console.log(`\n🎉 Finished adding giants. Total added: ${successCount}`);
}

main().catch(console.error);
