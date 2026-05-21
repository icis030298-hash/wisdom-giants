const fs = require('fs');
const path = require('path');

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error("Please provide at least one slug.");
  process.exit(1);
}

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
  } else {
    console.error(`Slug not found: ${slug}`);
  }
});

console.log(JSON.stringify(result, null, 2));
