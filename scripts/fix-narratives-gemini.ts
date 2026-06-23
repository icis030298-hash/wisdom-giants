import { getVertexAIInstance } from "../src/lib/vertexai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const filePath = path.join(__dirname, '../src/data/final-narratives.json');
const narratives = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Regex to find English words attached to Korean particles or standalone English words
const englishLeakRegex = /[a-zA-Z]{3,}(한|을|를|이|가|의|에|는|로|와|과|적)\b/g;
const standaloneEnglishRegex = /\b[a-zA-Z]{4,}\b/g;

function getFlaggedSlugs() {
  const flagged: string[] = [];
  Object.entries(narratives).forEach(([slug, content]: [string, any]) => {
    let hasLeak = false;
    
    // Check epic_ko
    if (content.epic_ko) {
      const matches1 = content.epic_ko.match(englishLeakRegex) || [];
      const matches2 = content.epic_ko.match(standaloneEnglishRegex) || [];
      const filteredMatches2 = matches2.filter((word: string) => {
        if (/^(http|https|www|com|org|net|png|jpg|gif|svg|webp|html|xml|json)$/i.test(word)) return false;
        return true;
      });
      if (matches1.length > 0 || filteredMatches2.length > 0) hasLeak = true;
    }
    
    // Check trials_ko
    if (content.trials_ko) {
      const matches1 = content.trials_ko.match(englishLeakRegex) || [];
      if (matches1.length > 0) hasLeak = true;
    }
    
    // Check overcoming_ko
    if (content.overcoming_ko) {
      const matches1 = content.overcoming_ko.match(englishLeakRegex) || [];
      if (matches1.length > 0) hasLeak = true;
    }

    if (hasLeak) {
      flagged.push(slug);
    }
  });
  return flagged;
}

async function fixGiant(slug: string) {
  const content = narratives[slug];
  console.log(`Processing giant: ${slug}...`);
  
  const systemInstruction = `You are a master Korean editor for 'Giants Wisdom' (거인의 어깨), fixing AI-generation artifacts in historical epic narratives.

Critical Rules:
1. ZERO English words may remain in the output, including fragments attached to Korean particles (e.g., "impenetrable한" must become a pure Korean equivalent like "뚫을 수 없는", "spread되어" must become "확산되어").
2. ZERO mid-word space corruption. Korean words must never be split by stray spaces (e.g., "이 국적인" must be corrected to "이국적인").
3. Preserve the grand, epic literary tone (대서사시 톤) exactly as in the original text. Do not summarize, simplify, or shorten the paragraphs. Only replace/fix the corrupted words naturally in the sentence.
4. Output ONLY a valid JSON object with fields "epic_ko", "trials_ko", "overcoming_ko". Do not write any markdown wrappers, no backticks (like \`\`\`json), and no preamble.
`;

  const prompt = `Here is the current text data for the historical giant "${slug}":
{
  "epic_ko": ${JSON.stringify(content.epic_ko || "")},
  "trials_ko": ${JSON.stringify(content.trials_ko || "")},
  "overcoming_ko": ${JSON.stringify(content.overcoming_ko || "")}
}

Return the corrected JSON object. Ensure all English words are translated/removed and spacing is fixed, while preserving the grand epic narrative.`;

  const vAI = getVertexAIInstance();
  
  let attempts = 6;
  let delay = 2000;
  while (attempts > 0) {
    // Fallback to gemini-2.5-flash if gemini-2.5-flash-lite faces 503 high demand
    const modelName = attempts <= 3 ? "gemini-2.5-flash" : "gemini-2.5-flash-lite";
    const model = vAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanedJson = JSON.parse(responseText);
      
      if (cleanedJson.epic_ko && typeof cleanedJson.epic_ko === 'string') {
        return cleanedJson;
      }
      throw new Error("Invalid response format");
    } catch (err: any) {
      console.warn(`Attempt failed for ${slug} using ${modelName}. Remaining attempts: ${attempts - 1}. Error:`, err.message);
      attempts--;
      if (attempts === 0) throw err;
      console.log(`Waiting for ${delay}ms before retrying...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2; // exponential backoff
    }
  }
}

async function main() {
  const flagged = getFlaggedSlugs();
  console.log(`Found ${flagged.length} flagged giants to fix.`);
  
  for (let i = 0; i < flagged.length; i++) {
    const slug = flagged[i];
    console.log(`[${i+1}/${flagged.length}]`);
    try {
      const fixedData = await fixGiant(slug);
      
      // Update data structure
      if (fixedData.epic_ko) narratives[slug].epic_ko = fixedData.epic_ko;
      if (fixedData.trials_ko) narratives[slug].trials_ko = fixedData.trials_ko;
      if (fixedData.overcoming_ko) narratives[slug].overcoming_ko = fixedData.overcoming_ko;
      
      // Write to file after each success to prevent data loss
      fs.writeFileSync(filePath, JSON.stringify(narratives, null, 2), 'utf8');
      console.log(`Successfully fixed and updated: ${slug}`);
      
      // Brief delay to prevent rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`FATAL: Failed to fix ${slug}:`, err);
      process.exit(1);
    }
  }
  
  console.log("All flagged narratives successfully purified!");
}

main();
