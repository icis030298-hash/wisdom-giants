const http = require('http');
const fs = require('fs');

const GIANTS = ['marie-curie', 'socrates', 'genghis-khan', 'rosa-parks', 'bartolomeu-dias', 'shakespeare'];
const LOCALES = ['ko', 'en', 'ja'];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function unescapeHtml(text) {
  return text.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

async function run() {
  let report = '## Vercel Preview Verification (Local Production Server Build)\n\n';

  for (const locale of LOCALES) {
    report += `### Locale: [${locale.toUpperCase()}]\n`;
    for (const slug of GIANTS) {
      const url = `http://localhost:3006/${locale}/giant/${slug}`;
      try {
        const html = await fetchHtml(url);
        
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        const descMatch = html.match(/<meta[^>]*name=\"description\"[^>]*content=\"([^\"]*)\"[^>]*>/i);
        
        const title = titleMatch ? unescapeHtml(titleMatch[1]) : null;
        const desc = descMatch ? unescapeHtml(descMatch[1]) : null;
        
        report += `- **${slug}**\n`;
        report += `  - Title (${title ? Array.from(title).length : 0} chars): ${title}\n`;
        report += `  - Desc  (${desc ? Array.from(desc).length : 0} chars): ${desc}\n`;
      } catch (e) {
        report += `- **${slug}**: Failed to fetch - ${e.message}\n`;
      }
    }
    report += '\n';
  }
  
  fs.writeFileSync('scratch/final_seo_report_v2.md', report);
  console.log('Report generated at scratch/final_seo_report_v2.md');
}

run();
