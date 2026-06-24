import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const modelId = "gemini-2.5-flash-lite";
const KOREAN_REGEX = /[\uAC00-\uD7A3]/;

function getGenAIClient(): GoogleGenerativeAI {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment");
  }
  return new GoogleGenerativeAI(apiKey);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const LANG_NAMES: Record<string, string> = {
  ko: "Korean", en: "English", de: "German", ja: "Japanese", es: "Spanish",
  fr: "French", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
  ru: "Russian", zh: "Simplified Chinese"
};

function buildTranslationPrompt(sourceText: string, targetLocale: string, field: string, slug: string): string {
  const targetLanguage = LANG_NAMES[targetLocale] || targetLocale;
  return `You are a professional literary translator and localizer.
Your task is to translate and perfectly localize the following text from Korean into ${targetLanguage}.

TARGET_LANGUAGE: ${targetLanguage}
TARGET_LOCALE: ${targetLocale}
BLOG_SLUG: ${slug}
FIELD_TYPE: ${field}

TEXT TO TRANSLATE:
"""
${sourceText}
"""

STRICT RULES:
1. Translate the entire text into natural, high-quality, professional ${targetLanguage}.
2. Absolutely NO Korean (Hangul) characters are allowed in your output. Every single Korean character must be translated or transliterated.
   - For example, transliterate Korean proper nouns:
     - "윤동주" -> in Japanese: "尹東柱" (or "ユン・ドンジュ"), in Arabic: "يوندونغجو", in Portuguese: "Yun Dong-ju", in Russian: "Юн Дон Джу"
     - "장영실" -> in Portuguese: "Jang Yeong-sil", in Italian: "Jang Yeong-sil", in Russian: "Чан Ён Силь"
     - "세종대왕" -> in Portuguese: "Sejong, o Grande", in Japanese: "世宗大王", in Arabic: "سيجونغ العظيم", in French: "le roi Sejong le Grand"
     - "자격루" -> in Portuguese: "Jagyeokru", in French: "Jagyeokru" (never "자격루" or "(자격루)")
     - "하늘과 바람과 별과 시" -> in Japanese: "空と風と星と詩", in Arabic: "السماء والرياح والنجوم والشعر", in German: "Himmel, Wind, Sterne und Gedicht", in French: "le Ciel, le Vent, les Étoiles et la Poésie"
     - "자화상" -> in Italian: "Autoritratto", in Spanish: "Autorretrato" (never leaving "(자화상)")
     - "한글" -> in Arabic: "الهانغول", in Russian: "хангыль"
3. DO NOT wrap your output in any markdown code block (like \`\`\`markdown or \`\`\`html). Output the raw translated text directly.
4. Keep all markdown structure (headings like ##, ###, bullet points, blockquotes starting with >) exactly as they are in the source text.
5. Do not include any introductory remarks, conversational text, explanations, or notes. Output ONLY the translated text.`;
}

function buildCorrectionPrompt(sourceText: string, targetLocale: string, faultyTranslation: string, foundKorean: string): string {
  const targetLanguage = LANG_NAMES[targetLocale] || targetLocale;
  return `You are a professional literary translator. Your previous translation of a Korean text into ${targetLanguage} contained Korean (Hangul) characters, which violates our strict requirements.
Korean characters found in your previous translation: "${foundKorean}"

Here is the original Korean text:
"""
${sourceText}
"""

Here is your previous translation:
"""
${faultyTranslation}
"""

Please correct the previous translation by translating or transliterating EVERY SINGLE KOREAN CHARACTER into ${targetLanguage}.
Do not leave any Hangul characters in the text (e.g. no "(한글)", no "(윤동주)").
Output ONLY the corrected ${targetLanguage} translation. Do not include any markdown wrappers, intros, or explanations.`;
}

async function callTranslationAPI(prompt: string): Promise<string> {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0.1,
    }
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  if (text && text.trim().length > 0) {
    return text.trim();
  }
  throw new Error("Empty response from Gemini API");
}

