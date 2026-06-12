import { google } from "googleapis";
import path from "path";

async function main() {
  console.log("Initializing Google Auth...");
  const keyPath = path.resolve(process.cwd(), "google-service-account.json");
  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const serviceusage = google.serviceusage({
    version: "v1",
    auth,
  });

  console.log("Enabling aiplatform.googleapis.com (Vertex AI API) on project giantswisdom-8dc26...");
  try {
    const res = await serviceusage.services.enable({
      name: "projects/giantswisdom-8dc26/services/aiplatform.googleapis.com",
    });
    console.log("Enable request submitted successfully!");
    console.log("Operation Details:", JSON.stringify(res.data, null, 2));
  } catch (e: any) {
    console.error("Error enabling Vertex AI API:", e.message || e);
  }
}

main().catch(console.error);
