/**
 * STEP 3-D: 감사 스크립트
 * - Part A: batch3-full-draft.json에서 정책 위반 12명 제거
 * - Part B: Wikidata로 사망연도 전수조회 → 1970년 이후/생존자 플래그
 * - Part C: 중복 쌍 처리
 */

const fs = require('fs');
const https = require('https');

// ========== 설정 ==========
const POLICY_VIOLATORS = [
  'jk-rowling', 'malala-yousafzai', 'rigoberta-menchu', 'margaret-thatcher',
  'steve-jobs', 'rosa-parks', 'mother-teresa', 'salvador-dali',
  'simone-de-beauvoir', 'agatha-christie', 'hannah-arendt', 'pablo-picasso'
];

// 제거할 슬러그 (더 표준적이지 않은 쪽)
const DUPLICATE_TO_REMOVE = [
  'avicenna-ibn-sina',    // ibn-sina 남김
  'averroes-ibn-rushd',   // ibn-rushd 남김
  'queen-elizabeth-i',    // elizabeth-i 남김
  'zarathushtra',         // zoroaster 남김 (영어권 더 일반적)
  'ataturk',              // mustafa-kemal-ataturk 남김 (이미 서사 작업 완료)
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WisdomGiantsAuditBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function fetchDeathYear(qid) {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=claims&format=json`;
    const text = await fetchUrl(url);
    const json = JSON.parse(text);
    const claims = json?.entities?.[qid]?.claims;
    
    // P570 = 사망일
    const deathClaim = claims?.P570?.[0]?.mainsnak?.datavalue?.value?.time;
    if (!deathClaim) return null; // 사망 기록 없음 = 생존 가능
    
    const isBC = deathClaim.startsWith('-');
    const year = parseInt(deathClaim.replace(/^[+-]/, '').split('-')[0], 10);
    return isBC ? -year : year;
  } catch (e) {
    return undefined; // 조회 실패
  }
}

async function main() {
  const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
  const wikiLinks = JSON.parse(fs.readFileSync('src/data/wikipedia-links.json', 'utf8'));
  const batch3Draft = JSON.parse(fs.readFileSync('scratch/batch3-full-draft.json', 'utf8'));
  
  const allSlugs = Object.keys(narratives);
  console.log(`\n총 마스터 슬러그 수: ${allSlugs.length}`);

  // ========== Part A: 정책 위반자 제거 ==========
  console.log('\n===== Part A: 정책 위반 12명 batch3 드래프트에서 제거 =====');
  const cleanedBatch3 = batch3Draft.filter(item => {
    if (POLICY_VIOLATORS.includes(item.slug)) {
      console.log(`  제거: ${item.slug}`);
      return false;
    }
    return true;
  });
  console.log(`  ${batch3Draft.length}명 → ${cleanedBatch3.length}명 (${batch3Draft.length - cleanedBatch3.length}명 제거)`);
  fs.writeFileSync('scratch/batch3-cleaned.json', JSON.stringify(cleanedBatch3, null, 2), 'utf8');
  console.log('  → scratch/batch3-cleaned.json 저장 완료');

  // ========== Part C: 중복 쌍 처리 (삭제 목록만 기록) ==========
  console.log('\n===== Part C: 중복 슬러그 확인 =====');
  const duplicateReport = [];
  const DUPLICATE_PAIRS = [
    { remove: 'avicenna-ibn-sina', keep: 'ibn-sina', person: '이븐 시나(아비켄나)' },
    { remove: 'averroes-ibn-rushd', keep: 'ibn-rushd', person: '이븐 루시드(아베로에스)' },
    { remove: 'queen-elizabeth-i', keep: 'elizabeth-i', person: '엘리자베스 1세' },
    { remove: 'zarathushtra', keep: 'zoroaster', person: '자라투스트라(조로아스터)' },
    { remove: 'ataturk', keep: 'mustafa-kemal-ataturk', person: '무스타파 케말 아타튀르크' },
  ];
  DUPLICATE_PAIRS.forEach(pair => {
    const removeExists = pair.remove in narratives;
    const keepExists = pair.keep in narratives;
    console.log(`  [${pair.person}] 제거: ${pair.remove} (${removeExists ? '존재' : '없음'}), 보존: ${pair.keep} (${keepExists ? '존재' : '없음'})`);
    duplicateReport.push({ ...pair, removeExists, keepExists });
  });
  fs.writeFileSync('scratch/duplicate-audit-report.json', JSON.stringify(duplicateReport, null, 2), 'utf8');

  // ========== Part B: Wikidata 사망연도 전수조회 ==========
  console.log('\n===== Part B: Wikidata 사망연도 전수조회 시작 =====');
  console.log('  (QID는 이미 생성 시 조회한 것을 활용해야 하나, 마스터엔 없으므로 slug 기반 en-wiki API 사용)\n');
  
  const auditReport = [];
  // 506개를 전부 조회하면 너무 오래 걸리므로, 
  // 1. 우선 정책 위반 가능성이 있는 이름 패턴을 키워드로 1차 필터
  // 2. 이미 알려진 위반자는 즉시 플래그
  
  const KNOWN_VIOLATORS_EXTRA = [
    // 이미 확인된 12명
    ...POLICY_VIOLATORS,
    // 추가 의심: 추가 배치에서 발생 가능한 인물 패턴
  ];
  
  let processed = 0;
  const BATCH_SIZE = 20;
  
  // QID 조회 없이 영문 위키피디아 API로 사망연도 조회
  async function fetchDeathYearFromWiki(slug) {
    try {
      const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_');
      const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(title)}&redirects=1&format=json`;
      const text = await fetchUrl(url);
      const json = JSON.parse(text);
      const pages = json?.query?.pages;
      if (!pages) return { qid: null, deathYear: undefined };
      const page = Object.values(pages)[0];
      const qid = page?.pageprops?.wikibase_item;
      if (!qid) return { qid: null, deathYear: undefined };
      
      await new Promise(r => setTimeout(r, 200)); // rate limit
      const deathYear = await fetchDeathYear(qid);
      return { qid, deathYear };
    } catch (e) {
      return { qid: null, deathYear: undefined };
    }
  }

  for (let i = 0; i < allSlugs.length; i += BATCH_SIZE) {
    const batch = allSlugs.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (slug) => {
      const result = await fetchDeathYearFromWiki(slug);
      const isViolator = result.deathYear === null || (result.deathYear !== undefined && result.deathYear > 1969);
      
      if (isViolator || KNOWN_VIOLATORS_EXTRA.includes(slug)) {
        auditReport.push({
          slug,
          qid: result.qid,
          deathYear: result.deathYear,
          reason: result.deathYear === null ? '사망 기록 없음(생존 의심)' :
                  result.deathYear > 1969 ? `사망 ${result.deathYear}년 (1970 이후)` :
                  '기존 확인된 위반자',
          recommendation: 'REMOVE'
        });
      }
      processed++;
    }));
    
    if ((i / BATCH_SIZE) % 5 === 0) {
      process.stdout.write(`  처리중: ${Math.min(i + BATCH_SIZE, allSlugs.length)}/${allSlugs.length}\r`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n  조회 완료! 총 ${allSlugs.length}명 조회, 플래그된 인물: ${auditReport.length}명`);
  
  auditReport.sort((a, b) => (b.deathYear || 9999) - (a.deathYear || 9999));
  fs.writeFileSync('scratch/wikidata-audit-report.json', JSON.stringify(auditReport, null, 2), 'utf8');
  console.log('  → scratch/wikidata-audit-report.json 저장 완료');
  
  console.log('\n===== 감사 완료 - 결과 요약 =====');
  console.log(`Part A: batch3 드래프트에서 ${batch3Draft.length - cleanedBatch3.length}명 제거 → scratch/batch3-cleaned.json`);
  console.log(`Part B: 전수조회 플래그 ${auditReport.length}명 → scratch/wikidata-audit-report.json`);
  console.log(`Part C: 중복 쌍 ${DUPLICATE_PAIRS.length}건 → scratch/duplicate-audit-report.json`);
}

main().catch(console.error);
