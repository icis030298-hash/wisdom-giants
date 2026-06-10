import { getVertexAIInstance } from "../src/lib/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

interface GiantMetadata {
  slug: string;
  nameEn: string;
  nameKo: string;
  category: "leadership" | "science" | "philosophy" | "arts" | "society" | "business";
  birth: number;
  death: number;
  nationality: string;
}

const GIANTS_TO_ADD: GiantMetadata[] = [
  // 리더십 (14명)
  { slug: "charlemagne", nameEn: "Charlemagne", nameKo: "샤를마뉴", category: "leadership", birth: 742, death: 814, nationality: "Frankish" },
  { slug: "akbar-the-great", nameEn: "Akbar the Great", nameKo: "악바르 대제", category: "leadership", birth: 1542, death: 1605, nationality: "Mughal" },
  { slug: "pachacuti", nameEn: "Pachacuti", nameKo: "파차쿠티", category: "leadership", birth: 1418, death: 1471, nationality: "Incan" },
  { slug: "queen-nzinga", nameEn: "Queen Nzinga", nameKo: "은징가 여왕", category: "leadership", birth: 1583, death: 1663, nationality: "Angolan" },
  { slug: "ramesses-ii", nameEn: "Ramesses II", nameKo: "람세스 2세", category: "leadership", birth: -1303, death: -1213, nationality: "Egyptian" },
  { slug: "cyrus-the-great", nameEn: "Cyrus the Great", nameKo: "키루스 대왕", category: "leadership", birth: -600, death: -530, nationality: "Persian" },
  { slug: "queen-elizabeth-i", nameEn: "Queen Elizabeth I", nameKo: "엘리자베스 1세", category: "leadership", birth: 1533, death: 1603, nationality: "British" },
  { slug: "frederick-the-great", nameEn: "Frederick the Great", nameKo: "프리드리히 대왕", category: "leadership", birth: 1712, death: 1786, nationality: "Prussian" },
  { slug: "william-the-conqueror", nameEn: "William the Conqueror", nameKo: "정복왕 윌리엄", category: "leadership", birth: 1028, death: 1087, nationality: "Norman-English" },
  { slug: "giuseppe-garibaldi", nameEn: "Giuseppe Garibaldi", nameKo: "주세페 가리발디", category: "leadership", birth: 1807, death: 1882, nationality: "Italian" },
  { slug: "hatshepsut", nameEn: "Hatshepsut", nameKo: "하트셉수트", category: "leadership", birth: -1507, death: -1458, nationality: "Egyptian" },
  { slug: "zenobia", nameEn: "Zenobia", nameKo: "제노비아", category: "leadership", birth: 240, death: 274, nationality: "Palmyrene" },
  { slug: "moctezuma-ii", nameEn: "Moctezuma II", nameKo: "몬테수마 2세", category: "leadership", birth: 1466, death: 1520, nationality: "Aztec" },
  { slug: "tran-hung-dao", nameEn: "Tran Hung Dao", nameKo: "쩐흥다오", category: "leadership", birth: 1228, death: 1300, nationality: "Vietnamese" },
  // 과학 (6명)
  { slug: "michael-faraday", nameEn: "Michael Faraday", nameKo: "마이클 패러데이", category: "science", birth: 1791, death: 1867, nationality: "British" },
  { slug: "james-clerk-maxwell", nameEn: "James Clerk Maxwell", nameKo: "제임스 맥스웰", category: "science", birth: 1831, death: 1879, nationality: "Scottish" },
  { slug: "edward-jenner", nameEn: "Edward Jenner", nameKo: "에드워드 제너", category: "science", birth: 1749, death: 1823, nationality: "British" },
  { slug: "erwin-schrodinger", nameEn: "Erwin Schrödinger", nameKo: "에르빈 슈뢰딩거", category: "science", birth: 1887, death: 1961, nationality: "Austrian" },
  { slug: "james-hutton", nameEn: "James Hutton", nameKo: "제임스 허튼", category: "science", birth: 1726, death: 1797, nationality: "Scottish" },
  { slug: "georges-cuvier", nameEn: "Georges Cuvier", nameKo: "조르주 퀴비에", category: "science", birth: 1769, death: 1832, nationality: "French" },
  // 철학 (8명)
  { slug: "epicurus", nameEn: "Epicurus", nameKo: "에피쿠로스", category: "philosophy", birth: -341, death: -270, nationality: "Greek" },
  { slug: "diogenes", nameEn: "Diogenes", nameKo: "디오게네스", category: "philosophy", birth: -412, death: -323, nationality: "Greek" },
  { slug: "heraclitus", nameEn: "Heraclitus", nameKo: "헤라클레이토스", category: "philosophy", birth: -535, death: -475, nationality: "Greek" },
  { slug: "pythagoras", nameEn: "Pythagoras", nameKo: "피타고라스", category: "philosophy", birth: -570, death: -495, nationality: "Greek" },
  { slug: "plotinus", nameEn: "Plotinus", nameKo: "플로티노스", category: "philosophy", birth: 204, death: 270, nationality: "Roman-Egyptian" },
  { slug: "john-stuart-mill", nameEn: "John Stuart Mill", nameKo: "존 스튜어트 밀", category: "philosophy", birth: 1806, death: 1873, nationality: "British" },
  { slug: "gottfried-leibniz", nameEn: "Gottfried Leibniz", nameKo: "고트프리트 라이프니츠", category: "philosophy", birth: 1646, death: 1716, nationality: "German" },
  { slug: "meister-eckhart", nameEn: "Meister Eckhart", nameKo: "마이스터 에크하르트", category: "philosophy", birth: 1260, death: 1328, nationality: "German" },
  // 문학·예술 (10명)
  { slug: "homer", nameEn: "Homer", nameKo: "호메로스", category: "arts", birth: -800, death: -701, nationality: "Greek" },
  { slug: "virgil", nameEn: "Virgil", nameKo: "베르길리우스", category: "arts", birth: -70, death: -19, nationality: "Roman" },
  { slug: "jane-austen", nameEn: "Jane Austen", nameKo: "제인 오스틴", category: "arts", birth: 1775, death: 1817, nationality: "British" },
  { slug: "charles-dickens", nameEn: "Charles Dickens", nameKo: "찰스 디킨스", category: "arts", birth: 1812, death: 1870, nationality: "British" },
  { slug: "rembrandt", nameEn: "Rembrandt", nameKo: "렘브란트", category: "arts", birth: 1606, death: 1669, nationality: "Dutch" },
  { slug: "francisco-de-goya", nameEn: "Francisco de Goya", nameKo: "프란시스코 고야", category: "arts", birth: 1746, death: 1828, nationality: "Spanish" },
  { slug: "franz-schubert", nameEn: "Franz Schubert", nameKo: "프란츠 슈베르트", category: "arts", birth: 1797, death: 1828, nationality: "Austrian" },
  { slug: "george-eliot", nameEn: "George Eliot", nameKo: "조지 엘리엇", category: "arts", birth: 1819, death: 1880, nationality: "British" },
  { slug: "emily-dickinson", nameEn: "Emily Dickinson", nameKo: "에밀리 디킨슨", category: "arts", birth: 1830, death: 1886, nationality: "American" },
  { slug: "henrik-ibsen", nameEn: "Henrik Ibsen", nameKo: "헨리크 입센", category: "arts", birth: 1828, death: 1906, nationality: "Norwegian" },
  // 인권·사회 (6명)
  { slug: "dorothea-dix", nameEn: "Dorothea Dix", nameKo: "도로시아 딕스", category: "society", birth: 1802, death: 1887, nationality: "American" },
  { slug: "clara-barton", nameEn: "Clara Barton", nameKo: "클라라 바턴", category: "society", birth: 1821, death: 1912, nationality: "American" },
  { slug: "ida-b-wells", nameEn: "Ida B. Wells", nameKo: "아이다 B. 웰스", category: "society", birth: 1862, death: 1931, nationality: "American" },
  { slug: "elizabeth-cady-stanton", nameEn: "Elizabeth Cady Stanton", nameKo: "엘리자베스 케이디 스탠턴", category: "society", birth: 1815, death: 1902, nationality: "American" },
  { slug: "harriet-martineau", nameEn: "Harriet Martineau", nameKo: "해리엇 마티노", category: "society", birth: 1802, death: 1876, nationality: "British" },
  { slug: "olympe-de-gouges", nameEn: "Olympe de Gouges", nameKo: "올랭프 드 구주", category: "society", birth: 1748, death: 1793, nationality: "French" },
  // 탐험·비즈니스 (6명)
  { slug: "james-cook", nameEn: "James Cook", nameKo: "제임스 쿡", category: "business", birth: 1728, death: 1779, nationality: "British" },
  { slug: "bartolomeu-dias", nameEn: "Bartolomeu Dias", nameKo: "바르톨로뮤 디아스", category: "business", birth: 1450, death: 1500, nationality: "Portuguese" },
  { slug: "ernest-shackleton", nameEn: "Ernest Shackleton", nameKo: "어니스트 섀클턴", category: "business", birth: 1874, death: 1922, nationality: "British" },
  { slug: "henry-hudson", nameEn: "Henry Hudson", nameKo: "헨리 허드슨", category: "business", birth: 1565, death: 1611, nationality: "British" },
  { slug: "vitus-bering", nameEn: "Vitus Bering", nameKo: "비투스 베링", category: "business", birth: 1681, death: 1741, nationality: "Danish-Russian" },
  { slug: "roald-amundsen", nameEn: "Roald Amundsen", nameKo: "로알 아문센", category: "business", birth: 1872, death: 1928, nationality: "Norwegian" }
];

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

