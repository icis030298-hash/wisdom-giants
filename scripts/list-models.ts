import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const API_KEY = process.env.GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;
async function list() {
  const response = await fetch(API_URL);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
list();
