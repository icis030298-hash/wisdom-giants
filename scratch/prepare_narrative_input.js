const fs = require('fs');
const path = require('path');

const dir = 'src/data/narratives';
const outDir = 'scratch/narrative_batches';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const giants9 = [
  'agatha-christie', 'ataturk', 'averroes-ibn-rushd', 'avicenna-ibn-sina',
  'hannah-arendt', 'queen-elizabeth-i', 'rosa-parks', 'simone-de-beauvoir',
  'zarathushtra'
];
const locales14 = ['de', 'es', 'fr', 'ha', 'he', 'id', 'it', 'ja', 'nl', 'pl', 'pt', 'sw', 'tr', 'vi'];

const ghazaliLocales = ['de', 'ha', 'id', 'it', 'nl', 'pl', 'sw', 'vi'];

// Build items map per locale
const localeItems = {};
locales14.forEach(l => { localeItems[l] = []; });

giants9.forEach(slug => {
  const file = path.join(dir, `${slug}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const enSource = {
    slug,
    epic: data.epic_en,
    trials: data.trials_en,
    overcoming: data.overcoming_en
  };
  locales14.forEach(loc => {
    localeItems[loc].push(enSource);
  });
});

// Add al-ghazali
const ghazaliData = JSON.parse(fs.readFileSync(path.join(dir, 'al-ghazali.json'), 'utf8'));
const ghazaliEnSource = {
  slug: 'al-ghazali',
  epic: ghazaliData.epic_en,
  trials: ghazaliData.trials_en,
  overcoming: ghazaliData.overcoming_en
};
ghazaliLocales.forEach(loc => {
  localeItems[loc].push(ghazaliEnSource);
});

// Write out JSON files for each locale
for (const loc of locales14) {
  const items = localeItems[loc];
  fs.writeFileSync(path.join(outDir, `in_narrative_${loc}.json`), JSON.stringify(items, null, 2), 'utf8');
  console.log(`Saved in_narrative_${loc}.json (${items.length} giants)`);
}
