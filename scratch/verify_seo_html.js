const http = require('http');

const GIANTS = [
  'marie-curie',
  'socrates',
  'genghis-khan',
  'rosa-parks',
  'bartolomeu-dias',
  'shakespeare'
];

const LOCALES = ['ko', 'en', 'ja'];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractMeta(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  
  return {
    title: titleMatch ? titleMatch[1] : null,
    desc: descMatch ? descMatch[1] : null
  };
}

async function run() {
  console.log("# SEO Metadata Verification Report");
  console.log("Source: Local Production Build (http://localhost:3005)\n");

  for (const locale of LOCALES) {
    console.log(`## Locale: [${locale.toUpperCase()}]`);
    for (const slug of GIANTS) {
      const url = `http://localhost:3005/${locale}/giant/${slug}`;
      try {
        const html = await fetchHtml(url);
        const meta = extractMeta(html);
        console.log(`- **${slug}**`);
        console.log(`  - Title (${meta.title ? Array.from(meta.title).length : 0} chars): ${meta.title}`);
        console.log(`  - Desc  (${meta.desc ? Array.from(meta.desc).length : 0} chars): ${meta.desc}`);
      } catch (e) {
        console.log(`- **${slug}**: Failed to fetch - ${e.message}`);
      }
    }
    console.log("");
  }
}

run();
