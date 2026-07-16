require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const data = require('./scratch/task3_id_chunk_1.json');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  generationConfig: { responseMimeType: "application/json" } 
});

async function processData() {
  const keys = Object.keys(data);
  const output = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.log(`Translating ${key} (${i+1}/${keys.length})...`);
    const item = data[key];

    const prompt = `Translate the following JSON into Indonesian (id). 
Rules:
1. Translate values of \`event\`, \`title\`, \`description\`, \`question\`, \`answer\`.
2. DO NOT translate the \`year\` string. Keep it exactly as it is.
3. Output the translated JSON strictly. Return exactly the same object structure as the input.

Input JSON:
${JSON.stringify(item, null, 2)}`;

    let retries = 5;
    while(retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        output[key] = JSON.parse(text);
        fs.writeFileSync('./scratch/task3_id_out_1.json', JSON.stringify(output, null, 2));
        break;
      } catch (e) {
        console.error(`Error on ${key}:`, e.message);
        retries--;
        if (retries === 0) {
          console.error(`Failed on ${key}, saving original.`);
          output[key] = item; // fallback
          fs.writeFileSync('./scratch/task3_id_out_1.json', JSON.stringify(output, null, 2));
        } else {
          console.log(`Retrying in 10 seconds...`);
          await new Promise(r => setTimeout(r, 10000));
        }
      }
    }
    // Wait to respect the 15 RPM free tier
    await new Promise(r => setTimeout(r, 4500));
  }
  console.log("Done!");
}

processData();
