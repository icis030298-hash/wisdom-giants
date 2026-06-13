import fs from "fs";
import path from "path";

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

async function main() {
  const generatedPath = path.resolve(process.cwd(), "scripts/new-giants-59.json");
  const tsFile = path.resolve(process.cwd(), "src/data/giants.ts");
  const narrativesPath = path.resolve(process.cwd(), "src/data/final-narratives.json");

  if (!fs.existsSync(generatedPath)) {
    console.error("Generated data file scripts/new-giants-59.json not found!");
    process.exit(1);
  }

  const generatedData = JSON.parse(fs.readFileSync(generatedPath, "utf8"));
  const slugs = Object.keys(generatedData);

  if (slugs.length === 0) {
    console.error("No generated giants found in scripts/new-giants-59.json");
    process.exit(1);
  }

  console.log(`Merging ${slugs.length} generated giants...`);

  // 1. Merge into src/data/final-narratives.json
  let narratives: Record<string, any> = {};
  if (fs.existsSync(narrativesPath)) {
    narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));
  }
  for (const slug of slugs) {
    narratives[slug] = generatedData[slug].epic;
  }
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), "utf8");
  console.log("✓ Merged narratives successfully into src/data/final-narratives.json");

  // 2. Merge into messages/*.json
  for (const lang of LOCALES) {
    const langPath = path.resolve(process.cwd(), `messages/${lang}.json`);
    if (fs.existsSync(langPath)) {
      const messages = JSON.parse(fs.readFileSync(langPath, "utf8"));
      if (!messages.Giants) messages.Giants = {};
      
      for (const slug of slugs) {
        const giantData = generatedData[slug];
        const langData = { ...giantData.messages[lang] };
        
        // Construct localized persona
        if (!langData.persona) {
          const name = langData.name || giantData.messages.en.name;
          const personaTemplates: Record<string, string> = {
            ko: `당신은 ${name}입니다.`,
            en: `You are ${name}.`,
            ja: `あなたは${name}です。`,
            de: `Sie sind ${name}.`,
            es: `Usted es ${name}.`,
            fr: `Vous êtes ${name}.`,
            it: `Lei è ${name}.`,
            pt: `Você é ${name}.`,
            ar: `أنت ${name}.`,
            hi: `आप ${name} हैं।`,
            ru: `Вы — ${name}.`,
            zh: `您是${name}。`
          };
          langData.persona = personaTemplates[lang] || personaTemplates.en;
        }
        
        messages.Giants[slug] = langData;
      }
      fs.writeFileSync(langPath, JSON.stringify(messages, null, 2), "utf8");
      console.log(`✓ Merged translations successfully into messages/${lang}.json`);
    } else {
      console.warn(`Warning: Translation file messages/${lang}.json not found!`);
    }
  }

  // 3. Merge into src/data/giants.ts
  let tsContent = fs.readFileSync(tsFile, "utf8");

  // Find max ID to increment
  let maxId = 0;
  const idMatches = tsContent.match(/id:\s*["'](\d+)["']/g);
  if (idMatches) {
    idMatches.forEach((m) => {
      const match = m.match(/\d+/);
      if (match) {
        const id = parseInt(match[0]);
        if (id > maxId) maxId = id;
      }
    });
  }

  let newTsBlocks = "";
  for (const slug of slugs) {
    // Avoid duplicate insertions
    if (tsContent.includes(`slug: "${slug}"`) || tsContent.includes(`slug: '${slug}'`)) {
      console.log(`[Skip] ${slug} already exists in giants.ts.`);
      continue;
    }

    maxId++;
    const giantData = generatedData[slug];
    const en = giantData.messages.en;
    const ko = giantData.messages.ko;
    
    // Clean strings for template safety
    const nameEn = (en.name || "").replace(/"/g, '\\"');
    const nameKo = (ko.name || nameEn).replace(/"/g, '\\"');
    const category = giantData.category || giantData.epic.category || en.category || "science"; // default safety
    const headline = (ko.headline || en.headline || "").replace(/"/g, '\\"');
    const shortDescription = (ko.shortDescription || en.shortDescription || "").replace(/"/g, '\\"');
    const quote = (ko.quote || en.quote || "").replace(/"/g, '\\"');
    const pain = (ko.pain || en.pain || "").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const recovery = (ko.recovery || en.recovery || "").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const era = (ko.era || en.era || "").replace(/"/g, '\\"');

    // Extract lessons from wisdom array if available
    let lessonsStr = "[]";
    const wisdom = giantData.epic.wisdom;
    if (Array.isArray(wisdom) && wisdom.length > 0) {
      const lessonsArray = wisdom.map((w: any) => {
        const titleClean = (w.quote_ko || "").replace(/"/g, '\\"');
        const contentClean = (w.meaning_ko || "").replace(/"/g, '\\"');
        return `      {
        title: "${titleClean}",
        content: "${contentClean}"
      }`;
      });
      lessonsStr = `[\n${lessonsArray.join(",\n")}\n    ]`;
    }

    // Determine category specific DNA code
    const dnaCodes: Record<string, string> = {
      leadership: "LRDI",
      science: "SPDT",
      philosophy: "PPHI",
      arts: "APHI",
      society: "SPDT",
      business: "LRDI"
    };
    const dnaCode = dnaCodes[category] || "LPDI";

    newTsBlocks += `  {\n    id: "${maxId}",\n    name: "${nameKo}",\n    category: "${category}",\n    headline: "${headline}",\n    shortDescription: "${shortDescription}",\n    slug: "${slug}",\n    dnaCode: "${dnaCode}",\n    quote: "${quote}",\n    pain: "${pain}",\n    recovery: "${recovery}",\n    lessons: ${lessonsStr},\n    persona: "당신은 ${nameKo}입니다.",\n    imageUrl: "/images/giants/${slug}.jpg",\n    era: "${era}"\n  },\n`;
  }

  if (newTsBlocks) {
    const closingIndex = tsContent.lastIndexOf("];");
    if (closingIndex !== -1) {
      tsContent = tsContent.slice(0, closingIndex) + newTsBlocks + tsContent.slice(closingIndex);
      fs.writeFileSync(tsFile, tsContent, "utf8");
      console.log("✓ Added new giants successfully to src/data/giants.ts");
    } else {
      console.error("Could not find closing array syntax '];' in src/data/giants.ts!");
    }
  } else {
    console.log("No new giants to add to giants.ts (all already present).");
  }

  console.log("\n=== MERGE OPERATION COMPLETED ===");
}

main().catch(console.error);
