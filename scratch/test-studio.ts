import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.log("Testing with API Key starting with:", API_KEY ? API_KEY.substring(0, 10) : "undefined");

if (!API_KEY) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

async function test() {
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in one word.");
      console.log(`Success with ${modelName}! Response:`, result.response.text().trim());
      return;
    } catch (e: any) {
      console.error(`Failed for ${modelName} with message:`, e.message);
    }
  }
}

test();
