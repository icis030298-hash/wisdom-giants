import fs from "fs";
import path from "path";
import { giantsData } from "../src/data/giants";

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

async function main() {
  const generatedPath = path.resolve(process.cwd(), "scratch/new-giants-3.json");
  const tsFile = path.resolve(process.cwd(), "src/data/giants.ts");
  const narrativesPath = path.resolve(process.cwd(), "src/data/final-narratives.json");
  const avatarPath = path.resolve(process.cwd(), "src/components/GiantAvatar.tsx");

  if (!fs.existsSync(generatedPath)) {
    console.error("Generated 3 giants data file not found!");
    process.exit(1);
  }

  const generatedData = JSON.parse(fs.readFileSync(generatedPath, "utf8"));
  
  const cicero = generatedData["cicero"];
  const sophocles = generatedData["sophocles"];
  const euclid = generatedData["euclid"];

  if (!cicero || !sophocles || !euclid) {
    console.error("Missing cicero, sophocles, or euclid in generated data!");
    process.exit(1);
  }

  console.log("Starting E-E-A-T Cleanup and Integration...");

  // 1. Update src/data/final-narratives.json
  let narratives: Record<string, any> = {};
  if (fs.existsSync(narrativesPath)) {
    narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));
  }
  // Delete Viktor Frankl narrative
  delete narratives["viktor-frankl"];
  // Add Cicero, Sophocles, Euclid narratives
  narratives["cicero"] = cicero.epic;
  narratives["sophocles"] = sophocles.epic;
  narratives["euclid"] = euclid.epic;
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), "utf8");
  console.log("✓ Updated src/data/final-narratives.json");

  // 2. Update messages/*.json
  for (const lang of LOCALES) {
    const langPath = path.resolve(process.cwd(), `messages/${lang}.json`);
    if (fs.existsSync(langPath)) {
      const messages = JSON.parse(fs.readFileSync(langPath, "utf8"));
      if (!messages.Giants) messages.Giants = {};
      
      // Delete Viktor Frankl translation
      delete messages.Giants["viktor-frankl"];
      
      // Helper to assign localized personas
      const assignPersona = (slug: string, giantData: any) => {
        const langData = { ...giantData.messages[lang] };
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
      };

      assignPersona("cicero", cicero);
      assignPersona("sophocles", sophocles);
      assignPersona("euclid", euclid);

      fs.writeFileSync(langPath, JSON.stringify(messages, null, 2), "utf8");
      console.log(`✓ Updated messages/${lang}.json`);
    }
  }

  // 3. Update src/data/giants.ts
  // We will manipulate giantsData in memory and format a new file
  // Find max ID in existing list to assign new IDs
  let maxId = 0;
  giantsData.forEach(g => {
    const id = parseInt(g.id);
    if (id > maxId) maxId = id;
  });

  const updatedGiants = giantsData.map(g => {
    if (g.slug === "viktor-frankl") {
      // Replace with Cicero but keep ID "12"
      const en = cicero.messages.en;
      const ko = cicero.messages.ko;
      const titleKo = ko.name;
      const titleEn = en.name;

      const lessons = cicero.epic.wisdom.map((w: any) => ({
        title: w.quote_ko || w.quote_en || "",
        content: w.meaning_ko || w.meaning_en || ""
      }));

      return {
        id: "12",
        name: titleKo,
        category: "philosophy",
        headline: ko.headline || en.headline || "",
        shortDescription: ko.shortDescription || en.shortDescription || "",
        slug: "cicero",
        dnaCode: "PPHI",
        quote: ko.quote || en.quote || "",
        pain: (ko.pain || en.pain || "").replace(/\n/g, "\\n"),
        recovery: (ko.recovery || en.recovery || "").replace(/\n/g, "\\n"),
        lessons,
        persona: `당신은 ${titleKo}입니다.`,
        imageUrl: `/images/giants/cicero.jpg`,
        era: ko.era || en.era || ""
      };
    }
    return g;
  });

  // Check if sophocles and euclid already exist in giants.ts (to avoid duplicates)
  if (!updatedGiants.some(g => g.slug === "sophocles")) {
    const en = sophocles.messages.en;
    const ko = sophocles.messages.ko;
    const titleKo = ko.name;
    const lessons = sophocles.epic.wisdom.map((w: any) => ({
      title: w.quote_ko || w.quote_en || "",
      content: w.meaning_ko || w.meaning_en || ""
    }));
    maxId++;
    updatedGiants.push({
      id: maxId.toString(),
      name: titleKo,
      category: "arts",
      headline: ko.headline || en.headline || "",
      shortDescription: ko.shortDescription || en.shortDescription || "",
      slug: "sophocles",
      dnaCode: "APHI",
      quote: ko.quote || en.quote || "",
      pain: (ko.pain || en.pain || "").replace(/\n/g, "\\n"),
      recovery: (ko.recovery || en.recovery || "").replace(/\n/g, "\\n"),
      lessons,
      persona: `당신은 ${titleKo}입니다.`,
      imageUrl: `/images/giants/sophocles.jpg`,
      era: ko.era || en.era || ""
    });
  }

  if (!updatedGiants.some(g => g.slug === "euclid")) {
    const en = euclid.messages.en;
    const ko = euclid.messages.ko;
    const titleKo = ko.name;
    const lessons = euclid.epic.wisdom.map((w: any) => ({
      title: w.quote_ko || w.quote_en || "",
      content: w.meaning_ko || w.meaning_en || ""
    }));
    maxId++;
    updatedGiants.push({
      id: maxId.toString(),
      name: titleKo,
      category: "science",
      headline: ko.headline || en.headline || "",
      shortDescription: ko.shortDescription || en.shortDescription || "",
      slug: "euclid",
      dnaCode: "SPDT",
      quote: ko.quote || en.quote || "",
      pain: (ko.pain || en.pain || "").replace(/\n/g, "\\n"),
      recovery: (ko.recovery || en.recovery || "").replace(/\n/g, "\\n"),
      lessons,
      persona: `당신은 ${titleKo}입니다.`,
      imageUrl: `/images/giants/euclid.jpg`,
      era: ko.era || en.era || ""
    });
  }

  // Format into src/data/giants.ts file
  let newTsContent = `export interface Lesson {
  title: string;
  content: string;
}

export interface Giant {
  id: string;
  name: string;
  category: 'leadership' | 'science' | 'philosophy' | 'arts' | 'society' | 'business';
  headline: string;
  shortDescription: string;
  slug: string;
  quote: string;
  pain: string;
  recovery: string;
  lessons: Lesson[];
  persona: string;
  imageUrl: string;
  dnaCode: string;
  era?: string;
}

export const giantsData: Giant[] = [\n`;

  updatedGiants.forEach(g => {
    const lessonsStr = JSON.stringify(g.lessons, null, 2)
      .split("\n")
      .map(line => "    " + line)
      .join("\n")
      .trim();

    newTsContent += `  {\n    id: "${g.id}",\n    name: "${g.name}",\n    category: "${g.category}",\n    headline: "${g.headline.replace(/"/g, '\\"')}",\n    shortDescription: "${g.shortDescription.replace(/"/g, '\\"')}",\n    slug: "${g.slug}",\n    dnaCode: "${g.dnaCode}",\n    quote: "${g.quote.replace(/"/g, '\\"')}",\n    pain: "${g.pain.replace(/"/g, '\\"')}",\n    recovery: "${g.recovery.replace(/"/g, '\\"')}",\n    lessons: ${lessonsStr},\n    persona: "${g.persona.replace(/"/g, '\\"')}",\n    imageUrl: "${g.imageUrl}",\n    era: "${g.era.replace(/"/g, '\\"')}"\n  },\n`;
  });

  newTsContent = newTsContent.slice(0, -2) + "\n];\n";
  fs.writeFileSync(tsFile, newTsContent, "utf8");
  console.log("✓ Successfully formatted and updated src/data/giants.ts");

  // 4. Update GiantAvatar.tsx
  if (fs.existsSync(avatarPath)) {
    let avatarContent = fs.readFileSync(avatarPath, "utf8");
    // Replace 'viktor-frankl' case with 'cicero' and remove glasses
    avatarContent = avatarContent.replace(
      `    // 12. Viktor Frankl
    if (slug === 'viktor-frankl') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#475569" />
          <rect x="65" y="60" width="70" height="90" rx="30" fill="#fef3c7" />
          <circle cx="85" cy="100" r="2.5" fill="#334155" />
          <circle cx="115" cy="100" r="2.5" fill="#334155" />
          <rect x="75" y="90" width="20" height="15" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
          <rect x="105" y="90" width="20" height="15" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="4" />
        </svg>
      );
    }`,
      `    // 12. Cicero
    if (slug === 'cicero') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#475569" />
          <rect x="65" y="60" width="70" height="90" rx="30" fill="#fef3c7" />
          <circle cx="85" cy="100" r="2.5" fill="#334155" />
          <circle cx="115" cy="100" r="2.5" fill="#334155" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="4" />
        </svg>
      );
    }`
    );
    fs.writeFileSync(avatarPath, avatarContent, "utf8");
    console.log("✓ Updated GiantAvatar.tsx");
  }

  console.log("\n=== ALL E-E-A-T MERGE OPERATIONS COMPLETED ===");
}

main().catch(console.error);
