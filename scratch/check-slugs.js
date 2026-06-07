const fs = require('fs');
const content = fs.readFileSync('src/data/giants.ts','utf8');
const slugs = [...content.matchAll(/slug:\s*['\"]([^'\"]+)['\"]/g)].map(m => m[1]);
console.log('전체 슬러그:');

const needed = [
  'abraham-lincoln',
  'marie-curie', 
  'socrates',
  'thomas-edison',
  'vincent-van-gogh',
  'isaac-newton',
  'seneca',
  'marcus-aurelius',
  'napoleon-bonaparte',
  'king-sejong',
  'confucius',
  'leonardo-da-vinci',
  'jeong-yak-yong'
];

needed.forEach(s => {
  console.log(
    slugs.includes(s) ? '✅' : '❌ 없음',
    s
  );
});
