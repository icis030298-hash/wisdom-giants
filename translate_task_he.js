require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const inPath = path.join(__dirname, 'scratch', 'task_he_in_1.json');
const outPath = path.join(__dirname, 'scratch', 'task_he_out_1.json');

const data = require(inPath);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  generationConfig: { responseMimeType: "application/json" } 
});

async function processData() {
  const keys = Object.keys(data);
  const output = {};

  if (fs.existsSync(outPath)) {
    Object.assign(output, JSON.parse(fs.readFileSync(outPath, 'utf8')));
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (output[key]) {
       console.log(`Skipping ${key} (${i+1}/${keys.length}), already done.`);
       continue;
    }
    console.log(`Translating ${key} (${i+1}/${keys.length})...`);
    const item = data[key];

    const prompt = `Translate the following JSON into Hebrew (he). 
Rules:
1. Translate ALL text string values inside the JSON into Hebrew.
2. CRITICAL: You MUST translate the \`year\` field inside each timeline event! Do not leave it in Korean. (e.g. "1874년 11월 30일" -> "30 בנובמבר 1874", "1895년" -> "1895").
3. Do NOT translate JSON keys. Do NOT translate the \`slug\` value (e.g., "winston-churchill" remains "winston-churchill"). Do not translate boolean or null values.
4. Keep the JSON structure exactly the same.
5. If \`missingDataNote\` or any string is empty, leave it empty.

Input JSON:
${JSON.stringify(item, null, 2)}`;

    let retries = 5;
    while(retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        output[key] = JSON.parse(text);
        fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
        break;
      } catch (e) {
        console.error(`Error on ${key}:`, e.message);
        retries--;
        if (retries === 0) {
          console.error(`Failed on ${key}, saving original.`);
          output[key] = item; // fallback
          fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
        } else {
          console.log(`Retrying in 45 seconds...`);
          await new Promise(r => setTimeout(r, 45000));
        }
      }
    }
    // Wait to respect the 15 RPM free tier
    await new Promise(r => setTimeout(r, 4500));
  }
  console.log("Done!");
}

processData();
