const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'es', 'de', 'it', 'ar', 'el', 'fa', 'ha', 'he', 'hi', 'id', 'ja', 'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'];
const dataDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');
const mapFile = path.join(__dirname, 'korean_years_map_filled.json');

const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

let totalApplied = 0;
let totalSkipped = 0;

for (const loc of locales) {
    const file = path.join(dataDir, `fact-layer-${loc}.json`);
    if (!fs.existsSync(file)) continue;

    let modified = false;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    for (const slug of Object.keys(data)) {
        const giant = data[slug];
        if (giant.timeline) {
            for (const item of giant.timeline) {
                if (item.year && /[가-힣]/.test(item.year)) {
                    // Check if we have a mapping
                    const translatedYear = map[loc] && map[loc][item.year];
                    
                    if (translatedYear && translatedYear.trim() !== '') {
                        item.year = translatedYear;
                        modified = true;
                        totalApplied++;
                    } else {
                        console.log(`[SKIP] Locale: ${loc}, Slug: ${slug}, Year: "${item.year}" - No translation found!`);
                        totalSkipped++;
                    }
                }
            }
        }
    }

    if (modified) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${loc} successfully.`);
    }
}

console.log(`\n=== Apply Summary ===`);
console.log(`Total Applied: ${totalApplied}`);
console.log(`Total Skipped: ${totalSkipped}`);
