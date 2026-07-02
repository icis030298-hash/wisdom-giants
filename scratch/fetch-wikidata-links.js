/**
 * fetch-wikidata-links.js
 *
 * Wikidata sitelinks 기반으로 493명 위인의 24개 언어 Wikipedia 링크를 생성.
 * - en URL → Wikipedia 슬러그 추출 → QID 조회 → sitelinks 배치 조회
 * - 폴백 발생 시 en URL 사용, fallback-report.json에 기록
 * - 중간 결과 wikidata-cache.json에 저장 (재실행 시 이어서 처리)
 * - 기존 ko URL과 다른 경우 로그 출력 후 기존 값 유지
 * - git push 하지 않음
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ─────────────────────────────────────────────
// 설정
// ─────────────────────────────────────────────
const DELAY_MS = 300;
const MAX_RETRY = 3;
const BATCH_SIZE = 50; // Wikidata API 최대 QID 배치 수

const WIKI_LINKS_PATH = path.join(__dirname, '../src/data/wikipedia-links.json');
const CACHE_PATH      = path.join(__dirname, 'wikidata-cache.json');
const OUTPUT_PATH     = path.join(__dirname, '../src/data/wikipedia-links.json');
const FALLBACK_PATH   = path.join(__dirname, 'fallback-report.json');

// 프로젝트 24개 로케일 → Wikipedia sitelink 키 매핑
const LOCALE_TO_SITELINK = {
  en: 'enwiki',
  ko: 'kowiki',
  ar: 'arwiki',
  zh: 'zhwiki',
  nl: 'nlwiki',
  fr: 'frwiki',
  de: 'dewiki',
  el: 'elwiki',
  ha: 'hawiki',
  he: 'hewiki',
  hi: 'hiwiki',
  id: 'idwiki',
  it: 'itwiki',
  ja: 'jawiki',
  fa: 'fawiki',
  pl: 'plwiki',
  pt: 'ptwiki',
  ru: 'ruwiki',
  es: 'eswiki',
  sw: 'swwiki',
  th: 'thwiki',
  tr: 'trwiki',
  uk: 'ukwiki',
  vi: 'viwiki',
};

const ALL_LOCALES = Object.keys(LOCALE_TO_SITELINK);

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'GiantsWisdom-WikiBot/1.0 (https://giantswisdom.com)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

async function fetchWithRetry(url, retries = MAX_RETRY) {
  for (let i = 0; i < retries; i++) {
    try {
      return await httpsGet(url);
    } catch (e) {
      console.warn(`  ⚠️  재시도 ${i + 1}/${retries}: ${e.message}`);
      if (i < retries - 1) await sleep(1000 * (i + 1));
    }
  }
  throw new Error(`최대 재시도 초과: ${url}`);
}

// en URL에서 Wikipedia 슬러그 추출
function extractEnSlug(enUrl) {
  if (!enUrl) return null;
  const m = enUrl.match(/en\.wikipedia\.org\/wiki\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

// Wikipedia API로 QID 조회 (title 단건)
// 주의: _ 는 스페이스로 변환해서 넘겨야 정확히 매칭됨
async function fetchQID(title) {
  // Wikipedia에서는 _를 공백으로 처리하므로 스페이스로 바꾼 뒤 encodeURIComponent
  const normalizedTitle = title.replace(/_/g, ' ');
  const encodedTitle = encodeURIComponent(normalizedTitle);
  // redirects=1: Napoleon_Bonaparte 같은 리다이렉트 문서도 QID 반환함
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${encodedTitle}&redirects=1&format=json`;
  const data = await fetchWithRetry(url);
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page?.pageprops?.wikibase_item || null;
}

// Wikidata API로 sitelinks 배치 조회 (QID 최대 50개)
async function fetchSitelinksBatch(qids) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qids.join('|')}&props=sitelinks&format=json`;
  const data = await fetchWithRetry(url);
  return data?.entities || {};
}

// sitelinks에서 24개 언어 URL 생성
function buildLocaleUrls(sitelinks, enUrl) {
  const result = {};
  for (const locale of ALL_LOCALES) {
    const sitelinkKey = LOCALE_TO_SITELINK[locale];
    const sl = sitelinks?.[sitelinkKey];
    if (sl?.title) {
      const encodedTitle = sl.title.replace(/ /g, '_');
      result[locale] = `https://${locale}.wikipedia.org/wiki/${encodeURIComponent(encodedTitle)}`;
    } else {
      // 폴백: en URL 사용 (en은 항상 있음)
      result[locale] = enUrl;
    }
  }
  return result;
}

// ─────────────────────────────────────────────
// 메인 실행
// ─────────────────────────────────────────────
async function main() {
  console.log('🚀 Wikidata 다국어 Wikipedia 링크 생성 시작\n');

  // 기존 데이터 로드
  const wikiLinks = JSON.parse(fs.readFileSync(WIKI_LINKS_PATH, 'utf-8'));
  const slugs = Object.keys(wikiLinks);
  console.log(`📂 위인 수: ${slugs.length}명\n`);

  // 캐시 로드 (재실행 시 이어서 처리)
  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    console.log(`♻️  캐시 발견: ${Object.keys(cache).length}명 이미 처리됨\n`);
  }

  // fallback 리포트 초기화
  let fallbackReport = {};
  if (fs.existsSync(FALLBACK_PATH)) {
    fallbackReport = JSON.parse(fs.readFileSync(FALLBACK_PATH, 'utf-8'));
  }

  // ── STEP 1: QID 수집 (아직 캐시에 없는 것만) ──
  const pendingSlugs = slugs.filter(s => !cache[s]);
  console.log(`🔍 QID 조회 필요: ${pendingSlugs.length}명`);

  const qidMap = {}; // slug → QID
  const noQidList = [];

  for (let i = 0; i < pendingSlugs.length; i++) {
    const slug = pendingSlugs[i];
    const enUrl = wikiLinks[slug]?.en;
    const title = extractEnSlug(enUrl);

    if (!title) {
      console.warn(`  ❌ [${i + 1}/${pendingSlugs.length}] ${slug}: en URL 없음`);
      noQidList.push(slug);
      continue;
    }

    try {
      const qid = await fetchQID(title);
      if (qid) {
        qidMap[slug] = qid;
        process.stdout.write(`  ✅ [${i + 1}/${pendingSlugs.length}] ${slug} → ${qid}\n`);
      } else {
        console.warn(`  ❌ [${i + 1}/${pendingSlugs.length}] ${slug}: QID 없음 (title: ${title})`);
        noQidList.push(slug);
      }
    } catch (e) {
      console.error(`  💥 [${i + 1}/${pendingSlugs.length}] ${slug}: ${e.message}`);
      noQidList.push(slug);
    }

    await sleep(DELAY_MS);

    // 50건마다 중간 저장
    if ((i + 1) % 50 === 0) {
      console.log(`  💾 중간 저장 (${i + 1}/${pendingSlugs.length})`);
    }
  }

  // ── STEP 2: sitelinks 배치 조회 ──
  const qidEntries = Object.entries(qidMap); // [slug, QID][]
  console.log(`\n🌐 sitelinks 조회: ${qidEntries.length}명 (배치 ${BATCH_SIZE}개씩)\n`);

  // QID 기준으로 배치 분할 (QID 중복 제거: 여러 slug가 같은 QID일 수 있음)
  const qidToSlugs = {}; // QID → slug[]
  for (const [slug, qid] of qidEntries) {
    if (!qidToSlugs[qid]) qidToSlugs[qid] = [];
    qidToSlugs[qid].push(slug);
  }
  const uniqueQIDs = Object.keys(qidToSlugs);

  for (let i = 0; i < uniqueQIDs.length; i += BATCH_SIZE) {
    const batchQIDs = uniqueQIDs.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(uniqueQIDs.length / BATCH_SIZE);
    console.log(`  📦 배치 ${batchNum}/${totalBatches} (${batchQIDs.length}개 QID 처리 중...)`);

    try {
      const entities = await fetchSitelinksBatch(batchQIDs);

      for (const qid of batchQIDs) {
        const entity = entities[qid];
        const sitelinks = entity?.sitelinks || {};
        const slugsForQID = qidToSlugs[qid];

        for (const slug of slugsForQID) {
          const enUrl = wikiLinks[slug]?.en;
          const localeUrls = buildLocaleUrls(sitelinks, enUrl);

          // 기존 ko URL 보존 로직
          const existingKo = wikiLinks[slug]?.ko;
          const newKo = localeUrls.ko;
          if (existingKo && newKo && existingKo !== newKo) {
            console.log(`  🔄 ko 불일치 [${slug}]:`);
            console.log(`     기존: ${existingKo}`);
            console.log(`     신규: ${newKo}`);
            console.log(`     → 기존 값 유지`);
            localeUrls.ko = existingKo;
          }

          // 폴백 기록
          const fallbacks = ALL_LOCALES.filter(l => localeUrls[l] === enUrl && l !== 'en');
          if (fallbacks.length > 0) {
            fallbackReport[slug] = fallbacks;
          }

          // 캐시에 저장
          cache[slug] = localeUrls;
        }
      }

      // 배치마다 캐시 저장
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
      fs.writeFileSync(FALLBACK_PATH, JSON.stringify(fallbackReport, null, 2));
      console.log(`     ✅ 배치 ${batchNum} 완료, 캐시 저장\n`);

    } catch (e) {
      console.error(`  💥 배치 ${batchNum} 실패: ${e.message}`);
    }

    await sleep(DELAY_MS);
  }

  // ── STEP 3: 이미 캐시된 것과 합쳐서 최종 파일 생성 ──
  console.log('\n📝 최종 wikipedia-links.json 생성 중...');

  const output = {};
  for (const slug of slugs) {
    if (cache[slug]) {
      output[slug] = cache[slug];
    } else {
      // QID 못 찾은 경우: 기존 ko/en + 나머지는 en 폴백
      const enUrl = wikiLinks[slug]?.en;
      const koUrl = wikiLinks[slug]?.ko || null;
      output[slug] = {};
      for (const locale of ALL_LOCALES) {
        output[slug][locale] = locale === 'ko' ? (koUrl || enUrl) : enUrl;
      }
      if (!fallbackReport[slug]) {
        fallbackReport[slug] = ALL_LOCALES.filter(l => l !== 'en' && l !== 'ko');
      }
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  fs.writeFileSync(FALLBACK_PATH, JSON.stringify(fallbackReport, null, 2));

  // ── 결과 요약 ──
  const allComplete = Object.values(output).filter(v =>
    ALL_LOCALES.every(l => v[l] && !v[l].includes('en.wikipedia.org') || l === 'en')
  ).length;

  const fallbackCount = Object.keys(fallbackReport).length;
  const avgFallbackLangs = fallbackCount > 0
    ? (Object.values(fallbackReport).reduce((s, a) => s + a.length, 0) / fallbackCount).toFixed(1)
    : 0;

  // 언어별 폴백 통계
  const langFallbackCount = {};
  for (const langs of Object.values(fallbackReport)) {
    for (const l of langs) {
      langFallbackCount[l] = (langFallbackCount[l] || 0) + 1;
    }
  }
  const langStats = Object.entries(langFallbackCount).sort((a, b) => b[1] - a[1]);

  console.log('\n' + '='.repeat(60));
  console.log('📊 결과 요약');
  console.log('='.repeat(60));
  console.log(`총 처리: ${slugs.length}명`);
  console.log(`QID 미확보 (수동 확인 필요): ${noQidList.length}명`);
  if (noQidList.length > 0) {
    noQidList.forEach(s => console.log(`  - ${s}`));
  }
  console.log(`\n폴백 발생 위인 수: ${fallbackCount}명 (평균 ${avgFallbackLangs}개 언어 폴백)`);
  console.log('\n언어별 폴백 빈도 (많은 순):');
  langStats.slice(0, 10).forEach(([l, c]) => {
    const bar = '█'.repeat(Math.round(c / slugs.length * 20));
    console.log(`  ${l.padEnd(4)} ${c.toString().padStart(3)}명 ${bar}`);
  });
  console.log(`\n💾 저장 완료:`);
  console.log(`  - ${OUTPUT_PATH}`);
  console.log(`  - ${FALLBACK_PATH}`);
  console.log(`  - ${CACHE_PATH}`);
  console.log('='.repeat(60));
}

main().catch(e => {
  console.error('💥 Fatal:', e);
  process.exit(1);
});
