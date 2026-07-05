const fs = require('fs');
const wl = JSON.parse(fs.readFileSync('src/data/wikipedia-links.json', 'utf-8'));

const keys = Object.keys(wl);
console.log('총 위인 수:', keys.length);

// en URL 있는 것, 없는 것
const withEn = keys.filter(k => wl[k].en && wl[k].en.trim().length > 0);
const withoutEn = keys.filter(k => !wl[k].en || wl[k].en.trim().length === 0);
// ko URL 있는 것, 없는 것
const withKo = keys.filter(k => wl[k].ko && wl[k].ko.trim().length > 0);
const withoutKo = keys.filter(k => !wl[k].ko || wl[k].ko.trim().length === 0);

console.log('\nen URL 있음:', withEn.length, '/ 없음:', withoutEn.length);
console.log('ko URL 있음:', withKo.length, '/ 없음:', withoutKo.length);

// en URL에서 slug 추출 가능한지 확인 (en.wikipedia.org/wiki/SLUG 패턴)
console.log('\n=== en URL 샘플 10개 ===');
withEn.slice(0, 10).forEach(k => {
  const url = wl[k].en;
  const m = url.match(/en\.wikipedia\.org\/wiki\/(.+)$/);
  const slug = m ? decodeURIComponent(m[1]) : '추출불가';
  console.log(`  ${k}: "${slug}"`);
});

// en URL이 없는 위인들
console.log('\n=== en URL 없는 위인들 ===');
withoutEn.forEach(k => console.log(`  ${k}: ko=${wl[k].ko}`));

// en URL이 en.wikipedia.org 아닌 것
const notEnWiki = withEn.filter(k => !wl[k].en.includes('en.wikipedia.org'));
if (notEnWiki.length > 0) {
  console.log('\n=== en 필드가 있지만 en.wikipedia.org가 아닌 것 ===');
  notEnWiki.forEach(k => console.log(`  ${k}: ${wl[k].en}`));
}
