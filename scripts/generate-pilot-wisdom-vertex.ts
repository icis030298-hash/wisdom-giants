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
  'imhotep',
  'amina-of-zazzau',
  'tutankhamun',
  'j-e-casely-hayford',
  'frantz-fanon'
];

async function generateWisdom(slug: string, epicEn: string, epicKo: string) {
  const prompt = `
You are a multilingual content writer for an elite wisdom app about historical giants.
Historical Figure: ${slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} (slug: ${slug})
Biography Context (EN): ${epicEn.substring(0, 1500)}
Biography Context (KO): ${epicKo.substring(0, 1500)}

Your task:
1. Generate exactly 3 famous, historically accurate, or highly inspiring wisdom quotes matching this figure's actual philosophy.
2. Provide them in BOTH English and Korean (original source pairs).

Strict Rules & Guardrails:
1. "wisdom" array must contain exactly 3 items.
2. Write the quotes in the first-person voice ("I") of the giant. Max 2 sentences, direct and memorable.
3. Write the modern meaning/lesson in a strategic peer tone for modern life. Max 3 sentences.
4. NO English words or untranslated jargon should leak into Korean fields (quote_ko, meaning_ko). The Korean fields must be 100% natural, high-quality Korean.
5. NO Markdown formatting (do NOT use bold **, lists, or other markdown syntax in the quotes or meanings).
6. Return ONLY a valid JSON matching this schema:
{
  "wisdom": [
    {
      "quote_en": "...",
      "meaning_en": "...",
      "quote_ko": "...",
      "meaning_ko": "..."
    },
    {
      "quote_en": "...",
      "meaning_en": "...",
      "quote_ko": "...",
      "meaning_ko": "..."
    },
    {
      "quote_en": "...",
      "meaning_en": "...",
      "quote_ko": "...",
      "meaning_ko": "..."
    }
  ]
}
`;

  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const resultText = response.response.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  } catch (err: any) {
    console.error(`Error generating wisdom for ${slug}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("Loading narratives data from " + mainJsonPath);
  const data = JSON.parse(fs.readFileSync(mainJsonPath, 'utf8'));

  console.log("\n=== 파일럿 5인 wisdom 생성 시작 (Vertex AI) ===");
  for (const slug of testSlugs) {
    const giant = data[slug];
    if (!giant) {
      console.log(`- ${slug}: 데이터 없음`);
      continue;
    }

    console.log(`Generating for ${slug}...`);
    const wisdomResult = await generateWisdom(slug, giant.epic_en || "", giant.epic_ko || "");
    if (wisdomResult && wisdomResult.wisdom) {
      console.log(`[Result] ${slug}:`);
      console.log(JSON.stringify(wisdomResult.wisdom, null, 2));
    }
  }
}

main().catch(console.error);
