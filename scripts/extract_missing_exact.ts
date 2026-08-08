import { blogPosts } from '../src/data/blog-posts';
import * as fs from 'fs';

const locales = ['ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh'];
const counts: Record<string, number> = {};
const missingByLocale: Record<string, string[]> = {};
locales.forEach(loc => { counts[loc] = 0; missingByLocale[loc] = []; });

const csvLines: string[] = ['locale,slug'];

blogPosts.forEach(post => {
  const enTitle = post.translations['en']?.title?.trim();
  locales.forEach(loc => {
    const locTitle = post.translations[loc]?.title?.trim();
    if (!locTitle || locTitle === enTitle) {
      counts[loc]++;
      missingByLocale[loc].push(post.slug);
      csvLines.push(`${loc},${post.slug}`);
    }
  });
});

console.log('=== Exact Runtime Counts ===');
console.log(counts);
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log('Total Missing:', total);

if (!fs.existsSync('scratch')) {
  fs.mkdirSync('scratch', { recursive: true });
}

fs.writeFileSync('scratch/missing_8_locales.csv', csvLines.join('\n'), 'utf8');
fs.writeFileSync('scratch/missing_8_locales.json', JSON.stringify(missingByLocale, null, 2), 'utf8');
console.log('Saved scratch/missing_8_locales.csv and missing_8_locales.json');
