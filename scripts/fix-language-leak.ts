import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const modelId = "gemini-2.5-flash-lite";

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

async function callTranslationAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0.2, // Lower temperature for high fidelity translations
    }
  });

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
      throw new Error("Empty response");
    } catch (e: any) {
      console.warn(`[Gemini API Warning] Attempt ${attempts} failed: ${e.message}`);
      await sleep(attempts * 3000);
    }
  }
  throw new Error("Failed to translate after 3 attempts");
}

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

// Build prompt according to the strict localization rules
function buildTranslationPrompt(sourceText: string, targetLocale: string, type: string, slug: string): string {
  const targetLanguage = LANG_NAMES[targetLocale] || targetLocale;
  const targetLanguageKo = LANG_NAMES_KO[targetLocale] || targetLocale;
  
  return `You are an expert Full-Stack Software Localizer and Professional Cultural Translator.
Your job is to translate and perfectly localize the following historical giant content/biography for the platform 'GiantsWisdom.com'.

TARGET_LOCALE: ${targetLocale} (${targetLanguage} / ${targetLanguageKo})
CONTENT_TYPE: ${type}
GIANT_SLUG: ${slug}

RAW_CONTENT_TO_TRANSLATE:
"""
${sourceText}
"""

Strict Rules:
1. MAXIMUM LOCALE PURITY: Absolutely NO Korean (Hangul) characters are allowed in the final output unless it is a specific native proper noun that cannot be translated (even then, it should be phonetically romanized or adapted to the target language).
2. COMPLETE COVERAGE: Translate everything. This includes main body paragraphs, quotes, subheadings, short metadata strings, button labels, and captions.
3. CONTEXT & TONE RETENTION: Maintain the historical depth, emotional resonance, and elite intellectual tone of the original text. Do not just do a literal word-by-word translation; write it like a premium local historical editorial.
4. FORMAT PRESERVATION: Keep all Markdown tags, structural formatting, blockquotes (e.g. lines starting with "> " followed by "- [Author Name]"), and spacing exactly as provided in the raw input. Do NOT change structural syntax.
5. SELF-VERIFICATION: Before finalizing output, scan your own response for any Hangul character (Unicode \\uAC00-\\uD7A3). If found, revise until zero Korean characters remain.
6. PROPER NOUN HANDLING: Korean proper nouns (e.g., 세종대왕, 이순신, 장영실) must be transliterated to the target language's standard convention (e.g., "Sejong the Great", "Yi Sun-sin", "Jang Yeong-sil"), NEVER left in Hangul script.

Return ONLY the translated/localized text inside a clean markdown block or raw text. Do not include any conversational intros, explanations, or JSON wrappers. Just output the translation.`;
}

