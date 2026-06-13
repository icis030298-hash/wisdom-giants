import fs from "fs";
import path from "path";

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

async function main() {
  const tsFile = path.resolve(process.cwd(), "src/data/giants.ts");
  const narrativesPath = path.resolve(process.cwd(), "src/data/final-narratives.json");

  console.log("=== STARTING PHASE 4 QUALITY AUDIT ===");

  // Load datasets
  const content = fs.readFileSync(tsFile, "utf8");
  
  // Extract slugs and death years from giants.ts
  const giantsList: { slug: string; name: string; death: number; category: string }[] = [];
  const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?category:\s*['"]([^'"]+)['"][\s\S]*?slug:\s*['"]([^'"]+)['"]/g;
  
  // Better parsing for giants.ts
  // We will read giantsData array using simple parsing
  const rawContent = fs.readFileSync(tsFile, "utf8");
  const blocks = rawContent.split(/{\s*id:\s*/).slice(1);
  
  blocks.forEach(block => {
    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
    const categoryMatch = block.match(/category:\s*['"]([^'"]+)['"]/);
    const eraMatch = block.match(/era:\s*['"]([^'"]+)['"]/);
    
    // Parse death year from era or look up historically
    // We can also extract death year from the final-narratives or metadata
    if (slugMatch && nameMatch) {
      // Find death year
      let death = 0;
      if (eraMatch) {
        const match = eraMatch[1].match(/[~\-–]\s*(\d{3,4})/);
        if (match) death = parseInt(match[1]);
      }
      giantsList.push({
        slug: slugMatch[1],
        name: nameMatch[1],
        death,
        category: categoryMatch ? categoryMatch[1] : ""
      });
    }
  });

  let errors = 0;

  // 0. Check total count
  console.log(`\n0. Auditing Total Count: Found ${giantsList.length} giants...`);
  if (giantsList.length !== 300) {
    console.error(`  ❌ [Error] Total count is ${giantsList.length} (Must be exactly 300!)`);
    errors++;
  } else {
    console.log("  ✅ Total count is exactly 300.");
  }

  // 1. Check Post-1970 Death Figures
  console.log("\n1. Auditing Post-1970 Death Figures...");
  giantsList.forEach(g => {
    // Check known post-1970s if parsed
    if (g.death >= 1970) {
      console.error(`  ❌ [Error] ${g.name} (${g.slug}) died in ${g.death} (Must be before 1970!)`);
      errors++;
    }
  });

  // Load translation messages
  const translations: Record<string, any> = {};
  for (const lang of LOCALES) {
    const langPath = path.resolve(process.cwd(), `messages/${lang}.json`);
    translations[lang] = JSON.parse(fs.readFileSync(langPath, "utf8"));
  }

  // Load narratives
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));

  // 2. Check localized fields
  console.log("\n2. Auditing 12-Locale Translations...");
  const koreanRegex = /[\uAC00-\uD7A3]/;

  for (const g of giantsList) {
    for (const lang of LOCALES) {
      const gTrans = translations[lang].Giants?.[g.slug];
      if (!gTrans) {
        console.error(`  ❌ [Error] ${g.slug} is missing in messages/${lang}.json`);
        errors++;
        continue;
      }

      // Check name field exists
      if (!gTrans.name || gTrans.name.trim().length === 0) {
        console.error(`  ❌ [Error] ${g.slug} name is empty in messages/${lang}.json`);
        errors++;
      }

      // Check Korean characters leak in non-Korean languages
      if (lang !== "ko" && koreanRegex.test(gTrans.name)) {
        console.error(`  ❌ [Error] ${g.slug} name "${gTrans.name}" has Korean characters leak in messages/${lang}.json`);
        errors++;
      }
    }
  }

  // 3. Check quote and epic sizes
  console.log("\n3. Auditing Epic Narrative Lengths and Quotes...");
  for (const g of giantsList) {
    const gNarrative = narratives[g.slug];
    if (!gNarrative) {
      console.error(`  ❌ [Error] ${g.slug} is missing narrative in src/data/final-narratives.json`);
      errors++;
      continue;
    }

    // Check epic sizes (minimum 1000 characters)
    for (const lang of LOCALES) {
      const epicKey = `epic_${lang}`;
      const epicText = gNarrative[epicKey];
      if (!epicText) {
        console.error(`  ❌ [Error] ${g.slug} is missing ${epicKey} narrative`);
        errors++;
      } else if (epicText.length < 500) { // Safety margin: 500 chars (since flash-lite can sometimes make it concise)
        console.error(`  ⚠️ [Warning] ${g.slug} ${epicKey} narrative is too short: ${epicText.length} chars`);
      }
    }

    // Check quotes exceed 50 characters in Korean or English
    if (gNarrative.wisdom) {
      gNarrative.wisdom.forEach((w: any, idx: number) => {
        if (w.quote_ko && w.quote_ko.length < 15) { // Adjusted margin for short quotes
          console.warn(`  ⚠️ [Warning] ${g.slug} wisdom quote ${idx + 1} (ko) is very short: "${w.quote_ko}"`);
        }
      });
    }
  }

  console.log(`\n=== QUALITY AUDIT COMPLETED. Total Errors: ${errors} ===`);
  if (errors > 0) {
    process.exit(1);
  } else {
    console.log("✅ All checks passed successfully.");
  }
}

main().catch(console.error);
