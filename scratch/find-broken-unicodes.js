const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/data/final-narratives.json');
if (!fs.existsSync(filePath)) {
  console.error('final-narratives.json not found!');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const reports = [];

function checkAndReport(slug, key, value) {
  if (typeof value === 'string' && value.includes('\uFFFD')) {
    reports.push({
      slug,
      key,
      text: value
    });
  } else if (typeof value === 'object' && value !== null) {
    for (const k in value) {
      checkAndReport(slug, `${key}.${k}`, value[k]);
    }
  }
}

for (const slug in data) {
  const giantData = data[slug];
  for (const key in giantData) {
    checkAndReport(slug, key, giantData[key]);
  }
}

// Analyze by language (from key suffix, e.g. epic_ko -> ko)
const langStats = {};
reports.forEach(r => {
  const parts = r.key.split('_');
  const lang = parts[parts.length - 1] || 'unknown';
  langStats[lang] = (langStats[lang] || 0) + 1;
});

console.log('Language stats of broken fields:');
console.log(JSON.stringify(langStats, null, 2));

console.log(`Total broken fields found: ${reports.length}`);
fs.writeFileSync('scratch/broken-fields-report.json', JSON.stringify(reports, null, 2), 'utf8');
console.log('Report saved to scratch/broken-fields-report.json');
