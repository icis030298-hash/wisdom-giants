import fs from 'fs';
import path from 'path';
import { VertexAI } from '@google-cloud/vertexai';

const inFile = path.join(__dirname, 't2-p2-chunk-6.json');
const outFile = path.join(__dirname, 't2-p2-out-6.json');

const tasks = JSON.parse(fs.readFileSync(inFile, 'utf8'));
const outTasks: any[] = [];

// Initialize VertexAI
delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
const vertexAI = new VertexAI({
  project: 'giantswisdom-8dc26',
  location: 'us-central1'
});
const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
  generationConfig: {
    temperature: 0.1,
    responseMimeType: 'application/json'
  }
});

async function processBatch(batch: any[]) {
  const prompt = `You are a translation worker.
Translate the following items into the target locale.
Return a JSON array of objects. For each object, return:
{
  "id": <id>,
  "translated": <translated content>
}

Rules for "translated":
- If "type" is 'fact-layer', originalEn is an array of { year, event }. Translate BOTH year and event into the target "loc". Keep the array of objects structure.
- If "type" is 'narrative', and originalEn is a string, translate it into the target "loc".
- If "type" is 'narrative', and originalEn is an array (like wisdom quotes), translate the English fields (quote_en, meaning_en) into the target "loc" and return the translated array.

Input items:
${JSON.stringify(batch.map((t, i) => ({
    id: i,
    loc: t.loc,
    type: t.type,
    originalEn: t.originalEn
  })), null, 2)}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = "";
    if (typeof response.text === "function") {
      text = response.text();
    } else {
      text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    
    const parsed = JSON.parse(text.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim());
    for (const p of parsed) {
      if (batch[p.id]) {
        batch[p.id].translated = p.translated;
      }
    }
  } catch (e: any) {
    console.error("Batch failed", e.message);
    // fallback
    for (const t of batch) {
       t.translated = t.originalEn;
    }
  }
}

async function main() {
  const batchSize = 10;
  for (let i = 0; i < tasks.length; i += batchSize) {
    console.log("Processing " + i + " to " + Math.min(i + batchSize, tasks.length) + " of " + tasks.length);
    const batch = tasks.slice(i, i + batchSize);
    await processBatch(batch);
    outTasks.push(...batch);
    
    fs.writeFileSync(outFile, JSON.stringify(outTasks, null, 2));
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("Done");
}

main();
