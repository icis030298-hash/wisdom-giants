const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const allJsonFiles = walkDir(path.join(__dirname, '..', 'scratch'));
console.log(`Found ${allJsonFiles.length} total JSON files in scratch/`);

let totalFoundPosts = 0;
const foundByLocale = {};

allJsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      const validPosts = data.filter(item => item && item.slug && item.title && item.content);
      if (validPosts.length > 0) {
        const basename = path.basename(file);
        console.log(`[FILE] ${file.replace(path.join(__dirname, '..'), '')} -> ${validPosts.length} post objects`);
        validPosts.forEach(p => {
          const loc = p.locale || 'unknown';
          if (!foundByLocale[loc]) foundByLocale[loc] = 0;
          foundByLocale[loc]++;
          totalFoundPosts++;
        });
      }
    }
  } catch (e) {
    // Ignore non-JSON or invalid syntax files
  }
});

console.log('\n=== SUMMARY OF RECOVERABLE TRANSLATIONS IN SCRATCH/ ===');
Object.keys(foundByLocale).forEach(loc => {
  console.log(`  Locale '${loc}': ${foundByLocale[loc]} post objects found`);
});
console.log(`TOTAL RECOVERABLE POST OBJECTS: ${totalFoundPosts}`);
