const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const modelId = 'gemini-2.5-flash'; // Use 2.5-flash for accurate and fast translations

// Deep Get Helper
function getValue(obj, pathStr) {
  const parts = pathStr.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    if (/^\d+$/.test(part)) {
      current = current[parseInt(part)];
    } else {
      current = current[part];
    }
  }
  return current;
}

// Deep Set Helper
function setValue(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isNextNumber = /^\d+$/.test(nextPart);
    
    if (/^\d+$/.test(part)) {
      const idx = parseInt(part);
      if (!current[idx]) {
        current[idx] = isNextNumber ? [] : {};
      }
      current = current[idx];
    } else {
      if (!current[part]) {
        current[part] = isNextNumber ? [] : {};
      }
      current = current[part];
    }
  }
  
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    current[parseInt(lastPart)] = value;
  } else {
    current[lastPart] = value;
  }
}

// Helper to determine the English reference path
function getEnglishKey(pathStr) {
  const parts = pathStr.split('.');
  const last = parts[parts.length - 1];
  // Replace language suffix (e.g. epic_ko -> epic_en, quote_ja -> quote_en)
  const base = last.replace(/_(ko|ja|es|de|fr|it|pt|ar|hi|ru|zh)$/, '');
  parts[parts.length - 1] = `${base}_en`;
  return parts.join('.');
}

// Map key to language name
function getLanguageName(key) {
  const last = key.split('.').pop();
  const match = last.match(/_(ko|ja|es|de|fr|it|pt|ar|hi|ru|zh)$/);
  const code = match ? match[1] : 'unknown';
  const LANG_NAMES = {
    ko: "Korean", en: "English", de: "German", ja: "Japanese", es: "Spanish",
    fr: "French", it: "Italian", pt: "Portuguese", ar: "Arabic", hi: "Hindi",
    ru: "Russian", zh: "Simplified Chinese"
  };
  return LANG_NAMES[code] || "Unknown";
}

async function callGenerativeAPI(prompt) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY found in .env.local");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1, // Low temperature for high precision
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
  return text;
}

async function main() {
  const reportPath = path.resolve('scratch/broken-fields-report.json');
  const narrativesPath = path.resolve('src/data/final-narratives.json');

  if (!fs.existsSync(reportPath)) {
    console.error('scratch/broken-fields-report.json not found! Run find-broken-unicodes.js first.');
    process.exit(1);
  }

  const brokenFields = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

  console.log(`Loaded ${brokenFields.length} broken fields to fix.`);

  const batchSize = 15;
  const totalBatches = Math.ceil(brokenFields.length / batchSize);

  for (let i = 0; i < brokenFields.length; i += batchSize) {
    const batch = brokenFields.slice(i, i + batchSize);
    const batchIndex = Math.floor(i / batchSize) + 1;
    console.log(`\nProcessing batch ${batchIndex}/${totalBatches} (fields ${i + 1} to ${Math.min(i + batchSize, brokenFields.length)})...`);

    // Prepare prompt payload
    const payload = batch.map((item, idx) => {
      const giantData = narratives[item.slug];
      const enKey = getEnglishKey(item.key);
      const englishReference = getValue(giantData, enKey) || "";
      const lang = getLanguageName(item.key);

      return {
        id: idx,
        lang: lang,
        english_reference: englishReference,
        broken_translation: item.text
      };
    });

    const prompt = `You are a precise multilingual localization expert. Your task is to repair broken unicode characters (\\uFFFD, ) in translations by comparing them with their original English versions.
Each item in the input array has a "broken_translation" which contains one or more  characters. These  characters represent letters, particles (such as 'の', 'に', 'は', '을', '를', '의' in Asian languages) or punctuation/accents (such as 'ó', 'ñ', '—', '«', '»') that were corrupted during encoding.
Use your knowledge of grammar, spelling, context, and the corresponding "english_reference" to replace  with the exact correct characters. DO NOT modify any other characters in the translation. Keep all paragraph breaks, spacing, and quotes intact.

Input JSON:
${JSON.stringify(payload, null, 2)}

Respond with a JSON array in the following format:
[
  {
    "id": 0,
    "fixed_translation": "..."
  },
  ...
]
Do not include any Markdown wrapper code blocks like \`\`\`json. Output raw JSON only.`;

    let attempts = 0;
    const maxAttempts = 3;
    let success = false;

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        const responseText = await callGenerativeAPI(prompt);
        let results;
        try {
          results = JSON.parse(responseText.trim());
        } catch (parseErr) {
          // Attempt cleaning markdown wrappers if present
          const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          results = JSON.parse(cleanText);
        }

        if (!Array.isArray(results)) {
          throw new Error("API response is not an array");
        }

        // Apply fixes back to the narratives database
        results.forEach(res => {
          const item = batch[res.id];
          if (!item) return;
          setValue(narratives[item.slug], item.key, res.fixed_translation);
          console.log(`  ✅ Fixed [${item.slug}] ${item.key}`);
        });

        success = true;
      } catch (err) {
        console.error(`  ❌ Attempt ${attempts} failed: ${err.message}`);
        if (attempts < maxAttempts) {
          console.log("  Waiting 3 seconds before retrying...");
          await new Promise(r => setTimeout(r, 3000));
        } else {
          console.error("  Max attempts reached for this batch. Skipping or aborting.");
          process.exit(1);
        }
      }
    }

    // Write progress back to final-narratives.json after each batch to prevent data loss
    fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
    console.log(`  💾 Batch ${batchIndex} successfully saved to final-narratives.json`);
    
    // Tiny delay between batches to respect rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n🎉 All broken unicode fields have been successfully repaired!');
}

main().catch(err => {
  console.error("Unhandled error in main:", err);
  process.exit(1);
});
