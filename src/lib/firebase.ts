import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Diagnostic Log
if (typeof window !== 'undefined') {
  console.log("[Firebase Debug]: Is API Key defined?", !!firebaseConfig.apiKey);
}

// Strict runtime condition to avoid crashing the whole Next.js page loop
const isConfigValid = !!firebaseConfig.apiKey;

// Initialize app only if config is potentially valid to avoid Firebase internal errors
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = isConfigValid ? getAuth(app) : null;
export const db = isConfigValid 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }) 
  : null;
export const googleProvider = new GoogleAuthProvider();
