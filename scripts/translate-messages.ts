import fs from 'fs';
import path from 'path';
import { VertexAI } from "@google-cloud/vertexai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'giantswisdom-8dc26';
const location = 'us-central1';
const vertex_ai = new VertexAI({ project, location });
const model = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.1
  }
});

const messagesDir = path.resolve('messages');
const wikiLinksPath = path.resolve('src/data/wikipedia-links.json');

const wikiLinks = JSON.parse(fs.readFileSync(wikiLinksPath, 'utf8'));
const enMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));
const enGiants = enMessages.Giants;

// Locales that are untranslated in messages (marked as English in our audit)
const targetLocales = ['nl', 'el', 'ha', 'he', 'id', 'fa', 'pl', 'sw', 'th', 'tr', 'uk', 'vi'];

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function cleanResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/g, '').replace(/```$/g, '').trim();
  return cleaned;
}

// Function to decode Wikipedia URL segment to get official name
function getOfficialName(slug: string, locale: string): string | null {
  const giantLinks = wikiLinks[slug];
  if (!giantLinks) return null;
  const link = giantLinks[locale];
  if (!link) return null;
  
  // Verify it is not a fallback link to en.wikipedia
  if (link.includes(`//${locale}.wikipedia.org/`)) {
    try {
      const lastSegment = link.substring(link.lastIndexOf('/') + 1);
      const decoded = decodeURIComponent(lastSegment).replace(/_/g, ' ');
      if (decoded && decoded.trim().length > 0) {
        return decoded.trim();
      }
    } catch (e) {
      console.error(`Failed to decode URL for ${slug} [${locale}]:`, e);
    }
  }
  return null;
}

async function translateProfile(slug: string, locale: string, enProfile: any, officialName: string | null): Promise<any> {
  const systemInstruction = `You are an expert biographer and translator.
Translate the provided historical giant's profile fields into the language with locale code '${locale}'.

[Rules]
1. If officialName is provided, use it EXACTLY as the "name" field. Otherwise, translate/transliterate the English name accurately into the target language.
2. Translate "headline", "shortDescription", "chatGreeting", and "suggestedQuestions" (array of 3 strings) naturally and accurately.
3. English Leak Prevention: Do not leave English words or mix them. Translate 100% of the sentences to the target language.
4. No Markdown: Do not use any markdown tags (like '**', '#').
5. Respond ONLY with a valid JSON object matching the schema below.`;

  const schema = {
    name: "...",
    headline: "...",
    shortDescription: "...",
    quote: "...",
    chatGreeting: "...",
    suggestedQuestions: [
      "...",
      "...",
      "..."
    ]
  };

  const source = {
    name: enProfile.name,
    headline: enProfile.headline,
    shortDescription: enProfile.shortDescription,
    quote: enProfile.quote,
    chatGreeting: enProfile.chatGreeting,
    suggestedQuestions: enProfile.suggestedQuestions
  };

  const prompt = `Translate this giant profile into locale '${locale}'.
${officialName ? `Official Name to use: "${officialName}"` : "No official Wikipedia name available; translate/transliterate the English name."}

Source:
${JSON.stringify(source, null, 2)}

Respond with this JSON structure:
${JSON.stringify(schema, null, 2)}`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const res = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      });
      const text = cleanResponse(res.response.candidates[0].content.parts[0].text);
      const parsed = JSON.parse(text);
      
      // Validate
      if (parsed.name && parsed.headline && parsed.shortDescription && parsed.chatGreeting && Array.isArray(parsed.suggestedQuestions) && parsed.suggestedQuestions.length === 3) {
        if (officialName) {
          parsed.name = officialName; // Force exact official name
        }
        return parsed;
      }
    } catch (e: any) {
      if (e.message && e.message.includes('429')) {
        console.log(`[${locale}] [${slug}] Rate limit, sleeping 10s...`);
        await sleep(10000);
      } else {
        console.error(`[${locale}] [${slug}] Attempt ${attempts} error:`, e.message);
      }
    }
  }
  return null;
}

async function main() {
  console.log("=== Starting messages/[locale].json Profile Translations (Flash-Lite) ===");
  const slugs = Object.keys(enGiants);

  for (const locale of targetLocales) {
    const localeFile = path.join(messagesDir, `${locale}.json`);
    if (!fs.existsSync(localeFile)) {
      console.warn(`Locale file not found: ${localeFile}`);
      continue;
    }
    
    console.log(`\n>>> Processing messages for locale: [${locale}]`);
    const localeData = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
    if (!localeData.Giants) {
      localeData.Giants = {};
    }

    let updates = 0;
    const chunkSize = 20; // Chunk size for concurrent API calls

    for (let i = 0; i < slugs.length; i += chunkSize) {
      const chunk = slugs.slice(i, i + chunkSize);
      const promises = [];

      for (const slug of chunk) {
        const enProfile = enGiants[slug];
        if (!enProfile) continue;

        // Check if it already exists and is translated (meaning it does not match the English name or headline)
        const currentProfile = localeData.Giants[slug];
        const isAlreadyTranslated = currentProfile && 
          currentProfile.name !== enProfile.name && 
          currentProfile.headline !== enProfile.headline;

        // If not translated, add to translation queue
        if (!isAlreadyTranslated) {
          promises.push((async () => {
            const officialName = getOfficialName(slug, locale);
            console.log(`  [${locale}] Translating profile for ${slug} ${officialName ? `(Wiki Name: ${officialName})` : ''}`);
            
            const translated = await translateProfile(slug, locale, enProfile, officialName);
            if (translated) {
              // Retain original era fallback if it exists, or translate it
              translated.era = currentProfile?.era || enProfile.era || '';
              localeData.Giants[slug] = translated;
              updates++;
            } else {
              console.error(`  [${locale}] Failed to translate ${slug}`);
            }
          })());
        }
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        // Save checkpoint
        const jsonString = JSON.stringify(localeData, null, 2).replace(/\r\n/g, '\n') + '\n';
        fs.writeFileSync(localeFile, jsonString, 'utf8');
        console.log(`  -- Saved messages checkpoint for [${locale}] (Chunk ${Math.floor(i / chunkSize + 1)})`);
        await sleep(1000);
      }
    }
    console.log(`<<< Finished locale: [${locale}], updated ${updates} profiles.`);
  }
  console.log("\n=== Messages profile translations completed! ===");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
