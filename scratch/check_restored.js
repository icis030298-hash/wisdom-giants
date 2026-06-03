const fs = require('fs');
try {
  const content = fs.readFileSync('src/data/giants.ts', 'utf8');
  const matches = [...content.matchAll(/slug:\s*["'](.*?)["']/g)].map(m => m[1]);
  console.log('Includes king-sejong:', matches.includes('king-sejong'));
  console.log('Matches count:', matches.length);
  console.log('Slugs:', matches);
} catch(e) {
  console.error(e);
}
