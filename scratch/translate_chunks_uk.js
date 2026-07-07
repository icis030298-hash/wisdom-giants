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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateChunk(chunkNum) {
  const numStr = String(chunkNum).padStart(3, '0');
  const inputPath = path.resolve(`scratch/optimization/chunks/chunk_${numStr}.json`);
  const outDir = path.resolve(`scratch/optimization/translations/uk`);
  const outputPath = path.join(outDir, `trans_chunk_${numStr}.json`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  if (fs.existsSync(outputPath)) {
    console.log(`[Chunk ${numStr}] Already exists. Skipping.`);
    return;
  }

  console.log(`[Chunk ${numStr}] Reading ${inputPath}...`);
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const koreanStrings = JSON.parse(rawData);

  console.log(`[Chunk ${numStr}] Translating ${koreanStrings.length} strings to Ukrainian (uk)...`);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `You are a professional translator. Translate the following JSON array of Korean strings into Ukrainian (uk).
Maintain the tone and meaning accurately. Keep all HTML tags intact. Keep placeholders like {name}, {total}, etc., exactly as is.

Return a JSON object where each key is the original Korean string and the value is the translated Ukrainian string:
{"Korean string": "Translated Ukrainian string"}

INPUT JSON ARRAY:
${JSON.stringify(koreanStrings, null, 2)}`;

  let attempts = 0;
  while (attempts < 3) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error("No JSON object found in response");
        }
      }

      // Verify that all keys in original exist in parsed (or at least it's a valid object)
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error("Response is not a valid JSON object");
      }

      fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), 'utf8');
      console.log(`[Chunk ${numStr}] Saved to ${outputPath}`);
      return;
    } catch (err) {
      attempts++;
      console.error(`[Chunk ${numStr}] Attempt ${attempts} failed: ${err.message}`);
      await sleep(3000 * attempts);
    }
  }
  throw new Error(`Failed to translate chunk ${numStr} after 3 attempts`);
}

async function main() {
  console.log('Starting translation of chunks 003 to 047 to Ukrainian (uk)...');
  for (let i = 3; i <= 47; i++) {
    try {
      await translateChunk(i);
      await sleep(1000); // safety gap
    } catch (e) {
      console.error(`Fatal error at chunk ${i}:`, e.message);
      process.exit(1);
    }
  }
  console.log('All chunks from 003 to 047 translated successfully.');
}

main().catch(err => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
