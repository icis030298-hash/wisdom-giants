import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    // Note: listModels is a method on genAI in some versions or listModel
    console.log("Listing models...");
    // Let's check what properties exist on genAI object first
    console.log("genAI methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(genAI)));
    
    // Attempt to list models
    if (typeof (genAI as any).listModels === 'function') {
      const response = await (genAI as any).listModels();
      console.log("Models:", response);
    } else {
      console.log("listModels method does not exist on genAI");
    }
  } catch (e: any) {
    console.error("List models failed:", e);
  }
}

run();
