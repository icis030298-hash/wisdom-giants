import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

// Setup Vertex AI credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");
delete process.env.GEMINI_API_KEY;
delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;

process.env.GOOGLE_CLOUD_PROJECT = 'giantswisdom-8dc26';
process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';

const ai = new GoogleGenAI({
  vertexai: {
    project: 'giantswisdom-8dc26',
    location: 'us-central1'
  }
});

const LOCALES = ["ko", "en", "ja", "de", "es", "fr", "it", "pt", "ar", "hi", "ru", "zh"] as const;
const BATCH_SIZE = 25; // Process in batches of 25

// Vertex AI Gemini 2.5 Pro Pricing (per 1M tokens)
const INPUT_PRICE_PER_M = 1.25;
const OUTPUT_PRICE_PER_M = 5.00;

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
  return str.replace(/\ufffd/g, "").replace(/ {2,}/g, " ").trim();
}

function getPrompt(c: any): string {
  return `You are a historian and localization editor for the educational website "Giants Wisdom" (users chat with AI versions of historical figures).
Create a comprehensive profile for the following figure:
Name: ${c.nameEn} (Korean name: ${c.nameKo})
Slug: ${c.slug}
Region: ${c.region}
Category: Auto-select from 'leadership' | 'science' | 'philosophy' | 'arts' | 'society' | 'business'
Death Year / Lifespan: ${c.deathYear}
Bio / Selection reason: ${c.briefBio}

Generate a single JSON object containing both UI translations ("messages"), historical narratives ("epic"), Wikipedia links ("wikipediaLinks"), and verified facts ("factLayer").
Ensure all fields are filled, and do not include any markdown styling or wrapper text. Only return the raw JSON object.

Strict Historical and Formatting Requirements:
1. "epic_ko" must be a long-form, moving narrative of their life (minimum 500 characters).
2. "epic_en" must be a detailed narrative of their life in English (minimum 150 words).
3. "epic_[locale]" must be detailed narratives for all other languages.
4. IMPORTANT: All narratives (epic_ko, epic_en, epic_de, etc.) MUST be formatted as EXACTLY 4 paragraphs separated by "\\n\\n".
5. IMPORTANT: DO NOT include any headings, subheadings, or titles (like "#", "##", "###", "### 1. Title", etc.) in the epic text. It must be pure, continuous narrative paragraphs.
6. Check for double spaces or spacing anomalies in Korean and clean them.
7. Tone of "chatGreeting" and "persona" must deeply reflect the person's real character and historical style. Speak in first-person ("I").
8. Do not use AI clichés like "as an AI..." or "as a virtual..."
9. Wikipedia links must be valid, existing URLs.
10. Select the most appropriate category for the figure out of: 'leadership' | 'science' | 'philosophy' | 'arts' | 'society' | 'business'. Output this in the root level 'category' property of the JSON.

Output exact JSON format:
{
  "slug": "${c.slug}",
  "category": "leadership | science | philosophy | arts | society | business",
  "messages": {
    "ko": {
      "name": "${c.nameKo}",
      "title": "Historical Title/Tag (e.g. 19세기 양자물리학의 선구자)",
      "headline": "Powerful headline/hook (within 15 characters)",
      "shortDescription": "2-3 sentence introduction",
      "quote": "Most famous quote in Korean",
      "chatGreeting": "Persona-appropriate chat greeting (2-3 sentences, first-person)",
      "suggestedQuestions": ["Question 1", "Question 2", "Question 3"],
      "era": "Historical Era (e.g. 19세기)",
      "pain": "Struggles in life",
      "recovery": "How they overcame struggles"
    },
    "en": {
      "name": "${c.nameEn}",
      "title": "Title (e.g., Pioneer of Quantum Physics)",
      "headline": "Headline (within 15 words)",
      "shortDescription": "2-3 sentence introduction",
      "quote": "Most famous quote in English",
      "chatGreeting": "Greeting (2-3 sentences, first-person)",
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
    "de": { "name": "German name", "title": "Title", "headline": "Headline", "shortDescription": "Introduction", "quote": "Quote", "chatGreeting": "Greeting", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era", "pain": "Struggles", "recovery": "Overcoming" },
    "es": { "name": "Spanish name", "title": "Title", "headline": "Headline", "shortDescription": "Introduction", "quote": "Quote", "chatGreeting": "Greeting", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era", "pain": "Struggles", "recovery": "Overcoming" },
    "fr": { "name": "French name", "title": "Title", "headline": "Headline", "shortDescription": "Introduction", "quote": "Quote", "chatGreeting": "Greeting (using formal 'vous' form)", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era", "pain": "Struggles", "recovery": "Overcoming" },
    "it": { "name": "Italian name", "title": "Title", "headline": "Headline", "shortDescription": "Introduction", "quote": "Quote", "chatGreeting": "Greeting (using formal 'Lei' form)", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era", "pain": "Struggles", "recovery": "Overcoming" },
    "pt": { "name": "Portuguese name", "title": "Title", "headline": "Headline", "shortDescription": "Introduction", "quote": "Quote", "chatGreeting": "Greeting", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era", "pain": "Struggles", "recovery": "Overcoming" },
    "ar": { "name": "Arabic name (in Arabic)", "title": "Title in Arabic", "headline": "Headline in Arabic", "shortDescription": "Introduction in Arabic", "quote": "Quote in Arabic", "chatGreeting": "Greeting in Arabic", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era in Arabic", "pain": "Struggles in Arabic", "recovery": "Overcoming in Arabic" },
    "hi": { "name": "Hindi name (in Devanagari)", "title": "Title in Hindi", "headline": "Headline in Hindi", "shortDescription": "Introduction in Hindi", "quote": "Quote in Hindi", "chatGreeting": "Greeting in Hindi", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era in Hindi", "pain": "Struggles in Hindi", "recovery": "Overcoming in Hindi" },
    "ru": { "name": "Russian name (in Cyrillic)", "title": "Title in Russian", "headline": "Headline in Russian", "shortDescription": "Introduction in Russian", "quote": "Quote in Russian", "chatGreeting": "Greeting in Russian", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era in Russian", "pain": "Struggles in Russian", "recovery": "Overcoming in Russian" },
    "zh": { "name": "Chinese name (in Simplified Chinese)", "title": "Title in Chinese", "headline": "Headline in Chinese", "shortDescription": "Introduction in Chinese", "quote": "Quote in Chinese", "chatGreeting": "Greeting in Chinese", "suggestedQuestions": ["Q1", "Q2", "Q3"], "era": "Era in Chinese", "pain": "Struggles in Chinese", "recovery": "Overcoming in Chinese" }
  },
  "epic": {
    "epic_ko": "Korean narrative...",
    "epic_en": "English narrative...",
    "epic_de": "German narrative...",
    "epic_ja": "Japanese narrative...",
    "epic_es": "Spanish narrative...",
    "epic_fr": "French narrative...",
    "epic_it": "Italian narrative...",
    "epic_pt": "Portuguese narrative...",
    "epic_ar": "Arabic narrative...",
    "epic_hi": "Hindi narrative...",
    "epic_ru": "Russian narrative...",
    "epic_zh": "Chinese narrative...",
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
  },
  "wikipediaLinks": {
    "ko": "https://ko.wikipedia.org/wiki/...",
    "en": "https://en.wikipedia.org/wiki/..."
  },
  "factLayer": {
    "timeline": [
      { "year": "Year/Period", "event": "Key event described" }
    ],
    "keyAchievements": [
      { "title": "Achievement Title", "description": "1 sentence description" }
    ],
    "faq": [
      { "question": "Question", "answer": "Answer" }
    ]
  }
}
`;
}

