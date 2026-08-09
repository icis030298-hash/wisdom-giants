const fs = require('fs');
const path = require('path');

const dir = 'src/data/narratives';
const targetSlugs = [
  'agatha-christie', 'ataturk', 'averroes-ibn-rushd', 'avicenna-ibn-sina',
  'hannah-arendt', 'queen-elizabeth-i', 'rosa-parks', 'simone-de-beauvoir',
  'zarathushtra', 'al-ghazali'
];

// Compare with a normal file
const normalSlug = 'john-d-rockefeller';
const normalData = JSON.parse(fs.readFileSync(path.join(dir, `${normalSlug}.json`), 'utf8'));
const normalKeys = Object.keys(normalData);

console.log(`정상 파일 (${normalSlug}.json) 전체 키 개수: ${normalKeys.length}`);
console.log(`기본 키 예시: ${normalKeys.slice(0, 15).join(', ')}...`);

console.log('\n--- 대상 10개 슬러그 필드 상태 검사 ---');
targetSlugs.forEach(slug => {
  const file = path.join(dir, `${slug}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const keys = Object.keys(data);
    
    // Check which prefix types exist: epic_, trials_, overcoming_, wisdom_ etc.
    const prefixes = new Set(keys.map(k => k.replace(/_[a-z]{2}$/, '_')));
    console.log(`${slug}: 총 ${keys.length}개 키 | 접두사 종류: Array.from(prefixes).join(', ') => [ ${Array.from(prefixes).join(', ')} ]`);
  } else {
    console.log(`${slug}: 파일 없음`);
  }
});
