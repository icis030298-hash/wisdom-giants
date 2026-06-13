import { getVertexAIInstance } from "../src/lib/vertexai";
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
  // [정치·리더십] (8명) - augustus-caesar (중복), yi-sun-sin (중복) 제외됨
  { slug: "eleanor-of-aquitaine", nameEn: "Eleanor of Aquitaine", nameKo: "알리에노르 다키텐", category: "leadership", birth: 1122, death: 1204, nationality: "French-English" },
  { slug: "sundiata-keita", nameEn: "Sundiata Keita", nameKo: "순자타 케이타", category: "leadership", birth: 1217, death: 1255, nationality: "Malian" },
  { slug: "peter-the-great", nameEn: "Peter the Great", nameKo: "표트르 대제", category: "leadership", birth: 1672, death: 1725, nationality: "Russian" },
  { slug: "catherine-the-great", nameEn: "Catherine the Great", nameKo: "예카테리나 대제", category: "leadership", birth: 1729, death: 1796, nationality: "Russian-German" },
  { slug: "maria-theresa", nameEn: "Maria Theresa", nameKo: "마리아 테레지아", category: "leadership", birth: 1717, death: 1780, nationality: "Austrian" },
  { slug: "boudicca", nameEn: "Boudicca", nameKo: "부디카", category: "leadership", birth: 30, death: 61, nationality: "British" },
  { slug: "ching-shih", nameEn: "Ching Shih", nameKo: "정일수", category: "leadership", birth: 1775, death: 1844, nationality: "Chinese" },
  { slug: "askia-the-great", nameEn: "Askia the Great", nameKo: "아스키아 대제", category: "leadership", birth: 1443, death: 1538, nationality: "Songhai" },

  // [과학·혁신] (12명) - al-biruni ~ alfred-russel-wallace (10명) + pierre-curie (예비), charles-lyell (예비)
  { slug: "al-biruni", nameEn: "Al-Biruni", nameKo: "알비루니", category: "science", birth: 973, death: 1048, nationality: "Persian" },
  { slug: "william-harvey", nameEn: "William Harvey", nameKo: "윌리엄 하비", category: "science", birth: 1578, death: 1657, nationality: "British" },
  { slug: "joseph-priestley", nameEn: "Joseph Priestley", nameKo: "조지프 프리스틀리", category: "science", birth: 1733, death: 1804, nationality: "British" },
  { slug: "carl-linnaeus", nameEn: "Carl Linnaeus", nameKo: "칼 린나이우스", category: "science", birth: 1707, death: 1778, nationality: "Swedish" },
  { slug: "lise-meitner", nameEn: "Lise Meitner", nameKo: "리제 마이트너", category: "science", birth: 1878, death: 1968, nationality: "Austrian-Swedish" },
  { slug: "emmy-noether", nameEn: "Emmy Noether", nameKo: "에미 뇌터", category: "science", birth: 1882, death: 1935, nationality: "German" },
  { slug: "alexander-von-humboldt", nameEn: "Alexander von Humboldt", nameKo: "알렉산더 폰 훔볼트", category: "science", birth: 1769, death: 1859, nationality: "German" },
  { slug: "tycho-brahe", nameEn: "Tycho Brahe", nameKo: "튀코 브라헤", category: "science", birth: 1546, death: 1601, nationality: "Danish" },
  { slug: "john-muir", nameEn: "John Muir", nameKo: "존 뮤어", category: "science", birth: 1838, death: 1914, nationality: "Scottish-American" },
  { slug: "alfred-russel-wallace", nameEn: "Alfred Russel Wallace", nameKo: "앨프리드 러셀 월리스", category: "science", birth: 1823, death: 1913, nationality: "British" },
  { slug: "pierre-curie", nameEn: "Pierre Curie", nameKo: "피에르 퀴리", category: "science", birth: 1859, death: 1906, nationality: "French" },
  { slug: "charles-lyell", nameEn: "Charles Lyell", nameKo: "찰스 라이엘", category: "science", birth: 1797, death: 1875, nationality: "British" },

  // [철학·사상] (10명) - al-farabi ~ ernst-mach (9명) + william-tyndale (예비)
  { slug: "al-farabi", nameEn: "Al-Farabi", nameKo: "알파라비", category: "philosophy", birth: 872, death: 950, nationality: "Kazakh-Persian" },
  { slug: "thomas-more", nameEn: "Thomas More", nameKo: "토마스 모어", category: "philosophy", birth: 1478, death: 1535, nationality: "British" },
  { slug: "simone-weil", nameEn: "Simone Weil", nameKo: "시몬 베유", category: "philosophy", birth: 1909, death: 1943, nationality: "French" },
  { slug: "antonio-gramsci", nameEn: "Antonio Gramsci", nameKo: "안토니오 그람시", category: "philosophy", birth: 1891, death: 1937, nationality: "Italian" },
  { slug: "rosa-luxemburg", nameEn: "Rosa Luxemburg", nameKo: "로자 룩셈부르크", category: "philosophy", birth: 1871, death: 1919, nationality: "German-Polish" },
  { slug: "george-santayana", nameEn: "George Santayana", nameKo: "조지 산타야나", category: "philosophy", birth: 1863, death: 1952, nationality: "Spanish-American" },
  { slug: "henri-bergson", nameEn: "Henri Bergson", nameKo: "앙리 베르그송", category: "philosophy", birth: 1859, death: 1941, nationality: "French" },
  { slug: "william-of-ockham", nameEn: "William of Ockham", nameKo: "오컴의 윌리엄", category: "philosophy", birth: 1287, death: 1347, nationality: "British" },
  { slug: "ernst-mach", nameEn: "Ernst Mach", nameKo: "에른스트 마흐", category: "philosophy", birth: 1838, death: 1916, nationality: "Austrian" },
  { slug: "william-tyndale", nameEn: "William Tyndale", nameKo: "윌리엄 틴들", category: "philosophy", birth: 1494, death: 1536, nationality: "British" },

  // [문학·예술] (18명) - chaucer ~ rudyard-kipling (16명) + dorothea-lange (예비), clara-schumann (예비)
  { slug: "chaucer", nameEn: "Geoffrey Chaucer", nameKo: "제프리 초서", category: "arts", birth: 1343, death: 1400, nationality: "British" },
  { slug: "jonathan-swift", nameEn: "Jonathan Swift", nameKo: "조너선 스위프트", category: "arts", birth: 1667, death: 1745, nationality: "Irish" },
  { slug: "george-sand", nameEn: "George Sand", nameKo: "조르주 상", category: "arts", birth: 1804, death: 1876, nationality: "French" },
  { slug: "paul-cezanne", nameEn: "Paul Cézanne", nameKo: "폴 세잔", category: "arts", birth: 1839, death: 1906, nationality: "French" },
  { slug: "auguste-rodin", nameEn: "Auguste Rodin", nameKo: "오귀스트 로댕", category: "arts", birth: 1840, death: 1917, nationality: "French" },
  { slug: "claude-debussy", nameEn: "Claude Debussy", nameKo: "클로드 드뷔시", category: "arts", birth: 1862, death: 1918, nationality: "French" },
  { slug: "virginia-woolf", nameEn: "Virginia Woolf", nameKo: "버지니아 울프", category: "arts", birth: 1882, death: 1941, nationality: "British" },
  { slug: "franz-kafka", nameEn: "Franz Kafka", nameKo: "프란츠 카프카", category: "arts", birth: 1883, death: 1924, nationality: "Czech-Austrian" },
  { slug: "james-joyce", nameEn: "James Joyce", nameKo: "제임스 조이스", category: "arts", birth: 1882, death: 1941, nationality: "Irish" },
  { slug: "giacomo-puccini", nameEn: "Giacomo Puccini", nameKo: "자코모 푸치니", category: "arts", birth: 1858, death: 1924, nationality: "Italian" },
  { slug: "charles-baudelaire", nameEn: "Charles Baudelaire", nameKo: "샤를 보들레르", category: "arts", birth: 1821, death: 1867, nationality: "French" },
  { slug: "wassily-kandinsky", nameEn: "Wassily Kandinsky", nameKo: "바실리 칸딘스키", category: "arts", birth: 1866, death: 1944, nationality: "Russian" },
  { slug: "paul-gauguin", nameEn: "Paul Gauguin", nameKo: "폴 고갱", category: "arts", birth: 1848, death: 1903, nationality: "French" },
  { slug: "william-blake", nameEn: "William Blake", nameKo: "윌리엄 블레이크", category: "arts", birth: 1757, death: 1827, nationality: "British" },
  { slug: "hans-christian-andersen", nameEn: "Hans Christian Andersen", nameKo: "한스 크리스티안 안데르센", category: "arts", birth: 1805, death: 1875, nationality: "Danish" },
  { slug: "rudyard-kipling", nameEn: "Rudyard Kipling", nameKo: "러디어드 키플링", category: "arts", birth: 1865, death: 1936, nationality: "British-Indian" },
  { slug: "dorothea-lange", nameEn: "Dorothea Lange", nameKo: "도로시어 랭", category: "arts", birth: 1895, death: 1965, nationality: "American" },
  { slug: "clara-schumann", nameEn: "Clara Schumann", nameKo: "클라라 슈만", category: "arts", birth: 1819, death: 1896, nationality: "German" },

  // [인권·사회] (7명)
  { slug: "jane-addams", nameEn: "Jane Addams", nameKo: "제인 애덤스", category: "society", birth: 1860, death: 1935, nationality: "American" },
  { slug: "maria-montessori", nameEn: "Maria Montessori", nameKo: "마리아 몬테소리", category: "society", birth: 1870, death: 1952, nationality: "Italian" },
  { slug: "william-lloyd-garrison", nameEn: "William Lloyd Garrison", nameKo: "윌리엄 로이드 개리슨", category: "society", birth: 1805, death: 1879, nationality: "American" },
  { slug: "albert-schweitzer", nameEn: "Albert Schweitzer", nameKo: "알베르트 슈바이처", category: "society", birth: 1875, death: 1965, nationality: "German-French" },
  { slug: "pandita-ramabai", nameEn: "Pandita Ramabai", nameKo: "판디타 라마바이", category: "society", birth: 1858, death: 1922, nationality: "Indian" },
  { slug: "elizabeth-blackwell", nameEn: "Elizabeth Blackwell", nameKo: "엘리자베스 블랙웰", category: "society", birth: 1821, death: 1910, nationality: "British-American" },
  { slug: "florence-kelley", nameEn: "Florence Kelley", nameKo: "플로렌스 켈리", category: "society", birth: 1859, death: 1932, nationality: "American" },

  // [탐험·비즈니스] (6명)
  { slug: "david-livingstone", nameEn: "David Livingstone", nameKo: "데이비드 리빙스턴", category: "business", birth: 1813, death: 1873, nationality: "Scottish" },
  { slug: "alfred-nobel", nameEn: "Alfred Nobel", nameKo: "알프레드 노벨", category: "business", birth: 1833, death: 1896, nationality: "Swedish" },
  { slug: "pierre-de-coubertin", nameEn: "Pierre de Coubertin", nameKo: "피에르 드 쿠베르탱", category: "business", birth: 1863, death: 1937, nationality: "French" },
  { slug: "fridtjof-nansen", nameEn: "Fridtjof Nansen", nameKo: "프리드쇼프 난센", category: "business", birth: 1861, death: 1930, nationality: "Norwegian" },
  { slug: "george-eastman", nameEn: "George Eastman", nameKo: "조지 이스트먼", category: "business", birth: 1854, death: 1932, nationality: "American" },
  { slug: "elisha-otis", nameEn: "Elisha Otis", nameKo: "엘리샤 오티스", category: "business", birth: 1811, death: 1861, nationality: "American" },
  { slug: "jang-yeong-sil", nameEn: "Jang Yeong-sil", nameKo: "장영실", category: "science", birth: 1390, death: 1450, nationality: "Korean" },
  { slug: "yun-dong-ju", nameEn: "Yun Dong-ju", nameKo: "윤동주", category: "arts", birth: 1917, death: 1945, nationality: "Korean" }
];

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

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
      "title": "Historical Title/Tag",
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
      "title": "Title",
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

