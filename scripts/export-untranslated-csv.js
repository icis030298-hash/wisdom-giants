const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const allLocales = [
  'ar', 'de', 'el', 'en', 'es', 'fa', 'fr', 'ha', 'he', 'hi',
  'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sw', 'th',
  'tr', 'uk', 'vi', 'zh'
];

const indexedBlogSet = new Set([
  'ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ru',
  'he', 'el', 'ha', 'sw', 'uk', 'pl', 'id'
]);

let untranslatedRows = [];
untranslatedRows.push('Locale,Slug,IndexedInGoogle,Title_En,Title_Current');

let countByLocale = {};
allLocales.forEach(l => countByLocale[l] = 0);

blogPosts.forEach(post => {
  const enTitle = post.translations['en'] ? post.translations['en'].title : '';
  
  allLocales.forEach(locale => {
    if (locale === 'en') return;
    const tr = post.translations[locale];
    const isUntranslated = !tr || (enTitle && tr.title === enTitle);

    if (isUntranslated) {
      countByLocale[locale]++;
      const curTitle = tr ? tr.title.replace(/"/g, '""').replace(/\n/g, ' ') : 'MISSING';
      const cleanEnTitle = enTitle.replace(/"/g, '""').replace(/\n/g, ' ');
      const isIndexed = indexedBlogSet.has(locale) ? 'YES' : 'NO';
      untranslatedRows.push(`"${locale}","${post.slug}","${isIndexed}","${cleanEnTitle}","${curTitle}"`);
    }
  });
});

const csvContent = untranslatedRows.join('\n');
const csvPath = path.join(__dirname, '..', 'untranslated_blog_posts.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log('=== UNTRANSLATED SUMMARY BY LOCALE ===');
let totalUntranslated = 0;
let indexedUntranslated = 0;
Object.entries(countByLocale).sort((a, b) => b[1] - a[1]).forEach(([loc, count]) => {
  totalUntranslated += count;
  const isIdx = indexedBlogSet.has(loc);
  if (isIdx) indexedUntranslated += count;
  const tag = isIdx ? '[INDEXED]' : '[NOINDEX]';
  console.log(`${loc.padEnd(5)} ${tag.padEnd(11)} : ${count} untranslated posts`);
});

console.log(`\nTotal Untranslated Pair Count: ${totalUntranslated}`);
console.log(`Indexed Untranslated Count: ${indexedUntranslated}`);
console.log(`CSV exported to ${csvPath}`);
