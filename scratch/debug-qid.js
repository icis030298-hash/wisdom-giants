const https = require('https');

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

async function testQID(rawTitle, label) {
  // 방법 1: 스페이스 (기존 시도)
  const t1 = rawTitle.replace(/_/g, ' ');
  const url1 = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(t1)}&format=json`;
  const d1 = await httpsGet(url1);
  const pages1 = d1?.query?.pages;
  const page1 = Object.values(pages1 || {})[0];
  const qid1 = page1?.pageprops?.wikibase_item;

  // 방법 2: _ 그대로 (미인코딩)
  const url2 = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${rawTitle}&format=json`;
  const d2 = await httpsGet(url2);
  const pages2 = d2?.query?.pages;
  const page2 = Object.values(pages2 || {})[0];
  const qid2 = page2?.pageprops?.wikibase_item;
  const pageId2 = page2 ? Object.keys(pages2)[0] : null;

  // 방법 3: redirects 허용
  const url3 = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&titles=${rawTitle}&redirects=1&format=json`;
  const d3 = await httpsGet(url3);
  const pages3 = d3?.query?.pages;
  const page3 = Object.values(pages3 || {})[0];
  const qid3 = page3?.pageprops?.wikibase_item;

  console.log(`\n[${label}] rawTitle: ${rawTitle}`);
  console.log(`  방법1 (스페이스): QID=${qid1 || 'null'}, pageTitle=${page1?.title}`);
  console.log(`  방법2 (그대로):   QID=${qid2 || 'null'}, pageId=${pageId2}, pageTitle=${page2?.title}`);
  console.log(`  방법3 (redirects): QID=${qid3 || 'null'}, pageTitle=${page3?.title}`);
}

async function main() {
  const tests = [
    ['Napoleon_Bonaparte', 'napoleon-bonaparte'],
    ['Hurrem_Sultan', 'hurrem-sultan'],
    ['Tamar_of_Georgia', 'tamar-of-georgia'],
  ];
  for (const [t, label] of tests) {
    await testQID(t, label);
  }
}
main().catch(console.error);
