import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs';
import path from 'path';

let vertexAIInstance: VertexAI | null = null;

export function getVertexAIInstance(): VertexAI {
  if (vertexAIInstance) return vertexAIInstance;
  
  const projectId = process.env.GCP_PROJECT_ID || 'giantswisdom-8dc26';
  const location = process.env.GCP_LOCATION || 'us-central1';
  
  const localKeyPath = path.resolve(process.cwd(), 'google-service-account.json');
  
  if (fs.existsSync(localKeyPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = localKeyPath;
  } else if (process.env.GCP_SERVICE_ACCOUNT) {
    try {
      const creds = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
      const tempPath = path.resolve(process.cwd(), 'temp-gcp-sa.json');
      fs.writeFileSync(tempPath, JSON.stringify(creds), 'utf8');
      process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
    } catch (e) {
      console.error("Failed to parse GCP_SERVICE_ACCOUNT env", e);
    }
  }
  
  const initOptions: any = {
    project: projectId,
    location: location,
  };
  
  vertexAIInstance = new VertexAI(initOptions);
  return vertexAIInstance;
}
