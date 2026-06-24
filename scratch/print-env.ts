console.log("Environment Keys:");
for (const key of Object.keys(process.env)) {
  if (key.includes("GCP") || key.includes("GOOGLE") || key.includes("GEMINI") || key.includes("CREDENTIALS")) {
    console.log(`- ${key}: ${process.env[key] ? process.env[key]?.substring(0, 20) + "..." : "empty"}`);
  }
}
