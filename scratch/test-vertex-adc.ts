import { VertexAI } from '@google-cloud/vertexai';
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testADC() {
  try {
    console.log("Initializing VertexAI with default credentials (ADC)...");
    const initOptions: any = {
      project: 'giantswisdom-8dc26',
      location: 'us-central1',
    };
    
    // Explicitly delete/clear GOOGLE_APPLICATION_CREDENTIALS so it doesn't try using the bad file
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;

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
    console.error("ADC auth failed:", err);
  }
}

testADC();
