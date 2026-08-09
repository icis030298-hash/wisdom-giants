const http = require('http');
const fs = require('fs');

const locales = ['ko', 'en', 'ja', 'ar', 'he'];
const slugs = [
  'sejong-the-great',
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
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) || 
                    html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
  return {
    title: titleMatch ? titleMatch[1] : 'NOT FOUND',
    description: descMatch ? descMatch[1] : 'NOT FOUND',
  };
}

async function run() {
  const results = {};
  
  for (const locale of locales) {
    results[locale] = {};
    for (const slug of slugs) {
      const url = `http://localhost:3002/${locale}/giant/${slug}`;
      try {
        const html = await fetchHtml(url);
        const { title, description } = extractMeta(html);
        
        // Unescape HTML entities
        const cleanTitle = title.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
        const cleanDesc = description.replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
        
        results[locale][slug] = {
          title: cleanTitle,
          titleLen: Array.from(cleanTitle).length,
          desc: cleanDesc,
          descLen: Array.from(cleanDesc).length
        };
      } catch (err) {
        results[locale][slug] = { error: err.message };
      }
    }
  }
  
  fs.writeFileSync('scratch/seo-results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log("Done");
}

run();
