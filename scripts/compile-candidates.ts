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

async function run() {
  console.log("Compiling 200 candidates using Vertex AI...");

  const prompt = `
You are a historian compiling a database of 200 historical figures.
Compile exactly 200 notable historical figures from three regions:
- 'africa' (Sub-Saharan Africa, North Africa, etc.)
- 'middle-east-turkey' (Iran, Iraq, Syria, Turkey, Saudi Arabia, Egypt, etc.)
- 'eurasia' (Byzantine Empire, Ukraine, Central Asia, Siberia, Silk Road cross-cultural figures, etc.)

Strict Selection Criteria:
1. Time limit: Must have died BEFORE 1970. Real living people are strictly banned.
2. Source limit: Must have a well-documented Wikipedia entry (meaning the historical record is rich, roughly > 800 chars of text).
3. Conflict limits: Exclude figures who are symbols of active, unresolved national/regional/religious conflicts, or war criminals/mass murderers.
4. Profession balance: Aim for a diverse mix of scholars, poets, scientists, explorers, reformers, artists, along with rulers/generals. Do not focus solely on military conquerors.

Sensitive Flagging:
For each figure, determine if they belong to any of the following three sensitive categories (set as true or false):
- 'colonialRelated': Active during the colonial era, either as a colonizer/ruler or as a resistance fighter/liberator.
- 'religiousLeader': A major religious leader, theologian, founder, or reformer.
- 'modern20th': Lived or active in the 20th century (died between 1900 and 1970).

Format the output strictly as a JSON array of objects. Do not include markdown formatting or explanation, just the raw JSON.
Each object must have the following fields:
{
  "nameKo": "한국어 이름 (e.g. 이븐 시나)",
  "nameEn": "English Name (e.g. Avicenna)",
  "slug": "url-friendly-slug (e.g. avicenna)",
  "region": "africa" | "middle-east-turkey" | "eurasia",
  "deathYear": "사망 연도 (number or string, e.g. 1037)",
  "briefBio": "1-2 sentence description of achievements and why they are selected",
  "colonialRelated": true | false,
  "religiousLeader": true | false,
  "modern20th": true | false
}

Make sure to provide exactly 200 figures in total (suggested ratio: ~70 Middle East & Turkey, ~70 Africa, ~60 Eurasia).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Use Pro for maximum historical knowledge and reasoning
      contents: prompt,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    let text = response.text?.trim() || "[]";
    if (text.startsWith("```")) {
      text = text.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }

    const candidates = JSON.parse(text);
    console.log(`Generated candidate list containing ${candidates.length} figures.`);

    // Save JSON to scripts folder
    const jsonPath = path.resolve(process.cwd(), 'scripts/candidates-approval.json');
    fs.writeFileSync(jsonPath, JSON.stringify(candidates, null, 2), 'utf-8');
    console.log(`Saved JSON candidate list to ${jsonPath}`);

    // Generate a beautiful Markdown table artifact in the brain folder
    // Note: We need to write this artifact to the conversation directory!
    const conversationId = '1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4';
    const brainDir = `C:\\Users\\user\\.gemini\\antigravity\brain\\${conversationId}`;
    
    // Sort candidates by region
    candidates.sort((a: any, b: any) => a.region.localeCompare(b.region));

    let md = `# Candidate Curation List (200 Figures for Review)

Please review the curated candidates for the database expansion. Columns are added to flag sensitive categories:
1. **Colonial**: Active during the colonial era (rulers & resistance).
2. **Religion**: Religious leaders or theologians.
3. **20th Cent.**: Lived/active in the 20th century (died 1900-1970).

Total Candidates: ${candidates.length}

| # | Name (KO) | Name (EN) | Slug | Region | Died | Colonial | Religion | 20th Cent. | Achievement / Selection Reason |
|---|---|---|---|---|---|:---:|:---:|:---:|---|
`;

    candidates.forEach((c: any, idx: number) => {
      const colFlag = c.colonialRelated ? '⚠️ **Yes**' : 'No';
      const relFlag = c.religiousLeader ? '⛪ **Yes**' : 'No';
      const modFlag = c.modern20th ? '🕒 **Yes**' : 'No';
      md += `| ${idx + 1} | ${c.nameKo} | ${c.nameEn} | \`${c.slug}\` | \`${c.region}\` | ${c.deathYear} | ${colFlag} | ${relFlag} | ${modFlag} | ${c.briefBio} |\n`;
    });

    const mdPath = path.resolve(process.cwd(), 'scripts/candidates-for-approval.md');
    fs.writeFileSync(mdPath, md, 'utf-8');
    console.log(`Saved Markdown candidate list to ${mdPath}`);

    // Copy to brain folder as artifact
    if (fs.existsSync(brainDir)) {
      const artifactPath = path.join(brainDir, 'candidates_for_approval.md');
      fs.writeFileSync(artifactPath, md, 'utf-8');
      console.log(`Saved brain artifact to ${artifactPath}`);
    }

  } catch (err: any) {
    console.error("Compilation failed:", err.message || err);
    process.exit(1);
  }
}

run();
