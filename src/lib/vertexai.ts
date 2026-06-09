import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs';
import path from 'path';

let vertexAIInstance: VertexAI | null = null;

export function getVertexAIInstance(): VertexAI {
  if (vertexAIInstance) return vertexAIInstance;
  
  const projectId = process.env.GCP_PROJECT_ID || 'giantswisdom-8dc26';
  const location = process.env.GCP_LOCATION || 'us-central1';
  
  // Try loading from local service account file first
  const localKeyPath = path.resolve(process.cwd(), 'google-service-account.json');
  let credentials;
  
  if (fs.existsSync(localKeyPath)) {
    try {
      credentials = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
    } catch (e) {
      console.error("Failed to parse local google-service-account.json", e);
    }
  }
  
  // Fallback to environment variable
  if (!credentials && process.env.GCP_SERVICE_ACCOUNT) {
    try {
      credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
    } catch (e) {
      console.error("Failed to parse GCP_SERVICE_ACCOUNT environment variable", e);
    }
  }
  
  const initOptions: any = {
    project: projectId,
    location: location,
  };
  
  if (credentials) {
    initOptions.googleAuthOptions = {
      credentials,
    };
  } else {
    console.warn("No GCP credentials found. Vertex AI will fall back to default application credentials.");
  }
  
  vertexAIInstance = new VertexAI(initOptions);
  return vertexAIInstance;
}
