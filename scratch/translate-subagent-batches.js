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
  'fa': 'Persian (Farsi)',
  'el': 'Greek',
  'uk': 'Ukrainian',
  'he': 'Hebrew',
  'th': 'Thai'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateChunkWithRetry(langName, langCode, chunk, retries = 3) {
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
3. For RTL languages (like Persian and Hebrew), ensure correct flow.
4. You will receive a JSON array of objects, each containing:
   - "id": number
   - "text": the source text to translate
5. Return a JSON array of objects with the exact same ids and their corresponding "translatedText".
   Example output format: [{"id": 0, "translatedText": "translated text here"}]
   Only return the JSON array, no markdown, no code blocks.
6. IMPORTANT: If there are double quotes inside the translated text, always escape them as \\\" (e.g. \\\"text\\\") so that the JSON remains completely valid and parseable. Do NOT return unescaped double quotes inside values.

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
      console.warn(`[${langCode}] Attempt ${attempt} failed for chunk: ${err.message}`);
      if (attempt === retries) {
        throw err;
      }
      await sleep(3000 * attempt);
    }
  }
}

async function translateFile(langCode, langName, filePath, outPath) {
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
        console.log(`[${langCode}] Skipping ${path.basename(filePath)} (already fully translated)`);
        return;
      }
    } catch (e) {
      console.log(`[${langCode}] Existing file was invalid JSON, rewriting...`);
    }
  }

  console.log(`[${langCode}] Translating: ${path.basename(filePath)} -> ${path.basename(outPath)} (${items.length} items)`);

  const chunkSize = 40; // Smaller chunk size for safety
  const translatedItems = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    console.log(`[${langCode}] Processing chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(items.length / chunkSize)} of ${path.basename(filePath)}...`);
    
    const translatedChunk = await translateChunkWithRetry(langName, langCode, chunk);
    translatedItems.push(...translatedChunk);
    
    // Quick cooldown to be nice to API limits
    await sleep(800);
  }

  fs.writeFileSync(outPath, JSON.stringify(translatedItems, null, 2), 'utf8');
  console.log(`[${langCode}] Saved ${translatedItems.length} items to ${path.basename(outPath)}`);
}

async function processLanguage(langCode, langName) {
  const baseDir = 'scratch/translation_batches';
  const dirPath = path.join(baseDir, langCode);
  if (!fs.existsSync(dirPath)) {
    console.warn(`[${langCode}] Directory not found: ${dirPath}`);
    return;
  }
  
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json') && !f.startsWith('translated_'));
  
  console.log(`[${langCode}] Found ${files.length} batches to process.`);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const outPath = path.join(dirPath, `translated_${file}`);
    
    try {
      await translateFile(langCode, langName, filePath, outPath);
    } catch (err) {
      console.error(`[${langCode}] ERROR translating ${file}:`, err);
      // Wait a bit on error before next file
      await sleep(5000);
    }
  }
}

async function main() {
  console.log('Starting parallel translation...');
  const promises = Object.entries(LANGUAGES).map(([langCode, langName]) => {
    return processLanguage(langCode, langName);
  });
  
  await Promise.all(promises);
  console.log('\nAll languages translated successfully!');
}

main().catch(err => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
