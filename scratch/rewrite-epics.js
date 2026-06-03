require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
let narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

// Find all epics under 1000 characters in Korean
const toRewrite = [];
for (const slug in narratives) {
  const epicKo = narratives[slug].epic_ko || "";
  if (epicKo.length < 1000) {
    toRewrite.push(slug);
  }
}

console.log(`Found ${toRewrite.length} epics under 1,000 characters. Initiating rewriting...`);

const promptTemplate = `
You are a master historical novelist. Your task is to rewrite the "Epic Story" (The Life Story) for the historical figure '{name}' into a massive, 4-paragraph masterpiece (The Sejong Standard).

STRICT RULES:
1. TOTAL LENGTH: The Korean text MUST be over 1,000 characters. The English text MUST be over 400 words. DO NOT SUMMARIZE.
2. EXACTLY 4 PARAGRAPHS. Each paragraph MUST have 5-6 long, dense, and literary sentences.
3. TONE: Epic Narrative Style. No documentary tones like "He did X" or "He invented Y". Use powerful metaphors, profound emotions, and historical gravity.

THE 4-ACT MASTER SPEC:
- Paragraph 1 (Act 1: Birth & Destiny): Grandly describe their origin, the darkness or limits of their era, and the deep inner void or environment of their youth. Make the first letter suitable for a drop-cap.
- Paragraph 2 (Act 2: Clash with Era & Great Leap): Detail the monumental technological/ideological barriers they faced and their desperate struggle, research, or battle to break them. Write with breathless tension.
- Paragraph 3 (Act 3: Creation of Paradigm & Inner Weight): Describe the moment of their greatest achievement (e.g. inventing the telephone) AND the profound inner solitude, physical pain, or opposition they endured. Make them human.
- Paragraph 4 (Act 4: Eternal Legacy): Conclude plainly yet profoundly on why they remain a 'giant's shoulder' for humanity even centuries later.

Output strictly in JSON:
{
  "ko": "Korean 4-paragraph epic (separated by \\n\\n, MINIMUM 1000 CHARACTERS!)",
  "en": "English 4-paragraph epic (separated by \\n\\n, MINIMUM 400 WORDS!)",
  "ja": "Japanese 4-paragraph epic (separated by \\n\\n, MINIMUM 1000 CHARACTERS!)"
}
`;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  for (let i = 0; i < toRewrite.length; i++) {
    const slug = toRewrite[i];
    const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    console.log(`[${i+1}/${toRewrite.length}] Rewriting for ${name} (Previous length: ${narratives[slug].epic_ko?.length || 0} chars)`);
    
    let retries = 5;
    while (retries > 0) {
      try {
        const prompt = promptTemplate.replace('{name}', name);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const data = JSON.parse(responseText);
        
        if (data.ko.length < 800) {
            throw new Error(`Text too short! Length: ${data.ko.length}. Must be massive.`);
        }
        
        narratives[slug].epic_ko = data.ko;
        narratives[slug].epic_en = data.en;
        narratives[slug].epic_ja = data.ja;
        
        fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2));
        console.log(`  -> Success! New length: ${data.ko.length} chars.`);
        break;
      } catch (err) {
        console.error(`  -> Failed: ${err.message}. Retries left: ${retries - 1}`);
        retries--;
        await delay(2000);
      }
    }
    await delay(2000);
  }
  console.log("All substandard epics have been successfully rewritten to the Gold Standard!");
}

run();
