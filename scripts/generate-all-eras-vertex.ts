import { VertexAI } from "@google-cloud/vertexai";
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.1
  }
});

const mainJsonPath = path.resolve('src/data/final-narratives.json');

// Helper to clean markdown blocks if AI leaks them
function cleanJSON(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

async function generateEra(slug: string, epicKo: string, epicEn: string): Promise<any> {
  const prompt = `
You are an expert biographer. Your task is to extract the birth and death years from the provided text and determine the centuries of active life of the giant. Then format the era in both Korean and English according to the exact schema.

Format schema:
- era_en: "{Centuries} Century Giant ({BirthYear}~{DeathYear})"
  - Example: "18th-19th Century Giant (1769~1821)"
  - Example: "19th Century Giant (1840~1893)"
  - Example: "19th-20th Century Giant (1847~1922)"
- era_ko: "{Centuries}세기의 거인 ({BirthYear}~{DeathYear})"
  - Example: "18~19세기의 거인 (1769~1821)"
  - Example: "19세기의 거인 (1840~1893)"
  - Example: "19~20세기의 거인 (1847~1922)"

Rules:
1. Centuries must be written like "18th-19th Century" or "19th Century" in English, and "18~19세기" or "19세기" in Korean.
2. Birth and death years should be written exactly as extracted (e.g. 1336~1405).
3. If BC years, specify BC (e.g., "551 BC~479 BC").
4. If birth or death years are completely unknown or not inferable from the text, return exactly null for both fields. Do NOT write sentences.
5. Return ONLY a valid JSON object matching this structure:
{
  "era_en": "...", // or null
  "era_ko": "..."  // or null
}

Provided text:
Slug: ${slug}
Epic (KO): ${epicKo}
Epic (EN): ${epicEn}
`;

  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const resultText = response.response.candidates[0].content.parts[0].text;
    const cleaned = cleanJSON(resultText);
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error(`Error generating era for ${slug}:`, err.message);
    return null;
  }
}

// Validator to ensure the generated era matches our strict schema format
function isValidEra(eraKo: any, eraEn: any): boolean {
  if (typeof eraKo !== 'string' || typeof eraEn !== 'string') return false;
  
  // Format check: must contain "세기의 거인" and "Century Giant"
  const hasKoKeyword = eraKo.includes('세기의 거인');
  const hasEnKeyword = eraEn.includes('Century Giant');
  
  // Must have parentheses with tilde (e.g., "(1769~1821)" or "(551 BC~479 BC)")
  const hasParentheses = eraKo.includes('(') && eraKo.includes(')') && eraKo.includes('~');
  
  // Prevent system error descriptions from leaking
  const hasErrorPhrases = eraKo.includes('없습니다') || eraKo.includes('찾을 수') || eraKo.includes('unknown');

  return hasKoKeyword && hasEnKeyword && hasParentheses && !hasErrorPhrases;
}

async function main() {
  console.log("Loading narratives data from " + mainJsonPath);
  const data = JSON.parse(fs.readFileSync(mainJsonPath, 'utf8'));
  const slugs = Object.keys(data);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // 1. Filter out already processed valid items
  const missingSlugs: string[] = [];
  for (const slug of slugs) {
    const giant = data[slug];
    if (giant && giant.era_ko && giant.era_en && isValidEra(giant.era_ko, giant.era_en)) {
      skipCount++;
    } else {
      missingSlugs.push(slug);
    }
  }

  console.log('\n==========================================');
  console.log(`[시작 준비] 총 거인: ${slugs.length}명`);
  console.log(`- 이미 올바른 era 존재 (스킵): ${skipCount}명`);
  console.log(`- 생성 필요 대상: ${missingSlugs.length}명`);
  console.log('==========================================\n');

  if (missingSlugs.length === 0) {
    console.log("모든 거인의 era가 완벽합니다. 작업을 종료합니다.");
    return;
  }

  // 2. Concurrency Pool (Batch Size = 3)
  const CONCURRENCY = 3;
  for (let i = 0; i < missingSlugs.length; i += CONCURRENCY) {
    const batch = missingSlugs.slice(i, i + CONCURRENCY);
    console.log(`[Batch ${Math.floor(i/CONCURRENCY) + 1}] Processing: ${batch.join(', ')}...`);

    const promises = batch.map(async (slug) => {
      const giant = data[slug];
      const eraResult = await generateEra(slug, giant.epic_ko || "", giant.epic_en || "");
      return { slug, eraResult };
    });

    const results = await Promise.all(promises);

    let batchUpdated = false;
    for (const { slug, eraResult } of results) {
      const giant = data[slug];
      if (eraResult && isValidEra(eraResult.era_ko, eraResult.era_en)) {
        giant.era_ko = eraResult.era_ko;
        giant.era_en = eraResult.era_en;
        successCount++;
        batchUpdated = true;
        console.log(`  ✓ Saved for ${slug}: "${giant.era_ko}"`);
      } else {
        failCount++;
        console.error(`  ✗ Failed or Invalid format for ${slug}:`, JSON.stringify(eraResult));
      }
    }

    if (batchUpdated) {
      // Safely write to file with LF endings
      const jsonString = JSON.stringify(data, null, 2).replace(/\r\n/g, '\n') + '\n';
      fs.writeFileSync(mainJsonPath, jsonString, 'utf8');
    }

    // Delay between batches to prevent API exhaustion
    if (i + CONCURRENCY < missingSlugs.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('\n==========================================');
  console.log('Era 대량 병렬 생성 작업 완료 보고');
  console.log(`- 스킵 건수: ${skipCount}건`);
  console.log(`- 성공 건수: ${successCount}건`);
  console.log(`- 실패 건수: ${failCount}건`);
  console.log('==========================================\n');
}

main().catch(console.error);
