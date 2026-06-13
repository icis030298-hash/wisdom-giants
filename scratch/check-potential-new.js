const fs = require('fs');

const content = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugs = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const potentials = [
  'gutenberg',
  'ada-lovelace',
  'hypatia',
  'marco-polo',
  'pascal',
  'jeong-yak-yong',
  'yun-dong-ju',
  'ahn-chang-ho',
  'shin-saimdang',
  'jang-yeong-sil'
];

potentials.forEach(p => {
  const found = slugs.some(s => s.toLowerCase().includes(p.toLowerCase()));
  console.log(`Checking "${p}":`, found ? 'FOUND' : 'NOT FOUND');
});
