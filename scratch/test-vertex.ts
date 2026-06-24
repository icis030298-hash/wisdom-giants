import { getVertexAIInstance } from "../src/lib/vertexai";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");

async function test() {
  try {
    console.log("Initializing Vertex AI...");
    const vAI = getVertexAIInstance();
    const model = vAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.7,
      }
    });
    console.log("Generating test content...");
    const result = await model.generateContent("Say hello in one word.");
    const response = await result.response;
    console.log("Success! Response:", response.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (err: any) {
    console.error("Test failed with error:", err);
  }
}

test();
