import { getVertexAIInstance } from "../src/lib/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const NEW_LOCALES = [
  { code: "ar", name: "Arabic", nameKo: "아랍어" },
  { code: "hi", name: "Hindi", nameKo: "힌디어" },
  { code: "ru", name: "Russian", nameKo: "러시아어" },
  { code: "zh", name: "Simplified Chinese", nameKo: "중국어 간체" }
];

const modelId = "gemini-2.5-flash-lite";

async function callGenerativeAPI(prompt: string, temperature: number = 0.3): Promise<string> {
  // 1. Try Vertex AI first (uses GCP Free Credit)
  try {
    const vAI = getVertexAIInstance();
    const model = vAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: temperature,
      }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = "";
    if (typeof response.text === "function") {
      text = response.text();
    } else {
      text = (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    if (text && text.trim().length > 0) {
      return text;
    }
  } catch (vertexErr: any) {
    console.warn(`[Vertex AI Warning] Failed to generate with Vertex AI: ${vertexErr.message}. Falling back to Google AI Studio...`);
  }

  // 2. Fallback to Google Generative AI (AI Studio)
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment for fallback");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: temperature,
    }
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanJSON(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// Generate UI translation excluding Giants
async function translateUI(localeCode: string, localeName: string, uiData: any): Promise<any> {
  const prompt = `
Translate the following English UI interface texts into ${localeName} (${localeCode}).
This is for an educational website where users chat with AI versions of historical figures.
Keep "Giants Wisdom" untranslated as it is the brand name. Use natural, formal/polite tone appropriate for a public web application.

UI Texts JSON:
${JSON.stringify(uiData, null, 2)}

Return ONLY the translated JSON matching the same structure. No markdown formatting.
`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const rawText = await callGenerativeAPI(prompt, 0.3);
      const cleaned = cleanJSON(rawText);
      return JSON.parse(cleaned);
    } catch (e: any) {
      console.error(`[UI Translation Warning] Attempt ${attempts} failed:`, e.message);
      await sleep(2000);
    }
  }
  throw new Error(`Failed to translate UI to ${localeCode}`);
}

// Translate Giants in batches of 10
async function translateGiantsInBatches(localeCode: string, localeName: string, giants: Record<string, any>, progressData: any): Promise<Record<string, any>> {
  const slugs = Object.keys(giants);
  const results = progressData.Giants || {};
  const batchSize = 10;

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize);
    const pendingBatch = batch.filter(slug => !results[slug]);

    if (pendingBatch.length === 0) {
      continue;
    }

    const batchData: Record<string, any> = {};
    pendingBatch.forEach(slug => {
      // Extract only core fields to save input tokens
      const g = giants[slug];
      batchData[slug] = {
        name: g.name,
        title: g.title || g.headline || "",
        headline: g.headline || "",
        shortDescription: g.shortDescription || "",
        quote: g.quote || "",
        chatGreeting: g.chatGreeting || "",
        suggestedQuestions: g.suggestedQuestions || [],
        era: g.era || "",
        pain: g.pain || "",
        recovery: g.recovery || ""
      };
    });

    console.log(`  Translating batch ${i + 1} to ${Math.min(i + batchSize, slugs.length)} of ${slugs.length} into ${localeName}...`);

    const prompt = `
Translate the following English profiles of historical figures into ${localeName} (${localeCode}).
Input is a JSON object where keys are giant slugs.
Translate each field accurately and professionally:
- "name": Use the localized name (e.g. standard spelling in ${localeName}).
- "title": Localized historical title.
- "headline": Powerful headline (within 15 words).
- "shortDescription": 2-3 sentences.
- "quote": Famous historical quote.
- "chatGreeting": Greeting in character as if speaking to the user.
- "suggestedQuestions": 3 suggested questions in ${localeName}.
- "era": Localized era string.
- "pain": Struggles in life.
- "recovery": Overcoming.

Input JSON:
${JSON.stringify(batchData, null, 2)}

Return ONLY the translated JSON object matching the input keys. No markdown wrappers.
`;

    let attempts = 0;
    let success = false;
    while (attempts < 3 && !success) {
      attempts++;
      try {
        const rawText = await callGenerativeAPI(prompt, 0.3);
        const cleaned = cleanJSON(rawText);
        const parsed = JSON.parse(cleaned);

        // Merge into results
        Object.assign(results, parsed);
        progressData.Giants = results;
        success = true;
      } catch (e: any) {
        console.error(`    [Batch Warning] Attempt ${attempts} failed:`, e.message);
        await sleep(3000);
      }
    }

    if (!success) {
      throw new Error(`Failed to translate giants batch starting at index ${i}`);
    }

    // Sleep to avoid rate limits
    await sleep(2000);
  }

  return results;
}

async function main() {
  // 1. Read English master file
  const enPath = path.resolve(process.cwd(), "messages/en.json");
  if (!fs.existsSync(enPath)) {
    console.error("Master translation messages/en.json not found!");
    process.exit(1);
  }
  const enContent = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const enGiants = enContent.Giants || {};
  
  // Create UI-only config
  const enUI = { ...enContent };
  delete enUI.Giants;

  const progressPath = path.resolve(process.cwd(), "scripts/lang-packs-progress.json");
  let progress: Record<string, any> = {};
  if (fs.existsSync(progressPath)) {
    progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));
  }

  for (const locale of NEW_LOCALES) {
    console.log(`\n=== Generating language pack for: ${locale.nameKo} (${locale.code}) ===`);
    
    if (!progress[locale.code]) {
      progress[locale.code] = { UI: null, Giants: {} };
    }

    // Translate UI
    if (!progress[locale.code].UI) {
      console.log("Translating UI elements...");
      progress[locale.code].UI = await translateUI(locale.code, locale.name, enUI);
      fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2), "utf8");
    } else {
      console.log("UI elements already translated.");
    }

    // Translate Giants
    console.log("Translating Giants...");
    const translatedGiants = await translateGiantsInBatches(locale.code, locale.name, enGiants, progress[locale.code]);
    
    // Save progress after completing giants translation
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2), "utf8");

    // Merge UI and Giants into final translation file
    const finalLocaleData = {
      ...progress[locale.code].UI,
      Giants: translatedGiants
    };

    const outputPath = path.resolve(process.cwd(), `messages/${locale.code}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(finalLocaleData, null, 2), "utf8");
    console.log(`✅ Saved complete translation to messages/${locale.code}.json`);
  }

  console.log("\n=== LANGUAGE PACKS GENERATION COMPLETED ===");
}

main().catch(console.error);
