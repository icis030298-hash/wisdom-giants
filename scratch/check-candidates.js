const fs = require('fs');
const path = require('path');

const giantsTsPath = path.resolve('src/data/giants.ts');
if (!fs.existsSync(giantsTsPath)) {
  console.error('giants.ts not found!');
  process.exit(1);
}

const { execSync } = require('child_process');

const content = fs.readFileSync(giantsTsPath, 'utf8');

// Independent slugs extraction
const existing = [];
const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
matches.forEach(m => existing.push(m[1]));

console.log('현재 복원된 위인 수:', existing.length);

const candidates = [
  // 리더십 12명
  'hatshepsut',
  'augustus-caesar',
  'eleanor-of-aquitaine',
  'sundiata-keita',
  'yi-sun-sin',
  'peter-the-great',
  'catherine-the-great',
  'maria-theresa',
  'boudicca',
  'zenobia',
  'ching-shih',
  'moctezuma-ii',
  // 과학·혁신 10명
  'al-biruni',
  'william-harvey',
  'joseph-priestley',
  'carl-linnaeus',
  'lise-meitner',
  'emmy-noether',
  'alexander-von-humboldt',
  'tycho-brahe',
  'john-muir',
  'alfred-russel-wallace',
  // 철학·사상 9명
  'al-farabi',
  'thomas-more',
  'simone-weil',
  'antonio-gramsci',
  'rosa-luxemburg',
  'george-santayana',
  'henri-bergson',
  'william-of-ockham',
  'ernst-mach',
  // 문학·예술 16명 (원래 19명 목록에 존재)
  'chaucer',
  'jonathan-swift',
  'goethe',
  'mary-shelley',
  'george-sand',
  'anton-chekhov',
  'paul-cezanne',
  'auguste-rodin',
  'claude-debussy',
  'virginia-woolf',
  'franz-kafka',
  'james-joyce',
  'giacomo-puccini',
  'charles-baudelaire',
  'wassily-kandinsky',
  'paul-gauguin',
  'william-blake',
  'hans-christian-andersen',
  'rudyard-kipling',
  // 인권·사회 7명
  'jane-addams',
  'maria-montessori',
  'william-lloyd-garrison',
  'albert-schweitzer',
  'pandita-ramabai',
  'elizabeth-blackwell',
  'florence-kelley',
  // 탐험·비즈니스 6명
  'david-livingstone',
  'alfred-nobel',
  'pierre-de-coubertin',
  'fridtjof-nansen',
  'george-eastman',
  'elisha-otis'
];

const duplicates = candidates.filter(s => existing.includes(s));
const toAdd = candidates.filter(s => !existing.includes(s));

console.log('이미 존재:', duplicates.length, '명');
console.log('추가 가능:', toAdd.length, '명');
console.log('\n추가할 목록:');
toAdd.forEach((s,i) => console.log(i+1, s));

console.log('\n중복된 목록:');
duplicates.forEach((s,i) => console.log(i+1, s));

const backups = [
  'askia-the-great',
  'william-tyndale',
  'george-washington-carver',
  'dorothea-lange',
  'clara-schumann',
  'harriet-martineau',
  'pierre-curie',
  'charles-lyell'
];
console.log('\n=== 예비 후보 체크 ===');
backups.forEach(b => {
  console.log(`${b}: ${existing.includes(b) ? '❌ 중복' : '✅ 추가 가능'}`);
});

