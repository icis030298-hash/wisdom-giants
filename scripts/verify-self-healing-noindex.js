const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts'), 'utf8');
const cleanCode = code.replace(/import\s+.*?;\s*/g, '').replace('export const blogPosts: BlogPost[] =', 'const blogPosts =');
const getBlogPosts = new Function(cleanCode + '; return blogPosts;');
const blogPosts = getBlogPosts();

const indexedBlogLocales = [
  'ko', 'en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ru',
  'he', 'el', 'ha', 'sw', 'uk', 'pl', 'id'
];

function isBlogLocaleIndexed(loc) {
  return indexedBlogLocales.includes(loc);
}

// Circuit Breaker simulation
let isCircuitBreakerTrippedCache = null;
function checkCircuitBreaker() {
  if (isCircuitBreakerTrippedCache !== null) return isCircuitBreakerTrippedCache;
  let untranslatedCount = 0;
  let totalEvaluated = 0;
  for (const locale of indexedBlogLocales) {
    if (locale === 'en') continue;
    for (const post of blogPosts) {
      totalEvaluated++;
      const enTr = post.translations['en'];
      const tr = post.translations[locale];
      if (!tr || (enTr && tr.title === enTr.title)) untranslatedCount++;
    }
  }
  const ratio = totalEvaluated > 0 ? untranslatedCount / totalEvaluated : 0;
  isCircuitBreakerTrippedCache = ratio > 0.6;
  return isCircuitBreakerTrippedCache;
}

function evaluatePageMetadata(locale, slug) {
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return { index: false, follow: false };

  const enTranslation = post.translations['en'];
  const currentTranslation = post.translations[locale];

  const isUntranslated = locale !== 'en' && (
    !currentTranslation ||
    (enTranslation && currentTranslation.title === enTranslation.title)
  );

  const circuitBreakerTripped = checkCircuitBreaker();
  const defaultIndex = isBlogLocaleIndexed(locale);
  const shouldIndex = circuitBreakerTripped ? defaultIndex : (defaultIndex && !isUntranslated);

  return {
    isUntranslated,
    circuitBreakerTripped,
    robots: {
      index: shouldIndex,
      follow: true // ALWAYS true
    }
  };
}

console.log('=== TEST 1: UNTRANSLATED INDEXED URLS (EXPECT: index: false, follow: true) ===');
const testUntranslated = [
  { locale: 'pl', slug: 'peter-the-great-wisdom' },
  { locale: 'pl', slug: 'catherine-the-great-wisdom' },
  { locale: 'uk', slug: 'omar-khayyam-wisdom' },
  { locale: 'uk', slug: 'ibn-battuta-wisdom' }
];

testUntranslated.forEach(t => {
  const res = evaluatePageMetadata(t.locale, t.slug);
  console.log(`${t.locale}/blog/${t.slug} -> isUntranslated: ${res.isUntranslated}, index: ${res.robots.index}, follow: ${res.robots.follow}`);
});

console.log('\n=== TEST 2: TRANSLATED INDEXED URLS (EXPECT: index: true, follow: true) ===');
const testTranslated = [
  { locale: 'es', slug: 'rockefeller-monopoly-guide' },
  { locale: 'fr', slug: 'rockefeller-monopoly-guide' },
  { locale: 'it', slug: 'rockefeller-monopoly-guide' },
  { locale: 'pt', slug: 'rockefeller-monopoly-guide' },
  { locale: 'pl', slug: 'rockefeller-monopoly-guide' },
  { locale: 'uk', slug: 'rockefeller-monopoly-guide' }
];

testTranslated.forEach(t => {
  const res = evaluatePageMetadata(t.locale, t.slug);
  console.log(`${t.locale}/blog/${t.slug} -> isUntranslated: ${res.isUntranslated}, index: ${res.robots.index}, follow: ${res.robots.follow}`);
});

console.log('\n=== TEST 3: INDEXED VS NOINDEX COUNTS PER INDEXED BLOG LOCALE ===');
indexedBlogLocales.forEach(locale => {
  let indexedCount = 0;
  let noindexCount = 0;
  blogPosts.forEach(post => {
    const res = evaluatePageMetadata(locale, post.slug);
    if (res.robots.index) indexedCount++;
    else noindexCount++;
  });
  console.log(`${locale.padEnd(5)} : ${indexedCount} INDEXED / ${noindexCount} NOINDEX`);
});

console.log('\n=== TEST 4: SITEMAP BLOG.XML COUNT ===');
let sitemapBlogCount = 0;
indexedBlogLocales.forEach(locale => {
  blogPosts.forEach(post => {
    if (locale === 'en') {
      sitemapBlogCount++;
      return;
    }
    const tr = post.translations[locale];
    const enTr = post.translations['en'];
    if (!tr) return;
    if (enTr && tr.title === enTr.title) return;
    sitemapBlogCount++;
  });
});
console.log(`Blog posts in sitemap/blog.xml: ${sitemapBlogCount}`);
console.log(`Blog list page entries: ${indexedBlogLocales.length}`);
console.log(`Total entries in sitemap/blog.xml: ${sitemapBlogCount + indexedBlogLocales.length}`);
