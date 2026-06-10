import { getVertexAIInstance } from "../src/lib/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const modelId = "gemini-2.5-flash-lite";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

const reportPath = path.resolve(process.cwd(), "scripts/audit-report.json");
const enDataPath = path.resolve(process.cwd(), "messages/en.json");

if (!fs.existsSync(reportPath)) {
  console.error("Audit report not found! Run full-audit.mjs first.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const enData = JSON.parse(fs.readFileSync(enDataPath, "utf8"));

const LANG_NAMES: Record<string, string> = {
  ko: "Korean", de: "German", ja: "Japanese", es: "Spanish",
  fr: "French", it: "Italian", pt: "Portuguese", ar: "Arabic",
  hi: "Hindi", ru: "Russian", zh: "Simplified Chinese"
};

const LANGUAGE_PATTERNS: Record<string, RegExp> = {
  ko: /[가-힣]/,
  ja: /[\u3040-\u30FF\u4E00-\u9FAF]/,
  ar: /[\u0600-\u06FF]/,
  hi: /[\u0900-\u097F]/,
  ru: /[\u0400-\u04FF]/,
  zh: /[\u4E00-\u9FFF]/,
  de: /[äöüÄÖÜß]/,
  es: /[áéíóúñ¿¡]/,
  fr: /[àâæçéèêëîïôœùûüÿ]/,
  it: /[àèéìíîòóùú]/,
  pt: /[ãâáàéêíóôõúç]/,
  en: /^[a-zA-Z\s.,!?'"()-]+$/
};
const ENGLISH_WORD = /\b[a-zA-Z]{5,}\b/g;
const ALLOWED_ENGLISH = [
  'Giants','Wisdom','AI','DNA','MBTI',
  'Google','Firebase','Gemini'
];

function isGiantAlreadyRepaired(slug: string, lang: string, locData: any): boolean {
  const giant = locData.Giants?.[slug];
  if (!giant) return false;
  const text = JSON.stringify(giant);
  if (text.length < 50) return false;
  
  if (lang === 'en') return true;

  const pattern = LANGUAGE_PATTERNS[lang];
  const hasNativeChars = pattern ? pattern.test(text) : true;
  if (!hasNativeChars) return false;

  const engWords = (text.match(ENGLISH_WORD) || []).filter((w: string) => !ALLOWED_ENGLISH.includes(w));
  const engRatio = engWords.length / (text.split(' ').length || 1);
  if (engRatio > 0.15) return false;

  return true; // Repaired!
}

async function translateSection(content: any, langName: string, langCode: string): Promise<any> {
  const isRTL = langCode === 'ar';
  const prompt = `
Translate the following English UI interface texts into ${langName} (${langCode}).
This is for an educational website where users chat with AI versions of historical figures.

Rules:
- "Giants Wisdom" is the brand name and must remain untranslated.
- Use natural, professional, and formal/polite tone appropriate for a public web application.
${isRTL ? "- Consider Right-to-Left (RTL) reading flow and alignment." : ""}
- Maintain the exact same JSON structure.

English JSON Content:
${JSON.stringify(content, null, 2)}

Return ONLY the translated JSON object. No markdown wrappers.
`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const result = await callGenerativeAPI(prompt, 0.3);
      const cleaned = cleanJSON(result);
      return JSON.parse(cleaned);
    } catch (e: any) {
      console.error(`    [Translate Warning] Attempt ${attempts} failed for locale ${langCode}:`, e.message);
      await sleep(3000);
    }
  }
  throw new Error(`Failed to translate UI section into ${langCode}`);
}

interface TranslationTask {
  type: 'ui' | 'giants';
  key: string; // section name or batch name
  chunkData: Record<string, any>;
}

async function main() {
  const localeIssues = report.summary.localeIssues || {};

  for (const [locale, issues] of Object.entries(localeIssues)) {
    if (!Array.isArray(issues)) continue;

    console.log(`\n=== Repairing gaps in locale: ${locale.toUpperCase()} (${LANG_NAMES[locale]}) ===`);
    const localePath = path.resolve(process.cwd(), `messages/${locale}.json`);
    
    let locData: any = {};
    if (fs.existsSync(localePath)) {
      locData = JSON.parse(fs.readFileSync(localePath, "utf8"));
    }

    if (!locData.Giants) locData.Giants = {};

    const tasks: TranslationTask[] = [];

    for (const issue of issues) {
      // 1. Missing UI Sections
      if (issue.type === 'missing_ui_sections') {
        const sections = issue.sections || [];
        for (const section of sections) {
          if (!enData[section]) continue;
          
          // Skip if already translated and populated
          if (locData[section] && (typeof locData[section] === 'string' ? locData[section].length > 0 : Object.keys(locData[section]).length > 0)) {
            console.log(`  ✓ Skipping UI section: ${section} (already exists)`);
            continue;
          }

          tasks.push({
            type: 'ui',
            key: section,
            chunkData: enData[section]
          });
        }
      }

      // 2. Missing Giants translation
      if (issue.type === 'missing_giants') {
        const missingSlugs: string[] = issue.slugs || [];
        const enGiants = enData.Giants || {};
        
        // Filter out slugs that are already translated
        const filteredSlugs = missingSlugs.filter(slug => {
          return !isGiantAlreadyRepaired(slug, locale, locData);
        });

        if (filteredSlugs.length > 0) {
          console.log(`  Adding ${filteredSlugs.length} missing giants to queue...`);
          for (let i = 0; i < filteredSlugs.length; i += 10) {
            const chunk = filteredSlugs.slice(i, i + 10);
            const chunkData: Record<string, any> = {};
            chunk.forEach(slug => {
              if (enGiants[slug]) chunkData[slug] = enGiants[slug];
            });

            tasks.push({
              type: 'giants',
              key: `missing-${i}`,
              chunkData
            });
          }
        }
      }

      // 3. English Leaks in Giants fields
      if (issue.type === 'english_leak_in_giants') {
        const details = issue.details || [];
        const enGiants = enData.Giants || {};
        const leakedSlugs = details.map((d: any) => d.slug);

        // Filter out slugs that have been repaired
        const filteredLeaks = leakedSlugs.filter(slug => {
          return !isGiantAlreadyRepaired(slug, locale, locData);
        });

        if (filteredLeaks.length > 0) {
          console.log(`  Adding ${filteredLeaks.length} leaked giants to queue...`);
          for (let i = 0; i < filteredLeaks.length; i += 10) {
            const chunk = filteredLeaks.slice(i, i + 10);
            const chunkData: Record<string, any> = {};
            chunk.forEach(slug => {
              if (enGiants[slug]) chunkData[slug] = enGiants[slug];
            });

            tasks.push({
              type: 'giants',
              key: `leak-${i}`,
              chunkData
            });
          }
        }
      }
    }

    if (tasks.length > 0) {
      console.log(`  Identified ${tasks.length} translation tasks. Running with concurrency 5...`);
      
      let activeIndex = 0;
      const concurrency = 5;

      async function worker(workerId: number) {
        while (true) {
          const i = activeIndex++;
          if (i >= tasks.length) break;

          const task = tasks[i];
          if (task.type === 'ui') {
            console.log(`  [Worker ${workerId}][${i + 1}/${tasks.length}] Translating UI section: ${task.key}...`);
            try {
              const translated = await translateSection(task.chunkData, LANG_NAMES[locale], locale);
              locData[task.key] = translated;
              console.log(`    ✓ [Worker ${workerId}] Translated UI section ${task.key}`);
            } catch (e: any) {
              console.error(`    ❌ [Worker ${workerId}] Failed to translate UI section ${task.key}:`, e.message);
            }
          } else if (task.type === 'giants') {
            console.log(`  [Worker ${workerId}][${i + 1}/${tasks.length}] Translating Giants chunk (${task.key})...`);
            try {
              const translated = await translateSection(task.chunkData, LANG_NAMES[locale], locale);
              Object.assign(locData.Giants, translated);
              console.log(`    ✓ [Worker ${workerId}] Translated Giants chunk (${task.key})`);
            } catch (e: any) {
              console.error(`    ❌ [Worker ${workerId}] Failed to translate Giants chunk (${task.key}):`, e.message);
            }
          }
          await sleep(200);
        }
      }

      const workers = Array.from({ length: concurrency }).map((_, wId) => worker(wId + 1));
      await Promise.all(workers);

      // Save final repaired file
      fs.writeFileSync(localePath, JSON.stringify(locData, null, 2), "utf8");
      console.log(`✅ Saved all repaired sections to messages/${locale}.json`);
    } else {
      console.log(`  ✓ No repair tasks needed for locale ${locale.toUpperCase()}`);
    }
  }

  console.log("\n=== LOCALE GAP REPAIRS COMPLETED ===");
}

main().catch(console.error);
