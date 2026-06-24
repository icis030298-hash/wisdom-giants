import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const modelId = "gemini-2.5-flash-lite";

function getGenAIClient(): GoogleGenerativeAI {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in environment");
  }
  return new GoogleGenerativeAI(apiKey);
}

async function callTranslationAPI(prompt: string): Promise<string> {
  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0.1,
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
      await new Promise(resolve => setTimeout(resolve, attempts * 3000));
    }
  }
  throw new Error("Failed to translate after 3 attempts");
}

const LANG_NAMES: Record<string, string> = {
  ja: "Japanese",
  ar: "Arabic",
  pt: "Portuguese"
};

function buildTranslationPrompt(sourceText: string, targetLocale: string): string {
  const targetLanguage = LANG_NAMES[targetLocale] || targetLocale;
  return `You are a professional literary translator and localizer.
Your task is to translate the following text from Korean into ${targetLanguage}.

TARGET_LANGUAGE: ${targetLanguage}
TARGET_LOCALE: ${targetLocale}

TEXT TO TRANSLATE:
"""
${sourceText}
"""

STRICT RULES:
1. Translate the entire text into natural, high-quality, professional ${targetLanguage}.
2. Absolutely NO Korean (Hangul) characters are allowed in your output. Every single Korean character must be translated or transliterated.
   - For example, transliterate Korean proper nouns:
     - "윤동주" -> in Japanese: "尹東柱" (or "ユン・ドンジュ"), in Arabic: "يوندونغجو", in Portuguese: "Yun Dong-ju"
     - "장영실" -> in Portuguese: "Jang Yeong-sil"
     - "세종대왕" -> in Portuguese: "Sejong, o Grande", in Japanese: "世宗大王", in Arabic: "سيجونغ العظيم"
     - "자격루" -> in Portuguese: "Jagyeokru" (never "자격루" or "(자격루)")
     - "하늘과 바람과 별과 시" -> in Japanese: "空と風と星と詩", in Arabic: "السماء والرياح والنجوم والشعر"
3. DO NOT wrap your output in any markdown code block (like \`\`\`markdown or \`\`\`html or \`\`\`ar). Output the raw translated text directly.
4. Keep all markdown structure (headings like ##, ###, bullet points, blockquotes starting with >) exactly as they are in the source text.
5. Do not include any introductory remarks, conversational text, explanations, or notes. Output ONLY the translated text.`;
}

async function main() {
  const blogPostsPath = path.resolve(process.cwd(), "src/data/blog-posts.ts");
  
  if (!fs.existsSync(blogPostsPath)) {
    console.error("blog-posts.ts not found!");
    process.exit(1);
  }

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

  console.log("Successfully parsed blog-posts.ts. Processing the 3 leaks...");

  // Leak 1: yun-dongju-poetry - Japanese (ja)
  const postYun = blogList.find(b => b.slug === "yun-dongju-poetry");
  if (postYun) {
    console.log("Translating yun-dongju-poetry to Japanese...");
    // 1. Clean title and description backticks
    if (postYun.translations.ja) {
      let t = postYun.translations.ja.title || "";
      let d = postYun.translations.ja.description || "";
      t = t.replace(/^```markdown\n/, "").replace(/\n```$/, "").trim();
      d = d.replace(/^```markdown\n/, "").replace(/\n```$/, "").trim();
      postYun.translations.ja.title = t;
      postYun.translations.ja.description = d;
      console.log(`Cleaned ja title: "${postYun.translations.ja.title}"`);
      console.log(`Cleaned ja description: "${postYun.translations.ja.description}"`);
    }

    // 2. Translate content
    const sourceKo = postYun.translations.ko?.content || "";
    if (sourceKo) {
      const prompt = buildTranslationPrompt(sourceKo, "ja");
      const translation = await callTranslationAPI(prompt);
      // Clean any potential markdown wraps
      const cleanedTranslation = translation.replace(/^```(markdown|japanese)?\n/, "").replace(/\n```$/, "").trim();
      postYun.translations.ja.content = cleanedTranslation;
      console.log("Successfully translated ja content.");
    }
  }

  // Leak 2: yun-dongju-poetry - Arabic (ar)
  if (postYun) {
    console.log("Translating yun-dongju-poetry to Arabic...");
    const sourceKo = postYun.translations.ko?.content || "";
    if (sourceKo) {
      const prompt = buildTranslationPrompt(sourceKo, "ar");
      const translation = await callTranslationAPI(prompt);
      const cleanedTranslation = translation.replace(/^```(markdown|arabic|ar)?\n/, "").replace(/\n```$/, "").trim();
      postYun.translations.ar.content = cleanedTranslation;
      console.log("Successfully translated ar content.");
    }
  }

  // Leak 3: jang-yeong-sil-genius - Portuguese (pt)
  const postJang = blogList.find(b => b.slug === "jang-yeong-sil-genius");
  if (postJang) {
    console.log("Translating jang-yeong-sil-genius to Portuguese...");
    const sourceKo = postJang.translations.ko?.content || "";
    if (sourceKo) {
      const prompt = buildTranslationPrompt(sourceKo, "pt");
      const translation = await callTranslationAPI(prompt);
      const cleanedTranslation = translation.replace(/^```(markdown|portuguese|pt)?\n/, "").replace(/\n```$/, "").trim();
      postJang.translations.pt.content = cleanedTranslation;
      console.log("Successfully translated pt content.");
    }
  }

  // Write back updated blog-posts.ts
  const header = tsContent.slice(0, arrayStartIndex);
  const updatedTsContent = header + JSON.stringify(blogList, null, 2) + "\n];\n";
  fs.writeFileSync(blogPostsPath, updatedTsContent, "utf8");
  console.log("Saved all updates back to src/data/blog-posts.ts.");
}

main().catch(console.error);
