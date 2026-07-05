import fs from 'fs';
import path from 'path';
import { VertexAI } from "@google-cloud/vertexai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function cleanResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/g, '').replace(/```$/g, '').trim();
  return cleaned;
}

const contaminatedLangs = ['ha', 'id', 'nl', 'pl', 'sw', 'th', 'tr', 'uk', 'vi'];

async function main() {
  console.log("=== Loading narratives data ===");
  const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
  const slugs = Object.keys(data);
  console.log(`Loaded ${slugs.length} giants.`);

  let cleanHebrewCount = 0;
  let cleanContaminatedCount = 0;

  // 1. Data Cleaning
  for (const slug of slugs) {
    const g = data[slug];

    // Clean Hebrew reversals
    const tHe = g.trials_he || '';
    const oHe = g.overcoming_he || '';
    const eHe = g.era_he || '';
    const hasHebrewReversal = tHe.includes('[RTL') || oHe.includes('[RTL') || eHe.includes('[RTL') ||
                              tHe.includes('.aneleH') || oHe.includes('.aneleH') ||
                              tHe.includes(' eht ') || oHe.includes(' eht ');

    if (hasHebrewReversal) {
      delete g.era_he;
      delete g.trials_he;
      delete g.overcoming_he;
      if (Array.isArray(g.wisdom)) {
        g.wisdom.forEach((w: any) => {
          delete w.quote_he;
          delete w.meaning_he;
        });
      }
      cleanHebrewCount++;
    }

    // Clean 9 contaminated languages
    let cleanedThisGiantContamination = false;
    for (const lang of contaminatedLangs) {
      const t = g[`trials_${lang}`] || '';
      const o = g[`overcoming_${lang}`] || '';
      const hasContamination = t.includes(`[${lang}]`) || o.includes(`[${lang}]`);
      
      if (hasContamination) {
        delete g[`era_${lang}`];
        delete g[`trials_${lang}`];
        delete g[`overcoming_${lang}`];
        if (Array.isArray(g.wisdom)) {
          g.wisdom.forEach((w: any) => {
            delete w[`quote_${lang}`];
            delete w[`meaning_${lang}`];
          });
        }
        cleanedThisGiantContamination = true;
      }
    }
    if (cleanedThisGiantContamination) {
      cleanContaminatedCount++;
    }
  }

  console.log(`Cleaned Hebrew reversals for ${cleanHebrewCount} giants.`);
  console.log(`Cleaned contaminated debug tags for ${cleanContaminatedCount} giants.`);
  
  // Save checkpoint after cleaning
  fs.writeFileSync(NARRATIVES_FILE, JSON.stringify(data, null, 2));
  console.log("Checkpoint saved after cleaning.");

  // 2. Generate Era for 406 giants (concurrently in chunks of 20)
  const missingEraSlugs = slugs.filter(slug => !data[slug].era_ko || !data[slug].era_en);
  console.log(`\n=== Generating missing era for ${missingEraSlugs.length} giants ===`);
  
  const eraChunkSize = 20;
  for (let i = 0; i < missingEraSlugs.length; i += eraChunkSize) {
    const chunk = missingEraSlugs.slice(i, i + eraChunkSize);
    const promises = chunk.map(async (slug) => {
      const g = data[slug];
      const epicKo = g.epic_ko || '';
      const epicEn = g.epic_en || '';
      
      const prompt = `Based on the following historical giant's information, please extract their birth and death years (or approximate historical era) and generate two fields: "era_ko" (Korean) and "era_en" (English).

Giant: ${slug}
Korean Epic Sample: ${epicKo.slice(0, 1000)}
English Epic Sample: ${epicEn.slice(0, 1000)}

Rules for "era_ko":
- Format: "X세기의 거인 (생년~몰년)" or similar natural Korean historical period phrasing.
- Examples:
  - "18~19세기의 거인 (1769~1821)"
  - "15세기의 거인 (1397~1450)"
  - "기원전 4세기의 거인 (기원전 356~기원전 323)"
  - "2세기 (로마 제국)"

Rules for "era_en":
- Format: "Xth Century Giant (Birth-Death)" or similar natural English phrasing.
- Examples:
  - "18th-19th Century Giant (1769-1821)"
  - "15th Century Giant (1397-1450)"
  - "4th Century BC Giant (356 BC-323 BC)"
  - "2nd Century Giant (Roman Empire)"

Return ONLY a valid JSON object:
{
  "era_ko": "...",
  "era_en": "..."
}`;

      try {
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
        });
        const text = cleanResponse(res.response.candidates[0].content.parts[0].text);
        const parsed = JSON.parse(text);
        if (parsed.era_ko && parsed.era_en) {
          g.era_ko = parsed.era_ko;
          g.era_en = parsed.era_en;
          console.log(`  [era] Generated for ${slug}: ${g.era_ko} / ${g.era_en}`);
        }
      } catch (err: any) {
        console.error(`  [era] Error generating for ${slug}:`, err.message);
      }
    });

    await Promise.all(promises);
    fs.writeFileSync(NARRATIVES_FILE, JSON.stringify(data, null, 2));
    console.log(`Checkpoint saved for era (Chunk ${Math.floor(i / eraChunkSize + 1)} / ${Math.ceil(missingEraSlugs.length / eraChunkSize)})`);
    await sleep(1000);
  }

  // 3. Generate Wisdom for 24 giants
  const missingWisdomSlugs = slugs.filter(slug => {
    const wisdom = data[slug].wisdom || [];
    const hasWisdomKo = wisdom.length > 0 && wisdom.some((w: any) => w.quote_ko && w.quote_ko.trim() !== '');
    return !hasWisdomKo;
  });
  console.log(`\n=== Generating missing wisdom lessons for ${missingWisdomSlugs.length} giants ===`);

  const wisdomChunkSize = 5; // Smaller chunk for larger generation payloads
  for (let i = 0; i < missingWisdomSlugs.length; i += wisdomChunkSize) {
    const chunk = missingWisdomSlugs.slice(i, i + wisdomChunkSize);
    const promises = chunk.map(async (slug) => {
      const g = data[slug];
      const epicKo = g.epic_ko || '';
      const factBox = g.fact_box || g.fact_box_ko || {};

      const prompt = `Based on the following historical giant's biography and achievements, please generate exactly 3 key wisdom lessons. Each lesson must have a core quote/principle and its modern meaning, in both Korean and English.

Giant: ${slug}
Biography (Korean): ${epicKo.slice(0, 2000)}
Fact Box (Korean): ${JSON.stringify(factBox)}

Return ONLY a JSON object matching this structure:
{
  "wisdom": [
    {
      "quote_ko": "실패를 두려워하지 말라...",
      "meaning_ko": "현대인들에게 실패는 두려움의 대상이지만...",
      "quote_en": "Do not fear failure...",
      "meaning_en": "For modern people, failure is feared, but..."
    },
    {
      "quote_ko": "...",
      "meaning_ko": "...",
      "quote_en": "...",
      "meaning_en": "..."
    },
    {
      "quote_ko": "...",
      "meaning_ko": "...",
      "quote_en": "...",
      "meaning_en": "..."
    }
  ]
}`;

      try {
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
        });
        const text = cleanResponse(res.response.candidates[0].content.parts[0].text);
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.wisdom) && parsed.wisdom.length === 3) {
          g.wisdom = parsed.wisdom;
          console.log(`  [wisdom] Generated 3 lessons for ${slug}`);
        } else {
          console.warn(`  [wisdom] Invalid format generated for ${slug}`);
        }
      } catch (err: any) {
        console.error(`  [wisdom] Error generating for ${slug}:`, err.message);
      }
    });

    await Promise.all(promises);
    fs.writeFileSync(NARRATIVES_FILE, JSON.stringify(data, null, 2));
    console.log(`Checkpoint saved for wisdom (Chunk ${Math.floor(i / wisdomChunkSize + 1)} / ${Math.ceil(missingWisdomSlugs.length / wisdomChunkSize)})`);
    await sleep(1500);
  }

  console.log("\n=== Stage 1 complete! Source data is now cleaned and complete. ===");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
