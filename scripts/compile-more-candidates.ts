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
  console.log("Loading existing giants...");
  const giantsTs = fs.readFileSync('src/data/giants.ts', 'utf8');
  const existingSlugs: string[] = [];
  const slugRegex = /slug:\s*"([^"]+)"/g;
  let match;
  while ((match = slugRegex.exec(giantsTs)) !== null) {
    existingSlugs.push(match[1]);
  }
  console.log(`Found ${existingSlugs.length} existing giants.`);

  console.log("Loading previously compiled candidates...");
  const candidatesPath = path.resolve(process.cwd(), 'scripts/candidates-approval.json');
  if (!fs.existsSync(candidatesPath)) {
    console.error("Error: scripts/candidates-approval.json does not exist. Run compile-candidates.ts first.");
    process.exit(1);
  }
  const oldCandidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));

  // Filter out any that are already in the existing giants
  const uniqueOldCandidates = oldCandidates.filter((c: any) => !existingSlugs.includes(c.slug));
  console.log(`Loaded ${uniqueOldCandidates.length} unique candidates (filtered out duplicates).`);

  // Gather all slugs to exclude
  const oldCandidateSlugs = uniqueOldCandidates.map((c: any) => c.slug);
  const allExcludedSlugs = [...existingSlugs, ...oldCandidateSlugs];
  console.log(`Total excluded slugs count: ${allExcludedSlugs.length}`);

  // We need exactly 42 new candidates:
  // Africa: 12
  // Middle East & Turkey: 10
  // Eurasia: 20
  console.log("Requesting 42 additional candidates from Vertex AI...");
  const prompt = `
You are a historian compiling a database of historical figures.
We need exactly 42 new notable historical figures from three specific regions, distributed as follows:
- exactly 12 figures for 'africa' (Sub-Saharan Africa, North Africa, etc.)
- exactly 10 figures for 'middle-east-turkey' (Iran, Iraq, Syria, Turkey, Saudi Arabia, Egypt, etc.)
- exactly 20 figures for 'eurasia' (Byzantine Empire, Ukraine, Central Asia, Siberia, Silk Road cross-cultural figures, etc.)

Total: 42 figures.

Crucially, you MUST NOT select any of the following historical figures, as they already exist in our database or have already been compiled (DO NOT use these slugs or names):
${JSON.stringify(allExcludedSlugs)}

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
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    let text = response.text?.trim() || "[]";
    if (text.startsWith("```")) {
      text = text.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }

    const newCandidates = JSON.parse(text);
    console.log(`Generated ${newCandidates.length} new candidates.`);

    // Validate region distribution and duplicates
    const validatedNewCandidates: any[] = [];
    const newSlugsSet = new Set<string>();

    for (const c of newCandidates) {
      if (allExcludedSlugs.includes(c.slug) || newSlugsSet.has(c.slug)) {
        console.warn(`Warning: Duplicated or excluded slug detected and skipped: ${c.slug}`);
        continue;
      }
      newSlugsSet.add(c.slug);
      validatedNewCandidates.push(c);
    }

    console.log(`Validated unique new candidates: ${validatedNewCandidates.length}`);

    // Merge lists
    const finalCandidates = [...uniqueOldCandidates, ...validatedNewCandidates];
    console.log(`Merged final list contains ${finalCandidates.length} unique candidates.`);

    // Sort by region, then by nameKo
    finalCandidates.sort((a, b) => {
      const regionCompare = a.region.localeCompare(b.region);
      if (regionCompare !== 0) return regionCompare;
      return a.nameKo.localeCompare(b.nameKo);
    });

    // Save final list to json
    fs.writeFileSync(candidatesPath, JSON.stringify(finalCandidates, null, 2), 'utf-8');
    console.log(`Saved merged JSON list to ${candidatesPath}`);

    // Save final list to Markdown table
    let md = `# Candidate Curation List (200 Figures for Review)

Please review the curated candidates for the database expansion. Columns are added to flag sensitive categories:
1. **Colonial**: Active during the colonial era (rulers & resistance).
2. **Religion**: Religious leaders or theologians.
3. **20th Cent.**: Lived/active in the 20th century (died 1900-1970).

Total Candidates: ${finalCandidates.length}

| # | Name (KO) | Name (EN) | Slug | Region | Died | Colonial | Religion | 20th Cent. | Achievement / Selection Reason |
|---|---|---|---|---|---|:---:|:---:|:---:|---|
`;

    finalCandidates.forEach((c: any, idx: number) => {
      const colFlag = c.colonialRelated ? '⚠️ **Yes**' : 'No';
      const relFlag = c.religiousLeader ? '⛪ **Yes**' : 'No';
      const modFlag = c.modern20th ? '🕒 **Yes**' : 'No';
      md += `| ${idx + 1} | ${c.nameKo} | ${c.nameEn} | \`${c.slug}\` | \`${c.region}\` | ${c.deathYear} | ${colFlag} | ${relFlag} | ${modFlag} | ${c.briefBio} |\n`;
    });

    const mdPath = path.resolve(process.cwd(), 'scripts/candidates-for-approval.md');
    fs.writeFileSync(mdPath, md, 'utf-8');
    console.log(`Saved Markdown candidate list to ${mdPath}`);

    // Copy to brain folder as artifact
    const conversationId = '1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4';
    const brainDir = `C:\\Users\\user\\.gemini\\antigravity\\brain\\${conversationId}`;
    if (fs.existsSync(brainDir)) {
      const artifactPath = path.join(brainDir, 'candidates_for_approval.md');
      fs.writeFileSync(artifactPath, md, 'utf-8');
      console.log(`Saved brain artifact to ${artifactPath}`);
    }

  } catch (err: any) {
    console.error("Compilation of more candidates failed:", err.message || err);
    process.exit(1);
  }
}

run();
