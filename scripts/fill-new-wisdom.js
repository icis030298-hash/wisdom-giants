/**
 * fill-new-wisdom.js
 * Generates and fills missing wisdom arrays for the 57 newly added giants.
 * Uses Gemini API to generate 3 wisdom lessons per giant in 8 languages.
 * Run: node scripts/fill-new-wisdom.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_PATH = './src/data/final-narratives.json';
const LOCALES = ['en', 'ko', 'de', 'ja', 'es', 'fr', 'it', 'pt'];

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
if (!APIKEY) {
  console.error('No GEMINI_API_KEY found in environment');
  process.exit(1);
}

function geminiRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 8192, 
        responseMimeType: 'application/json' 
      }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${APIKEY}`,
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
            reject(new Error(parsed.error.message)); 
            return; 
          }
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(text);
        } catch(e) { 
          reject(new Error('JSON parse error: ' + e.message + ' | Raw: ' + data.slice(0, 300))); 
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function generateWisdomForGiant(slug, giantData) {
  const name = slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const epicEn = giantData.epic_en || '';
  const epicKo = giantData.epic_ko || '';

  const prompt = `You are a professional multilingual content curator for a wisdom app.
Historical Figure: ${name} (slug: ${slug})

[Biography Context (English)]:
"${epicEn}"

[Biography Context (Korean)]:
"${epicKo}"

Your task is to generate exactly 3 wisdom lessons/quotes for this historical figure.
Each lesson must be translated and adapted into ALL 8 languages: en, ko, de, ja, es, fr, it, pt.

STRICT RULES:
1. Generate exactly 3 wisdom lessons.
2. For each lesson, provide "quote_[lang]" and "meaning_[lang]" for all 8 languages: en, ko, de, ja, es, fr, it, pt.
3. Quote Guidelines: Max 1-2 sentences. Punchy, memorable, written in the direct first-person voice of the historical figure.
4. Meaning Guidelines: Max 2-3 sentences. Explain how this wisdom can be applied to modern life. Use a sharp, peer-to-peer strategic tone (NOT preachy, NOT like a school teacher).
5. Ensure historical accuracy and tone consistency.

Expected JSON output format (a JSON array containing exactly 3 objects):
[
  {
    "quote_en": "...",
    "meaning_en": "...",
    "quote_ko": "...",
    "meaning_ko": "...",
    "quote_de": "...",
    "meaning_de": "...",
    "quote_ja": "...",
    "meaning_ja": "...",
    "quote_es": "...",
    "meaning_es": "...",
    "quote_fr": "...",
    "meaning_fr": "...",
    "quote_it": "...",
    "meaning_it": "...",
    "quote_pt": "...",
    "meaning_pt": "..."
  },
  ...
]`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const raw = await geminiRequest(prompt);
      let parsed = JSON.parse(raw);
      
      // Basic validation
      if (!Array.isArray(parsed) || parsed.length !== 3) {
        throw new Error(`Invalid response structure: expected array of length 3, got ${typeof parsed}`);
      }
      
      // Ensure all keys are present
      for (const item of parsed) {
        for (const lang of LOCALES) {
          if (!item[`quote_${lang}`] || !item[`meaning_${lang}`]) {
            throw new Error(`Missing keys for language: ${lang}`);
          }
        }
      }
      
      return parsed;
    } catch (e) {
      console.log(`  [WARN] Attempt ${attempts} for ${slug} failed: ${e.message}`);
      await sleep(2000);
    }
  }
  throw new Error(`Failed to generate wisdom for ${slug} after 3 attempts.`);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  
  // Find all giants with empty wisdom
  const toFix = [];
  for (const [slug, g] of Object.entries(data)) {
    if (!g.wisdom || g.wisdom.length === 0) {
      toFix.push(slug);
    }
  }

  console.log(`Found ${toFix.length} giants with missing/empty wisdom. Starting generation...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toFix.length; i++) {
    const slug = toFix[i];
    console.log(`\n[${i + 1}/${toFix.length}] Processing: ${slug}`);
    
    try {
      const wisdom = await generateWisdomForGiant(slug, data[slug]);
      data[slug].wisdom = wisdom;
      
      // Save after each giant to prevent data loss
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
      successCount++;
      console.log(`  ✅ Successfully saved wisdom for ${slug}`);
      
      // Standard rate limiting delay
      await sleep(1500);
    } catch (e) {
      console.error(`  ❌ Failed to generate wisdom for ${slug}:`, e.message);
      failCount++;
      await sleep(3000);
    }
  }

  console.log(`\n=== PROCESS COMPLETED ===`);
  console.log(`Successfully generated: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
