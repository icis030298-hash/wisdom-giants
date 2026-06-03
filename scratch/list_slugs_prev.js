const cp = require('child_process');
try {
  const fs = require('fs');
  const content = fs.readFileSync('src/data/giants.ts', 'utf8');
  const matches = [...content.matchAll(/slug:\s*["'](.*?)["']/g)].map(m => m[1]);
  console.log('Includes king-sejong:', matches.includes('king-sejong'));
  console.log('Index of king-sejong:', matches.indexOf('king-sejong'));
  console.log('Matches length:', matches.length);
} catch(e) {
  console.error(e);
}
