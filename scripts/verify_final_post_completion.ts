import { blogPosts } from '../src/data/blog-posts';

const targetLocales = ['ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh'];
const completedLocales = [
  'ko', 'en', 'ja', 'de', 'fr', 'es', 'it', 'ru', 'pt', 'id', 'sw', 'el', 'he'
];
const allLocales = [...completedLocales, ...targetLocales];

console.log('=== (a) RESIDUAL MISSING COUNT ACROSS 8 LOCALES ===');
let totalResidualMissing = 0;
targetLocales.forEach(loc => {
  const missing = blogPosts.filter(p => !p.translations[loc] || !p.translations[loc].title);
  console.log(`${loc}: residual missing ${missing.length}건`);
  totalResidualMissing += missing.length;
});
console.log(`TOTAL RESIDUAL MISSING: ${totalResidualMissing}건 (Target: 0)`);

console.log('\n=== (b) LOCALE INDEX / NOINDEX BREAKDOWN ===');
targetLocales.forEach(loc => {
  let indexed = 0;
  let noindex = 0;
  blogPosts.forEach(p => {
    const tr = p.translations[loc];
    const enTr = p.translations['en'];
    if (tr && tr.title && tr.title !== enTr?.title) {
      indexed++;
    } else {
      noindex++;
    }
  });
  console.log(`${loc}: ${indexed} indexed / ${noindex} noindex`);
});

console.log('\n=== (c) SITEMAP / BLOG.XML URL COUNT ===');
let totalSitemapUrls = 0;
allLocales.forEach(loc => {
  const locPosts = blogPosts.filter(p => {
    const tr = p.translations[loc];
    const enTr = p.translations['en'];
    return tr && tr.title && tr.title !== enTr?.title;
  });
  totalSitemapUrls += locPosts.length;
});
console.log(`Total blog post URLs for sitemap/blog.xml across 21 locales: ${totalSitemapUrls} URLs (Target: ~4,657 URLs)`);

console.log('\n=== (d) REGRESSION CHECK FOR 13 COMPLETED LOCALES ===');
let regressionErrors = 0;
completedLocales.forEach(loc => {
  const count = blogPosts.filter(p => p.translations[loc] && p.translations[loc].title).length;
  console.log(`${loc}: ${count} / 195`);
  if (count !== 195) regressionErrors++;
});
console.log(`REGRESSION ERRORS: ${regressionErrors}`);
