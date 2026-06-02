/**
 * fill-wisdom-gaps-v2.js
 * Improved version: fills all empty wisdom fields using Gemini.
 * Better JSON extraction + generates from scratch if needed.
 * Run: node scripts/fill-wisdom-gaps-v2.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const https = require('https');

const DATA_PATH = './src/data/final-narratives.json';
const ALL_LANGS = ['en', 'ko', 'de', 'ja', 'es', 'fr', 'it', 'pt'];
const TARGET_LANGS = ['en', 'ko', 'de', 'ja', 'fr', 'pt'];  // es and it mostly exist

const LANG_NAMES = {
  en: 'English',
  ko: 'Korean (한국어)',
  de: 'German (Deutsch)',
  ja: 'Japanese (日本語)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  it: 'Italian (Italiano)',
  pt: 'Portuguese (Português)',
};

const APIKEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!APIKEY) { console.error('No GEMINI_API_KEY found'); process.exit(1); }

function geminiRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 4096, responseMimeType: 'application/json' }
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
        } catch(e) { reject(new Error('JSON parse error: ' + e.message + ' | Raw: ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Get best available source text for a wisdom item
function getBestSource(wisdomItem) {
  for (const lang of ['es', 'it', 'pt', 'en', 'ko', 'de', 'ja', 'fr']) {
    if (wisdomItem[`quote_${lang}`] && wisdomItem[`quote_${lang}`].trim() !== '') {
      return {
        lang,
        quote: wisdomItem[`quote_${lang}`],
        meaning: wisdomItem[`meaning_${lang}`] || ''
      };
    }
  }
  return null;
}

async function fillWisdomItem(slug, giantName, wisdomItem, itemIndex) {
  const source = getBestSource(wisdomItem);
  
  // Find which target langs are missing
  const missingLangs = TARGET_LANGS.filter(lang =>
    !wisdomItem[`quote_${lang}`] || wisdomItem[`quote_${lang}`].trim() === ''
  );

  if (missingLangs.length === 0) return wisdomItem;
  if (!source) {
    console.log(`  [SKIP] ${slug} item ${itemIndex}: truly no source`);
    return wisdomItem;
  }

  const prompt = `You are a multilingual content writer for a wisdom app about historical giants.

Historical Figure: ${giantName} (slug: ${slug})
Source Language: ${LANG_NAMES[source.lang]}
Source Quote: "${source.quote}"
Source Meaning/Lesson: "${source.meaning}"

Translate BOTH the quote AND the meaning into these languages: ${missingLangs.map(l => LANG_NAMES[l]).join(', ')}

STRICT RULES:
- Quote: Max 2 sentences. Sharp, memorable, direct. First-person voice of the historical figure.
- Meaning: Max 3 sentences. What this means for modern life. Strategic peer tone, NOT teacher/lecturer tone.
- Stay faithful to the source content's meaning.
- Return ONLY valid JSON, no markdown code blocks.

Required JSON format:
{
  ${missingLangs.map(l => `"quote_${l}": "...",\n  "meaning_${l}": "..."`).join(',\n  ')}
}`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const raw = await geminiRequest(prompt);
      // Try direct parse first (responseMimeType: json should give clean JSON)
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Fallback: extract JSON block
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON found in response');
        parsed = JSON.parse(match[0]);
      }
      
      // Validate we got the expected keys
      const filledCount = missingLangs.filter(l => parsed[`quote_${l}`]).length;
      if (filledCount === 0) throw new Error('No expected keys found in response');
      
      return { ...wisdomItem, ...parsed };
    } catch(e) {
      console.log(`  [RETRY ${attempts}] ${slug} item ${itemIndex}: ${e.message}`);
      await sleep(2000);
    }
  }
  
  console.log(`  [FAILED] ${slug} item ${itemIndex}: giving up after 3 attempts`);
  return wisdomItem;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  
  // Find all giants with any missing TARGET_LANG fields
  const toFix = [];
  for (const [slug, g] of Object.entries(data)) {
    if (!g.wisdom || g.wisdom.length === 0) continue;
    const hasEmpty = g.wisdom.some(w =>
      TARGET_LANGS.some(lang => !w[`quote_${lang}`] || w[`quote_${lang}`].trim() === '')
    );
    if (hasEmpty) toFix.push(slug);
  }

  console.log(`Found ${toFix.length} giants needing wisdom fill. Starting...`);

  let processed = 0;
  for (const slug of toFix) {
    processed++;
    // Get giant name from en epic or slug
    const g = data[slug];
    const giantName = slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    console.log(`\n[${processed}/${toFix.length}] ${giantName} (${slug})`);
    
    const newWisdom = [];
    for (let i = 0; i < g.wisdom.length; i++) {
      const missingCount = TARGET_LANGS.filter(l =>
        !g.wisdom[i][`quote_${l}`] || g.wisdom[i][`quote_${l}`].trim() === ''
      ).length;
      
      if (missingCount === 0) {
        newWisdom.push(g.wisdom[i]);
        continue;
      }
      
      console.log(`  Item ${i+1}/${g.wisdom.length}: filling ${missingCount} languages...`);
      const filled = await fillWisdomItem(slug, giantName, g.wisdom[i], i);
      newWisdom.push(filled);
      await sleep(600);
    }
    
    data[slug].wisdom = newWisdom;
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  ✓ Saved`);
    await sleep(800);
  }

  // Final verification
  console.log('\n=== FINAL VERIFICATION ===');
  let stillEmpty = 0;
  const stillEmptyGiants = new Set();
  for (const [slug, g] of Object.entries(data)) {
    if (!g.wisdom) continue;
    for (const w of g.wisdom) {
      for (const lang of TARGET_LANGS) {
        if (!w[`quote_${lang}`] || w[`quote_${lang}`].trim() === '') {
          stillEmpty++;
          stillEmptyGiants.add(slug);
        }
      }
    }
  }
  console.log(`Still empty fields: ${stillEmpty} across ${stillEmptyGiants.size} giants`);
  if (stillEmptyGiants.size > 0) {
    console.log('Affected:', [...stillEmptyGiants].join(', '));
  } else {
    console.log('✅ All wisdom fields filled!');
  }
}

main().catch(console.error);
