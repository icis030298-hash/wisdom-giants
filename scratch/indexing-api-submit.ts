import { google } from 'googleapis';
import { INDEXED_LOCALES } from '../src/config/locale-status';
import { giants } from '../src/lib/giants-data';

// How to run: 
// GCP_CLIENT_EMAIL="your-email@gserviceaccount.com" GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." npx tsx scratch/indexing-api-submit.ts

const BASE_URL = 'https://www.giantswisdom.com';
const DAILY_QUOTA_LIMIT = 200; // Safe threshold for Indexing API
const IS_DRY_RUN = process.env.DRY_RUN !== 'false';

async function getJwtClient() {
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  let privateKey = process.env.GCP_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    console.warn("⚠️ GCP Credentials not found in environment variables (GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY).");
    console.warn("Executing DRY RUN (Mock) to display target URLs.");
    return null;
  }

  // Fix escaped newlines if they were passed in as a single string
  privateKey = privateKey.replace(/\\n/g, '\n');

  const jwtClient = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );

  return new Promise((resolve, reject) => {
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        console.error("❌ Failed to authorize with GCP:", err);
        return reject(err);
      }
      resolve(jwtClient);
    });
  });
}

async function submitUrl(jwtClient: any, url: string) {
  if (!jwtClient || IS_DRY_RUN) {
    console.log(`[DRY RUN] 🟢 200 OK - Mock Submitted: ${url}`);
    return;
  }

  const indexing = google.indexing({ version: 'v3', auth: jwtClient });
  try {
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });
    console.log(`✅ [200 OK] Submitted: ${url}`);
  } catch (error: any) {
    console.error(`❌ Failed to submit ${url}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting Giants Wisdom Google Indexing API Submit Script");
  console.log("---------------------------------------------------------");
  console.log(`Targeting Tier 1 Locales (INDEXED_LOCALES): ${INDEXED_LOCALES.join(', ')}`);
  
  const jwtClient = await getJwtClient();
  
  // 1. Prioritize About Pages (1st person philosophy)
  const priorityUrls: string[] = [];
  for (const loc of INDEXED_LOCALES) {
    priorityUrls.push(`${BASE_URL}/${loc}/about`);
  }

  // 2. Add Tier 1 Giant Profiles
  for (const loc of INDEXED_LOCALES) {
    for (const giant of giants) {
      priorityUrls.push(`${BASE_URL}/${loc}/giant/${giant.slug}`);
    }
  }

  console.log(`Total Eligible URLs: ${priorityUrls.length}`);
  console.log(`Applying Daily Quota Limit: ${DAILY_QUOTA_LIMIT}`);
  
  // Truncate to quota
  const batchToSubmit = priorityUrls.slice(0, DAILY_QUOTA_LIMIT);
  
  console.log("---------------------------------------------------------");
  console.log("▶️  Executing Batch Submission (Max 200)...");
  
  let successCount = 0;
  for (const url of batchToSubmit) {
    await submitUrl(jwtClient, url);
    successCount++;
    // Delay to prevent rate limiting issues
    await new Promise(resolve => setTimeout(resolve, 300)); 
  }
  
  console.log("---------------------------------------------------------");
  console.log(`🎉 Batch Complete: Successfully processed ${successCount} URLs.`);
}

main();
