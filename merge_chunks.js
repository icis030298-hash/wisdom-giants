const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, 'src/data/final-narratives.json');
let narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

let mergedCount = 0;

for (let i = 1; i <= 9; i++) {
  const chunkPath = path.join(__dirname, `chunk${i}.json`);
  if (fs.existsSync(chunkPath)) {
    try {
      const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
      for (const [slug, data] of Object.entries(chunkData)) {
        if (narratives[slug]) {
          // Merge translations
          if (data.epic_it) narratives[slug].epic_it = data.epic_it;
          if (data.epic_pt) narratives[slug].epic_pt = data.epic_pt;
          if (data.trials_it) narratives[slug].trials_it = data.trials_it;
          if (data.trials_pt) narratives[slug].trials_pt = data.trials_pt;
          if (data.overcoming_it) narratives[slug].overcoming_it = data.overcoming_it;
          if (data.overcoming_pt) narratives[slug].overcoming_pt = data.overcoming_pt;
          
          if (data.wisdom && Array.isArray(data.wisdom) && narratives[slug].wisdom) {
            for (let j = 0; j < data.wisdom.length; j++) {
              if (narratives[slug].wisdom[j]) {
                if (data.wisdom[j].quote_it) narratives[slug].wisdom[j].quote_it = data.wisdom[j].quote_it;
                if (data.wisdom[j].quote_pt) narratives[slug].wisdom[j].quote_pt = data.wisdom[j].quote_pt;
                if (data.wisdom[j].meaning_it) narratives[slug].wisdom[j].meaning_it = data.wisdom[j].meaning_it;
                if (data.wisdom[j].meaning_pt) narratives[slug].wisdom[j].meaning_pt = data.wisdom[j].meaning_pt;
              }
            }
          }
          mergedCount++;
        }
      }
      console.log(`Merged ${chunkPath}`);
    } catch (e) {
      console.error(`Error reading ${chunkPath}:`, e);
    }
  } else {
    console.log(`chunk${i}.json not found yet.`);
  }
}

fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2));
console.log(`Successfully merged ${mergedCount} giants!`);
