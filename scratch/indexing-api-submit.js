const { google } = require('googleapis');
const fs = require('fs');

// Requirements: npm install googleapis
// How to run: 
// 1. Get a service account key from GCP Console
// 2. Save it as 'service-account.json' in this folder
// 3. node scratch/indexing-api-submit.js

const KEY_FILE = './scratch/service-account.json';

async function getJwtClient() {
  if (!fs.existsSync(KEY_FILE)) {
    console.error(`❌ GCP Service Account key not found at ${KEY_FILE}`);
    console.error("Please download it from Google Cloud Console and save it as service-account.json");
    process.exit(1);
  }

  const key = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
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

async function submitUrl(jwtClient, url) {
  const indexing = google.indexing({ version: 'v3', auth: jwtClient });
  try {
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });
    console.log(`✅ Submitted: ${url}`);
  } catch (error) {
    console.error(`❌ Failed to submit ${url}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting Google Indexing API Submit Script");
  const jwtClient = await getJwtClient();
  
  // Only fetching English paths for rapid indexing as an example.
  // The Google bot will crawl the 'alternate' hreflang links automatically.
  const coreUrls = [
    'https://www.giantswisdom.com/en',
    'https://www.giantswisdom.com/en/test',
    'https://www.giantswisdom.com/en/blog',
    'https://www.giantswisdom.com/en/giant/albert-einstein',
    'https://www.giantswisdom.com/en/giant/marcus-aurelius'
  ];

  for (const url of coreUrls) {
    await submitUrl(jwtClient, url);
    // Be careful with quota limits (default 200 URLs per day)
    await new Promise(resolve => setTimeout(resolve, 500)); 
  }
  
  console.log("🎉 Indexing API Submission Complete");
}

main();
