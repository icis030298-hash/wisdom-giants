const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

// Need to set Google app credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), 'google-service-account.json');

// Get project ID from service account
const sa = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
const projectId = sa.project_id;
const location = 'us-central1';

const vertex_ai = new VertexAI({project: projectId, location: location});
const model = vertex_ai.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
  generationConfig: { responseMimeType: 'application/json' }
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateBatch(batch, batchIndex) {
  console.log(`[Batch ${batchIndex}] Translating ${batch.length} items...`);
  const prompt = `You are a professional translator. I will provide a JSON array of objects.
Each object has a "taskId", "type", "loc" (target locale code), and "originalEn" (the text to translate, which may be Korean or English).
- If "type" is 'fact-layer', "originalEn" is an array of { year, event } objects. Translate BOTH year and event into the target "loc". Keep the format identical.
- If "type" is 'narrative', "originalEn" is a string. Translate it into the target "loc".

Return a JSON array of objects. Each object MUST have:
- "taskId": the same taskId as provided
- "translated": the translated content (either array of {year, event} or string).

INPUT JSON ARRAY:
${JSON.stringify(batch.map((b, i) => ({
  taskId: i,
  loc: b.loc,
  type: b.type,
  originalEn: b.originalEn
})), null, 2)}
`;

  let attempts = 0;
  while (attempts < 3) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.candidates[0].content.parts[0].text;
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error("No JSON array found in response");
        }
      }
      return parsed;
    } catch (err) {
      attempts++;
      console.error(`[Batch ${batchIndex}] Attempt ${attempts} failed: ${err.message}`);
      await sleep(2000 * attempts);
    }
  }
  throw new Error(`Failed to translate batch ${batchIndex}`);
}

async function main() {
  const inputPath = path.resolve('scratch/t2-p2-chunk-10.json');
  const outputPath = path.resolve('scratch/t2-p2-out-10.json');

  const rawData = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(rawData);

  console.log(`Total items to translate: ${data.length}`);

  const batchSize = 10;
  const outData = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const translatedBatchRaw = await translateBatch(batch, Math.floor(i / batchSize));
    
    for (let j = 0; j < batch.length; j++) {
      const item = batch[j];
      const translatedItemRaw = translatedBatchRaw.find(t => t.taskId === j);
      outData.push({
        ...item,
        translated: translatedItemRaw ? translatedItemRaw.translated : null
      });
    }
    
    // Save intermediate progress just in case
    fs.writeFileSync(outputPath, JSON.stringify(outData, null, 2), 'utf8');
    await sleep(500); // rate limiting
  }

  console.log(`Finished translating. Saved to ${outputPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
