const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path:'.env.local'});

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function main() {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `You are a professional biographer.
Convert the following Korean 1st-person epic stories into a 3rd-person biography style.

INPUT JSON:
{
  "steve-jobs": {
    "name_ko": "스티브 잡스",
    "epic_ko": "나는 차가운 샌프란시스코의 겨울 안개 속..."
  }
}

Return a JSON object containing the rewritten 3rd-person epic_ko for each giant slug in the input:
{
  "steve-jobs": "rewritten epic_ko..."
}`;

  console.log("Calling Gemini...");
  const result = await model.generateContent(prompt);
  console.log("Raw Response:");
  console.log(result.response.text());
}

main().catch(console.error);
