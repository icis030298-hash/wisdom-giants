const https = require('https');
const http = require('http');

const previewBaseUrl = 'https://wisdom-giants-ghhtf7nab-kimseongeuns-projects.vercel.app';

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) return resolve({ statusCode: 500, error: 'Too many redirects' });
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `${previewBaseUrl}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`;
        }
        return fetchUrl(redirectUrl, maxRedirects - 1).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data, finalUrl: url }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runLiveVerification() {
  console.log(`Polling Vercel Preview deployment: ${previewBaseUrl}...`);
  let isReady = false;
  for (let i = 1; i <= 30; i++) {
    const res = await fetchUrl(`${previewBaseUrl}/en/about`);
    if (res.statusCode === 200) {
      console.log(`\n[SUCCESS] Vercel Preview deployment is READY! (HTTP 200)`);
      isReady = true;
      break;
    }
    console.log(`Attempt ${i}/30: Preview status code = ${res.statusCode || res.error}. Retrying in 4s...`);
    await sleep(4000);
  }

  console.log('\n======================================================');
  console.log('=== REAL HTTP VERIFICATION FROM VERCEL PREVIEW URL ===');
  console.log('=== Domain: ' + previewBaseUrl + ' ===');
  console.log('======================================================\n');

  // Requirement 3(a): Untranslated URLs (EXPECT: noindex, follow)
  console.log('--- 3(a) Untranslated URLs (EXPECT: noindex, follow) ---');
  const untranslatedUrls = [
    '/pl/blog/peter-the-great-wisdom',
    '/pl/blog/catherine-the-great-wisdom',
    '/uk/blog/omar-khayyam-wisdom',
    '/uk/blog/ibn-battuta-wisdom'
  ];

  for (const urlPath of untranslatedUrls) {
    const fullUrl = `${previewBaseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const metaRobotsMatch = res.data ? res.data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i) : null;
    const metaContent = metaRobotsMatch ? metaRobotsMatch[1] : 'NOT FOUND';
    console.log(`[HTTP ${res.statusCode}] ${urlPath}`);
    console.log(`   -> meta name="robots" content="${metaContent}"`);
  }

  // Requirement 3(b): Translated URLs in pl and uk (3 each) (EXPECT: index, follow)
  console.log('\n--- 3(b) Translated URLs in pl & uk (EXPECT: index, follow) ---');
  const translatedPlUkUrls = [
    '/pl/blog/rockefeller-monopoly-guide',
    '/pl/blog/machiavelli-power-dynamics-guide',
    '/pl/blog/zhuge-liang-strategy-guide',
    '/uk/blog/rockefeller-monopoly-guide',
    '/uk/blog/machiavelli-power-dynamics-guide',
    '/uk/blog/zhuge-liang-strategy-guide'
  ];

  for (const urlPath of translatedPlUkUrls) {
    const fullUrl = `${previewBaseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const metaRobotsMatch = res.data ? res.data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i) : null;
    const metaContent = metaRobotsMatch ? metaRobotsMatch[1] : 'NOT FOUND';
    console.log(`[HTTP ${res.statusCode}] ${urlPath}`);
    console.log(`   -> meta name="robots" content="${metaContent}"`);
  }

  // Requirement 3(c): Translated URLs in es, fr, it, pt (EXPECT: index, follow)
  console.log('\n--- 3(c) Translated URLs in es, fr, it, pt (EXPECT: index, follow) ---');
  const translatedLocalesUrls = [
    '/es/blog/rockefeller-monopoly-guide',
    '/fr/blog/rockefeller-monopoly-guide',
    '/it/blog/rockefeller-monopoly-guide',
    '/pt/blog/rockefeller-monopoly-guide'
  ];

  for (const urlPath of translatedLocalesUrls) {
    const fullUrl = `${previewBaseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const metaRobotsMatch = res.data ? res.data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i) : null;
    const metaContent = metaRobotsMatch ? metaRobotsMatch[1] : 'NOT FOUND';
    console.log(`[HTTP ${res.statusCode}] ${urlPath}`);
    console.log(`   -> meta name="robots" content="${metaContent}"`);
  }

  // Requirement 3(d) & (e): All 9 sitemaps HTTP status and URL count from Preview
  console.log('\n--- 3(d) & 3(e) All 9 Sub-Sitemaps HTTP Status and Live URL Counts ---');
  const sitemapIds = [
    'pages', 'blog', 'giants-0', 'giants-1', 'giants-2', 'giants-3', 'giants-4', 'giants-5', 'giants-6'
  ];

  let totalSitemapUrls = 0;
  for (const sitemapId of sitemapIds) {
    const urlPath = `/sitemap/${sitemapId}.xml`;
    const fullUrl = `${previewBaseUrl}${urlPath}`;
    const res = await fetchUrl(fullUrl);
    const locMatches = res.data ? res.data.match(/<loc>/g) : null;
    const count = locMatches ? locMatches.length : 0;
    totalSitemapUrls += count;
    console.log(`[HTTP ${res.statusCode}] ${urlPath.padEnd(20)} -> ${count} URL entries`);
  }

  console.log(`\nTOTAL LIVE SITEMAP URL COUNT ACROSS ALL 9 SITEMAPS: ${totalSitemapUrls}`);
}

runLiveVerification();
