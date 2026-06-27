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

const LOCALES = [
  'en', 'ko', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh',
  'id', 'tr', 'sw', 'ha', 'fa', 'he', 'vi', 'th', 'pl', 'el', 'nl', 'uk'
] as const;

const LANG_NAMES: Record<string, string> = {
  en: 'English', ko: 'Korean', de: 'German', ja: 'Japanese', es: 'Spanish',
  fr: 'French', it: 'Italian', pt: 'Portuguese', ar: 'Arabic', hi: 'Hindi',
  ru: 'Russian', zh: 'Chinese', id: 'Indonesian', tr: 'Turkish', sw: 'Swahili',
  ha: 'Hausa', fa: 'Persian', he: 'Hebrew', vi: 'Vietnamese', th: 'Thai',
  pl: 'Polish', el: 'Greek', nl: 'Dutch', uk: 'Ukrainian'
};

const narrativesPath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
const finalNarratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const reportPath = path.resolve(process.cwd(), 'scripts/completeness-report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const missingWisdomSlugs = report.missingWisdom; // 29 slugs

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function callGemini(prompt: string): Promise<string> {
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
      timeout: 60000,
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

async function processGiant(slug: string) {
  console.log(`\nProcessing wisdom quotes for: ${slug}`);
  const epic_en = finalNarratives[slug]?.epic_en || '';
  
  const prompt = `You are a multilingual content writer for an elite wisdom app about historical giants.
Historical Figure: ${slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} (slug: ${slug})
Biography context: ${epic_en.substring(0, 1000)}

Your task:
1. Generate exactly 3 famous, historically accurate, or highly inspiring wisdom quotes in English and Korean that match this historical figure's philosophy.
2. Translate BOTH the quote and its modern meaning/lesson into all these 24 languages: ${LOCALES.map(l => LANG_NAMES[l]).join(', ')}.

Rules:
- For quote fields: use "quote_<locale_code>". Max 2 sentences, memorable, direct, in the first-person voice of the giant.
- For meaning/lesson fields: use "meaning_<locale_code>". Max 3 sentences, explaining what this means for modern life in a strategic peer tone.
- Ensure RTL layouts for Hebrew (he) and Persian (fa) have natural wording.
- Return strictly valid JSON object structure:
{
  "wisdom": [
    {
      "quote_en": "...",
      "meaning_en": "...",
      "quote_ko": "...",
      "meaning_ko": "...",
      ... (include all 24 locales)
    },
    ... (total 3 items)
  ]
}`;

  let attempts = 0;
  while (attempts < 3) {
    try {
      const responseText = await callGemini(prompt);
      const parsed = JSON.parse(responseText);
      if (parsed && Array.isArray(parsed.wisdom) && parsed.wisdom.length === 3) {
        return parsed.wisdom;
      }
      throw new Error('Invalid JSON structure or incorrect number of quotes');
    } catch (e: any) {
      attempts++;
      console.error(`  [Attempt ${attempts} failed for ${slug}]: ${e.message}`);
      await sleep(3000);
    }
  }
  return null;
}

async function main() {
  console.log(`Starting wisdom quotes generation for ${missingWisdomSlugs.length} giants...`);
  
  const firstBatch = missingWisdomSlugs.slice(0, 5);
  console.log(`Generating first batch of 5:`, firstBatch);

  for (const slug of firstBatch) {
    // Skip if already has wisdom from previous run
    if (finalNarratives[slug]?.wisdom && finalNarratives[slug].wisdom.length === 3) {
      console.log(`\n[SKIP] Wisdom already exists for: ${slug}`);
      continue;
    }

    const wisdom = await processGiant(slug);
    if (wisdom) {
      if (!finalNarratives[slug]) finalNarratives[slug] = {};
      finalNarratives[slug].wisdom = wisdom;
      fs.writeFileSync(narrativesPath, JSON.stringify(finalNarratives, null, 2), 'utf8');
      console.log(`  ✓ Saved wisdom for ${slug}`);
    } else {
      console.error(`  ✗ Failed to generate wisdom for ${slug}`);
    }
    await sleep(1000);
  }

  console.log('\nFirst batch completed successfully!');
}

main().catch(console.error);
