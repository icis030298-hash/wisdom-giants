import { getVertexAIInstance } from "../src/lib/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const modelId = "gemini-2.5-flash-lite";

// Fallback Google AI Studio Client
function getGenAIClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment");
  }
  return new GoogleGenerativeAI(apiKey);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGenerativeAPI(prompt: string, temperature: number = 0.7): Promise<string> {
  // 1. Try Vertex AI first (uses GCP Free Credit)
  try {
    const vAI = getVertexAIInstance();
    const model = vAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        responseMimeType: "text/plain", // plain text response for epics
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
      temperature: temperature,
    }
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

const reportPath = path.resolve(process.cwd(), "scripts/audit-report.json");
const narrativesPath = path.resolve(process.cwd(), "src/data/final-narratives.json");

if (!fs.existsSync(reportPath)) {
  console.error("Audit report not found! Run full-audit.mjs first.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));

const LANG_NAMES: Record<string, string> = {
  ko: "Korean", en: "English", de: "German", ja: "Japanese", es: "Spanish",
  fr: "French", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
  ru: "Russian", zh: "Simplified Chinese"
};

const LANG_NAMES_KO: Record<string, string> = {
  ko: "한국어", en: "영어", de: "독일어", ja: "일본어", es: "스페인어",
  fr: "프랑스어", it: "이탈리아어", pt: "포르투갈어", ar: "아랍어", hi: "힌디어",
  ru: "러시아어", zh: "중국어 간체"
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

function isAlreadyRepaired(slug: string, lang: string): boolean {
  if (slug === 'murasaki-shikibu') {
    // Murasaki Shikibu is forced to rewrite to fix style/list formatting
    return false;
  }
  const existing = narratives[slug]?.[`epic_${lang}`];
  if (!existing || existing.trim().length < 200) {
    return false;
  }
  if (lang === 'en') {
    return true; // English epic check: length > 200 is sufficient
  }
  const pattern = LANGUAGE_PATTERNS[lang];
  const hasNativeChars = pattern ? pattern.test(existing) : true;
  if (!hasNativeChars) {
    return false;
  }
  const engWords = (existing.match(ENGLISH_WORD) || []).filter((w: string) => !ALLOWED_ENGLISH.includes(w));
  const engRatio = engWords.length / (existing.split(' ').length || 1);
  if (engRatio > 0.15) {
    return false; // has leak
  }
  return true; // repaired!
}

async function fixEpic(slug: string, lang: string, enEpic: string, isRewrite: boolean = false): Promise<string | null> {
  const languageName = LANG_NAMES[lang];
  const languageNameKo = LANG_NAMES_KO[lang];
  const isRTL = lang === 'ar';

  let customInstruction = "";
  if (slug === 'murasaki-shikibu') {
    customInstruction = `
- **CRITICAL**: Do NOT use bullet points, list numbers (like 1., 2.), or index sections.
- Write in a flowing, dramatic, and poetic prose style, similar to a historical novel or epic story.
- Structure with exactly 4 or more rich narrative paragraphs separated by H3 subtitles (e.g. ### 1. ...\\n\\n### 2. ...).`;
  }

  const prompt = `
You are an expert historian and localization editor.
Translate the following English biography epic of the historical figure "${slug}" into high-quality ${languageName} (${languageNameKo}).

English Source Epic:
${enEpic}

Strict Requirements:
1. Translate fully into ${languageNameKo}. Do NOT mix any English words, except for globally recognized proper nouns if absolutely necessary.
2. Maintain a dramatic, moving, and engaging historical novel style.
3. Structure with at least 4 clear sections using H3 subtitles (e.g. ### 1. ...\\n\\n### 2. ...).
4. The output must be long-form and comprehensive (minimum 1000 characters for Korean/Japanese/Chinese, or 400 words for Western/Middle Eastern languages).
${isRTL ? "5. Ensure the phrasing feels natural for an Arabic audience and fits Right-to-Left (RTL) reading flow." : ""}
${customInstruction}

Return ONLY the translated/rewritten epic text. Do NOT wrap in markdown JSON code blocks. Do NOT add any preamble or conversational text. Only output the raw translation markdown content.
`;

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const result = await callGenerativeAPI(prompt, 0.7);
      if (result && result.trim().length > 100) {
        return result.trim();
      }
      throw new Error("Generated response is too short or empty");
    } catch (e: any) {
      console.error(`    [Fix Epic Warning] Attempt ${attempts} failed for ${slug} [${lang}]:`, e.message);
      await sleep(3000);
    }
  }
  return null;
}

async function main() {
  const toFix: { slug: string; lang: string; reason: string }[] = [];

  // 1. Gather missing locales (emptyByLang)
  const emptyByLang = report.summary.epicIssues.emptyByLang || [];
  emptyByLang.forEach((item: any) => {
    const lang = item.lang;
    if (lang === 'all') return; // Skip all-locale fallback logic
    item.slugs.forEach((slug: string) => {
      if (isAlreadyRepaired(slug, lang)) return;
      toFix.push({ slug, lang, reason: "Empty epic" });
    });
  });

  // 2. Gather English leaks (englishLeaksByLang)
  const englishLeaksByLang = report.summary.epicIssues.englishLeaksByLang || [];
  englishLeaksByLang.forEach((item: any) => {
    const lang = item.lang;
    item.slugs.forEach((slug: string) => {
      if (isAlreadyRepaired(slug, lang)) return;
      // Avoid duplicate
      if (!toFix.some(f => f.slug === slug && f.lang === lang)) {
        toFix.push({ slug, lang, reason: "English leaks detected" });
      }
    });
  });

  // 3. FORCE rewrite Murasaki Shikibu in ALL locales to improve style formatting (removing lists)
  const murasakiLocales = Object.keys(LANG_NAMES);
  murasakiLocales.forEach((lang) => {
    if (!toFix.some(f => f.slug === 'murasaki-shikibu' && f.lang === lang)) {
      toFix.push({ slug: 'murasaki-shikibu', lang, reason: "Format rewrite request (from list to prose)" });
    }
  });

  console.log(`Total repair tasks identified: ${toFix.length}`);

  let successCount = 0;
  let failCount = 0;
  let activeIndex = 0;

  const concurrency = 25;

  async function worker(workerId: number) {
    while (true) {
      const i = activeIndex++;
      if (i >= toFix.length) {
        break;
      }

      const { slug, lang, reason } = toFix[i];
      console.log(`\n[Worker ${workerId}][${i + 1}/${toFix.length}] Repairing ${slug} in ${lang.toUpperCase()} (${LANG_NAMES_KO[lang]}) - Reason: ${reason}...`);

      let enEpic = "";
      if (lang === 'en') {
        const koEpic = narratives[slug]?.epic_ko || "";
        if (!koEpic) {
          console.warn(`  ⚠️ [Worker ${workerId}] Cannot rewrite English: missing Korean source for ${slug}`);
          failCount++;
          continue;
        }
        enEpic = koEpic;
      } else {
        enEpic = narratives[slug]?.epic_en || narratives[slug]?.epic_ko || "";
        if (!enEpic) {
          console.warn(`  ⚠️ [Worker ${workerId}] Cannot translate: missing English/Korean source for ${slug}`);
          failCount++;
          continue;
        }
      }

      const repairedEpic = await fixEpic(slug, lang, enEpic, slug === 'murasaki-shikibu');

      if (repairedEpic) {
        if (!narratives[slug]) narratives[slug] = {};
        narratives[slug][`epic_${lang}`] = repairedEpic;
        successCount++;
        console.log(`  ✓ [Worker ${workerId}] Successfully repaired ${slug} [${lang}] (${repairedEpic.length} chars)`);

        if (successCount % 5 === 0) {
          fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), "utf8");
          console.log(`  💾 [Worker ${workerId}] Progress auto-saved.`);
        }
      } else {
        failCount++;
        console.error(`  ❌ [Worker ${workerId}] Failed to repair ${slug} [${lang}]`);
      }

      await sleep(200);
    }
  }

  const workers = Array.from({ length: concurrency }).map((_, workerId) => worker(workerId + 1));
  await Promise.all(workers);

  // Final save
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), "utf8");
  console.log(`\n=== EPIC REPAIR COMPLETE ===`);
  console.log(`Success: ${successCount}, Failures: ${failCount}, Total: ${toFix.length}`);
}

main().catch(console.error);
