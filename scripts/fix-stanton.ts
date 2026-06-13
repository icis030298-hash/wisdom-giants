import { getVertexAIInstance } from "../src/lib/vertexai.js";
import fs from 'fs';

async function fixStanton() {
  const narrativesPath = 'src/data/final-narratives.json';
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

  const vAI = getVertexAIInstance();
  const model = vAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const enEpic = narratives['elizabeth-cady-stanton'].epic_en;

  const prompt = `Translate the following epic narrative into Korean.
Do NOT add any Markdown headers.
Keep it strictly to 4 paragraphs.
Maintain the literary, dramatic, and epic prose style (Napoleon level).
Only output the Korean translation.

English Text:
${enEpic}
`;

  const result = await model.generateContent(prompt);
  const koEpic = result.response.candidates![0].content.parts[0].text!.trim();

  narratives['elizabeth-cady-stanton'].epic_ko = koEpic;
  
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf-8');
  console.log('✅ Success: Stanton KO epic is now', koEpic.length, 'chars');
}

fixStanton().catch(console.error);
