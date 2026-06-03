const cp = require('child_process');
try {
  const diff = cp.execSync('git show b347d5d -- src/data/giants.ts').toString();
  console.log(diff.slice(0, 1000));
  console.log('--- TRUNCATED ---');
  console.log(diff.slice(-1000));
} catch(e) {
  console.error(e);
}
