import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
console.log("Checking API Key: ", API_KEY ? `${API_KEY.slice(0, 8)}...` : "UNDEFINED");

if (!API_KEY) {
  console.error("API key is not configured.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

async function run() {
  try {
    const response = await model.generateContent("Say 'Hello' in French");
    console.log("Response text:", response.response.text());
  } catch (error: any) {
    console.error("Full API Error Details:");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Error Object:", JSON.stringify(error, null, 2));
  }
}

run();
