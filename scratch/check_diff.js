const cp = require('child_process');
const fs = require('fs');

try {
  const prev = cp.execSync('git show 6d02626^:src/data/giants.ts').toString();
  const currFile = fs.readFileSync('./src/data/giants.ts', 'utf8');

  const prevSlugs = [...prev.matchAll(/slug:\s*["'](.*?)["']/g)].map(m => m[1]);
  const currSlugs = [...currFile.matchAll(/slug:\s*["'](.*?)["']/g)].map(m => m[1]);

  const removed = prevSlugs.filter(s => !currSlugs.includes(s));
  console.log('Removed count:', removed.length);
  console.log('Removed slugs:', removed);
} catch (e) {
  console.error(e);
}
