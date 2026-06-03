const cp = require('child_process');
try {
  const c1 = cp.execSync('git show 6d02626:src/data/giants.ts').toString();
  const c2 = cp.execSync('git show b347d5d^:src/data/giants.ts').toString();
  console.log('Equal?', c1 === c2);
  console.log('c1 length:', c1.length);
  console.log('c2 length:', c2.length);
  console.log('c1 matches Sejong:', c1.includes('king-sejong'));
  console.log('c2 matches Sejong:', c2.includes('king-sejong'));
} catch(e) {
  console.error(e);
}
