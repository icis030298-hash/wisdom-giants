/**
 * 최종 정합성 정리:
 * 1. 4명 제거 (oprah, mandela, hawking, mlk)
 * 2. 간디 wikipedia-links 추가
 * 3. 최종 diff 확인
 */

const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WisdomGiantsBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
  const wikiLinks = JSON.parse(fs.readFileSync('src/data/wikipedia-links.json', 'utf8'));

  // ===== Step 1: 4명 제거 =====
  const toRemove = ['oprah-winfrey', 'nelson-mandela', 'stephen-hawking', 'martin-luther-king'];
  console.log('===== Step 1: 4명 제거 =====');
  toRemove.forEach(slug => {
    if (slug in narratives) {
      delete narratives[slug];
      console.log('  제거:', slug);
    } else {
      console.log('  [이미 없음]', slug);
    }
  });

  // ===== Step 2: 간디 wikipedia-links 추가 =====
  console.log('\n===== Step 2: 간디 위키피디아 링크 조회 =====');
  const gandhiLinks = {};
  
  // 주요 언어별 위키피디아 링크 구성
  // Wikidata QID: Q1001 (마하트마 간디)
  const QID = 'Q1001';
  const langs = ['ko', 'en', 'ja', 'zh', 'fr', 'de', 'es', 'it', 'pt', 'ru', 'ar', 'hi', 'bn', 'tr', 'fa', 'pl', 'nl', 'sv', 'vi', 'uk', 'id', 'cs', 'ro', 'hu'];
  
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${QID}&props=sitelinks&format=json`;
    const json = JSON.parse(await fetchUrl(url));
    const sitelinks = json?.entities?.[QID]?.sitelinks || {};

    for (const lang of langs) {
      const key = `${lang}wiki`;
      if (sitelinks[key]) {
        const title = encodeURIComponent(sitelinks[key].title);
        gandhiLinks[lang] = `https://${lang}.wikipedia.org/wiki/${title}`;
      }
    }
    
    console.log('  수집된 언어 수:', Object.keys(gandhiLinks).length);
    Object.entries(gandhiLinks).forEach(([lang, url]) => console.log(`  ${lang}: ${url}`));
  } catch (e) {
    console.error('  위키데이터 조회 실패:', e.message);
    // 수동 폴백
    gandhiLinks['en'] = 'https://en.wikipedia.org/wiki/Mahatma_Gandhi';
    gandhiLinks['ko'] = 'https://ko.wikipedia.org/wiki/%EB%A7%88%ED%95%98%ED%8A%B8%EB%A7%88_%EA%B0%84%EB%94%94';
  }

  wikiLinks['mahatma-gandhi'] = gandhiLinks;
  console.log('  → mahatma-gandhi 링크 추가 완료');

  // ===== 저장 =====
  fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(narratives, null, 2), 'utf8');
  fs.writeFileSync('src/data/wikipedia-links.json', JSON.stringify(wikiLinks, null, 2), 'utf8');

  // ===== Step 3: 최종 Diff =====
  console.log('\n===== Step 3: 최종 Diff =====');
  const nSlugs = new Set(Object.keys(narratives));
  const wSlugs = new Set(Object.keys(wikiLinks));
  const onlyInN = [...nSlugs].filter(s => !wSlugs.has(s));
  const onlyInW = [...wSlugs].filter(s => !nSlugs.has(s));

  console.log('final-narratives.json:', nSlugs.size, '명');
  console.log('wikipedia-links.json:', wSlugs.size, '개');
  console.log('');
  if (onlyInN.length === 0 && onlyInW.length === 0) {
    console.log('✅ 완전 일치! 두 파일 slug 목록이 정확히 동일합니다.');
  } else {
    if (onlyInN.length > 0) { console.log('[서사만 있음]', onlyInN.length, '명:'); onlyInN.forEach(s => console.log(' -', s)); }
    if (onlyInW.length > 0) { console.log('[링크만 있음]', onlyInW.length, '명:'); onlyInW.forEach(s => console.log(' -', s)); }
  }

  const finalCount = nSlugs.size;
  const done = Object.values(narratives).filter(v => (v.epic_ko || '').length >= 1800).length;
  console.log(`\n===== 최종 현황 =====`);
  console.log(`마스터 총 인원: ${finalCount}명`);
  console.log(`서사 완성(1800자↑): ${done}명 (${Math.round(done/finalCount*100)}%)`);
  console.log(`서사 미완성(원본 유지): ${finalCount - done}명`);
}

main().catch(console.error);
