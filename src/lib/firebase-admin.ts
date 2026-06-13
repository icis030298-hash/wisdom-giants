import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

function initFirebase() {
  if (getApps().length > 0) {
    return;
  }

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
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    credentialConfig = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : undefined,
    };
  }

  // Only initialize if we have credentials (avoids crashing during build phase on Vercel)
  if (credentialConfig.privateKey && credentialConfig.clientEmail) {
    initializeApp({
      credential: cert(credentialConfig),
    });
  } else {
    console.warn("Firebase Admin credentials (privateKey, clientEmail) are missing. Initialization deferred.");
  }
}

// Export a proxy that lazy-loads Firebase Admin on first property access
export const adminDb = new Proxy({} as any, {
  get(target, prop) {
    initFirebase();
    if (getApps().length === 0) {
      throw new Error("Firebase Admin SDK is not initialized. Please verify that FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL environment variables are configured.");
    }
    const firestore = getFirestore();
    const value = firestore[prop as keyof ReturnType<typeof getFirestore>];
    if (typeof value === 'function') {
      return value.bind(firestore);
    }
    return value;
  }
});

export default adminDb;
