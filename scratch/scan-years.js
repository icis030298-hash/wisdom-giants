const fs = require('fs');
const path = require('path');

const locales = ['de', 'es', 'fr', 'it', 'ja', 'pt', 'ru', 'zh'];
const dataDir = path.join(process.cwd(), 'src/data/fact-layers');

let totalKoreanYears = 0;
let totalTimelineItems = 0;

for (const locale of locales) {
  const filePath = path.join(dataDir, `fact-layer-${locale}.json`);
  if (!fs.existsSync(filePath)) continue;
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let koreanYearsInLocale = 0;
  
  for (const slug in data) {
    const giant = data[slug];
    if (giant.timeline && Array.isArray(giant.timeline)) {
      totalTimelineItems += giant.timeline.length;
      giant.timeline.forEach(item => {
        if (item.year && /[년월일]/.test(item.year)) {
          koreanYearsInLocale++;
          totalKoreanYears++;
        }
      });
    }
  }
  console.log(`Locale: ${locale}, Korean format 'year' fields: ${koreanYearsInLocale}`);
}

console.log(`\nTotal timeline items scanned: ${totalTimelineItems}`);
console.log(`Total Korean 'year' fields found: ${totalKoreanYears}`);
