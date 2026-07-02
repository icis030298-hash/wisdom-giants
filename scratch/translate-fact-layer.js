const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path:'.env.local'});

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateBatch(batchEntries) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `You are a professional historian and translator. Translate the following historical giants' timeline, key achievements, and FAQ from English to Korean.
Maintain a formal, solemn, and polished biographical tone in Korean (historical text style: "~임", "~함" for timeline; formal "~다" for achievements/FAQ).

INPUT JSON (containing multiple giants mapped by their slug):
${JSON.stringify(batchEntries, null, 2)}

Ensure the output matches the exact same JSON keys and structure for every giant in the input:
Each giant object should contain:
- timeline: array of { year, event } (translate "event")
- keyAchievements: array of { title, description } (translate "title", "description")
- faq: array of { question, answer } (translate "question", "answer")

Return only the translated JSON object.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw e;
  }
}

async function main() {
  const filePath = path.resolve('src/data/fact-layer-all.json');
  const factLayer = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const entries = Object.entries(factLayer);
  console.log(`Loaded fact-layer-all.json with ${entries.length} entries.`);
  
  // Find entries that are in English
  const englishEntries = [];
  for (const [slug, data] of entries) {
    const firstEvent = data.timeline?.[0]?.event || "";
    const isEnglish = /[a-zA-Z]/.test(firstEvent) && !firstEvent.includes('년') && !firstEvent.includes('세');
    if (isEnglish) {
      englishEntries.push(slug);
    }
  }
  
  console.log(`Found ${englishEntries.length} entries that need translation to Korean.`);
  
  const BATCH_SIZE = 12;
  const totalBatches = Math.ceil(englishEntries.length / BATCH_SIZE);
  
  for (let b = 0; b < totalBatches; b++) {
    const batchSlugs = englishEntries.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    console.log(`[Batch ${b + 1}/${totalBatches}] Translating: ${batchSlugs.join(', ')}`);
    
    const batchPayload = {};
    for (const slug of batchSlugs) {
      batchPayload[slug] = factLayer[slug];
    }
    
    let attempts = 0;
    let success = false;
    
    while (!success && attempts < 3) {
      try {
        const translatedBatch = await translateBatch(batchPayload);
        
        for (const slug of batchSlugs) {
          if (translatedBatch[slug]) {
            factLayer[slug].timeline = translatedBatch[slug].timeline;
            factLayer[slug].keyAchievements = translatedBatch[slug].keyAchievements;
            factLayer[slug].faq = translatedBatch[slug].faq;
          } else {
            console.warn(`  ⚠ Missing translation for slug: ${slug}`);
          }
        }
        
        success = true;
        
        // Write incrementally to prevent data loss
        fs.writeFileSync(filePath, JSON.stringify(factLayer, null, 2), 'utf-8');
        console.log(`  ✓ Batch ${b + 1} completed successfully.`);
        await sleep(1500);
      } catch (err) {
        attempts++;
        console.error(`  ✗ Error in batch ${b + 1} (attempt ${attempts}):`, err.message);
        await sleep(5000);
      }
    }
  }
  
  console.log(`\n🎉 Translation finished!`);
}

main().catch(console.error);
