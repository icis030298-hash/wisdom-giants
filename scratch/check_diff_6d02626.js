const cp = require('child_process');
try {
  const prev = cp.execSync('git show 6d02626^:src/data/giants.ts').toString();
  const curr = cp.execSync('git show 6d02626:src/data/giants.ts').toString();

  const prevSlugs = [...prev.matchAll(/slug:\s*["'](.*?)["']/g)].map(m => m[1]);
  const currSlugs = [...curr.matchAll(/slug:\s*["'](.*?)["']/g)].map(m => m[1]);

  const removed = prevSlugs.filter(s => !currSlugs.includes(s));
  console.log('Removed in 6d02626 count:', removed.length);
  console.log('Removed in 6d02626 slugs:', removed);
} catch (e) {
  console.error(e);
}
