const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: ".env.local" });

const GIANTS_TO_ADD = [
  { slug: "cicero", nameEn: "Cicero", nameKo: "키케로", category: "philosophy", birth: -106, death: -43, nationality: "Roman" },
  { slug: "sophocles", nameEn: "Sophocles", nameKo: "소포클레스", category: "arts", birth: -497, death: -406, nationality: "Greek" },
  { slug: "euclid", nameEn: "Euclid", nameKo: "유클리드", category: "science", birth: -325, death: -265, nationality: "Greek" }
];

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"];

function getPrompt(giant) {
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
      "era": "Historical Era (e.g. 기원전 1세기)",
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
      "era": "Era (e.g. 1st Century BC)",
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

async function callGenerativeAPI(prompt) {
  const modelId = "gemini-2.5-flash-lite";
  
  const v = new VertexAI({
    project: process.env.GCP_PROJECT_ID || 'giantswisdom-8dc26',
    location: 'us-central1'
  });
  const model = v.getGenerativeModel({
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
    text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
  
  if (!text || text.trim().length === 0) {
    throw new Error("Empty response from Vertex AI");
  }
  return text;
}

function cleanJSON(text) {
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

function sanitizeString(str) {
  return str.replace(/\ufffd/g, "");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");
  const outputPath = path.resolve(process.cwd(), "scratch/new-giants-3.json");
  let generatedData = {};

  let count = 0;
  for (const giant of GIANTS_TO_ADD) {
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

        // Deep sanitize strings and strip Korean characters from non-ko locales if leaked
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
              m.suggestedQuestions = m.suggestedQuestions.map(q => sanitizeString(q));
            }
            // Strict sanitization of Korean leaks for non-ko locales
            if (loc !== "ko") {
              const koreanRegex = /[\uAC00-\uD7A3]/g;
              m.name = m.name.replace(koreanRegex, "").replace(/\s*\(\s*\)\s*/g, " ").trim();
              m.title = m.title.replace(koreanRegex, "").trim();
              m.headline = m.headline.replace(koreanRegex, "").trim();
              m.shortDescription = m.shortDescription.replace(koreanRegex, "").trim();
              m.quote = m.quote.replace(koreanRegex, "").trim();
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
          ep.wisdom = ep.wisdom.map(w => ({
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
      } catch (err) {
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

  console.log("\n=== 3 NEW GIANTS DATA GENERATION COMPLETED SUCCESSFULLY ===");
}

main().catch(console.error);
