import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

async function listModels() {
  if (!apiKey) {
    console.error("No API key found.");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // Note: The SDK doesn't have a direct listModels method on the genAI instance easily accessible this way,
    // but we can try to initialize the model and see if it fails.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash:", result.response.text());
  } catch (error) {
    console.error("Failed with gemini-1.5-flash:", error.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash-latest:", result.response.text());
  } catch (error) {
    console.error("Failed with gemini-1.5-flash-latest:", error.message);
  }
}

listModels();
