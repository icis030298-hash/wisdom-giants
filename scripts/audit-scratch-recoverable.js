const fs = require('fs');
const path = require('path');

const scratchDir = path.join(__dirname, '..', 'scratch');

function getJsonFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const jsonFiles = getJsonFiles(scratchDir);
console.log(`=== AUDITING ALL RECOVERABLE TRANSLATIONS IN SCRATCH/ ===`);
console.log(`Scanning ${jsonFiles.length} JSON files...\n`);

const localeCounts = {};
let totalValidPostObjects = 0;

jsonFiles.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const items = Array.isArray(data) ? data : [data];
    items.forEach(item => {
      if (item && item.slug && item.title && item.content) {
        const locale = item.locale || (file.includes('pl_') ? 'pl' : file.includes('uk_') ? 'uk' : 'unknown');
        if (!localeCounts[locale]) localeCounts[locale] = 0;
        localeCounts[locale]++;
        totalValidPostObjects++;
      }
    });
  } catch (e) {}
});

console.log('--- RECOVERABLE POST OBJECTS BY LOCALE ---');
Object.keys(localeCounts).forEach(loc => {
  console.log(`  Locale '${loc}': ${localeCounts[loc]} post objects available in scratch/`);
});
console.log(`\nTOTAL RECOVERABLE POST OBJECTS IN SCRATCH/: ${totalValidPostObjects}`);
