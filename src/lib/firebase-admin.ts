import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let credentialConfig: any;

// Try reading local service account file for development
const serviceAccountPath = path.resolve(process.cwd(), 'google-service-account.json');
if (fs.existsSync(serviceAccountPath)) {
  try {
    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    credentialConfig = JSON.parse(fileContent);
  } catch (e) {
    console.warn("Failed to parse local google-service-account.json:", e);
  }
}

// Fallback to environment variables for production
if (!credentialConfig) {
  credentialConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(credentialConfig),
  });
}

export const adminDb = getFirestore();
export default adminDb;