async function callGenerativeAPI(prompt: string): Promise<string> {
  const modelId = "gemini-2.5-flash-lite";
  
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
  
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response from Vertex AI");
  }
  return text;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function main() {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");
  const outputPath = path.resolve(process.cwd(), "scripts/new-giants-59.json");
  let generatedData: Record<string, any> = {};

  if (fs.existsSync(outputPath)) {
    try {
      generatedData = JSON.parse(fs.readFileSync(outputPath, "utf8"));
      console.log(`Loaded ${Object.keys(generatedData).length} already generated giants.`);
    } catch (e) {
      console.error("Failed to parse existing new-giants-59.json, starting fresh.");
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
        
        fs.writeFileSync(outputPath, JSON.stringify(generatedData, null, 2), "utf8");
        console.log(`[Success] Generated and saved ${giant.slug}`);
        success = true;
      } catch (err: any) {
        console.error(`[Error] Attempt ${attempts} failed for ${giant.slug}:`, err.message);
        await sleep(3000);
      }
    }

    if (!success) {
      console.error(`[Fatal] Failed to generate ${giant.slug} after 3 attempts. Aborting.`);
      process.exit(1);
    }

    await sleep(2000);
  }

  console.log("\n=== ALL DATA GENERATION COMPLETED SUCCESSFULLY ===");
}

main().catch(console.error);
