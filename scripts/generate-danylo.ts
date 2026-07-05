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
  model: 'gemini-2.5-flash-lite',
});

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');

async function main() {
  const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
  const slug = 'danylo-halytskyi';
  const g = data[slug];
  const epicKo = g.epic_ko || '';
  const factBox = g.fact_box || g.fact_box_ko || {};

  console.log("Generating wisdom for danylo-halytskyi specifically...");

  const prompt = `Based on the following historical giant's biography and achievements, please generate exactly 3 key wisdom lessons. Each lesson must have a core quote/principle and its modern meaning, in both Korean and English.

Giant: ${slug}
Biography (Korean): ${epicKo.slice(0, 2000)}
Fact Box (Korean): ${JSON.stringify(factBox)}

Return ONLY a valid JSON object matching this structure. Make sure all strings are properly escaped (especially avoid unescaped double quotes or newlines inside strings):
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

  let attempts = 0;
  while (attempts < 5) {
    attempts++;
    try {
      const res = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      });
      let text = res.response.candidates[0].content.parts[0].text.trim();
      text = text.replace(/^```json\s*/g, '').replace(/```$/g, '').trim();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.wisdom) && parsed.wisdom.length === 3) {
        g.wisdom = parsed.wisdom;
        fs.writeFileSync(NARRATIVES_FILE, JSON.stringify(data, null, 2));
        console.log(`Successfully generated wisdom for ${slug} on attempt ${attempts}!`);
        return;
      }
    } catch (err: any) {
      console.warn(`Attempt ${attempts} failed:`, err.message);
    }
  }
  console.error("Failed to generate wisdom for danylo-halytskyi after all attempts.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
