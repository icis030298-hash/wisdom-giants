const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'es', 'de', 'it', 'ar', 'el', 'fa', 'ha', 'he', 'hi', 'id', 'ja', 'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'];
const dataDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');

const map = {};

for (const loc of locales) {
    const file = path.join(dataDir, `fact-layer-${loc}.json`);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const uniqueKoreanYears = new Set();

    for (const slug of Object.keys(data)) {
        const giant = data[slug];
        if (giant.timeline) {
            for (const item of giant.timeline) {
                if (item.year && /[가-힣]/.test(item.year)) {
                    uniqueKoreanYears.add(item.year);
                }
            }
        }
    }

    if (uniqueKoreanYears.size > 0) {
        map[loc] = {};
        for (const year of uniqueKoreanYears) {
            map[loc][year] = "";
        }
    }
}

fs.writeFileSync(path.join(__dirname, 'korean_years_map_empty.json'), JSON.stringify(map, null, 2), 'utf8');
console.log("Extracted empty map to korean_years_map_empty.json");
