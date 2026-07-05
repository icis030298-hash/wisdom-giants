const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log("Attempting to authenticate with service account...");
  
  const keyPath = path.resolve('google-service-account.json');
  if (!fs.existsSync(keyPath)) {
    console.error(`Service account file not found at: ${keyPath}`);
    return;
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: [
      'https://www.googleapis.com/auth/cloud-billing',
      'https://www.googleapis.com/auth/cloud-platform'
    ],
  });

  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  const billing = google.cloudbilling({ version: 'v1' });

  try {
    console.log("Listing billing accounts...");
    const res = await billing.billingAccounts.list();
    const accounts = res.data.billingAccounts || [];
    console.log(`Found ${accounts.length} billing accounts:`);
    for (const acc of accounts) {
      console.log(`- Name: ${acc.name}, Display Name: ${acc.displayName}, Open: ${acc.open}`);
    }

    if (accounts.length === 0) {
      console.log("No billing accounts found for this service account.");
      return;
    }

    // Try to check budgets for the first account
    const billingAccountId = accounts[0].name.split('/').pop();
    console.log(`Checking budgets for billing account: ${billingAccountId}`);
    
    // Using billingbudgets API
    const billingbudgets = google.billingbudgets({ version: 'v1' });
    const budgetsRes = await billingbudgets.billingAccounts.budgets.list({
      parent: `billingAccounts/${billingAccountId}`
    });
    
    const budgets = budgetsRes.data.budgets || [];
    console.log(`Found ${budgets.length} budgets:`);
    for (const budget of budgets) {
      console.log(JSON.stringify(budget, null, 2));
    }
  } catch (err) {
    console.error("Error accessing Billing API:", err.message);
    if (err.response) {
      console.error("Response data:", JSON.stringify(err.response.data, null, 2));
    }
  }
}

main();
