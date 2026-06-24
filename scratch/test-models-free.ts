import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY not found");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const models = [
  "gemini-1.5-pro",
  "gemini-1.5-pro-latest",
  "gemini-2.0-flash-exp",
  "gemini-2.5-pro",
];

async function run() {
  for (const m of models) {
    try {
      console.log(`Testing ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hello");
      console.log(`Success with ${m}:`, result.response.text().trim());
      return;
    } catch (e: any) {
      console.log(`Failed for ${m}:`, e.message);
    }
  }
}

run();
