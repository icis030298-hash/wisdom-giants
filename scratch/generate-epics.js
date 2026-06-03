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

const giantsPath = path.join(__dirname, '../src/data/giants.ts');
const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');

const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
const slugs = [];
let match;
while ((match = slugRegex.exec(giantsContent)) !== null) {
  slugs.push(match[1]);
}

let narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const missing = slugs.filter(s => !narratives[s] || !narratives[s].epic_ko || !narratives[s].epic_en);
console.log(`Found ${missing.length} missing epics.`);

const promptTemplate = `
Generate a 3-paragraph "Epic Story" (The Life Story) for the historical figure '{name}'.
Follow these strict rules:
- Paragraph 1 (Birth & Background): Describe their birthplace and early environment that shaped them.
- Paragraph 2 (Crucial Moment & Achievement): Dramatically narrate their greatest paradigm-shifting achievement overcoming their most fatal trial.
- Paragraph 3 (Eternal Legacy): Conclude plainly with the trace of wisdom they left for modern humanity.
- Length limit: EXACTLY 3 paragraphs. Each paragraph MUST be 2 to 3 sentences maximum. Keep it concise for short-form readers.
- Tone: Grand, dramatic, yet sophisticated.

Output the result strictly in this JSON format:
{
  "ko": "Korean translation of the 3 paragraphs (separated by \\n\\n)",
  "en": "English translation (separated by \\n\\n)",
  "ja": "Japanese translation (separated by \\n\\n)"
}
`;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  for (let i = 0; i < missing.length; i++) {
    const slug = missing[i];
    const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    console.log(`[${i+1}/${missing.length}] Generating for ${name}...`);
    
    let retries = 3;
    while (retries > 0) {
      try {
        const prompt = promptTemplate.replace('{name}', name);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const data = JSON.parse(responseText);
        
        if (!narratives[slug]) narratives[slug] = {};
        narratives[slug].epic_ko = data.ko;
        narratives[slug].epic_en = data.en;
        narratives[slug].epic_ja = data.ja;
        
        // Save immediately after each success
        fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2));
        console.log(`  -> Success!`);
        break;
      } catch (err) {
        console.error(`  -> Failed: ${err.message}. Retries left: ${retries - 1}`);
        retries--;
        await delay(2000);
      }
    }
    // Rate limit protection
    await delay(1500);
  }
  console.log("All missing epics generated successfully!");
}

run();
