import fs from "fs";
import path from "path";

const localKeyPath = path.resolve(process.cwd(), "google-service-account.json");
if (!fs.existsSync(localKeyPath)) {
  console.error("google-service-account.json does not exist");
  process.exit(1);
}

try {
  const content = fs.readFileSync(localKeyPath, "utf8");
  const parsed = JSON.parse(content);
  console.log("Project ID:", parsed.project_id);
  console.log("Client Email:", parsed.client_email);
  console.log("Private Key length:", parsed.private_key ? parsed.private_key.length : 0);
  
  if (parsed.private_key) {
    const pk = parsed.private_key;
    console.log("Private Key starts with BEGIN PRIVATE KEY?", pk.includes("BEGIN PRIVATE KEY"));
    console.log("Private Key ends with END PRIVATE KEY?", pk.includes("END PRIVATE KEY"));
    console.log("Contains literal \\n?", pk.includes("\\n"));
    console.log("Contains real newlines?", pk.includes("\n"));
    console.log("Contains \\r?", pk.includes("\r"));
  }
} catch (e) {
  console.error("Failed to parse json:", e);
}
