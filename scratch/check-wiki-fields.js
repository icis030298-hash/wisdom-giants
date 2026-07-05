const fs = require('fs');
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf-8'));

// 어떤 필드명으로 wiki URL이 저장되어 있는지 확인
const allKeys = new Set();
Object.values(fn).forEach(v => Object.keys(v).forEach(k => allKeys.add(k)));
console.log('=== final-narratives.json 모든 필드명 ===');
console.log([...allKeys].sort().join('\n'));

// wiki 관련 필드만
const wikiKeys = [...allKeys].filter(k => k.toLowerCase().includes('wiki'));
console.log('\n=== wiki 관련 필드 ===');
console.log(wikiKeys);

// wiki 필드 있는 위인 수
wikiKeys.forEach(key => {
  const withVal = Object.entries(fn).filter(([k, v]) => v[key] && v[key].trim().length > 0);
  const withoutVal = Object.entries(fn).filter(([k, v]) => !v[key] || v[key].trim().length === 0);
  console.log(`\n[${key}] 값 있음: ${withVal.length}명 / 없음: ${withoutVal.length}명`);
  if (withVal.length > 0 && withVal.length <= 10) {
    withVal.forEach(([k, v]) => console.log(`  ${k}: ${v[key]}`));
  } else if (withVal.length > 0) {
    withVal.slice(0, 5).forEach(([k, v]) => console.log(`  ${k}: ${v[key]}`));
    console.log(`  ...(+${withVal.length - 5}개 더)`);
  }
});
