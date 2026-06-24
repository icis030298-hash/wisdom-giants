import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("NEXT_PUBLIC_GEMINI_API_KEY not found");
  process.exit(1);
}

async function testFetch() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  try {
    console.log("Sending direct fetch request to Gemini API...");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say hello in one word." }] }]
      })
    });
    
    console.log("Status:", res.status, res.statusText);
    const data = await res.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

testFetch();
