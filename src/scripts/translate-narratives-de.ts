import fs from 'fs';
import path from 'path';
import https from 'https';

const envLocalPath = path.join(__dirname, '..', '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error("Error: NEXT_PUBLIC_GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const narrativesPath = path.join(__dirname, '..', 'data', 'final-narratives.json');
const narrativesData = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

interface WisdomItem {
  quote_en: string;
  meaning_en: string;
  quote_de?: string;
  meaning_de?: string;
  [key: string]: any;
}

interface GiantNarrative {
  era_en: string;
  epic_en: string;
  trials_en: string;
  overcoming_en: string;
  wisdom?: WisdomItem[];
  [key: string]: any;
}

function translateBatch(batch: Record<string, GiantNarrative>): Promise<any> {
  return new Promise((resolve, reject) => {
    const prompt = `You are an expert translator and historian. Translate the following JSON object containing historical biographies and narratives from English to elegant, natural, and historically accurate German.
For each giant in the object, translate the English fields into their corresponding German fields. Keep the exact same structure but change the _en suffix to _de:
- era_en -> era_de
- epic_en -> epic_de
- trials_en -> trials_de
- overcoming_en -> overcoming_de
- inside the wisdom array:
  - quote_en -> quote_de
  - meaning_en -> meaning_de

IMPORTANT POLICING RULES:
1. Use a formal, highly literary German style.
2. Use the past tense narrative (Präteritum) for historical narratives (e.g. "Im Jahr 1769 wurde auf der rauen Mittelmeerinsel Korsika ein Junge geboren...").
3. Keep the narrative tone monumental, inspiring, and appropriate for historical figures.
4. Keep core quotes historically recognized in German if applicable (e.g., Julius Caesar: "Der Würfel ist gefallen", Napoleon: "Das Wort unmöglich gibt es in meinem Wörterbuch nicht").

Do NOT include the original _en or _ko or _es fields in your output. Return ONLY the newly translated _de fields for each giant, matching this structure exactly:
{
  "steve-jobs": {
    "era_de": "...",
    "epic_de": "...",
    "trials_de": "...",
    "overcoming_de": "...",
    "wisdom": [
      { "quote_de": "...", "meaning_de": "..." }
    ]
  }
}

Return ONLY the valid translated JSON block. Do not wrap in markdown \`\`\`json block. Just the raw JSON content:

Input JSON of narratives:
${JSON.stringify(batch, null, 2)}`;

    const requestData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      method: 'POST',
      timeout: 120000, // 120 seconds socket timeout
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts[0]) {
            const rawText = json.candidates[0].content.parts[0].text.trim();
            const translatedObj = JSON.parse(rawText);
            resolve(translatedObj);
          } else {
            const errMsg = json.error ? `API Error Code ${json.error.code}: ${json.error.message}` : `Empty candidates response. Raw response: ${data.slice(0, 300)}`;
            reject(new Error(errMsg));
          }
        } catch (err: any) {
          reject(new Error(`Failed to parse API response: ${err.message}. Raw response: ${data.slice(0, 300)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error('Request timed out after 120 seconds'));
    });

    req.on('error', (err) => { reject(err); });
    req.write(requestData);
    req.end();
  });
}

async function translateBatchWithRetry(batch: Record<string, GiantNarrative>, retries = 5, delay = 5000): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await translateBatch(batch);
    } catch (err: any) {
      console.warn(`[Batch] Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('Quota exceeded')) {
        console.warn(`⚠️ Rate limit hit! Sleeping for 65 seconds...`);
        await new Promise(r => setTimeout(r, 65000));
        attempt--;
        continue;
      }
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay * attempt));
    }
  }
}

async function run() {
  console.log("Starting German Narrative Translation...");
  
  const slugs = Object.keys(narrativesData);
  console.log(`Found ${slugs.length} total giants in final-narratives.json.`);

  const giantsToTranslate = slugs.filter(slug => {
    const data = narrativesData[slug];
    return !data.epic_de; // Needs translation if epic_de is missing
  });

  console.log(`Of these, ${giantsToTranslate.length} giants need German narrative translation.`);

  if (giantsToTranslate.length === 0) {
    console.log("🎉 All giants already have German narratives!");
    process.exit(0);
  }

  const batchSize = 3; 
  for (let i = 0; i < giantsToTranslate.length; i += batchSize) {
    const batchSlugs = giantsToTranslate.slice(i, i + batchSize);
    console.log(`[Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(giantsToTranslate.length / batchSize)}] Translating ${batchSlugs.length} giants...`);
    
    const batchToTranslate: Record<string, GiantNarrative> = {};
    for (const slug of batchSlugs) {
      const data = narrativesData[slug];
      batchToTranslate[slug] = {
        era_en: data.era_en,
        epic_en: data.epic_en,
        trials_en: data.trials_en,
        overcoming_en: data.overcoming_en,
        wisdom: data.wisdom ? data.wisdom.map((w: any) => ({
          quote_en: w.quote_en,
          meaning_en: w.meaning_en
        })) : []
      };
    }

    try {
      const translatedBatch = await translateBatchWithRetry(batchToTranslate);
      for (const slug of batchSlugs) {
        if (translatedBatch[slug]) {
          const tData = translatedBatch[slug];
          narrativesData[slug].era_de = tData.era_de;
          narrativesData[slug].epic_de = tData.epic_de;
          narrativesData[slug].trials_de = tData.trials_de;
          narrativesData[slug].overcoming_de = tData.overcoming_de;
          
          if (tData.wisdom && narrativesData[slug].wisdom) {
            for (let j = 0; j < narrativesData[slug].wisdom.length; j++) {
              if (tData.wisdom[j]) {
                narrativesData[slug].wisdom[j].quote_de = tData.wisdom[j].quote_de;
                narrativesData[slug].wisdom[j].meaning_de = tData.wisdom[j].meaning_de;
              }
            }
          }
          console.log(`  ✓ Translated: ${slug}`);
        } else {
          console.warn(`  ⚠️ Missing translation in response for: ${slug}`);
        }
      }
      
      fs.writeFileSync(narrativesPath, JSON.stringify(narrativesData, null, 2));
      console.log(`  💾 Saved progress to final-narratives.json`);
      
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`❌ Batch failed completely:`, err);
    }
  }

  console.log("✅ All German narratives translated and saved to final-narratives.json!");
}

run();
