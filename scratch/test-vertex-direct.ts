import { VertexAI } from '@google-cloud/vertexai';
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testDirect() {
  try {
    console.log("Reading credentials...");
    const localKeyPath = path.resolve(process.cwd(), 'google-service-account.json');
    if (!fs.existsSync(localKeyPath)) {
      throw new Error("google-service-account.json not found");
    }
    const credentials = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));

    console.log("Initializing VertexAI with direct credentials...");
    const initOptions: any = {
      project: 'giantswisdom-8dc26',
      location: 'us-central1',
      googleAuthOptions: {
        credentials,
      }
    };
    
    const vAI = new VertexAI(initOptions);
    const model = vAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });
    
    console.log("Generating test content...");
    const result = await model.generateContent("Say hello in one word.");
    const response = await result.response;
    let text = "";
    if (typeof response.text === "function") {
      text = response.text();
    } else {
      text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    console.log("Success! Response:", text.trim());
  } catch (err: any) {
    console.error("Direct auth failed:", err);
  }
}

testDirect();
