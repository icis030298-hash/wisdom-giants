const fs = require('fs');
const path = require('path');

const slugs = ['coco-chanel', 'pablo-picasso', 'mozart', 'william-shakespeare', 'albert-einstein', 'marie-curie'];
const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const data = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const result = {};
slugs.forEach(slug => {
  if (data[slug]) {
    const g = data[slug];
    result[slug] = {
      era_en: g.era_en,
      epic_en: g.epic_en,
      trials_en: g.trials_en,
      overcoming_en: g.overcoming_en,
      wisdom: g.wisdom.map((w, idx) => ({
        idx,
        quote_en: w.quote_en,
        meaning_en: w.meaning_en
      }))
    };
  }
});

fs.writeFileSync(path.join(__dirname, 'batch2_en.json'), JSON.stringify(result, null, 2), 'utf8');
console.log("Wrote batch2_en.json");
