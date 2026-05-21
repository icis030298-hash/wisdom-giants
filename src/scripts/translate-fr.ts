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
  model: "gemini-2.0-flash",
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

async function translateGiant(slug: string, giantEn: any) {
  const prompt = `
Translate the following historical giant details from English into elegant, polite, and culturally appropriate French.
Use formal and polite French ("vouvoiement" - "vous", "votre", "vos") throughout the translations, especially for the chatGreeting and suggestedQuestions.

Input JSON in English:
${JSON.stringify(giantEn, null, 2)}

Specific guidelines:
1. If the slug is "${slug}", ensure the name is translated or mapped as follows if applicable:
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

2. If the slug is "${slug}", ensure the quote is translated exactly as follows if applicable:
   - "napoleon-bonaparte" -> "Impossible n'est pas français."
   - "julius-caesar" -> "Le sort en est jeté."
   - "steve-jobs" -> "Soyez affamés, soyez fous."
   - "frida-kahlo" -> "Des pieds, pourquoi en voudrais-je si j'ai des ailes pour voler ?"
   - "joan-of-arc" -> "Je n'aurais su être en si bonne compagnie."
   - "voltaire" -> "Le mieux est l'ennemi du bien."
   - "victor-hugo" -> "Ceux qui vivent sont ceux qui luttent."

Output JSON schema:
{
  "name": "string",
  "headline": "string",
  "shortDescription": "string",
  "quote": "string",
  "era": "string",
  "chatGreeting": "string",
  "suggestedQuestions": ["string", "string", "string"]
}
`;

  let attempts = 0;
  while (attempts < 5) {
    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const parsed = JSON.parse(text);

      // Apply overrides explicitly as a safeguard in case Gemini missed them
      if (nameOverrides[slug]) {
        parsed.name = nameOverrides[slug];
      }
      if (quoteOverrides[slug]) {
        parsed.quote = quoteOverrides[slug];
      }

      return parsed;
    } catch (error: any) {
      const errorMsg = error.message || "";
      if (error.status === 429 || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
        console.warn(`Rate limit hit (429) while translating "${slug}". Sleeping for 65 seconds...`);
        await sleep(65000);
        attempts++;
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to translate "${slug}" after 5 attempts due to rate limit.`);
}

async function run() {
  const slugs = Object.keys(enData.Giants);
  console.log(`Found ${slugs.length} giants in English file.`);

  let count = 0;
  for (const slug of slugs) {
    if (frData.Giants[slug] && frData.Giants[slug].name) {
      console.log(`[${slug}] Already translated, skipping...`);
      continue;
    }

    console.log(`[${slug}] Translating...`);
    try {
      const translated = await translateGiant(slug, enData.Giants[slug]);
      frData.Giants[slug] = translated;
      
      // Save after each translation for safety
      fs.writeFileSync(frPath, JSON.stringify(frData, null, 2), "utf-8");
      console.log(`[${slug}] Translated and saved.`);
      count++;

      // Small delay between requests to avoid rate limits
      await sleep(1000);
    } catch (e) {
      console.error(`Error translating ${slug}:`, e);
      process.exit(1);
    }
  }

  console.log(`Translation complete! ${count} new giants translated.`);
}

run();
