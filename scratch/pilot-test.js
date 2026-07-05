/**
 * pilot-test.js — 5명만 테스트
 */
const https = require('https');

const LOCALE_TO_SITELINK = {
  en: 'enwiki', ko: 'kowiki', ar: 'arwiki', zh: 'zhwiki', nl: 'nlwiki',
  fr: 'frwiki', de: 'dewiki', el: 'elwiki', ha: 'hawiki', he: 'hewiki',
  hi: 'hiwiki', id: 'idwiki', it: 'itwiki', ja: 'jawiki', fa: 'fawiki',
  pl: 'plwiki', pt: 'ptwiki', ru: 'ruwiki', es: 'eswiki', sw: 'swwiki',
  th: 'thwiki', tr: 'trwiki', uk: 'ukwiki', vi: 'viwiki',
};
const ALL_LOCALES = Object.keys(LOCALE_TO_SITELINK);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'GiantsWisdom-WikiBot/1.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// 파일럿: 5명만
const PILOT_SLUGS = [
  'napoleon-bonaparte',   // 유명인, 모든 언어 있을 것
  'avvakum',              // 동유럽 인물, ha/sw 폴백 예상
  'hurrem-sultan-roxelana', // 오스만 인물
  'tamar-of-georgia',     // 조지아 인물, ha/sw 폴백 예상
  'amanirenas',           // 아프리카 고대 인물, 많은 언어 폴백 예상
];

const fs = require('fs');
const wl = JSON.parse(fs.readFileSync('src/data/wikipedia-links.json', 'utf-8'));

async function getQID(title) {
  const normalizedTitle = title.replace(/_/g, ' ');
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(normalizedTitle)}&format=json`;
  const data = await httpsGet(url);
  const pages = data?.query?.pages;
  const page = Object.values(pages || {})[0];
  return page?.pageprops?.wikibase_item || null;
}

async function getSitelinks(qids) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qids.join('|')}&props=sitelinks&format=json`;
  return (await httpsGet(url))?.entities || {};
}

function extractSlug(enUrl) {
  const m = enUrl?.match(/en\.wikipedia\.org\/wiki\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function main() {
  console.log('🧪 파일럿 테스트 — 5명\n');

  const qidMap = {};
  for (const slug of PILOT_SLUGS) {
    const enUrl = wl[slug]?.en;
    const title = extractSlug(enUrl);
    if (!title) { console.log(`❌ ${slug}: en URL 없음`); continue; }
    const qid = await getQID(title);
    console.log(`${slug} → QID: ${qid || 'NOT FOUND'} (title: ${title})`);
    if (qid) qidMap[slug] = qid;
    await sleep(300);
  }

  const qids = Object.values(qidMap);
  console.log(`\n📦 sitelinks 배치 조회: ${qids.length}개 QID\n`);
  const entities = await getSitelinks(qids);

  for (const [slug, qid] of Object.entries(qidMap)) {
    const sitelinks = entities[qid]?.sitelinks || {};
    const enUrl = wl[slug].en;

    console.log(`\n── ${slug} (${qid}) ──`);
    const fallbacks = [];
    for (const locale of ALL_LOCALES) {
      const key = LOCALE_TO_SITELINK[locale];
      const sl = sitelinks[key];
      if (sl?.title) {
        const url = `https://${locale}.wikipedia.org/wiki/${encodeURIComponent(sl.title.replace(/ /g,'_'))}`;
        console.log(`  ✅ ${locale.padEnd(4)}: ${url}`);
      } else {
        fallbacks.push(locale);
        console.log(`  ⬇️  ${locale.padEnd(4)}: [폴백 → en]`);
      }
    }
    console.log(`  → 폴백 ${fallbacks.length}개: [${fallbacks.join(', ')}]`);
  }
}

main().catch(e => console.error('💥', e));