async function translateAndVerify(sourceText: string, targetLocale: string, field: string, slug: string): Promise<string> {
  console.log(`  Calling translation API for ${slug} (${field}) to ${targetLocale}...`);
  let prompt = buildTranslationPrompt(sourceText, targetLocale, field, slug);
  let translation = await callTranslationAPI(prompt);
  
  // Clean markdown wraps if any
  translation = translation.replace(/^```(markdown|html|ja|ar|pt|ru|de|fr|es|it|hi|zh)?\n/, "").replace(/\n```$/, "").trim();
  
  // Check if it still contains Korean characters
  if (KOREAN_REGEX.test(translation)) {
    const match = translation.match(/[\uAC00-\uD7A3]+/g);
    const foundKorean = match ? match.join(", ") : "Hangul characters";
    console.warn(`  [Warning] Translation contains Hangul characters: [${foundKorean}]. Triggering self-correction loop...`);
    
    // Call correction API
    const correctionPrompt = buildCorrectionPrompt(sourceText, targetLocale, translation, foundKorean);
    translation = await callTranslationAPI(correctionPrompt);
    translation = translation.replace(/^```(markdown|html|ja|ar|pt|ru|de|fr|es|it|hi|zh)?\n/, "").replace(/\n```$/, "").trim();
    
    if (KOREAN_REGEX.test(translation)) {
      const secondMatch = translation.match(/[\uAC00-\uD7A3]+/g);
      console.error(`  [Error] Self-correction failed. Still contains Hangul: [${secondMatch ? secondMatch.join(", ") : ""}]`);
    } else {
      console.log(`  [Success] Self-correction succeeded! Zero Hangul characters remain.`);
    }
  }
  
  return translation;
}

async function main() {
  const blogPostsPath = path.resolve(process.cwd(), "src/data/blog-posts.ts");
  const leakReportPath = path.resolve(process.cwd(), "scripts/leak-report.json");

  if (!fs.existsSync(blogPostsPath)) {
    console.error("blog-posts.ts not found!");
    process.exit(1);
  }

  if (!fs.existsSync(leakReportPath)) {
    console.error("leak-report.json not found! Run audit-language-leak.ts first.");
    process.exit(1);
  }

  const leaksData = JSON.parse(fs.readFileSync(leakReportPath, "utf8"));
  const blogLeaks = leaksData.blogLeaks || [];

  if (blogLeaks.length === 0) {
    console.log("No blog leaks to fix!");
    return;
  }

  console.log(`Found ${blogLeaks.length} blog leaks to fix.`);

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

  console.log("Successfully parsed blog-posts.ts array.");

  // Process leaks sequentially
  for (let idx = 0; idx < blogLeaks.length; idx++) {
    const leak = blogLeaks[idx];
    const { slug, locale, field } = leak;
    console.log(`[Leak ${idx + 1}/${blogLeaks.length}] Fixing ${slug} in locale ${locale.toUpperCase()} (field: ${field})`);

    const blog = blogList.find((b) => b.slug === slug);
    if (!blog) {
      console.error(`Blog post with slug ${slug} not found in array!`);
      continue;
    }

    // Get Korean text as source text
    const sourceText = blog.translations?.ko?.[field] || "";
    if (!sourceText) {
      console.error(`Korean source text for slug ${slug} (field: ${field}) not found!`);
      continue;
    }

    try {
      const fixedTranslation = await translateAndVerify(sourceText, locale, field, slug);
      
      if (!blog.translations[locale]) {
        blog.translations[locale] = {};
      }
      blog.translations[locale][field] = fixedTranslation;
      console.log(`✓ Fixed ${slug} (${locale})`);
      
      // Delay to avoid rate limit
      await sleep(2000);
    } catch (err: any) {
      console.error(`❌ Failed to fix leak: ${err.message}`);
    }
  }

  // Write back to file
  const header = tsContent.slice(0, arrayStartIndex);
  const updatedTsContent = header + JSON.stringify(blogList, null, 2) + "\n];\n";
  fs.writeFileSync(blogPostsPath, updatedTsContent, "utf8");
  console.log(`\n💾 Saved all fixed blog posts to src/data/blog-posts.ts.`);
}

main().catch(console.error);
