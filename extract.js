const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const slugs = [
  "otto-von-bismarck",
  "peter-the-great",
  "catherine-the-great",
  "simon-bolivar",
  "margaret-thatcher",
  "john-d-rockefeller",
  "ataturk",
  "theodore-roosevelt",
  "anne-frank",
  "rosa-parks"
];
const result = {};
slugs.forEach(s => {
  if (data[s]) {
    result[s] = {
      epic_en: data[s].epic_en,
      trials_en: data[s].trials_en,
      overcoming_en: data[s].overcoming_en,
      wisdom: data[s].wisdom.map(w => ({
        quote_en: w.quote_en,
        meaning_en: w.meaning_en
      }))
    };
  }
});
fs.writeFileSync('extract.json', JSON.stringify(result, null, 2));