async function main() {
  const leakReportPath = path.resolve(process.cwd(), "scripts/leak-report.json");
  const narrativesPath = path.resolve(process.cwd(), "src/data/final-narratives.json");
  const blogPostsPath = path.resolve(process.cwd(), "src/data/blog-posts.ts");

  if (!fs.existsSync(leakReportPath)) {
    console.error("Leak report not found! Run audit-language-leak.ts first.");
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(leakReportPath, "utf8"));
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));

  // 1. Process Narrative Leaks (834 tasks)
  console.log(`Starting Narrative Leak Repairs: ${report.narrativeLeaks.length} tasks...`);
  
  let narrativeSuccess = 0;
  let activeIndex = 0;
  const concurrency = 15;

  async function worker(workerId: number) {
    while (true) {
      const i = activeIndex++;
      if (i >= report.narrativeLeaks.length) {
        break;
      }
      
      const task = report.narrativeLeaks[i];
      const { slug, field } = task;
      
      let locale = "";
      if (field.includes("_")) {
        locale = field.split("_").pop() || "";
      } else if (field.startsWith("wisdom[")) {
        locale = field.split("_").pop() || "";
      }

      if (!locale || locale === "ko") continue;

      console.log(`[Worker ${workerId}][Narrative ${i + 1}/${report.narrativeLeaks.length}] Translating ${slug} (${field}) to ${locale.toUpperCase()}...`);

      let sourceText = "";
      const baseField = field.substring(0, field.lastIndexOf("_"));
      
      if (field.startsWith("wisdom[")) {
        const match = field.match(/wisdom\[(\d+)\]\.(\w+)_(\w+)/);
        if (match) {
          const idx = parseInt(match[1], 10);
          const subfield = match[2];
          const wisdomArray = narratives[slug]?.wisdom || [];
          const item = wisdomArray[idx] || {};
          sourceText = item[`${subfield}_en`] || item[`${subfield}_ko`] || "";
        }
      } else {
        sourceText = narratives[slug]?.[`${baseField}_en`] || narratives[slug]?.[`${baseField}_ko`] || "";
      }

      if (!sourceText || sourceText.length < 5) {
        console.warn(`  [Worker ${workerId}] Missing source text for ${slug} (${field})`);
        continue;
      }

      try {
        const prompt = buildTranslationPrompt(sourceText, locale, field, slug);
        const translatedText = await callTranslationAPI(prompt);
        
        if (field.startsWith("wisdom[")) {
          const match = field.match(/wisdom\[(\d+)\]\.(\w+)_(\w+)/);
          if (match) {
            const idx = parseInt(match[1], 10);
            const subfield = match[2];
            narratives[slug].wisdom[idx][`${subfield}_${locale}`] = translatedText;
          }
        } else {
          narratives[slug][field] = translatedText;
        }
        
        narrativeSuccess++;
        console.log(`  [Worker ${workerId}] ✓ Successfully localized ${slug} (${field}). Length: ${translatedText.length}`);

        if (narrativeSuccess % 50 === 0) {
          fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), "utf8");
          console.log(`  [Worker ${workerId}] 💾 Progress auto-saved to final-narratives.json`);
        }
        
        await sleep(1000); // 1s sleep per task per worker to maintain good rate limits
      } catch (err: any) {
        console.error(`  [Worker ${workerId}] ❌ Failed to translate ${slug} (${field}): ${err.message}`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }).map((_, workerId) => worker(workerId + 1));
  await Promise.all(workers);

  // Save final narratives progress
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), "utf8");
  console.log(`\n💾 Saved all narratives progress.`);

  // 2. Process Blog Leaks (24 tasks)
  if (report.blogLeaks.length > 0) {
    console.log(`\nStarting Blog Leak Repairs: ${report.blogLeaks.length} tasks...`);
    
    // Parse blog-posts.ts file
    let tsContent = fs.readFileSync(blogPostsPath, "utf8");
    const arrayStartMatch = tsContent.match(/export const blogPosts: BlogPost\[\] = \s*\[/);
    if (!arrayStartMatch) {
      console.error("Could not find start of blogPosts array in blog-posts.ts!");
      process.exit(1);
    }

    const arrayStartIndex = tsContent.indexOf(arrayStartMatch[0]) + arrayStartMatch[0].length - 1;
    const arrayEndIndex = tsContent.lastIndexOf("];");
    const arrayString = tsContent.slice(arrayStartIndex, arrayEndIndex + 1);
    
    let blogList: any[] = [];
    try {
      const fn = new Function(`return ${arrayString};`);
      blogList = fn();
    } catch (e: any) {
      console.error("Failed to parse blog-posts.ts array:", e.message);
      process.exit(1);
    }

    let blogSuccess = 0;
    let activeBlogIndex = 0;
    const blogConcurrency = 5;

    async function blogWorker(workerId: number) {
      while (true) {
        const i = activeBlogIndex++;
        if (i >= report.blogLeaks.length) {
          break;
        }

        const task = report.blogLeaks[i];
        const { slug, locale, field } = task;
        
        console.log(`[Blog Worker ${workerId}][Blog ${i + 1}/${report.blogLeaks.length}] Translating blog ${slug} (${field}) to ${locale.toUpperCase()}...`);
        
        const blogIdx = blogList.findIndex(b => b.slug === slug);
        if (blogIdx === -1) {
          console.warn(`  [Blog Worker ${workerId}] ⚠️ Blog post ${slug} not found in array!`);
          continue;
        }
        
        const blog = blogList[blogIdx];
        const sourceText = blog.translations?.ko?.[field] || "";
        if (!sourceText) {
          console.warn(`  [Blog Worker ${workerId}] ⚠️ Missing Korean source text for blog ${slug}`);
          continue;
        }

        try {
          const prompt = buildTranslationPrompt(sourceText, locale, `blog-${field}`, slug);
          const translatedText = await callTranslationAPI(prompt);
          
          if (!blog.translations[locale]) {
            blog.translations[locale] = {};
          }
          blog.translations[locale][field] = translatedText;
          
          blogSuccess++;
          console.log(`  [Blog Worker ${workerId}] ✓ Successfully localized blog ${slug} (${field}) to ${locale}`);
          
          await sleep(1000);
        } catch (err: any) {
          console.error(`  [Blog Worker ${workerId}] ❌ Failed to translate blog ${slug} (${field}): ${err.message}`);
        }
      }
    }

    const blogWorkers = Array.from({ length: blogConcurrency }).map((_, workerId) => blogWorker(workerId + 1));
    await Promise.all(blogWorkers);

    // Write back updated blog-posts.ts
    const header = tsContent.slice(0, arrayStartIndex);
    const updatedTsContent = header + JSON.stringify(blogList, null, 2) + "\n];\n";
    fs.writeFileSync(blogPostsPath, updatedTsContent, "utf8");
    console.log(`\n💾 Saved all blog posts progress to blog-posts.ts.`);
  }

  console.log(`\n=== TRANSLATION COMPLETE ===`);
  console.log(`Narratives success: ${narrativeSuccess}/${report.narrativeLeaks.length}`);
}

main().catch(console.error);