function mergeIntoProject(giantData: any, region: string, category: string) {
  const giantSlug = giantData.slug;
  console.log(`Merging data for ${giantSlug} into files...`);

  // 1. Merge into messages/*.json
  for (const lang of LOCALES) {
    const p = path.resolve(process.cwd(), 'messages', `${lang}.json`);
    if (fs.existsSync(p)) {
      const messages = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (!messages.Giants) messages.Giants = {};
      if (giantData.messages && giantData.messages[lang]) {
        messages.Giants[giantSlug] = giantData.messages[lang];
        fs.writeFileSync(p, JSON.stringify(messages, null, 2), 'utf8');
      }
    }
  }

  // 2. Merge into final-narratives.json
  const narrativesPath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
  let narratives: Record<string, any> = {};
  if (fs.existsSync(narrativesPath)) {
    narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  }
  if (giantData.epic) {
    narratives[giantSlug] = giantData.epic;
    fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
  }

  // 3. Merge into wikipedia-links.json
  const wikiPath = path.resolve(process.cwd(), 'src/data/wikipedia-links.json');
  let wikiLinks: Record<string, any> = {};
  if (fs.existsSync(wikiPath)) {
    wikiLinks = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
  }
  if (giantData.wikipediaLinks) {
    wikiLinks[giantSlug] = giantData.wikipediaLinks;
    fs.writeFileSync(wikiPath, JSON.stringify(wikiLinks, null, 2), 'utf8');
  }

  // 4. Merge into regions-map.ts
  const regionsPath = path.resolve(process.cwd(), 'src/data/regions-map.ts');
  if (fs.existsSync(regionsPath)) {
    let regionsContent = fs.readFileSync(regionsPath, 'utf8');
    if (!regionsContent.includes(`"${giantSlug}":`) && !regionsContent.includes(`'${giantSlug}':`)) {
      const insertIndex = regionsContent.indexOf('};');
      if (insertIndex !== -1) {
        const insertBlock = `  "${giantSlug}": "${region}",\n`;
        regionsContent = regionsContent.slice(0, insertIndex) + insertBlock + regionsContent.slice(insertIndex);
        fs.writeFileSync(regionsPath, regionsContent, 'utf8');
      }
    }
  }

  // 5. Merge into fact-layer-all.json
  const factPath = path.resolve(process.cwd(), 'src/data/fact-layer-all.json');
  let factLayer: Record<string, any> = {};
  if (fs.existsSync(factPath)) {
    factLayer = JSON.parse(fs.readFileSync(factPath, 'utf8'));
  }
  if (giantData.factLayer) {
    factLayer[giantSlug] = {
      slug: giantSlug,
      timeline: giantData.factLayer.timeline || [],
      keyAchievements: giantData.factLayer.keyAchievements || [],
      faq: giantData.factLayer.faq || [],
      sourceVerified: true
    };
    fs.writeFileSync(factPath, JSON.stringify(factLayer, null, 2), 'utf8');
  }

  // 6. Merge into giants.ts
  const tsPath = path.resolve(process.cwd(), 'src/data/giants.ts');
  let tsContent = fs.readFileSync(tsPath, 'utf8');
  if (!tsContent.includes(`slug: "${giantSlug}"`) && !tsContent.includes(`slug: '${giantSlug}'`)) {
    let maxId = 0;
    const idMatches = tsContent.match(/id:\s*["'](\d+)["']/g);
    if (idMatches) {
      idMatches.forEach(m => {
        const id = parseInt(m.match(/\d+/)[0]);
        if (id > maxId) maxId = id;
      });
    }
    const nextId = maxId + 1;
    const en = giantData.messages.en || {};
    const ko = giantData.messages.ko || {};

    const newTsBlock = `  {
    id: "${nextId}",
    name: "${ko.name.replace(/"/g, '\\"')}",
    category: "${category}",
    headline: "${ko.headline.replace(/"/g, '\\"')}",
    shortDescription: "${ko.shortDescription.replace(/"/g, '\\"')}",
    slug: "${giantSlug}",
    dnaCode: "LPDI",
    quote: "${ko.quote.replace(/"/g, '\\"')}",
    pain: "${ko.pain.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    recovery: "${ko.recovery.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    lessons: [],
    persona: "당신은 ${ko.name.replace(/"/g, '\\"')}입니다.",
    imageUrl: "/images/giants/${giantSlug}.jpg",
    era: "${ko.era.replace(/"/g, '\\"')}"
  },\n`;

    const closingIndex = tsContent.lastIndexOf('];');
    if (closingIndex !== -1) {
      // Find the last non-whitespace character before ];
      let lastCharIndex = closingIndex - 1;
      while (lastCharIndex >= 0 && /\s/.test(tsContent[lastCharIndex])) {
        lastCharIndex--;
      }
      const needsComma = lastCharIndex >= 0 && tsContent[lastCharIndex] !== ',';
      const comma = needsComma ? ',' : '';
      
      tsContent = tsContent.slice(0, closingIndex) + comma + '\n' + newTsBlock + tsContent.slice(closingIndex);
      fs.writeFileSync(tsPath, tsContent, 'utf8');
    }
  }

  console.log(`✓ Successfully merged ${giantSlug} into codebase.`);
}

async function main() {
  const candidatesPath = path.resolve(process.cwd(), 'scripts/candidates-approval.json');
  const outputPath = path.resolve(process.cwd(), 'scripts/new-giants-data.json');

  if (!fs.existsSync(candidatesPath)) {
    console.error("Candidates approval file scripts/candidates-approval.json not found!");
    process.exit(1);
  }

  const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  let generatedData: Record<string, any> = {};

  if (fs.existsSync(outputPath)) {
    try {
      generatedData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Loaded ${Object.keys(generatedData).length} already generated giants.`);
    } catch (e) {
      console.error("Failed to parse existing new-giants-data.json, starting fresh.");
    }
  }

  // Filter out those already processed
  const unprocessedCandidates = candidates.filter((c: any) => !generatedData[c.slug]);
  console.log(`Total candidates: ${candidates.length}. Unprocessed: ${unprocessedCandidates.length}`);

  if (unprocessedCandidates.length === 0) {
    console.log("All candidates have already been generated!");
    process.exit(0);
  }

  // Take the first BATCH_SIZE candidates
  const batch = unprocessedCandidates.slice(0, BATCH_SIZE);
  console.log(`Starting generation for batch of ${batch.length} giants...`);

  let batchPromptTokens = 0;
  let batchCandidatesTokens = 0;
  let count = 0;

  for (const c of batch) {
    count++;
    console.log(`\n--------------------------------------------------`);
    console.log(`[${count}/${batch.length}] Generating: ${c.nameEn} (${c.slug})`);
    console.log(`--------------------------------------------------`);
    
    const prompt = getPrompt(c);
    let attempts = 0;
    let success = false;

    while (attempts < 3 && !success) {
      attempts++;
      try {
        console.log(`Sending API request (Attempt ${attempts})...`);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3 // low temperature for historical accuracy
          }
        });

        // Track tokens and cost
        const usage = response.usageMetadata;
        if (usage) {
          batchPromptTokens += usage.promptTokenCount || 0;
          batchCandidatesTokens += usage.candidatesTokenCount || 0;
          const cost = ((usage.promptTokenCount || 0) * INPUT_PRICE_PER_M / 1000000) + 
                       ((usage.candidatesTokenCount || 0) * OUTPUT_PRICE_PER_M / 1000000);
          console.log(`Tokens - Input: ${usage.promptTokenCount}, Output: ${usage.candidatesTokenCount}. Estimated cost: $${cost.toFixed(4)}`);
        }

        const rawText = response.text || "";
        const cleaned = cleanJSON(rawText);
        const parsed = JSON.parse(cleaned);

        // Simple validation check
        if (!parsed.messages || !parsed.epic || !parsed.messages.en || !parsed.messages.ko) {
          throw new Error("Invalid profile structure returned from AI");
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
            if (loc === "ko") parsed.messages[loc].name = c.nameKo;
            else parsed.messages[loc].name = c.nameEn;
          }
        }

        // Sanitize epic
        const ep = parsed.epic;
        for (const loc of LOCALES) {
          if (!ep[`epic_${loc}`]) ep[`epic_${loc}`] = ep[`epic_en`] || ep[`epic_ko`] || "";
          ep[`epic_${loc}`] = sanitizeString(ep[`epic_${loc}`]);
          
          // Verify exactly 4 paragraphs for formatting
          const paragraphs = ep[`epic_${loc}`].split(/\n\n|\\n\\n/).map((p: string) => p.trim()).filter(Boolean);
          if (paragraphs.length !== 4) {
            console.warn(`[Warning] ${loc} epic has ${paragraphs.length} paragraphs. Re-formatting to 4 paragraphs...`);
            // Try to force group or split into 4 paragraphs if possible, or print warning
          }
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

        // Add verified properties
        parsed.slug = c.slug;
        parsed.category = parsed.category || "leadership";
        parsed.region = c.region;

        generatedData[c.slug] = parsed;

        // Save local backup file after each giant to protect progress
        fs.writeFileSync(outputPath, JSON.stringify(generatedData, null, 2), 'utf8');
        console.log(`[Success] Generated profile for ${c.slug}.`);

        // Auto-merge into project files
        mergeIntoProject(parsed, c.region, parsed.category);
        success = true;
      } catch (err: any) {
        console.error(`[Error] Attempt ${attempts} failed for ${c.slug}:`, err.message || err);
        await sleep(5000);
      }
    }

    if (!success) {
      console.error(`[Fatal] Failed to generate ${c.slug} after 3 attempts. Aborting batch.`);
      break;
    }

    // Rate limiting sleep
    await sleep(2000);
  }

  // Log final batch summaries
  const totalBatchCost = (batchPromptTokens * INPUT_PRICE_PER_M / 1000000) + 
                         (batchCandidatesTokens * OUTPUT_PRICE_PER_M / 1000000);
  
  console.log(`\n==================================================`);
  console.log(`BATCH COMPLETED`);
  console.log(`==================================================`);
  console.log(`Total prompt tokens: ${batchPromptTokens}`);
  console.log(`Total candidates tokens: ${batchCandidatesTokens}`);
  console.log(`Estimated batch cost: $${totalBatchCost.toFixed(4)} USD`);
  console.log(`==================================================\n`);
}

main().catch(console.error);
