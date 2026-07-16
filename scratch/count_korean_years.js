const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'es', 'de', 'it', 'ar', 'el', 'fa', 'ha', 'he', 'hi', 'id', 'ja', 'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'];
const dataDir = path.join(__dirname, '..', 'src', 'data', 'fact-layers');

const results = {};

for (const loc of locales) {
    const file = path.join(dataDir, `fact-layer-${loc}.json`);
    if (!fs.existsSync(file)) continue;

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    let koreanYearCount = 0;
    const uniqueKoreanYears = new Set();

    for (const slug of Object.keys(data)) {
        const giant = data[slug];
        if (giant.timeline) {
            for (const item of giant.timeline) {
                if (item.year && /[가-힣]/.test(item.year)) {
                    koreanYearCount++;
                    uniqueKoreanYears.add(item.year);
                }
            }
        }
    }

    if (koreanYearCount > 0) {
        results[loc] = {
            count: koreanYearCount,
            uniqueCount: uniqueKoreanYears.size,
            samples: Array.from(uniqueKoreanYears).slice(0, 5)
        };
    }
}

console.log("=== Korean Year Fields per Locale ===");
let total = 0;
for (const [loc, stats] of Object.entries(results)) {
    console.log(`Locale: ${loc.toUpperCase().padEnd(3)} | Total items: ${String(stats.count).padEnd(4)} | Unique strings: ${String(stats.uniqueCount).padEnd(3)} | Samples: ${stats.samples.join(', ')}`);
    total += stats.count;
}
console.log(`\nTotal Korean year fields across all languages: ${total}`);
