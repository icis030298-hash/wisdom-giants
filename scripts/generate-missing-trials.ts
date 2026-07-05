import fs from 'fs';
import path from 'path';
import { VertexAI } from "@google-cloud/vertexai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));

function cleanResponse(text: string): string {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

async function generateTrialsFor(slug: string) {
  const g = data[slug];
  const epicKo = g.epic_ko || '';
  const epicEn = g.epic_en || '';

  const prompt = `Based on the following historical giant's information, please generate the missing source fields: "trials_ko", "trials_en", "overcoming_ko", "overcoming_en".

Giant: ${slug}
Korean Epic: ${epicKo}
English Epic: ${epicEn}

Rules:
- "trials_ko" (Korean): Summarize 2-3 major trials/hardships of the giant (e.g., social isolation, physical disability, political betrayal, military defeat) in a natural Korean sentence.
- "trials_en" (English): Accurate, high-quality translation of "trials_ko" without Korean-English leakage.
- "overcoming_ko" (Korean): Summarize how they overcame the trials or what lasting legacy they left in a natural Korean sentence.
- "overcoming_en" (English): Accurate, high-quality translation of "overcoming_ko".

Format: Plain text sentences. Do NOT use markdown bold/italic tags.
Return ONLY a valid JSON object matching the exact structure below:
{
  "trials_ko": "...",
  "trials_en": "...",
  "overcoming_ko": "...",
  "overcoming_en": "..."
}`;

  console.log(`Generating trials/overcoming for ${slug}...`);
  try {
    const res = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
    });

    const text = cleanResponse(res.response.candidates[0].content.parts[0].text);
    const parsed = JSON.parse(text);

    if (parsed.trials_ko && parsed.trials_en && parsed.overcoming_ko && parsed.overcoming_en) {
      g.trials_ko = parsed.trials_ko;
      g.trials_en = parsed.trials_en;
      g.overcoming_ko = parsed.overcoming_ko;
      g.overcoming_en = parsed.overcoming_en;
      console.log(`  Successfully generated for ${slug}`);
      return true;
    } else {
      console.error(`  Validation failed for ${slug}: incomplete keys`);
      return false;
    }
  } catch (err: any) {
    console.error(`  Error generating for ${slug}:`, err.message);
    return false;
  }
}

async function main() {
  const slugs = ['john-f-kennedy', 'shaka-zulu'];
  let updated = false;

  for (const slug of slugs) {
    const success = await generateTrialsFor(slug);
    if (success) updated = true;
  }

  if (updated) {
    fs.writeFileSync(NARRATIVES_FILE, JSON.stringify(data, null, 2));
    console.log("Saved generated fields to final-narratives.json");
  }
}

main();
