const fs = require('fs');
const path = require('path');
const https = require('https');

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

function translateBatch(batch) {
  return new Promise((resolve, reject) => {
    const prompt = `You are an expert translator. Translate the following JSON object containing historical biographies and narratives from English to highly professional, inspiring Spanish (Latin American).
For each giant in the object, translate the English fields into their corresponding Spanish fields. Keep the exact same structure but change the _en suffix to _es:
- era_en -> era_es
- epic_en -> epic_es
- trials_en -> trials_es
- overcoming_en -> overcoming_es
- inside the wisdom array:
  - quote_en -> quote_es
  - meaning_en -> meaning_es

Do NOT include the original _en or _ko fields in your output. Return ONLY the newly translated _es fields for each giant, matching this structure:
{
  "steve-jobs": {
    "era_es": "...",
    "epic_es": "...",
    "trials_es": "...",
    "overcoming_es": "...",
    "wisdom": [
      { "quote_es": "...", "meaning_es": "..." }
    ]
  }
}

Maintain an inspiring, monumental, and historically accurate tone. 
Return ONLY the valid translated JSON block. Do not wrap in markdown \`\`\`json block. Just the raw JSON content:

Input JSON of narratives:
${JSON.stringify(batch, null, 2)}`;

    const requestData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
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
        } catch (err) {
          reject(new Error(`Failed to parse API response: ${err.message}. Raw response: ${data.slice(0, 300)}`));
        }
      });
    });

    req.on('error', (err) => { reject(err); });
    req.write(requestData);
    req.end();
  });
}

async function translateBatchWithRetry(batch, retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await translateBatch(batch);
    } catch (err) {
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
  console.log("Starting Spanish Narrative Translation...");
  
  const slugs = Object.keys(narrativesData);
  console.log(`Found ${slugs.length} total giants in final-narratives.json.`);

  const giantsToTranslate = slugs.filter(slug => {
    const data = narrativesData[slug];
    return !data.epic_es; // Needs translation if epic_es is missing
  });

  console.log(`Of these, ${giantsToTranslate.length} giants need Spanish narrative translation.`);

  if (giantsToTranslate.length === 0) {
    console.log("🎉 All giants already have Spanish narratives!");
    process.exit(0);
  }

  const batchSize = 10; // Process 10 at a time to finish in ~8 API calls!
  for (let i = 0; i < giantsToTranslate.length; i += batchSize) {
    const batchSlugs = giantsToTranslate.slice(i, i + batchSize);
    console.log(`[Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(giantsToTranslate.length / batchSize)}] Translating ${batchSlugs.length} giants...`);
    
    const batchToTranslate = {};
    for (const slug of batchSlugs) {
      const data = narrativesData[slug];
      batchToTranslate[slug] = {
        era_en: data.era_en,
        epic_en: data.epic_en,
        trials_en: data.trials_en,
        overcoming_en: data.overcoming_en,
        wisdom: data.wisdom ? data.wisdom.map(w => ({
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
          narrativesData[slug].era_es = tData.era_es;
          narrativesData[slug].epic_es = tData.epic_es;
          narrativesData[slug].trials_es = tData.trials_es;
          narrativesData[slug].overcoming_es = tData.overcoming_es;
          
          if (tData.wisdom && narrativesData[slug].wisdom) {
            for (let j = 0; j < narrativesData[slug].wisdom.length; j++) {
              if (tData.wisdom[j]) {
                narrativesData[slug].wisdom[j].quote_es = tData.wisdom[j].quote_es;
                narrativesData[slug].wisdom[j].meaning_es = tData.wisdom[j].meaning_es;
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

  console.log("✅ All narratives translated and saved to final-narratives.json!");
}

run();
