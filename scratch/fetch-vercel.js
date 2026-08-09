const https = require('https');

const locales = ['ko', 'en', 'ja', 'ar', 'he'];
const slugs = [
  'sejong',
  'marie-curie',
  'socrates',
  'leonardo-da-vinci',
  'martin-luther-king-jr',
  'bartolomeu-dias',
  'genghis-khan',
  'albert-einstein',
  'aristotle',
  'thomas-edison'
];

// The Vercel URL
const baseUrl = 'https://wisdom-giants-git-chore-giant-emoji-seo-kimseongeuns-projects.vercel.app';

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractMeta(html) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) || 
                    html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
  return {
    title: titleMatch ? titleMatch[1] : 'NOT FOUND',
    description: descMatch ? descMatch[1] : 'NOT FOUND',
  };
}

async function run() {
  console.log("# Vercel 배포 프리뷰 검증 결과\n");
  console.log(`URL: ${baseUrl}`);
  
  for (const locale of locales) {
    console.log(`\n## 로케일: ${locale.toUpperCase()}`);
    for (const slug of slugs) {
      const url = `${baseUrl}/${locale}/giant/${slug}`;
      try {
        const html = await fetchHtml(url);
        const { title, description } = extractMeta(html);
        
        // Unescape HTML entities
        const cleanTitle = title.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
        const cleanDesc = description.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
        
        console.log(`- **${slug}**`);
        console.log(`  - Title (${Array.from(cleanTitle).length}자): ${cleanTitle}`);
        console.log(`  - Desc  (${Array.from(cleanDesc).length}자): ${cleanDesc}`);
      } catch (err) {
        console.error(`- **${slug}**: Error fetching - ${err.message}`);
      }
    }
  }
}

run();
