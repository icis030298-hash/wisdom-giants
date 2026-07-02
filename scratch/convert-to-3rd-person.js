const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path:'.env.local'});

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function convertBatchTo3rdPerson(batchPayload) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  let targetsText = "";
  for (const [slug, item] of Object.entries(batchPayload)) {
    targetsText += `=== START GIANT: ${slug} ===\nKorean Name: ${item.name_ko}\nOriginal Epic:\n${item.epic_ko}\n=== END GIANT: ${slug} ===\n\n`;
  }

  const prompt = `You are a professional biographer and historical editor.
Convert the following historical giants' Korean 1st-person epic stories into a 3rd-person biography style.

GOLD STANDARD RULES:
1. Replace 1st-person pronouns ("나는", "내가", "나의", "나를", "우리") with 3rd-person pronouns ("그는", "그의", "그를" for male; "그녀는", "그녀의", "그녀를" for female; "[위인 이름]은/는", "[위인 이름]의" etc.).
2. You MUST determine the correct gender of each figure based on their history (e.g., Cleopatra VII, Simone de Beauvoir, Hannah Arendt, Harriet Tubman, Rosa Parks, Joan of Arc, Queen Victoria, Empress Wu Zetian are female ("그녀는"); Steve Jobs, Napoleon, Sejong are male ("그는")).
3. Introduce the biography by presenting the giant's Korean name at the very beginning of the first sentence of the epic.
4. Maintain a literary, epic, and solemn biographical tone (위인전 스타일). Keep all historical facts and paragraph structures exactly as-is.
5. Keep any sentence endings formal (e.g. "~했다", "~하였다").

For each giant, wrap the rewritten 3rd-person epic_ko in XML tags matching their slug:
Example:
<steve-jobs>
스티브 잡스는 ...
</steve-jobs>

INPUT GIANTS:
${targetsText}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const results = {};
  for (const slug of Object.keys(batchPayload)) {
    const regex = new RegExp(`<${slug}>([\\s\\S]*?)</${slug}>`);
    const match = text.match(regex);
    if (match) {
      results[slug] = match[1].trim();
    } else {
      // Fallback: try to find standard markdown block or something
      console.warn(`  ⚠ Could not find tags for: ${slug}`);
    }
  }
  return results;
}

async function main() {
  const filePath = path.resolve('src/data/final-narratives.json');
  const narratives = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Load giantsData to resolve Korean names
  const { giantsData } = require('../src/data/giants.ts');
  const getNameKo = (slug) => {
    const g = giantsData.find(x => x.slug === slug);
    return g ? g.name : slug;
  };
  
  // Find all 1st person narrative slugs
  const targetSlugs = [];
  for (const [slug, data] of Object.entries(narratives)) {
    if (data.epic_ko && (data.epic_ko.includes('나는 ') || data.epic_ko.includes('나의 '))) {
      targetSlugs.push(slug);
    }
  }
  
  console.log(`Found ${targetSlugs.length} total 1st-person narratives.`);
  
  // Select first 50 giants for Batch 1
  let batch1Slugs = targetSlugs.slice(0, 50);
  if (!batch1Slugs.includes('cleopatra-vii') && targetSlugs.includes('cleopatra-vii')) {
    batch1Slugs[batch1Slugs.length - 1] = 'cleopatra-vii';
  }
  
  console.log(`Batch 1 target slugs (${batch1Slugs.length}):`, batch1Slugs.join(', '));
  
  const BATCH_SIZE = 5;
  const totalBatches = Math.ceil(batch1Slugs.length / BATCH_SIZE);
  
  for (let b = 0; b < totalBatches; b++) {
    const slugs = batch1Slugs.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    console.log(`[Batch ${b + 1}/${totalBatches}] Converting: ${slugs.join(', ')}`);
    
    const payload = {};
    for (const slug of slugs) {
      payload[slug] = {
        name_ko: getNameKo(slug),
        epic_ko: narratives[slug].epic_ko
      };
    }
    
    let attempts = 0;
    let success = false;
    
    while (!success && attempts < 3) {
      try {
        const results = await convertBatchTo3rdPerson(payload);
        
        let batchOk = true;
        for (const slug of slugs) {
          if (results[slug]) {
            narratives[slug].epic_ko = results[slug];
          } else {
            console.warn(`  ⚠ Missing conversion for slug: ${slug}`);
            batchOk = false;
          }
        }
        
        if (!batchOk) {
          throw new Error("Missing some translations in the batch response");
        }
        
        success = true;
        
        // Write incrementally to prevent data loss
        fs.writeFileSync(filePath, JSON.stringify(narratives, null, 2), 'utf-8');
        console.log(`  ✓ Batch ${b + 1} completed successfully.`);
        await sleep(1500);
      } catch (err) {
        attempts++;
        console.error(`  ✗ Error in batch ${b + 1} (attempt ${attempts}):`, err.message);
        await sleep(5000);
      }
    }
  }
  
  console.log(`\n🎉 Narrative conversion finished for Batch 1!`);
}

main().catch(console.error);
