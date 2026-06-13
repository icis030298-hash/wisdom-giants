const { VertexAI } = require('@google-cloud/vertexai');
const path = require('path');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('google-service-account.json');

const sa = JSON.parse(fs.readFileSync('google-service-account.json', 'utf8'));
const projectId = sa.project_id;

const v = new VertexAI({
  project: projectId,
  location: 'us-central1'
});

const giant = { slug: "sundiata-keita", nameEn: "Sundiata Keita", nameKo: "순자타 케이타", category: "leadership", birth: 1217, death: 1255, nationality: "Malian" };

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
      "name": "Name in Japanese",
      "title": "Title in Japanese",
      "headline": "Headline in Japanese",
      "shortDescription": "Intro in Japanese",
      "quote": "Quote in Japanese",
      "chatGreeting": "Greeting in Japanese",
      "suggestedQuestions": ["Q1", "Q2", "Q3"],
      "era": "Era in Japanese",
      "pain": "Struggles in Japanese",
      "recovery": "Overcoming in Japanese"
    },
    // Same structure for: de, es, fr, it, pt, ar, hi, ru, zh
  },
  "epic": {
    "category": "${giant.category}",
    "birth": ${giant.birth},
    "death": ${giant.death},
    "epic_ko": "Long-form Korean narrative...",
    "epic_en": "Long-form English narrative...",
    "epic_de": "Long-form German narrative...",
    "epic_ja": "Long-form Japanese narrative...",
    "epic_es": "Long-form Spanish narrative...",
    "epic_fr": "Long-form French narrative...",
    "epic_it": "Long-form Italian narrative...",
    "epic_pt": "Long-form Portuguese narrative...",
    "epic_ar": "Long-form Arabic narrative...",
    "epic_hi": "Long-form Hindi narrative...",
    "epic_ru": "Long-form Russian narrative...",
    "epic_zh": "Long-form Chinese narrative...",
    "trials_ko": "Struggles in detail (Korean)",
    "trials_en": "Struggles in detail (English)",
    "overcoming_ko": "Overcoming in detail (Korean)",
    "overcoming_en": "Overcoming in detail (English)",
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

async function test() {
  console.log('Calling Vertex AI...');
  const m = v.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    }
  });
  const prompt = getPrompt(giant);
  try {
    const result = await m.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw text length:', text.length);
    fs.writeFileSync('scratch/raw-response.txt', text, 'utf8');
    console.log('Saved raw response to scratch/raw-response.txt');
    
    // Attempt parse
    JSON.parse(text);
    console.log('JSON parsed successfully!');
  } catch (e) {
    console.log('Error parsing JSON:', e.message);
  }
}

test();
