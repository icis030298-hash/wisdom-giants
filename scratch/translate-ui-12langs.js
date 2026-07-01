/**
 * translate-ui-12langs.js
 * Translates UI sections (non-giant keys) from EN into 12 new languages
 * using the Gemini API, then merges into existing message files.
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY not set!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// 12 new languages to translate
const LANGS = [
  { code: 'el', name: 'Greek' },
  { code: 'fa', name: 'Persian (Farsi)' },
  { code: 'ha', name: 'Hausa' },
  { code: 'he', name: 'Hebrew' },
  { code: 'id', name: 'Indonesian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'sw', name: 'Swahili' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'vi', name: 'Vietnamese' },
];

// UI sections to translate (exclude 'Giants' which has giant-specific data)
const UI_SECTIONS = [
  'Navigation', 'Auth', 'Test', 'Chats', 'Hero', 'Featured',
  'GiantsGrid', 'GiantDetail', 'Chat', 'Stats', 'QuoteSection',
  'Privacy', 'Footer', 'About', 'Terms', 'Cookie', 'Contact',
  'Debate', 'DebateCTA', 'Consult', 'Disclaimer', 'BlogAuthorBox',
  'AboutEditorialPolicy', 'GiantsSection', 'BlogGiantLink',
  'GiantBlogLink', 'ShareCard', 'Newsletter', 'brand'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateChunk(langCode, langName, chunk) {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `You are a professional UI/UX translator. Translate the following JSON object's string values from English to ${langName} (language code: ${langCode}).

RULES:
1. Keep ALL keys exactly as-is (do NOT translate keys)
2. Keep template variables like {name}, {total}, {progress}, {filtered}, {stage} unchanged
3. Keep HTML entities like &amp; unchanged  
4. Only translate the string VALUES
5. Return ONLY valid JSON, no markdown, no code blocks
6. For proper nouns like "Giants Wisdom", "Hall of Great Minds" — translate the meaning naturally
7. For RTL languages (fa, he, ar) ensure text flows correctly

INPUT JSON:
${JSON.stringify(chunk, null, 2)}

Return the translated JSON object only.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse response for ${langCode}: ${text.substring(0, 200)}`);
  }
}

async function main() {
  console.log('Loading EN source...');
  const en = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));
  
  // Extract only UI sections
  const uiData = {};
  for (const section of UI_SECTIONS) {
    if (en[section]) uiData[section] = en[section];
  }
  
  console.log(`UI sections to translate: ${Object.keys(uiData).length}`);
  console.log('Sections:', Object.keys(uiData).join(', '));

  // Split into smaller chunks to avoid token limits
  const sectionEntries = Object.entries(uiData);
  const CHUNK_SIZE = 5; // sections per chunk
  const chunks = [];
  for (let i = 0; i < sectionEntries.length; i += CHUNK_SIZE) {
    chunks.push(Object.fromEntries(sectionEntries.slice(i, i + CHUNK_SIZE)));
  }
  console.log(`Split into ${chunks.length} chunks of ~${CHUNK_SIZE} sections each`);

  for (const { code, name } of LANGS) {
    console.log(`\n=== Translating to ${name} (${code}) ===`);
    
    const existingFile = `./messages/${code}.json`;
    const existing = JSON.parse(fs.readFileSync(existingFile, 'utf8'));
    
    const translated = { ...existing };
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkSections = Object.keys(chunk).join(', ');
      console.log(`  Chunk ${i + 1}/${chunks.length}: ${chunkSections}`);
      
      try {
        const result = await translateChunk(code, name, chunk);
        
        // Merge translated sections into the file
        for (const [section, data] of Object.entries(result)) {
          if (uiData[section]) {
            translated[section] = data;
          }
        }
        
        console.log(`  ✓ Chunk ${i + 1} done`);
        await sleep(1000); // Rate limiting
      } catch (err) {
        console.error(`  ✗ Chunk ${i + 1} failed: ${err.message}`);
        console.error('  Skipping and continuing...');
        await sleep(2000);
      }
    }
    
    // Write updated file
    fs.writeFileSync(existingFile, JSON.stringify(translated, null, 2), 'utf8');
    console.log(`✅ Saved ${code}.json`);
    
    await sleep(2000); // Pause between languages
  }
  
  console.log('\n🎉 All translations complete!');
}

main().catch(console.error);
