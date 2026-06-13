const { execSync } = require('child_process');

try {
  const ts9a = execSync('git show 9a143e7:src/data/giants.ts', { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
  const slugs9a = [...ts9a.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

  const ts62 = execSync('git show 62145a3:src/data/giants.ts', { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
  const slugs62 = [...ts62.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

  console.log(`Commit 9a143e7 slugs count: ${slugs9a.length}`);
  console.log(`Commit 62145a3 slugs count: ${slugs62.length}`);

  const lost = slugs9a.filter(s => !slugs62.includes(s));
  console.log(`Lost slugs count (${lost.length}):`);
  console.log(lost);
} catch (e) {
  console.log('Error comparing commits:', e.message);
}
