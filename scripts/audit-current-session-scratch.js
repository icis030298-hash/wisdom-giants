const fs = require('fs');
const path = require('path');

const scratchDir = path.join(__dirname, '..', 'scratch');

function getDirectScratchJsonFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.includes('backup') && !file.includes('translation_batches')) {
        results = results.concat(getDirectScratchJsonFiles(filePath));
      }
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getDirectScratchJsonFiles(scratchDir);
console.log(`=== CURRENT SESSION TRANSLATION JSON FILES IN SCRATCH/ ===`);
console.log(`Found ${files.length} current session JSON files:\n`);

let totalFoundPosts = 0;
const localeMap = {};

files.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    const items = Array.isArray(data) ? data : [data];
    const valid = items.filter(i => i && i.slug && i.title && i.content);
    if (valid.length > 0) {
      console.log(`[${valid.length} items] ${f.replace(path.join(__dirname, '..'), '')}`);
      valid.forEach(v => {
        const loc = v.locale || (f.includes('pl') ? 'pl' : f.includes('uk') ? 'uk' : 'unknown');
        if (!localeMap[loc]) localeMap[loc] = 0;
        localeMap[loc]++;
        totalFoundPosts++;
      });
    }
  } catch (e) {}
});

console.log('\n--- LOCALE BREAKDOWN OF CURRENT SESSION ARTIFACTS ---');
Object.keys(localeMap).forEach(loc => {
  console.log(`  Locale '${loc}': ${localeMap[loc]} post objects available`);
});
console.log(`\nTOTAL RECOVERABLE POST OBJECTS: ${totalFoundPosts}`);
