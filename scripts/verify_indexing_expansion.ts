import { blogPosts } from '../src/data/blog-posts';
import { INDEXED_BLOG_LOCALES, isBlogLocaleIndexed, isLocaleIndexed } from '../src/config/locale-status';
import { isBlogTranslationMissing } from '../src/lib/translation-status';

const targetLocales = ['ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh'];
const original16Locales = ['ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ru', 'he', 'el', 'ha', 'sw', 'uk', 'pl', 'id'];

console.log('=== 1. DEFINED LOCALE WHITELIST LOCATION ===');
console.log('INDEXED_BLOG_LOCALES in src/config/locale-status.ts:');
console.log(INDEXED_BLOG_LOCALES);
console.log(`Total indexed blog locales count: ${INDEXED_BLOG_LOCALES.length} (Expected: 24)`);

console.log('\n=== (a) 8 LOCALES BLOG POST ROBOTS VERIFICATION (SAMPLE 5 PER LOCALE) ===');
let sampleErrors = 0;
targetLocales.forEach(loc => {
  const samplePosts = blogPosts.slice(0, 5);
  console.log(`\n--- Locale: ${loc} ---`);
  samplePosts.forEach((post, i) => {
    const enTr = post.translations['en'];
    const currentTr = post.translations[loc];
    const isUntranslated = loc !== 'en' && isBlogTranslationMissing(currentTr, enTr);
    const defaultIndex = isBlogLocaleIndexed(loc);
    const shouldIndex = defaultIndex && !isUntranslated;
    const robots = { index: shouldIndex, follow: true };
    console.log(`  [${i+1}] ${post.slug}: robots = index: ${robots.index}, follow: ${robots.follow} (title: "${currentTr?.title?.slice(0, 30)}...")`);
    if (!robots.index) sampleErrors++;
  });
});
console.log(`\nSample post robots error count: ${sampleErrors}`);

console.log('\n=== (b) 8 LOCALES BLOG LIST PAGE ROBOTS VERIFICATION ===');
targetLocales.forEach(loc => {
  const listRobots = { index: isBlogLocaleIndexed(loc), follow: isLocaleIndexed(loc) };
  console.log(`  /${loc}/blog -> robots: index: ${listRobots.index}, follow: ${listRobots.follow}`);
});

console.log('\n=== (c) SITEMAP BLOG.XML URL COUNT SIMULATION ===');
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
console.log(`TOTAL blog.xml URLs: ${totalBlogXmlUrls} (Previous: 3,097, Expected shift: +1,568 -> 4,665)`);

console.log('\n=== (d) CIRCUIT BREAKER CHECK ===');
let untranslatedCount = 0;
let totalEvaluated = 0;
for (const loc of INDEXED_BLOG_LOCALES) {
  if (loc === 'en') continue;
  for (const p of blogPosts) {
    totalEvaluated++;
    if (isBlogTranslationMissing(p.translations[loc], p.translations['en'])) {
      untranslatedCount++;
    }
  }
}
const breakerRatio = untranslatedCount / totalEvaluated;
console.log(`Total evaluated posts across ${INDEXED_BLOG_LOCALES.length - 1} non-EN locales: ${totalEvaluated}`);
console.log(`Total untranslated count: ${untranslatedCount}`);
console.log(`Untranslated ratio: ${(breakerRatio * 100).toFixed(2)}% (Threshold: 60%)`);
console.log(`Circuit Breaker Tripped? ${breakerRatio > 0.6 ? 'YES (🔴 TRIPPED)' : 'NO (🟢 SAFE)'}`);

console.log('\n=== (e) REGRESSION CHECK FOR 16 ORIGINAL LOCALES ===');
const expectedCounts: Record<string, number> = {
  ko: 195, en: 195, es: 195, fr: 195, it: 195, pt: 195, ja: 195,
  ha: 195, pl: 195, uk: 195, sw: 195, he: 195, el: 195,
  de: 185, ru: 186, id: 175
};

let regressionErrors = 0;
original16Locales.forEach(loc => {
  const validCount = blogPosts.filter(p => !isBlogTranslationMissing(p.translations[loc], p.translations['en'])).length;
  const expected = expectedCounts[loc];
  const pass = validCount === expected;
  if (!pass) regressionErrors++;
  console.log(`  ${loc}: ${validCount} / ${expected} (${pass ? '✅ MATCH' : '🔴 MISMATCH'})`);
});
console.log(`Original 16 locales regression error count: ${regressionErrors}`);
