import { GoogleAuth } from "google-auth-library";
import path from "path";

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");

async function testAuth() {
  try {
    console.log("Initializing GoogleAuth...");
    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
    console.log("Getting client...");
    const client = await auth.getClient();
    console.log("Getting access token...");
    const token = await client.getAccessToken();
    console.log("Success! Token starts with:", token.token ? token.token.substring(0, 15) : "null");
  } catch (e: any) {
    console.error("Auth test failed:", e);
  }
}

testAuth();
