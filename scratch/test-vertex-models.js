const { VertexAI } = require('@google-cloud/vertexai');
const path = require('path');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('google-service-account.json');

// Extract project from service account JSON
const sa = JSON.parse(fs.readFileSync('google-service-account.json', 'utf8'));
const projectId = sa.project_id;
console.log('Project ID:', projectId);

const v = new VertexAI({
  project: projectId,
  location: 'us-central1'
});

async function testModel(modelName) {
  console.log(`\nTesting model: ${modelName}...`);
  try {
    const m = v.getGenerativeModel({
      model: modelName
    });
    const result = await m.generateContent('Hello, this is a test. Answer with "OK"');
    const response = await result.response;
    console.log(`✅ Model ${modelName} success! Response:`, JSON.stringify(response.candidates?.[0]?.content?.parts?.[0]?.text));
    return true;
  } catch (e) {
    console.log(`❌ Model ${modelName} failed:`, e.message);
    return false;
  }
}

async function run() {
  const models = [
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash-lite-001',
    'gemini-2.0-flash-001',
    'gemini-1.5-flash'
  ];
  for (const model of models) {
    await testModel(model);
  }
}

run();
