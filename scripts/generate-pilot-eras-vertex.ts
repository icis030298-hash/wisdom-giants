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
    responseMimeType: "application/json"
  }
});

const mainJsonPath = path.resolve('src/data/final-narratives.json');

const testSlugs = [
  'timur-tamerlane',
  'pyotr-ilyich-tchaikovsky',
  'alexander-graham-bell',
  'andrew-carnegie',
  'johannes-gutenberg'
];

async function generateEra(slug: string, epicKo: string, epicEn: string) {
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
4. Return ONLY a valid JSON object matching this structure:
{
  "era_en": "...",
  "era_ko": "..."
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
    return JSON.parse(resultText);
  } catch (err: any) {
    console.error(`Error generating era for ${slug}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("Loading narratives data from " + mainJsonPath);
  const data = JSON.parse(fs.readFileSync(mainJsonPath, 'utf8'));

  console.log("\n=== 파일럿 5인 era 생성 시작 (Vertex AI) ===");
  for (const slug of testSlugs) {
    const giant = data[slug];
    if (!giant) {
      console.log(`- ${slug}: 데이터 없음`);
      continue;
    }

    console.log(`Generating for ${slug}...`);
    const eraResult = await generateEra(slug, giant.epic_ko || "", giant.epic_en || "");
    if (eraResult) {
      console.log(`[Result] ${slug}:`);
      console.log(`  era_ko: "${eraResult.era_ko}"`);
      console.log(`  era_en: "${eraResult.era_en}"`);
    }
  }
}

main().catch(console.error);
