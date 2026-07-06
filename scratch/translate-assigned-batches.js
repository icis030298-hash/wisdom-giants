const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load env vars from .env.local
let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*([^\r\n]+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error('No GEMINI_API_KEY found!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const LANGUAGES = {
  'id': 'Indonesian',
  'nl': 'Dutch',
  'tr': 'Turkish',
  'pl': 'Polish'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateChunkWithRetry(langName, langCode, chunk, retries = 5) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const promptInput = chunk.map((item, idx) => ({
    id: idx,
    text: item.sourceText
  }));

  const prompt = `You are a professional translator. Translate the following text items from English to ${langName} (locale: ${langCode}).

RULES:
1. Keep all original formatting, HTML tags, and placeholders (like {name}, {total}, {progress}, {filtered}, {stage}, etc.) exactly as is.
2. Make sure the translations are natural, highly accurate, and dignified in tone.
3. You will receive a JSON array of objects, each containing:
   - "id": number
   - "text": the source text to translate
4. Return a JSON array of objects with the exact same ids and their corresponding "translatedText".
   Example output format: [{"id": 0, "translatedText": "translated text here"}]
   Only return the JSON array, no markdown, no code blocks.

INPUT:
${JSON.stringify(promptInput, null, 2)}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error("No JSON array found in response");
        }
      }

      if (!Array.isArray(parsed) || parsed.length !== chunk.length) {
        throw new Error(`Response array size mismatch or not an array. Expected ${chunk.length}, got ${parsed ? parsed.length : 'null'}`);
      }

      // Merge translations back
      return chunk.map((item, idx) => {
        const translationObj = parsed.find(p => p.id === idx);
        return {
          ...item,
          translatedText: translationObj ? translationObj.translatedText : item.sourceText
        };
      });

    } catch (err) {
      console.warn(`Attempt ${attempt} failed for chunk: ${err.message}`);
      if (attempt === retries) {
        throw err;
      }
      await sleep(3000 * attempt);
    }
  }
}

async function translateFile(langCode, langName, filePath, outPath) {
  console.log(`\nTranslating: ${filePath} -> ${outPath}`);
  const rawData = fs.readFileSync(filePath, 'utf8');
  const items = JSON.parse(rawData);
  
  if (items.length === 0) {
    fs.writeFileSync(outPath, JSON.stringify([], null, 2), 'utf8');
    return;
  }

  // If output exists and matches the original length, check if it's already fully translated
  if (fs.existsSync(outPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      if (existing.length === items.length && existing.every(x => x.translatedText !== undefined)) {
        console.log(`Skipping ${filePath} (already fully translated)`);
        return;
      }
    } catch (e) {
      console.log(`Existing file was invalid JSON, rewriting...`);
    }
  }

  const chunkSize = 150;
  const translatedItems = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    console.log(`Processing chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(items.length / chunkSize)} (${chunk.length} items)...`);
    
    const translatedChunk = await translateChunkWithRetry(langName, langCode, chunk);
    translatedItems.push(...translatedChunk);
    
    // Quick cooldown to be nice to API limits
    await sleep(400);
  }

  fs.writeFileSync(outPath, JSON.stringify(translatedItems, null, 2), 'utf8');
  console.log(`Saved ${translatedItems.length} items to ${outPath}`);
}

async function main() {
  const baseDir = 'scratch/translation_batches';
  const targetLang = process.argv[2]; // Optional: e.g. 'id', 'nl', 'tr', 'pl'
  
  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    if (targetLang && targetLang !== langCode) {
      continue;
    }

    const dirPath = path.join(baseDir, langCode);
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory not found: ${dirPath}`);
      continue;
    }
    
    console.log(`\n=== Processing Language: ${langName} (${langCode}) ===`);
    const files = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.json') && !f.startsWith('translated_'));
    
    console.log(`Found ${files.length} batches:`, files);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const outPath = path.join(dirPath, `translated_${file}`);
      
      try {
        await translateFile(langCode, langName, filePath, outPath);
      } catch (err) {
        console.error(`ERROR translating ${filePath}:`, err);
        // Continue to next file
      }
    }
  }
  console.log('\nAll done!');
}

main().catch(err => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
