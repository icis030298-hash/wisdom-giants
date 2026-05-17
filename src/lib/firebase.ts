import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, memoryLocalCache, enableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = firebaseConfig.apiKey ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const db = firebaseConfig.apiKey
  ? initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: true
    })
  : null;

// PRE-WARM NETWORK CONNECTION IMMEDIATELY ON CLIENT SIDE
if (typeof window !== "undefined" && db) {
  enableNetwork(db).catch((e) => console.warn("Network warming skipped:", e));
}

console.log("🔥 [Firebase Core]: Token-ready engine and network warming initialized.");
