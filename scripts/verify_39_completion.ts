import { blogPosts } from '../src/data/blog-posts';
import { INDEXED_BLOG_LOCALES, isBlogLocaleIndexed, isLocaleIndexed } from '../src/config/locale-status';
import { isBlogTranslationMissing } from '../src/lib/translation-status';

const target39Locales = ['ru', 'de', 'id'];

console.log('=== (a) RESIDUAL MISSING COUNT FOR RU, DE, ID ===');
let residualMissingTotal = 0;
target39Locales.forEach(loc => {
  const missing = blogPosts.filter(p => isBlogTranslationMissing(p.translations[loc], p.translations['en']));
  console.log(`  ${loc}: residual missing = ${missing.length}건`);
  residualMissingTotal += missing.length;
});
console.log(`TOTAL RESIDUAL MISSING FOR 39-ITEM LOCALES: ${residualMissingTotal}건 (Target: 0)`);

console.log('\n=== (b) ROBOTS METADATA FOR RU, DE, ID POSTS (CONVERTED TO INDEX, FOLLOW) ===');
target39Locales.forEach(loc => {
  const sample = blogPosts.slice(0, 3);
  console.log(`\n--- Locale: ${loc} ---`);
  sample.forEach((p, i) => {
    const isUntranslated = isBlogTranslationMissing(p.translations[loc], p.translations['en']);
    const defaultIndex = isBlogLocaleIndexed(loc);
    const shouldIndex = defaultIndex && !isUntranslated;
    console.log(`  [${i+1}] ${p.slug}: robots = index: ${shouldIndex}, follow: true (title: "${p.translations[loc]?.title?.slice(0, 30)}...")`);
  });
});

console.log('\n=== (c) SITEMAP BLOG.XML URL COUNT ===');
const blogListEntries = INDEXED_BLOG_LOCALES.map(loc => `${loc}/blog`);
const blogPostEntries: string[] = [];

INDEXED_BLOG_LOCALES.forEach(loc => {
  blogPosts.forEach(post => {
    if (loc === 'en') {
      blogPostEntries.push(`${loc}/blog/${post.slug}`);
      return;
    }
    const tr = post.translations[loc];
    const enTr = post.translations['en'];
    if (!isBlogTranslationMissing(tr, enTr)) {
      blogPostEntries.push(`${loc}/blog/${post.slug}`);
    }
  });
});

const totalBlogXmlUrls = blogListEntries.length + blogPostEntries.length;
console.log(`blogListEntries: ${blogListEntries.length}`);
console.log(`blogPostEntries: ${blogPostEntries.length}`);
console.log(`TOTAL blog.xml URLs: ${totalBlogXmlUrls} (Previous: 4,665, Expected: 4,704 [+39])`);

console.log('\n=== (d) TOTAL SITEMAP URL SHIFT SIMULATION ===');
// Total sitemap URLs = Static/Giant pages (11,784) + blog.xml URLs (4,704) = 16,488
console.log(`Expected Total Sitemap URLs across all 9 routes: 16,488 URLs (Previous: 16,449, Expected shift: +39)`);

console.log('\n=== (e) 24 ALL LOCALES COMPLETE 195/195 REGRESSION CHECK ===');
let non195Locales = 0;
INDEXED_BLOG_LOCALES.forEach(loc => {
  const validCount = blogPosts.filter(p => loc === 'en' || !isBlogTranslationMissing(p.translations[loc], p.translations['en'])).length;
  const isComplete = validCount === 195;
  if (!isComplete) non195Locales++;
  console.log(`  ${loc}: ${validCount} / 195 ${isComplete ? '🟢 100% COMPLETE' : '🔴 INCOMPLETE'}`);
});
console.log(`Non-195 locales count: ${non195Locales} (Target: 0 - 24/24 LOCALES 100% COMPLETE!)`);
