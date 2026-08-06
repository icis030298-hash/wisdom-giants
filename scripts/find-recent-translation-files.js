const fs = require('fs');
const path = require('path');

const now = Date.now();
const twoHoursAgo = now - (2 * 60 * 60 * 1000);

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          if (!filePath.includes('node_modules') && !filePath.includes('.next') && !filePath.includes('.git') && !filePath.includes('backup')) {
            results = results.concat(walkDir(filePath));
          }
        } else if (file.endsWith('.json') && stat.mtimeMs >= twoHoursAgo) {
          results.push({ filePath, mtime: new Date(stat.mtimeMs).toISOString(), size: stat.size });
        }
      } catch (e) {}
    });
  } catch (e) {}
  return results;
}

const recentFiles = walkDir(path.join(__dirname, '..', 'scratch'));
console.log(`=== RECENTLY MODIFIED TRANSLATION JSON FILES IN SCRATCH/ (LAST 2 HOURS) ===`);
console.log(`Found ${recentFiles.length} recent JSON files:\n`);

recentFiles.forEach(f => {
  console.log(`[${f.mtime}] ${f.filePath} (${f.size} bytes)`);
});
