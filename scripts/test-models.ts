import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
async function list() {
  const models = await genAI.getGenerativeModel({ model: "gemini-pro" }).listModels();
  console.log(models);
}
// list(); // listModels is not on the model object, it's usually on the genAI or separate
