import fs from "fs";
import path from "path";
import crypto from "crypto";

const localKeyPath = path.resolve(process.cwd(), "google-service-account.json");
if (!fs.existsSync(localKeyPath)) {
  console.error("google-service-account.json does not exist");
  process.exit(1);
}

try {
  const content = fs.readFileSync(localKeyPath, "utf8");
  const parsed = JSON.parse(content);
  const privateKey = parsed.private_key;
  
  console.log("Attempting to sign a dummy message using crypto module...");
  const sign = crypto.createSign('SHA256');
  sign.update('test data');
  sign.end();
  const signature = sign.sign(privateKey);
  console.log("Success! Private key is a valid PEM key. Signature length:", signature.length);
} catch (e: any) {
  console.error("Crypto signing failed. The private key format might be corrupted:", e.message);
}
