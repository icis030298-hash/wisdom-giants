const fs = require('fs');

const content = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugs = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total existing slugs:', slugs.length);

const checkList = ['ahn-jung-geun', 'king-jeongjo', 'jeongjo', 'ahn-junggeun', 'yi-sun-shin', 'sejong'];
checkList.forEach(slug => {
  const found = slugs.some(s => s.toLowerCase().includes(slug.toLowerCase()));
  console.log(`Checking "${slug}":`, found ? 'FOUND' : 'NOT FOUND');
});

// Let's print some of them to see what they are like
console.log('Sample slugs:', slugs.slice(0, 10));
