import fs from "fs";
import path from "path";

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

async function main() {
  const generatedPath = path.resolve(process.cwd(), "scripts/new-giants-50.json");

  if (!fs.existsSync(generatedPath)) {
    console.error("❌ Error: scripts/new-giants-50.json not found! Run the generation script first.");
    process.exit(1);
  }

  const generatedData = JSON.parse(fs.readFileSync(generatedPath, "utf8"));
  const slugs = Object.keys(generatedData);

  console.log(`=== STARTING VALIDATION FOR ${slugs.length} GIANTS ===\n`);

  let errorCount = 0;

  if (slugs.length !== 50) {
    console.warn(`⚠️ Warning: Expected exactly 50 giants, but found ${slugs.length}.`);
  }

  for (const slug of slugs) {
    console.log(`Checking: ${slug}...`);
    const g = generatedData[slug];

    // 1. Basic properties
    if (!g.category) {
      console.error(`❌ [${slug}] Missing root 'category' property.`);
      errorCount++;
    }

    if (!g.messages || typeof g.messages !== "object") {
      console.error(`❌ [${slug}] Missing or invalid 'messages' object.`);
      errorCount++;
      continue;
    }

    if (!g.epic || typeof g.epic !== "object") {
      console.error(`❌ [${slug}] Missing or invalid 'epic' object.`);
      errorCount++;
      continue;
    }

    // 2. Localized messages check
    for (const loc of LOCALES) {
      const msg = g.messages[loc];
      if (!msg) {
        console.error(`❌ [${slug}] Missing translations for locale '${loc}'.`);
        errorCount++;
        continue;
      }

      // Check fields
      const requiredFields = ["name", "title", "headline", "shortDescription", "quote", "chatGreeting", "era", "pain", "recovery"];
      for (const field of requiredFields) {
        if (!msg[field] || typeof msg[field] !== "string" || msg[field].trim().length === 0) {
          console.error(`❌ [${slug}] [${loc}] Empty or missing field: '${field}'`);
          errorCount++;
        }
      }

      // Check greeting length
      if (msg.chatGreeting && msg.chatGreeting.trim().length < 15) {
        console.warn(`⚠️ [${slug}] [${loc}] chatGreeting is very short: "${msg.chatGreeting}"`);
      }
    }

    // 3. Localized epics check
    const ep = g.epic;
    for (const loc of LOCALES) {
      const epicKey = `epic_${loc}`;
      const epicText = ep[epicKey];
      if (!epicText || typeof epicText !== "string" || epicText.trim().length === 0) {
        console.error(`❌ [${slug}] Missing narrative for epic key '${epicKey}'.`);
        errorCount++;
        continue;
      }

      // Deep verification for Korean & English formats
      if (loc === "ko") {
        if (epicText.length < 500) {
          console.error(`❌ [${slug}] [ko] Korean epic story is too short (${epicText.length} chars, expected >= 500).`);
          errorCount++;
        }
        const h3Matches = epicText.match(/###\s+\d+\./g) || epicText.match(/###\s+/g) || [];
        if (h3Matches.length < 4) {
          console.error(`❌ [${slug}] [ko] Korean epic should contain at least 4 H3 titles (found ${h3Matches.length}).`);
          errorCount++;
        }
      }

      if (loc === "en") {
        const words = epicText.trim().split(/\s+/).length;
        if (words < 300) {
          console.error(`❌ [${slug}] [en] English epic story is too short (${words} words, expected >= 300).`);
          errorCount++;
        }
        const h3Matches = epicText.match(/###\s+\d+\./g) || epicText.match(/###\s+/g) || [];
        if (h3Matches.length < 4) {
          console.error(`❌ [${slug}] [en] English epic should contain at least 4 H3 titles (found ${h3Matches.length}).`);
          errorCount++;
        }
      }
    }

    // 4. Trials & Overcoming checks
    const trialsFields = ["trials_ko", "trials_en", "overcoming_ko", "overcoming_en"];
    for (const field of trialsFields) {
      if (!ep[field] || typeof ep[field] !== "string" || ep[field].trim().length === 0) {
        console.error(`❌ [${slug}] Missing trial/overcoming field: '${field}'`);
        errorCount++;
      }
    }

    // 5. Wisdom check
    if (!Array.isArray(ep.wisdom) || ep.wisdom.length < 3) {
      console.error(`❌ [${slug}] Missing or insufficient wisdom array (expected at least 3, found ${Array.isArray(ep.wisdom) ? ep.wisdom.length : 0}).`);
      errorCount++;
    } else {
      ep.wisdom.forEach((w: any, index: number) => {
        if (!w.quote_ko || !w.quote_en || !w.meaning_ko || !w.meaning_en) {
          console.error(`❌ [${slug}] Wisdom quote at index ${index} is missing translation fields.`);
          errorCount++;
        }
      });
    }
  }

  console.log(`\n=== VALIDATION COMPLETED WITH ${errorCount} ERRORS ===`);
  if (errorCount > 0) {
    process.exit(1);
  } else {
    console.log("🚀 All validation checks passed successfully!");
    process.exit(0);
  }
}

main().catch(console.error);