// Generate unified prompt for both metadata translations and narratives
function getPrompt(giant: GiantMetadata): string {
  return `You are an expert historian and localization editor.
Create a comprehensive profile for the historical figure:
Name: ${giant.nameEn} (Korean name: ${giant.nameKo})
Slug: ${giant.slug}
Category: ${giant.category}
Lifespan: ${giant.birth} to ${giant.death}
Nationality: ${giant.nationality}

Generate a single JSON object containing both UI translations ("messages") and the historical narrative ("epic"). 
Ensure all fields are filled, and do not include any markdown styling or wrapper text. Only return the raw JSON object.

Strict historical requirements:
- Use accurate, verified historical details. Do not fictionalize.
- Ensure the quote is historically documented.
- The tone of "chatGreeting" and "persona" must deeply reflect the person's real character and historical style.
- No AI clichés. Do not say "as an AI..." or "as a virtual..."
- "epic_ko" must be a long-form, moving narrative of their life (minimum 500 characters, formatted with exactly 4 or more H3 subtitles like "### 1. ...\\n\\n...").
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
      "name": "${giant.nameKo}",
      "title": "Historical Title/Tag (e.g. 19세기 양자물리학의 선구자)",
      "headline": "Powerful headline/hook (within 15 characters)",
      "shortDescription": "2-3 sentence introduction",
      "quote": "Most famous quote in Korean",
      "chatGreeting": "Persona-appropriate chat greeting (2-3 sentences)",
      "suggestedQuestions": ["Question 1", "Question 2", "Question 3"],
      "era": "Historical Era (e.g. 19세기)",
      "pain": "Struggles in life",
      "recovery": "How they overcame struggles"
    },
    "en": {
      "name": "${giant.nameEn}",
      "title": "Title (e.g., Pioneer of Quantum Physics)",
      "headline": "Headline (within 15 words)",
      "shortDescription": "2-3 sentence introduction",
      "quote": "Most famous quote in English",
      "chatGreeting": "Greeting (2-3 sentences)",
      "suggestedQuestions": ["Question 1", "Question 2", "Question 3"],
      "era": "Era (e.g. 19th Century)",
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

// Function to call API, trying Vertex AI first, and falling back to Google Generative AI (AI Studio)
async function callGenerativeAPI(prompt: string): Promise<string> {
  const modelId = "gemini-2.5-flash-lite";
  
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
      temperature: 0.7,
    }
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Clean JSON response from potential markdown formatting wrappers
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

// Ensure there are no placeholder characters or bad encodings
function sanitizeString(str: string): string {
  return str.replace(/\ufffd/g, "");
}

async function main() {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");
  const outputPath = path.resolve(process.cwd(), "scripts/new-giants-50.json");
  let generatedData: Record<string, any> = {};

  if (fs.existsSync(outputPath)) {
    try {
      generatedData = JSON.parse(fs.readFileSync(outputPath, "utf8"));
      console.log(`Loaded ${Object.keys(generatedData).length} already generated giants.`);
    } catch (e) {
      console.error("Failed to parse existing new-giants-50.json, starting fresh.");
    }
  }

  let count = 0;
  for (const giant of GIANTS_TO_ADD) {
    if (generatedData[giant.slug]) {
      console.log(`[Skip] ${giant.slug} already generated.`);
      continue;
    }

    console.log(`\nGenerating data for: ${giant.nameEn} (${giant.slug}) [${++count}/${GIANTS_TO_ADD.length}]...`);
    const prompt = getPrompt(giant);
    
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

        generatedData[giant.slug] = { ...parsed, category: giant.category };
        
        // Save after each giant to protect progress
        fs.writeFileSync(outputPath, JSON.stringify(generatedData, null, 2), "utf8");
        console.log(`[Success] Generated and saved ${giant.slug}`);
        success = true;
      } catch (err: any) {
        console.error(`[Error] Attempt ${attempts} failed for ${giant.slug}:`, err.message);
        await sleep(2000);
      }
    }

    if (!success) {
      console.error(`[Fatal] Failed to generate ${giant.slug} after 3 attempts. Aborting.`);
      process.exit(1);
    }

    // Sleep to respect API rate limits
    await sleep(2000);
  }

  console.log("\n=== ALL DATA GENERATION COMPLETED SUCCESSFULLY ===");
}

main().catch(console.error);
