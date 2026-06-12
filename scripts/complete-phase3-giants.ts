import { getVertexAIInstance } from "../src/lib/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];
const modelId = "gemini-2.5-flash-lite";

// 12개 국어에 대한 언어명 매핑 (프롬프트 전달용)
const LANG_NAMES: Record<string, string> = {
  ko: "Korean", en: "English", de: "German", ja: "Japanese", es: "Spanish",
  fr: "French", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
  ru: "Russian", zh: "Simplified Chinese"
};

// 12개 국어에 대한 한국어 설명
const LANG_NAMES_KO: Record<string, string> = {
  ko: "한국어", en: "영어", de: "독일어", ja: "일본어", es: "스페인어",
  fr: "프랑스어", it: "이탈리아어", pt: "포르투갈어", ar: "아랍어", hi: "힌디어",
  ru: "러시아어", zh: "중국어 간체"
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Vertex AI 및 Google AI Studio Fallback API 호출 함수
async function callGenerativeAPI(prompt: string): Promise<string> {
  // 1. Try Vertex AI
  try {
    const vAI = getVertexAIInstance();
    const model = vAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = "";
    if (typeof (response as any).text === "function") {
      text = (response as any).text();
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
      temperature: 0.7,
    }
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return (response as any).text();
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

function sanitizeString(str: string): string {
  return str.replace(/\ufffd/g, "");
}

function getPrompt(slug: string, nameEn: string, nameKo: string, category: string, era: string): string {
  return `You are an expert historian and localization editor.
Create a comprehensive profile for the historical figure:
Name: ${nameEn} (Korean name: ${nameKo})
Slug: ${slug}
Category: ${category}
Era: ${era}

Generate a single JSON object containing both UI translations ("messages") and the historical narrative ("epic"). 
Ensure all fields are filled, and do not include any markdown styling or wrapper text. Only return the raw JSON object.

Strict historical requirements:
- Use accurate, verified historical details. Do not fictionalize.
- Ensure the quote is historically documented.
- The tone of "chatGreeting" and "persona" must deeply reflect the person's real character and historical style.
- No AI clichés. Do not say "as an AI..." or "as a virtual..."
- "epic_ko" must be a long-form, moving narrative of their life (minimum 500 characters, formatted with exactly 4 or more H3 subtitles like "### 1. ...\\\\n\\\\n...").
- "epic_en" must be a detailed narrative of their life in English (minimum 300 words, formatted with exactly 4 or more H3 subtitles).
- Include 3 or more wisdom quotes in the "wisdom" array.
- "pain" must describe real historical struggles, and "recovery" must describe how they overcame them.

Language-specific rules for additional locales:
- For Arabic (ar): Write in formal modern standard Arabic ("باللغة العربية الفصحى").
- For Hindi (hi): Write in natural, fluent Hindi ("हिंदी में प्राकृतिक रूप से").
- For Russian (ru): Write in literary, elegant Russian ("На литературном русском языке").
- For Chinese (zh): Write in standard Mandarin written language ("用标准普通话书面语").

Output exact JSON format:
{
  "messages": {
    "ko": {
      "name": "${nameKo}",
      "title": "Historical Title/Tag (e.g. 19세기 양자물리학의 선구자)",
      "headline": "Powerful headline/hook (within 15 characters)",
      "shortDescription": "2-3 sentence introduction",
      "quote": "Most famous quote in Korean",
      "chatGreeting": "Persona-appropriate chat greeting (2-3 sentences)",
      "suggestedQuestions": ["Question 1", "Question 2", "Question 3"],
      "era": "${era}",
      "pain": "Struggles in life",
      "recovery": "How they overcame struggles"
    },
    "en": {
      "name": "${nameEn}",
      "title": "Title (e.g., Pioneer of Quantum Physics)",
      "headline": "Headline (within 15 words)",
      "shortDescription": "2-3 sentence introduction",
      "quote": "Most famous quote in English",
      "chatGreeting": "Greeting (2-3 sentences)",
      "suggestedQuestions": ["Question 1", "Question 2", "Question 3"],
      "era": "Era in English",
      "pain": "Struggles",
      "recovery": "Overcoming"
    },
    "ja": {
      "name": "Japanese name",
      "title": "Title",
      "headline": "Headline",
      "shortDescription": "Introduction",
      "quote": "Quote",
      "chatGreeting": "Greeting",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era",
      "pain": "Struggles",
      "recovery": "Overcoming"
    },
    "de": {
      "name": "German name",
      "title": "Title",
      "headline": "Headline",
      "shortDescription": "Introduction",
      "quote": "Quote",
      "chatGreeting": "Greeting",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era",
      "pain": "Struggles",
      "recovery": "Overcoming"
    },
    "es": {
      "name": "Spanish name",
      "title": "Title",
      "headline": "Headline",
      "shortDescription": "Introduction",
      "quote": "Quote",
      "chatGreeting": "Greeting",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era",
      "pain": "Struggles",
      "recovery": "Overcoming"
    },
    "fr": {
      "name": "French name",
      "title": "Title",
      "headline": "Headline",
      "shortDescription": "Introduction",
      "quote": "Quote",
      "chatGreeting": "Greeting (using formal 'vous' form)",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era",
      "pain": "Struggles",
      "recovery": "Overcoming"
    },
    "it": {
      "name": "Italian name",
      "title": "Title",
      "headline": "Headline",
      "shortDescription": "Introduction",
      "quote": "Quote",
      "chatGreeting": "Greeting (using formal 'Lei' form)",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era",
      "pain": "Struggles",
      "recovery": "Overcoming"
    },
    "pt": {
      "name": "Portuguese name",
      "title": "Title",
      "headline": "Headline",
      "shortDescription": "Introduction",
      "quote": "Quote",
      "chatGreeting": "Greeting",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era",
      "pain": "Struggles",
      "recovery": "Overcoming"
    },
    "ar": {
      "name": "Arabic name (in Arabic)",
      "title": "Title in Arabic",
      "headline": "Headline in Arabic",
      "shortDescription": "Introduction in Arabic",
      "quote": "Quote in Arabic",
      "chatGreeting": "Greeting in Arabic",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era in Arabic",
      "pain": "Struggles in Arabic",
      "recovery": "Overcoming in Arabic"
    },
    "hi": {
      "name": "Hindi name (in Devanagari script)",
      "title": "Title in Hindi",
      "headline": "Headline in Hindi",
      "shortDescription": "Introduction in Hindi",
      "quote": "Quote in Hindi",
      "chatGreeting": "Greeting in Hindi",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era in Hindi",
      "pain": "Struggles in Hindi",
      "recovery": "Overcoming in Hindi"
    },
    "ru": {
      "name": "Russian name (in Cyrillic)",
      "title": "Title in Russian",
      "headline": "Headline in Russian",
      "shortDescription": "Introduction in Russian",
      "quote": "Quote in Russian",
      "chatGreeting": "Greeting in Russian",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era in Russian",
      "pain": "Struggles in Russian",
      "recovery": "Overcoming in Russian"
    },
    "zh": {
      "name": "Chinese name (in Simplified Chinese characters)",
      "title": "Title in Chinese",
      "headline": "Headline in Chinese",
      "shortDescription": "Introduction in Chinese",
      "quote": "Quote in Chinese",
      "chatGreeting": "Greeting in Chinese",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era in Chinese",
      "pain": "Struggles in Chinese",
      "recovery": "Overcoming in Chinese"
    }
  },
  "epic": {
    "epic_ko": "Korean narrative (detailed, min 500 chars, with 4 H3 subtitles. Use \\\\n\\\\n for newlines)",
    "epic_en": "English narrative (detailed, min 300 words, with 4 H3 subtitles. Use \\\\n\\\\n for newlines)",
    "epic_de": "German narrative (detailed)",
    "epic_ja": "Japanese narrative (detailed)",
    "epic_es": "Spanish narrative (detailed)",
    "epic_fr": "French narrative (detailed)",
    "epic_it": "Italian narrative (detailed)",
    "epic_pt": "Portuguese narrative (detailed)",
    "epic_ar": "Arabic narrative (detailed, in Arabic)",
    "epic_hi": "Hindi narrative (detailed, in Hindi)",
    "epic_ru": "Russian narrative (detailed, in Russian)",
    "epic_zh": "Chinese narrative (detailed, in Simplified Chinese)",
    "trials_ko": "Korean summary of trials",
    "trials_en": "English summary of trials",
    "overcoming_ko": "Korean summary of overcoming",
    "overcoming_en": "English summary of overcoming",
    "wisdom": [
      {
        "quote_ko": "Wisdom quote 1 (Korean)",
        "quote_en": "Wisdom quote 1 (English)",
        "meaning_ko": "Brief explanation of quote 1 (Korean)",
        "meaning_en": "Brief explanation of quote 1 (English)"
      },
      {
        "quote_ko": "Wisdom quote 2 (Korean)",
        "quote_en": "Wisdom quote 2 (English)",
        "meaning_ko": "Brief explanation of quote 2 (Korean)",
        "meaning_en": "Brief explanation of quote 2 (English)"
      },
      {
        "quote_ko": "Wisdom quote 3 (Korean)",
        "quote_en": "Wisdom quote 3 (English)",
        "meaning_ko": "Brief explanation of quote 3 (Korean)",
        "meaning_en": "Brief explanation of quote 3 (English)"
      }
    ]
  }
}
`;
}

function getPartialPrompt(slug: string, nameEn: string, nameKo: string, category: string, era: string): string {
  return `You are an expert historian and localization editor.
For the historical figure:
Name: ${nameEn} (Korean name: ${nameKo})
Slug: ${slug}
Category: ${category}
Era: ${era}

Generate a JSON object containing only the missing fields in Korean:
1. "era_ko": A natural Korean translation of their era (e.g., "19세기의 거인 (18세기~19세기)", "기원전 5세기의 거인" 등).
2. "trials_ko": A brief Korean summary (1-2 sentences) of their trials and struggles in life.
3. "overcoming_ko": A brief Korean summary (1-2 sentences) of how they overcame struggles.

Ensure the output is raw JSON with no markdown wrapping and no other text.
Output format:
{
  "era_ko": "Korean translation of era",
  "trials_ko": "Korean summary of struggles",
  "overcoming_ko": "Korean summary of overcoming"
}
`;
}

async function main() {
  const giantsPath = path.resolve(process.cwd(), "src/data/giants.ts");
  const narrativesPath = path.resolve(process.cwd(), "src/data/final-narratives.json");
  const progressPath = path.resolve(process.cwd(), "scripts/complete-progress.json");
  
  if (!fs.existsSync(giantsPath)) {
    console.error("giants.ts file not found!");
    process.exit(1);
  }

  // 1. giants.ts의 모든 위인 리스트 로드 및 파싱
  const giantsContent = fs.readFileSync(giantsPath, "utf8");
  const giantBlocks = giantsContent.split(/export const giants[^=]*=\s*\[/)[1];
  if (!giantBlocks) {
    console.error("Failed to parse giants.ts");
    process.exit(1);
  }

  const giantObjects: any[] = [];
  const objectRegex = /\{([^}]+)\}/g;
  let match;
  while ((match = objectRegex.exec(giantBlocks)) !== null) {
    const content = match[1];
    const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
    const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
    const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
    const eraMatch = content.match(/era:\s*['"]([^'"]+)['"]/);
    
    if (slugMatch) {
      giantObjects.push({
        slug: slugMatch[1],
        nameEn: slugMatch[1].split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        nameKo: nameMatch ? nameMatch[1] : '',
        category: categoryMatch ? categoryMatch[1] : 'science',
        era: eraMatch ? eraMatch[1] : '역사의 거인'
      });
    }
  }

  console.log(`Loaded ${giantObjects.length} giants from giants.ts`);

  // 2. final-narratives.json 로드하여 미완성 위인 찾기
  let narratives: Record<string, any> = {};
  if (fs.existsSync(narrativesPath)) {
    narratives = JSON.parse(fs.readFileSync(narrativesPath, "utf8"));
  }

  const missingGiants = giantObjects.filter((g) => {
    const n = narratives[g.slug];
    if (!n) return true;
    // epic_ko, trials_ko, overcoming_ko, era_ko 중 하나라도 없으면 미완성으로 취급
    if (!n.epic_ko && (!n.epic || !n.epic.ko)) return true;
    if (!n.trials_ko && (!n.trials || !n.trials.ko)) return true;
    if (!n.overcoming_ko && (!n.overcoming || !n.overcoming.ko)) return true;
    if (!n.era_ko && (!n.era || !n.era.ko)) return true;
    return false;
  });

  console.log(`Found ${missingGiants.length} incomplete giants that need data generation.`);

  if (missingGiants.length === 0) {
    console.log("No incomplete giants found. All set!");
    return;
  }

  // 3. progress.json 로드 (이미 생성된 데이터가 있는지 확인해 중간 저장/이어쓰기 지원)
  let progressData: Record<string, any> = {};
  if (fs.existsSync(progressPath)) {
    try {
      progressData = JSON.parse(fs.readFileSync(progressPath, "utf8"));
      console.log(`Loaded ${Object.keys(progressData).length} giants from progress cache.`);
    } catch (e) {
      console.error("Failed to parse progress cache, starting fresh.");
    }
  }

  let count = 0;
  for (const giant of missingGiants) {
    if (progressData[giant.slug]) {
      console.log(`[Skip Cache] ${giant.slug} already generated in progress cache.`);
      continue;
    }

    const existingN = narratives[giant.slug];
    const isPartial = !!existingN;

    if (isPartial) {
      console.log(`\n[${++count}/${missingGiants.length}] [Partial] Generating missing fields for: ${giant.nameKo} (${giant.slug})...`);
      const prompt = getPartialPrompt(giant.slug, giant.nameEn, giant.nameKo, giant.category, giant.era);
      
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        attempts++;
        try {
          const rawResponse = await callGenerativeAPI(prompt);
          const cleaned = cleanJSON(rawResponse);
          const parsed = JSON.parse(cleaned);

          if (!parsed.era_ko || !parsed.trials_ko || !parsed.overcoming_ko) {
            throw new Error("Invalid partial structure returned from AI");
          }

          progressData[giant.slug] = {
            isPartial: true,
            epic: {
              ...existingN,
              era_ko: sanitizeString(parsed.era_ko || ""),
              trials_ko: sanitizeString(parsed.trials_ko || ""),
              overcoming_ko: sanitizeString(parsed.overcoming_ko || ""),
            },
            messages: {}
          };
          
          fs.writeFileSync(progressPath, JSON.stringify(progressData, null, 2), "utf8");
          console.log(`[Success] Generated partial data for ${giant.slug}`);
          success = true;
        } catch (err: any) {
          console.error(`[Error] Attempt ${attempts} failed for partial ${giant.slug}:`, err.message);
          await sleep(3000);
        }
      }

      if (!success) {
        console.error(`[Fatal] Failed to generate partial data for ${giant.slug} after 3 attempts. Pausing.`);
        process.exit(1);
      }
    } else {
      console.log(`\n[${++count}/${missingGiants.length}] [Full] Generating full data for: ${giant.nameKo} (${giant.slug})...`);
      const prompt = getPrompt(giant.slug, giant.nameEn, giant.nameKo, giant.category, giant.era);
      
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        attempts++;
        try {
          const rawResponse = await callGenerativeAPI(prompt);
          const cleaned = cleanJSON(rawResponse);
          const parsed = JSON.parse(cleaned);

          // Simple validation check
          if (!parsed.messages || !parsed.epic || !parsed.messages.en || !parsed.messages.ko) {
            throw new Error("Invalid structure returned from AI");
          }

          // Deep sanitize strings
          for (const loc of LOCALES) {
            const m = parsed.messages[loc];
            if (m) {
              m.name = sanitizeString(m.name || "");
              m.title = sanitizeString(m.title || "");
              m.headline = sanitizeString(m.headline || "");
              m.shortDescription = sanitizeString(m.shortDescription || "");
              m.quote = sanitizeString(m.quote || "");
              m.chatGreeting = sanitizeString(m.chatGreeting || "");
              m.era = sanitizeString(m.era || "");
              m.pain = sanitizeString(m.pain || "");
              m.recovery = sanitizeString(m.recovery || "");
              if (Array.isArray(m.suggestedQuestions)) {
                m.suggestedQuestions = m.suggestedQuestions.map((q: string) => sanitizeString(q));
              }
            } else {
              // Fallback locale if missing
              parsed.messages[loc] = { ...parsed.messages.en };
              if (loc === "ko") parsed.messages[loc].name = giant.nameKo;
              else parsed.messages[loc].name = giant.nameEn;
            }
          }

          // Sanitize epic
          const ep = parsed.epic;
          for (const loc of LOCALES) {
            if (!ep[`epic_${loc}`]) ep[`epic_${loc}`] = ep[`epic_en`] || ep[`epic_ko`] || "";
            ep[`epic_${loc}`] = sanitizeString(ep[`epic_${loc}`]);
          }
          ep.trials_ko = sanitizeString(ep.trials_ko || ep.trials_en || "");
          ep.trials_en = sanitizeString(ep.trials_en || "");
          ep.overcoming_ko = sanitizeString(ep.overcoming_ko || ep.overcoming_en || "");
          ep.overcoming_en = sanitizeString(ep.overcoming_en || "");
          
          if (Array.isArray(ep.wisdom)) {
            ep.wisdom = ep.wisdom.map((w: any) => ({
              quote_ko: sanitizeString(w.quote_ko || w.quote_en || ""),
              quote_en: sanitizeString(w.quote_en || ""),
              meaning_ko: sanitizeString(w.meaning_ko || w.meaning_en || ""),
              meaning_en: sanitizeString(w.meaning_en || "")
            }));
          }

          progressData[giant.slug] = { ...parsed, category: giant.category };
          
          // Save progress cache
          fs.writeFileSync(progressPath, JSON.stringify(progressData, null, 2), "utf8");
          console.log(`[Success] Generated full data for ${giant.slug}`);
          success = true;
        } catch (err: any) {
          console.error(`[Error] Attempt ${attempts} failed for ${giant.slug}:`, err.message);
          await sleep(3000);
        }
      }

      if (!success) {
        console.error(`[Fatal] Failed to generate ${giant.slug} after 3 attempts. Pausing. Run again to resume.`);
        process.exit(1);
      }
    }

    // Sleep to respect API rate limits (GCP Free Tier 안전 확보)
    await sleep(2500);
  }

  // 4. 모든 작업 완료 시 final-narratives.json 및 messages/*.json에 병합
  console.log("\n=== 병합 작업 시작 (Merging into final files) ===");
  const finishedSlugs = Object.keys(progressData);

  // 4-1. final-narratives.json 병합
  for (const slug of finishedSlugs) {
    narratives[slug] = progressData[slug].epic;
  }
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), "utf8");
  console.log("✓ Merged narratives successfully into src/data/final-narratives.json");

  // 4-2. messages/*.json 병합
  for (const lang of LOCALES) {
    const langPath = path.resolve(process.cwd(), `messages/${lang}.json`);
    if (fs.existsSync(langPath)) {
      const messages = JSON.parse(fs.readFileSync(langPath, "utf8"));
      if (!messages.Giants) messages.Giants = {};
      
      for (const slug of finishedSlugs) {
        if (progressData[slug].isPartial) {
          continue;
        }
        messages.Giants[slug] = progressData[slug].messages[lang];
      }
      fs.writeFileSync(langPath, JSON.stringify(messages, null, 2), "utf8");
      console.log(`✓ Merged translations successfully into messages/${lang}.json`);
    }
  }

  // 병합 완료 시 캐시 제거
  try {
    fs.unlinkSync(progressPath);
    console.log("✓ Progress cache cleared.");
  } catch (e) {}

  console.log("\n=== ALL DATA GENERATION & MERGING COMPLETED ===");
}

main().catch(console.error);
