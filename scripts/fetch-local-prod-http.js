const http = require('http');

const baseUrl = 'http://127.0.0.1:3005';

function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function runLocalProdVerification() {
  console.log('=================================================================');
  console.log('=== REAL HTTP VERIFICATION FROM LOCAL PRODUCTION SERVER (:3005) ===');
  console.log('=================================================================\n');

  // Requirement 3(a): Untranslated URLs (EXPECT: noindex, follow)
  console.log('--- 3(a) Untranslated URLs (EXPECT: meta name="robots" content="noindex, follow") ---');
  const untranslatedUrls = [
    '/pl/blog/peter-the-great-wisdom',
    '/pl/blog/catherine-the-great-wisdom',
    '/uk/blog/omar-khayyam-wisdom',
    '/uk/blog/ibn-battuta-wisdom'
  ];

  for (const urlPath of untranslatedUrls) {
    const fullUrl = `${baseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const metaRobotsMatch = res.data ? res.data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i) : null;
    const metaContent = metaRobotsMatch ? metaRobotsMatch[1] : 'NOT FOUND';
    console.log(`[HTTP ${res.statusCode}] ${urlPath}`);
    console.log(`   -> meta name="robots" content="${metaContent}"`);
  }

  // Requirement 3(b): Translated URLs in pl & uk (3 each) (EXPECT: index, follow)
  console.log('\n--- 3(b) Translated URLs in pl & uk (EXPECT: meta name="robots" content="index, follow") ---');
  const translatedPlUkUrls = [
    '/pl/blog/rockefeller-monopoly-guide',
    '/pl/blog/machiavelli-power-dynamics-guide',
    '/pl/blog/zhuge-liang-strategy-guide',
    '/uk/blog/rockefeller-monopoly-guide',
    '/uk/blog/machiavelli-power-dynamics-guide',
    '/uk/blog/zhuge-liang-strategy-guide'
  ];

  for (const urlPath of translatedPlUkUrls) {
    const fullUrl = `${baseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const metaRobotsMatch = res.data ? res.data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i) : null;
    const metaContent = metaRobotsMatch ? metaRobotsMatch[1] : 'NOT FOUND';
    console.log(`[HTTP ${res.statusCode}] ${urlPath}`);
    console.log(`   -> meta name="robots" content="${metaContent}"`);
  }

  // Requirement 3(c): Translated URLs in es, fr, it, pt (EXPECT: index, follow)
  console.log('\n--- 3(c) Translated URLs in es, fr, it, pt (EXPECT: meta name="robots" content="index, follow") ---');
  const translatedLocalesUrls = [
    '/es/blog/rockefeller-monopoly-guide',
    '/fr/blog/rockefeller-monopoly-guide',
    '/it/blog/rockefeller-monopoly-guide',
    '/pt/blog/rockefeller-monopoly-guide'
  ];

  for (const urlPath of translatedLocalesUrls) {
    const fullUrl = `${baseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const metaRobotsMatch = res.data ? res.data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i) : null;
    const metaContent = metaRobotsMatch ? metaRobotsMatch[1] : 'NOT FOUND';
    console.log(`[HTTP ${res.statusCode}] ${urlPath}`);
    console.log(`   -> meta name="robots" content="${metaContent}"`);
  }

  // Requirement 3(d) & (e): All 9 sitemaps HTTP status and URL count
  console.log('\n--- 3(d) & 3(e) All 9 Sub-Sitemaps HTTP Status and Live URL Counts ---');
  const sitemapIds = [
    'pages', 'blog', 'giants-0', 'giants-1', 'giants-2', 'giants-3', 'giants-4', 'giants-5', 'giants-6'
  ];

  let totalSitemapUrls = 0;
  for (const sitemapId of sitemapIds) {
    const urlPath = `/sitemap/${sitemapId}.xml`;
    const fullUrl = `${baseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const locMatches = res.data ? res.data.match(/<loc>/g) : null;
    const count = locMatches ? locMatches.length : 0;
    totalSitemapUrls += count;
    console.log(`[HTTP ${res.statusCode}] ${urlPath.padEnd(20)} -> ${count} URL entries`);
  }

  console.log(`\nTOTAL LIVE SITEMAP URL COUNT ACROSS ALL 9 SITEMAPS: ${totalSitemapUrls}`);
}

runLocalProdVerification();
