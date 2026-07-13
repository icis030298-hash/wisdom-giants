const fs = require('fs');

const dataPath = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const missingGiants = ['john-f-kennedy', 'shaka-zulu'];

const locales = ['ko', 'en', 'ja', 'de', 'es', 'fr', 'it', 'pt', 'ar', 'zh', 'nl', 'ru', 'hi', 'id', 'pl', 'sw', 'th', 'tr', 'uk', 'vi', 'el', 'fa', 'he', 'ha'];

missingGiants.forEach(slug => {
  if (!data[slug]) {
    data[slug] = {};
  }
  const g = data[slug];
  
  // Create dummy English text
  const dummyEn = {
    epic: `${slug.replace(/-/g, ' ')}'s epic is currently being researched and will be updated soon.`,
    trials: "Historical trials being compiled.",
    overcoming: "Achievements and legacy being documented."
  };

  locales.forEach(loc => {
    const suffix = `_${loc}`;
    if (!g[`epic${suffix}`]) g[`epic${suffix}`] = dummyEn.epic;
    if (!g[`trials${suffix}`]) g[`trials${suffix}`] = dummyEn.trials;
    if (!g[`overcoming${suffix}`]) g[`overcoming${suffix}`] = dummyEn.overcoming;
    if (!g[`era${suffix}`]) g[`era${suffix}`] = "Historical Giant";
  });
  
  if (!g.wisdom) {
    g.wisdom = {
      "wisdom-1": {}
    };
  }
  
  Object.values(g.wisdom).forEach(w => {
    locales.forEach(loc => {
      const suffix = `_${loc}`;
      if (!w[`quote${suffix}`]) w[`quote${suffix}`] = "Quote being compiled.";
      if (!w[`meaning${suffix}`]) w[`meaning${suffix}`] = "Meaning being analyzed.";
    });
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Injected fallback data for ${missingGiants.join(', ')} across all 24 locales.`);
