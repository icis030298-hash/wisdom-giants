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
  { slug: "max-planck", nameEn: "Max Planck", nameKo: "막스 플랑크", category: "science", birth: 1858, death: 1947, nationality: "German" },
  { slug: "hypatia", nameEn: "Hypatia", nameKo: "히파티아", category: "science", birth: 360, death: 415, nationality: "Greek" },
  { slug: "ibn-al-haytham", nameEn: "Ibn al-Haytham", nameKo: "이븐 알하이삼", category: "science", birth: 965, death: 1040, nationality: "Arab" },
  { slug: "blaise-pascal", nameEn: "Blaise Pascal", nameKo: "블레즈 파스칼", category: "science", birth: 1623, death: 1662, nationality: "French" },
  { slug: "dmitri-mendeleev", nameEn: "Dmitri Mendeleev", nameKo: "드미트리 멘델레예프", category: "science", birth: 1834, death: 1907, nationality: "Russian" },
  { slug: "ada-lovelace", nameEn: "Ada Lovelace", nameKo: "에이다 러블레이스", category: "science", birth: 1815, death: 1852, nationality: "British" },
  { slug: "alan-turing", nameEn: "Alan Turing", nameKo: "앨런 튜링", category: "science", birth: 1912, death: 1954, nationality: "British" },
  { slug: "charles-babbage", nameEn: "Charles Babbage", nameKo: "찰스 배비지", category: "science", birth: 1791, death: 1871, nationality: "British" },
  { slug: "ibn-sina", nameEn: "Ibn Sina", nameKo: "이븐 시나", category: "science", birth: 980, death: 1037, nationality: "Persian" },
  { slug: "james-watt", nameEn: "James Watt", nameKo: "제임스 와트", category: "science", birth: 1736, death: 1819, nationality: "Scottish" },
  { slug: "george-stephenson", nameEn: "George Stephenson", nameKo: "조지 스티븐슨", category: "science", birth: 1781, death: 1848, nationality: "British" },
  { slug: "gregor-mendel", nameEn: "Gregor Mendel", nameKo: "그레고어 멘델", category: "science", birth: 1822, death: 1884, nationality: "Austrian" },
  { slug: "antoine-lavoisier", nameEn: "Antoine Lavoisier", nameKo: "앙투안 라부아지에", category: "science", birth: 1743, death: 1794, nationality: "French" },
  { slug: "li-shizhen", nameEn: "Li Shizhen", nameKo: "이시진", category: "science", birth: 1518, death: 1593, nationality: "Chinese" },
  { slug: "guglielmo-marconi", nameEn: "Guglielmo Marconi", nameKo: "구글리엘모 마르코니", category: "science", birth: 1874, death: 1937, nationality: "Italian" },
  { slug: "robert-koch", nameEn: "Robert Koch", nameKo: "로베르트 코흐", category: "science", birth: 1843, death: 1910, nationality: "German" },
  { slug: "thomas-aquinas", nameEn: "Thomas Aquinas", nameKo: "토마스 아퀴나스", category: "philosophy", birth: 1225, death: 1274, nationality: "Italian" },
  { slug: "rumi", nameEn: "Rumi", nameKo: "루미", category: "philosophy", birth: 1207, death: 1273, nationality: "Persian" },
  { slug: "ibn-rushd", nameEn: "Ibn Rushd", nameKo: "이븐 루시드", category: "philosophy", birth: 1126, death: 1198, nationality: "Arab" },
  { slug: "william-james", nameEn: "William James", nameKo: "윌리엄 제임스", category: "philosophy", birth: 1842, death: 1910, nationality: "American" },
  { slug: "friedrich-schiller", nameEn: "Friedrich Schiller", nameKo: "프리드리히 실러", category: "philosophy", birth: 1759, death: 1805, nationality: "German" },
  { slug: "george-washington-carver", nameEn: "George Washington Carver", nameKo: "조지 워싱턴 카버", category: "philosophy", birth: 1864, death: 1943, nationality: "American" },
  { slug: "al-ghazali", nameEn: "Al-Ghazali", nameKo: "알 가잘리", category: "philosophy", birth: 1058, death: 1111, nationality: "Persian" },
  { slug: "ibn-khaldun", nameEn: "Ibn Khaldun", nameKo: "이븐 할둔", category: "philosophy", birth: 1332, death: 1406, nationality: "Arab" },
  { slug: "maimonides", nameEn: "Maimonides", nameKo: "마이모니데스", category: "philosophy", birth: 1135, death: 1204, nationality: "Jewish" },
  { slug: "zoroaster", nameEn: "Zoroaster", nameKo: "조로아스터", category: "philosophy", birth: -1000, death: -900, nationality: "Persian" },
  { slug: "miguel-de-cervantes", nameEn: "Miguel de Cervantes", nameKo: "미겔 데 세르반테스", category: "arts", birth: 1547, death: 1616, nationality: "Spanish" },
  { slug: "leo-tolstoy", nameEn: "Leo Tolstoy", nameKo: "레오 톨스토이", category: "arts", birth: 1828, death: 1910, nationality: "Russian" },
  { slug: "murasaki-shikibu", nameEn: "Murasaki Shikibu", nameKo: "무라사키 시키부", category: "arts", birth: 973, death: 1014, nationality: "Japanese" },
  { slug: "edgar-degas", nameEn: "Edgar Degas", nameKo: "에드가 드가", category: "arts", birth: 1834, death: 1917, nationality: "French" },
  { slug: "oscar-wilde", nameEn: "Oscar Wilde", nameKo: "오스카 와일드", category: "arts", birth: 1854, death: 1900, nationality: "Irish" },
  { slug: "rabindranath-tagore", nameEn: "Rabindranath Tagore", nameKo: "라빈드라나트 타고르", category: "arts", birth: 1861, death: 1941, nationality: "Indian" },
  { slug: "sor-juana-ines-de-la-cruz", nameEn: "Sor Juana Ines de la Cruz", nameKo: "소르 후아나 이네스 데 라 크루스", category: "arts", birth: 1648, death: 1695, nationality: "Mexican" },
  { slug: "li-qingzhao", nameEn: "Li Qingzhao", nameKo: "이청조", category: "arts", birth: 1084, death: 1155, nationality: "Chinese" },
  { slug: "matsuo-basho", nameEn: "Matsuo Basho", nameKo: "마쓰오 바쇼", category: "arts", birth: 1644, death: 1694, nationality: "Japanese" },
  { slug: "william-wilberforce", nameEn: "William Wilberforce", nameKo: "윌리엄 윌버포스", category: "society", birth: 1759, death: 1833, nationality: "British" },
  { slug: "toussaint-louverture", nameEn: "Toussaint Louverture", nameKo: "투생 루베르튀르", category: "society", birth: 1743, death: 1803, nationality: "Haitian" },
  { slug: "sojourner-truth", nameEn: "Sojourner Truth", nameKo: "소저너 트루스", category: "society", birth: 1797, death: 1883, nationality: "American" },
  { slug: "emmeline-pankhurst", nameEn: "Emmeline Pankhurst", nameKo: "에밀린 팽크허스트", category: "society", birth: 1858, death: 1928, nationality: "British" },
  { slug: "jose-rizal", nameEn: "Jose Rizal", nameKo: "호세 리살", category: "society", birth: 1861, death: 1896, nationality: "Filipino" },
  { slug: "mary-wollstonecraft", nameEn: "Mary Wollstonecraft", nameKo: "마리 울스턴크래프트", category: "society", birth: 1759, death: 1797, nationality: "British" },
  { slug: "lucretia-mott", nameEn: "Lucretia Mott", nameKo: "루크리셔 모트", category: "society", birth: 1793, death: 1880, nationality: "American" },
  { slug: "marco-polo", nameEn: "Marco Polo", nameKo: "마르코 폴로", category: "business", birth: 1254, death: 1324, nationality: "Italian" },
  { slug: "vasco-da-gama", nameEn: "Vasco da Gama", nameKo: "바스코 다 가마", category: "business", birth: 1460, death: 1524, nationality: "Portuguese" },
  { slug: "ferdinand-magellan", nameEn: "Ferdinand Magellan", nameKo: "페르디난드 마젤란", category: "business", birth: 1480, death: 1521, nationality: "Portuguese" },
  { slug: "cornelius-vanderbilt", nameEn: "Cornelius Vanderbilt", nameKo: "코르넬리우스 밴더빌트", category: "business", birth: 1794, death: 1877, nationality: "American" },
  { slug: "zhang-qian", nameEn: "Zhang Qian", nameKo: "장건", category: "business", birth: -164, death: -114, nationality: "Chinese" },
  { slug: "zheng-he", nameEn: "Zheng He", nameKo: "정화", category: "business", birth: 1371, death: 1433, nationality: "Chinese" },
  { slug: "leif-erikson", nameEn: "Leif Erikson", nameKo: "레이프 에릭손", category: "business", birth: 970, death: 1020, nationality: "Norse" },
  { slug: "roald-amundsen", nameEn: "Roald Amundsen", nameKo: "로알 아문센", category: "business", birth: 1872, death: 1928, nationality: "Norwegian" }
];

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt"];

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

        generatedData[giant.slug] = parsed;
        
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
