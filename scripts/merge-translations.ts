import fs from 'fs';
import path from 'path';

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const TRANSLATIONS_DIR = path.resolve('scratch/translations');

const SUPPORTED_LOCALES = [
  'ar', 'de', 'el', 'en', 'es', 'fa', 'fr', 'ha', 'he', 'hi', 'id', 'it', 'ja',
  'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'
];

function mergeTranslations() {
  console.log("=== Merging Translations ===");
  const backupDir = path.resolve('scratch/backup');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const timestamp = Date.now();
  const backupFile = path.join(backupDir, `final-narratives-backup-${timestamp}.json`);
  fs.copyFileSync(NARRATIVES_FILE, backupFile);
  console.log(`Backup created at: ${backupFile}`);

  const narratives = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));

  for (const lang of SUPPORTED_LOCALES) {
    const file = path.join(TRANSLATIONS_DIR, `final-${lang}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`Translation file for [${lang}] does not exist yet at ${file}. Skipping.`);
      continue;
    }

    const transData = JSON.parse(fs.readFileSync(file, 'utf8'));
    let count = 0;

    for (const slug of Object.keys(transData)) {
      const trans = transData[slug];
      if (trans && trans.narrative && trans.fact_box) {
        if (!narratives[slug]) {
          console.warn(`Giant [${slug}] found in translations for [${lang}] but not in master narratives list!`);
          continue;
        }
        
        // Merge epic (narrative)
        narratives[slug][`epic_${lang}`] = trans.narrative;
        
        // Merge fact box
        narratives[slug][`fact_box_${lang}`] = trans.fact_box;
        count++;
      }
    }
    console.log(`Merged ${count} narratives and fact boxes for locale [${lang}].`);
  }

  fs.writeFileSync(NARRATIVES_FILE, JSON.stringify(narratives, null, 2), 'utf8');
  console.log("=== Merge Completed! final-narratives.json updated. ===");
}

mergeTranslations();
