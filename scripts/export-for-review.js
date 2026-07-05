const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const EXPORT_DIR = path.resolve('scratch/exports');

if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const slugs = Object.keys(data);

// Define all 24 locales, including 'en' and 'ko'
const locales = ['ko', 'en', 'ar','de','el','es','fa','fr','ha','he','hi','id','it','ja','nl','pl','pt','ru','sw','th','tr','uk','vi','zh'];

console.log(`Exporting ${slugs.length} giants into separate language files for review...`);

locales.forEach(loc => {
  const exportData = {};
  
  slugs.forEach(slug => {
    const giant = data[slug];
    
    // Extract lang-specific fields
    const epic = giant[`epic_${loc}`];
    const fact_box = loc === 'ko' ? (giant.fact_box || giant.fact_box_ko) : giant[`fact_box_${loc}`];
    const era = giant[`era_${loc}`];
    const trials = giant[`trials_${loc}`];
    const overcoming = giant[`overcoming_${loc}`];
    
    // Wisdom array extraction
    const wisdom = (giant.wisdom || []).map(w => ({
      quote: w[`quote_${loc}`] || "",
      meaning: w[`meaning_${loc}`] || ""
    })).filter(w => w.quote !== ""); // Only include if quote exists

    // Only add to export if there's at least an epic or fact_box
    if (epic || fact_box) {
      exportData[slug] = {
        era: era || null,
        fact_box: fact_box || null,
        epic: epic || null,
        trials: trials || null,
        overcoming: overcoming || null,
        wisdom_lessons: wisdom.length > 0 ? wisdom : null
      };
    }
  });

  const exportPath = path.join(EXPORT_DIR, `review-${loc}.json`);
  fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf8');
  console.log(`Saved ${loc} -> ${exportPath}`);
});

console.log('✅ Export complete! Files are ready in scratch/exports/');
