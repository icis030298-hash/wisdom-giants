/**
 * fill-wisdom-gaps.js
 * Fills empty wisdom lesson fields in final-narratives.json using Gemini API.
 * Uses existing ES content as the source, translates to missing languages.
 * Run: node scripts/fill-wisdom-gaps.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const https = require('https');

const DATA_PATH = './src/data/final-narratives.json';
const LANGS = ['en', 'ko', 'de', 'ja', 'fr', 'pt', 'it'];

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
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${APIKEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(text);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fillWisdomForGiant(slug, giantData, wisdomItem, itemIndex) {
  // Find the best source content (prefer es, then it/pt)
  const sourceQuote = wisdomItem.quote_es || wisdomItem.quote_it || wisdomItem.quote_pt || '';
  const sourceMeaning = wisdomItem.meaning_es || wisdomItem.meaning_it || wisdomItem.meaning_pt || '';
  
  if (!sourceQuote) {
    console.log(`  [SKIP] ${slug} item ${itemIndex}: no source content`);
    return wisdomItem;
  }

  // Find which langs need filling
  const missingLangs = LANGS.filter(lang => 
    !wisdomItem[`quote_${lang}`] || wisdomItem[`quote_${lang}`].trim() === '' ||
    !wisdomItem[`meaning_${lang}`] || wisdomItem[`meaning_${lang}`].trim() === ''
  );

  if (missingLangs.length === 0) return wisdomItem;

  const giantName = giantData.epic_en ? 
    giantData.epic_en.split(' ').slice(0, 3).join(' ') : slug;

  const prompt = `You are a professional multilingual translator and copywriter for a wisdom app featuring historical figures.

Giant: ${slug}
Source quote (Spanish): "${sourceQuote}"
Source meaning/lesson (Spanish): "${sourceMeaning}"

Translate and adapt BOTH the quote and the meaning into the following languages: ${missingLangs.map(l => LANG_NAMES[l]).join(', ')}.

RULES:
1. The quote should be SHORT, punchy, 1-2 sentences max. Direct, impactful.
2. The meaning should be 2-3 sentences. Insight into why this wisdom matters for modern life. NOT preachy. Like a sharp strategic peer, not a teacher.
3. Stay faithful to the source content while making it natural in each target language.
4. No generic life advice. Each lesson should feel specific to this historical figure's perspective.

Return ONLY a JSON object like this (no markdown, no explanation):
{
  ${missingLangs.map(l => `"quote_${l}": "...",\n  "meaning_${l}": "..."`).join(',\n  ')}
}`;

  try {
    const raw = await geminiRequest(prompt);
    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log(`  [WARN] ${slug} item ${itemIndex}: Could not parse JSON from response`);
      return wisdomItem;
    }
    const filled = JSON.parse(jsonMatch[0]);
    return { ...wisdomItem, ...filled };
  } catch(e) {
    console.log(`  [ERR] ${slug} item ${itemIndex}:`, e.message);
    return wisdomItem;
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  
  // Find all slugs with empty wisdom fields
  const toFix = [];
  for (const [slug, g] of Object.entries(data)) {
    if (!g.wisdom || g.wisdom.length === 0) continue;
    const hasEmpty = g.wisdom.some(w => 
      LANGS.some(lang => !w[`quote_${lang}`] || w[`quote_${lang}`].trim() === '' ||
                         !w[`meaning_${lang}`] || w[`meaning_${lang}`].trim() === '')
    );
    if (hasEmpty) toFix.push(slug);
  }

  console.log(`Found ${toFix.length} giants with missing wisdom fields. Starting fill...`);

  let processed = 0;
  for (const slug of toFix) {
    console.log(`\n[${++processed}/${toFix.length}] Processing: ${slug}`);
    const g = data[slug];
    const newWisdom = [];
    for (let i = 0; i < g.wisdom.length; i++) {
      console.log(`  Filling item ${i + 1}/${g.wisdom.length}...`);
      const filled = await fillWisdomForGiant(slug, g, g.wisdom[i], i);
      newWisdom.push(filled);
      await sleep(500); // Rate limit
    }
    data[slug].wisdom = newWisdom;
    
    // Save after each giant to prevent data loss
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  ✓ Saved ${slug}`);
    await sleep(1000);
  }

  // Final verification scan
  console.log('\n=== FINAL VERIFICATION ===');
  let stillEmpty = 0;
  for (const [slug, g] of Object.entries(data)) {
    if (!g.wisdom) continue;
    for (const w of g.wisdom) {
      for (const lang of LANGS) {
        if (!w[`quote_${lang}`] || w[`quote_${lang}`].trim() === '') {
          console.log(`  Still empty: ${slug} quote_${lang}`);
          stillEmpty++;
        }
      }
    }
  }
  console.log(`\nStill empty fields: ${stillEmpty}`);
  console.log('Done! Run npm run build to verify.');
}

main().catch(console.error);
