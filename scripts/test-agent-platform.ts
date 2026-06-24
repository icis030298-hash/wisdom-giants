import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");
delete process.env.GEMINI_API_KEY;
delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;

process.env.GOOGLE_CLOUD_PROJECT = 'giantswisdom-8dc26';
process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';

async function test() {
  try {
    console.log("Initializing Agent Platform (formerly Vertex AI)...");
    
    const ai = new GoogleGenAI({
      vertexai: {
        project: 'giantswisdom-8dc26',
        location: 'us-central1'
      }
    });

    console.log("Generating test content with gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say hello in one word.'
    });

    console.log("Success! Response:", response.text);
  } catch (err: any) {
    console.error("Test failed with error:", err.message || err);
  }
}

test();
