import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("No Gemini API key found in env variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: { responseMimeType: "application/json" },
});

const enPath = path.resolve(process.cwd(), "messages/en.json");
const frPath = path.resolve(process.cwd(), "messages/fr.json");

const enData = JSON.parse(fs.readFileSync(enPath, "utf-8"));
const frData = JSON.parse(fs.readFileSync(frPath, "utf-8"));

if (!frData.Giants) {
  frData.Giants = {};
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const nameOverrides: Record<string, string> = {
  "alexander-the-great": "Alexandre le Grand",
  "julius-caesar": "Jules César",
  "king-sejong": "Le Roi Sejong le Grand",
  "genghis-khan": "Gengis Khan",
  "aristotle": "Aristote",
  "plato": "Platon",
  "socrates": "Socrate",
  "napoleon-bonaparte": "Napoléon Bonaparte",
  "leonardo-da-vinci": "Léonard de Vinci",
  "buddha": "Bouddha",
  "lao-tzu": "Lao Tseu",
  "cleopatra": "Cléopâtre"
};

const quoteOverrides: Record<string, string> = {
  "napoleon-bonaparte": "Impossible n'est pas français.",
  "julius-caesar": "Le sort en est jeté.",
  "steve-jobs": "Soyez affamés, soyez fous.",
  "frida-kahlo": "Des pieds, pourquoi en voudrais-je si j'ai des ailes pour voler ?",
  "joan-of-arc": "Je n'aurais su être en si bonne compagnie.",
  "voltaire": "Le mieux est l'ennemi du bien.",
  "victor-hugo": "Ceux qui vivent sont ceux qui luttent."
};

async function translateBatch(batch: Record<string, any>) {
  const prompt = `
You are a French localization expert and historical translator.
Translate the following batch of historical giants' details from English into elegant, polite, and culturally appropriate French.
Use formal and polite French ("vouvoiement" - "vous", "votre", "vos") throughout the translations, especially for the chatGreeting and suggestedQuestions.

Input Batch in English:
${JSON.stringify(batch, null, 2)}

Specific guidelines:
1. Ensure these exact historical name translations are used:
   - "alexander-the-great" -> "Alexandre le Grand"
   - "julius-caesar" -> "Jules César"
   - "king-sejong" -> "Le Roi Sejong le Grand"
   - "genghis-khan" -> "Gengis Khan"
   - "aristotle" -> "Aristote"
   - "plato" -> "Platon"
   - "socrates" -> "Socrate"
   - "napoleon-bonaparte" -> "Napoléon Bonaparte"
   - "leonardo-da-vinci" -> "Léonard de Vinci"
   - "buddha" -> "Bouddha"
   - "lao-tzu" -> "Lao Tseu"
   - "cleopatra" -> "Cléopâtre"

2. Ensure these exact historical quotes are used:
   - "napoleon-bonaparte" -> "Impossible n'est pas français."
   - "julius-caesar" -> "Le sort en est jeté."
   - "steve-jobs" -> "Soyez affamés, soyez fous."
   - "frida-kahlo" -> "Des pieds, pourquoi en voudrais-je si j'ai des ailes pour voler ?"
   - "joan-of-arc" -> "Je n'aurais su être en si bonne compagnie."
   - "voltaire" -> "Le mieux est l'ennemi du bien."
   - "victor-hugo" -> "Ceux qui vivent sont ceux qui luttent."

Output JSON schema matching the batch keys exactly:
{
  "slug-1": {
    "name": "string",
    "headline": "string",
    "shortDescription": "string",
    "quote": "string",
    "era": "string",
    "chatGreeting": "string",
    "suggestedQuestions": ["string", "string", "string"]
  },
  ...
}
`;

  let attempts = 0;
  while (attempts < 5) {
    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const parsed = JSON.parse(text);

      // Apply overrides explicitly as a safeguard in case Gemini missed them
      for (const slug of Object.keys(parsed)) {
        if (nameOverrides[slug]) {
          parsed[slug].name = nameOverrides[slug];
        }
        if (quoteOverrides[slug]) {
          parsed[slug].quote = quoteOverrides[slug];
        }
      }

      return parsed;
    } catch (error: any) {
      const errorMsg = error.message || "";
      if (error.status === 429 || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
        console.warn(`Rate limit hit (429) during batch translation. Sleeping for 65 seconds...`);
        await sleep(65000);
        attempts++;
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to translate batch after 5 attempts due to rate limit.`);
}

async function run() {
  const slugs = Object.keys(enData.Giants);
  const remainingSlugs = slugs.filter(slug => !frData.Giants[slug] || !frData.Giants[slug].name);
  
  console.log(`Found ${slugs.length} total giants in English file.`);
  console.log(`${remainingSlugs.length} giants remaining to translate.`);

  if (remainingSlugs.length === 0) {
    console.log("All giants are already translated!");
    return;
  }

  const BATCH_SIZE = 5;
  const batches: string[][] = [];
  for (let i = 0; i < remainingSlugs.length; i += BATCH_SIZE) {
    batches.push(remainingSlugs.slice(i, i + BATCH_SIZE));
  }

  console.log(`Split into ${batches.length} batches of size ${BATCH_SIZE}.`);

  for (let idx = 0; idx < batches.length; idx++) {
    const batchSlugs = batches[idx];
    console.log(`[Batch ${idx + 1}/${batches.length}] Translating: ${batchSlugs.join(", ")}...`);

    const batchData: Record<string, any> = {};
    for (const slug of batchSlugs) {
      batchData[slug] = enData.Giants[slug];
    }

    try {
      const translatedBatch = await translateBatch(batchData);
      
      // Inject translated giants
      for (const slug of batchSlugs) {
        if (translatedBatch[slug]) {
          frData.Giants[slug] = translatedBatch[slug];
        } else {
          console.warn(`Warning: giant "${slug}" was not returned in batch output. Retry planned.`);
        }
      }

      // Save progress to file
      fs.writeFileSync(frPath, JSON.stringify(frData, null, 2), "utf-8");
      console.log(`[Batch ${idx + 1}/${batches.length}] Saved.`);

      // Small delay between requests to be safe
      await sleep(2000);
    } catch (e) {
      console.error(`Error translating batch ${idx + 1}:`, e);
      process.exit(1);
    }
  }

  console.log(`Translation complete! All giants translated and saved.`);
}

run();
