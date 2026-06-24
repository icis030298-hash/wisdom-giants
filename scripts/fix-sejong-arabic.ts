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

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  if (text && text.trim().length > 0) {
    return text.trim();
  }
  throw new Error("Empty response from Gemini API");
}

async function main() {
  const blogPostsPath = path.resolve(process.cwd(), "src/data/blog-posts.ts");
  
  let tsContent = fs.readFileSync(blogPostsPath, "utf8");
  const arrayStartMatch = tsContent.match(/export const blogPosts: BlogPost\[\] = \s*\[/);
  if (!arrayStartMatch) {
    console.error("Could not find start of blogPosts array");
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

  const blog = blogList.find(b => b.slug === "king-sejong-innovation");
  if (!blog) {
    console.error("Blog post not found!");
    process.exit(1);
  }

  const sourceText = blog.translations.ko.content;

  const prompt = `You are a professional literary translator and localizer.
Translate the following historical essay from Korean into Arabic.

TEXT TO TRANSLATE:
"""
${sourceText}
"""

STRICT CONSTRAINTS:
1. Output ONLY the translated Arabic text. No intros, no notes, no explanations, no markdown wrappers like \`\`\`ar or \`\`\`markdown.
2. Absolutely NO Korean (Hangul) characters are allowed in your output.
3. Transliterate or translate all Korean terms into Arabic. Use these exact transliterations:
   - "세종대왕" -> "الملك سيجونغ العظيم"
   - "조선" -> "جوسون"
   - "훈민정음" -> "هونمينجونغوم"
   - "애민" -> "آي مين"
   - "측우기" -> "تشيوغوغي"
   - "농사직설" -> "نونغسا جيكسول"
   - "실록" -> "سيلوك"
   - "혼천의" -> "هونتشوني"
   - "간의" -> "غاني"
   - "장영실" -> "جانغ يونغ سيل"
   - "칠정산" -> "تشيلجونغسان"
   - "앙부일구" -> "أنغبو إيلغو"
4. Do not leave the original Korean term in parentheses. For example, write only "هونمينجونغوم" and never "هونمينجونغوم (훈민정음)".
5. Maintain all markdown formatting (##, ###, > blockquotes) exactly as in the source.`;

  console.log("Calling Gemini API to translate King Sejong innovation to Arabic...");
  let translation = await callTranslationAPI(prompt);
  translation = translation.replace(/^```(markdown|html|ar)?\n/, "").replace(/\n```$/, "").trim();

  const KOREAN_REGEX = /[\uAC00-\uD7A3]/;
  if (KOREAN_REGEX.test(translation)) {
    const matches = translation.match(/[\uAC00-\uD7A3]+/g);
    console.error("Failed: translation still contains Korean characters:", matches);
    process.exit(1);
  }

  console.log("Success! Zero Hangul characters found in the translated text.");
  
  blog.translations.ar.content = translation;

  // Write back to file correctly (without double closing brackets)
  const header = tsContent.slice(0, arrayStartIndex);
  const updatedTsContent = header + JSON.stringify(blogList, null, 2) + ";\n";
  fs.writeFileSync(blogPostsPath, updatedTsContent, "utf8");
  console.log("Successfully updated blog-posts.ts with corrected Arabic translation.");
}

main().catch(console.error);
